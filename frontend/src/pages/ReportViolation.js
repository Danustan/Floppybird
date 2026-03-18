import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import api from '../utils/api';
import { toast } from 'react-toastify';
import MapPicker from '../components/MapPicker';
import '../styles/ReportViolation.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const reportValidationSchema = Yup.object().shape({
  user_name: Yup.string().required('Name is required'),
  user_email: Yup.string().email('Invalid email').required('Email is required'),
  violation_type_id: Yup.string().required('Violation type is required'),
  title: Yup.string().required('Title is required'),
  description: Yup.string().min(5, 'Description must be at least 5 characters').required('Description is required'),
  location_address: Yup.string().required('Location address is required')
});

const ReportViolation = () => {
  const navigate = useNavigate();
  const [violations, setViolations] = useState([]);
  const [mapLocation, setMapLocation] = useState({ lat: 40, lng: -95 });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchViolationTypes();
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  const fetchViolationTypes = async () => {
    try {
      const response = await api.get('/users/violation-types/all');
      setViolations(response.data.violationTypes);
    } catch (error) {
      toast.error('Failed to load violation types');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + uploadedFiles.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleNextStep = (values) => {
    // Validate only current step before moving
    const validateCurrentStep = async () => {
      try {
        // Get only current step fields for validation
        let currentStepSchema;
        
        if (step === 1) {
          currentStepSchema = Yup.object().shape({
            user_name: Yup.string().required('Name is required'),
            user_email: Yup.string().email('Invalid email').required('Email is required')
          });
        } else if (step === 2) {
          currentStepSchema = Yup.object().shape({
            violation_type_id: Yup.string().required('Violation type is required')
          });
        } else if (step === 3) {
          currentStepSchema = Yup.object().shape({
            title: Yup.string().required('Title is required'),
            description: Yup.string().min(5, 'Description must be at least 5 characters').required('Description is required')
          });
        } else if (step === 4) {
          currentStepSchema = Yup.object().shape({
            location_address: Yup.string().required('Location address is required')
          });
        }

        await currentStepSchema.validate(values);
        setStep(step + 1);
      } catch (error) {
        toast.error(error.message);
      }
    };

    validateCurrentStep();
  };

  const handleSubmit = async (values) => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      formData.append('location_lat', mapLocation.lat);
      formData.append('location_lng', mapLocation.lng);

      uploadedFiles.forEach(file => {
        formData.append('proofs', file);
      });

      const response = await api.post('/complaints/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem('complaintId', response.data.complaintId);
      toast.success('Complaint submitted successfully!');
      navigate('/thank-you');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit complaint';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = (values, isSubmitting) => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h2>Your Contact Information</h2>
            <Field
              as="input"
              type="text"
              name="user_name"
              placeholder="Full Name"
              className="form-input"
            />
            <ErrorMessage name="user_name" component="span" className="error" />

            <Field
              as="input"
              type="email"
              name="user_email"
              placeholder="Email Address"
              className="form-input"
            />
            <ErrorMessage name="user_email" component="span" className="error" />

            <Field
              as="input"
              type="tel"
              name="user_phone"
              placeholder="Phone Number (Optional)"
              className="form-input"
            />
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Select Violation Type</h2>
            <Field
              as="select"
              name="violation_type_id"
              className="form-input"
            >
              <option value="">-- Select Violation Type --</option>
              {violations.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </Field>
            <ErrorMessage name="violation_type_id" component="span" className="error" />
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Describe the Violation</h2>
            <Field
              as="input"
              type="text"
              name="title"
              placeholder="Violation Title"
              className="form-input"
            />
            <ErrorMessage name="title" component="span" className="error" />

            <Field
              as="textarea"
              name="description"
              placeholder="Detailed Description (minimum 5 characters)"
              className="form-input"
              rows="4"
            />
            <ErrorMessage name="description" component="span" className="error" />
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Upload Proof & Location</h2>

            <Field
              as="input"
              type="text"
              name="location_address"
              placeholder="Location Address (or use map)"
              className="form-input"
            />
            <ErrorMessage name="location_address" component="span" className="error" />

            <MapPicker 
              location={mapLocation} 
              onLocationSelect={setMapLocation}
            />

            <div className="file-upload">
              <label>Upload Photos/Videos (Optional, Max 5)</label>
              <p className="file-formats">📁 Supported: JPG, PNG, GIF, WebP, BMP, MP4, WebM, AVI, MOV, MKV, and more</p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="file-input"
              />
              {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="file-item">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="remove-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="report-container">
      <div className="report-wrapper">
        <div className="progress-bar">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`progress-step ${s <= step ? 'active' : ''}`}>
              {s}
            </div>
          ))}
        </div>

        <Formik
          initialValues={{
            user_name: '',
            user_email: '',
            user_phone: '',
            violation_type_id: '',
            title: '',
            description: '',
            location_address: ''
          }}
          validationSchema={reportValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form>
              {renderStep(values, isSubmitting)}

              <div className="form-buttons">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="btn btn-secondary"
                  >
                    ← Previous
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => handleNextStep(values)}
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || loading}
                  >
                    Submit Report
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReportViolation;
