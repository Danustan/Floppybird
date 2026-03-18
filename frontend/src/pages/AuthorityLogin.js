import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import '../styles/AuthorityLogin.css';

const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

const AuthorityLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/authority/login', values);

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('authority', JSON.stringify(response.data.authority));

      toast.success('Login successful!');
      navigate('/authority/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🔐 Authority Login</h1>
        <p className="login-subtitle">Access your regulatory dashboard</p>

        <Formik
          initialValues={{
            username: '',
            password: ''
          }}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label>Username</label>
                <Field
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  className="form-input"
                />
                <ErrorMessage name="username" component="span" className="error" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="form-input"
                />
                <ErrorMessage name="password" component="span" className="error" />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-login"
                disabled={isSubmitting || loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="security-notice">
                <p>⚠️ For authorized government officials only</p>
                <p>Account must be verified by Green Justice Admin</p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AuthorityLogin;
