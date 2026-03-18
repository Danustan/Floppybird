import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LanguageSelection.css';

const LanguageSelection = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  const handleLanguageSelect = (language) => {
    localStorage.setItem('language', language.code);
    if (userType === 'user') {
      navigate('/report');
    } else if (userType === 'authority') {
      navigate('/authority/login');
    }
  };

  return (
    <div className="language-container">
      <div className="welcome-section">
        <h1>🌱 Green Justice</h1>
        <p className="tagline">Keeping Our Environment Clean and Protected</p>
        
        {!userType ? (
          <div className="user-type-selection">
            <h2>Choose Your Role</h2>
            <button 
              className="role-btn user-btn"
              onClick={() => setUserType('user')}
            >
              👤 Report a Violation
            </button>
            <button 
              className="role-btn authority-btn"
              onClick={() => setUserType('authority')}
            >
              👮 Authority Access
            </button>
          </div>
        ) : (
          <div className="language-selection">
            <h2>Select Your Language</h2>
            <div className="language-grid">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className="language-btn"
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <span className="flag">{lang.flag}</span>
                  <span className="language-name">{lang.name}</span>
                </button>
              ))}
            </div>
            <button 
              className="back-btn"
              onClick={() => setUserType(null)}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelection;
