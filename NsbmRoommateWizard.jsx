import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { roommateService } from '../services/roommateService';
import { 
  User, Mail, Phone, Calendar, MapPin, DollarSign, Clock, 
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Sparkles, 
  HelpCircle, Compass, Home, Users, PlusCircle
} from 'lucide-react';

const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia'
];

const NsbmRoommateWizard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: '',
    occupation: 'Student', // Student or Lecturer
    avatar: AVATARS[0],
    preferredCity: '',
    minBudget: '',
    maxBudget: '',
    moveInDate: '',
    leaseDuration: '6 months',
    roomType: 'Private Room', // Private Room, Shared Room, Entire Apartment, Any
    aboutMe: '',
    contactMethod: 'WhatsApp' // Email, Phone call, In-app Chat, WhatsApp
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Pre-fill email and name from auth context if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPill = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    setError('');
    setFieldErrors({});
    setSubmitting(true);

    // Structure payload exactly as { preferredCity, minBudget, maxBudget, roomType }
    const payload = {
      preferredCity: formData.preferredCity,
      minBudget: parseFloat(formData.minBudget) || 0,
      maxBudget: parseFloat(formData.maxBudget) || 0,
      roomType: formData.roomType
    };

    try {
      if (user) {
        // Authenticated creation
        await roommateService.createRoommateAd(payload);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/roommates');
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.validationErrors) {
        setFieldErrors(err.response.data.validationErrors);
        setError('Validation failed. Please correct the errors below.');
      } else {
        setError('Failed to publish roommate ad. Please check your inputs.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setFieldErrors({});
    // Basic validation per step
    if (step === 1) {
      const errors = {};
      if (!formData.fullName) errors.fullName = 'Full Name is required.';
      if (!formData.age) errors.age = 'Age is required.';
      if (!formData.email) errors.email = 'Email Address is required.';
      if (!formData.phone) errors.phone = 'Phone Number is required.';
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError('Please fill in all required personal info fields.');
        return;
      }
    } else if (step === 2) {
      const errors = {};
      if (!formData.preferredCity) errors.preferredCity = 'Preferred City is required.';
      if (!formData.minBudget) errors.minBudget = 'Minimum budget is required.';
      if (!formData.maxBudget) errors.maxBudget = 'Maximum budget is required.';
      if (!formData.moveInDate) errors.moveInDate = 'Move-in Date is required.';
      
      if (parseFloat(formData.minBudget) > parseFloat(formData.maxBudget)) {
        errors.minBudget = 'Minimum budget cannot exceed maximum budget.';
        errors.maxBudget = 'Maximum budget cannot be less than minimum budget.';
      }
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError('Please correct the housing preference errors.');
        return;
      }
      // If Next is clicked on Housing Needs tab, submit the form!
      handleSubmit();
      return;
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setFieldErrors({});
    setStep(prev => prev - 1);
  };

  return (
    <div className="nsbm-wizard-workspace">
      {/* Light-themed Header Navbar */}
      <header className="wizard-navbar">
        <div className="wizard-navbar-container">
          <Link to="/" className="wizard-logo">
            <span className="logo-blue">NSBM</span> <span className="logo-dark">RoomMate</span>
          </Link>
          <div className="wizard-nav-links">
            <Link to="/" className="wizard-nav-link">Home</Link>
            <Link to="/properties" className="wizard-nav-link">Find Housing</Link>
            <Link to="/roommates" className="wizard-nav-link">Find Roommates</Link>
          </div>
          <button onClick={() => setStep(1)} className="wizard-post-btn">
            <PlusCircle size={16} />
            <span>Post Your Ad</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="wizard-main-layout">
        {/* Left Column: Form Wizard */}
        <div className="wizard-form-column">
          {/* Success Banner */}
          {success && (
            <div className="wizard-success-banner">
              <CheckCircle size={22} className="text-green" />
              <div>
                <h4>Congratulations!</h4>
                <p>Your advertisement has been published. Redirecting to matches...</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="wizard-error-banner">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="wizard-card">
            {/* Step Progress Bar */}
            <div className="step-progress-indicator">
              <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <span className="step-num">{step > 1 ? '✓' : '1'}</span>
                <span className="step-label">Personal Info</span>
              </div>
              <div className="step-connector-line">
                <div className="step-line-fill" style={{ width: step > 1 ? (step === 2 ? '50%' : '100%') : '0%' }}></div>
              </div>
              <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                <span className="step-num">{step > 2 ? '✓' : '2'}</span>
                <span className="step-label">Housing Needs</span>
              </div>
              <div className="step-connector-line">
                <div className="step-line-fill" style={{ width: step > 2 ? '100%' : '0%' }}></div>
              </div>
              <div className={`step-node ${step === 3 ? 'active' : ''}`}>
                <span className="step-num">3</span>
                <span className="step-label">About You</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="wizard-form-el">
              {/* TAB 1: Personal Info */}
              {step === 1 && (
                <div className="wizard-tab-content">
                  <h3 className="tab-title">Tell us about yourself</h3>
                  <p className="tab-subtitle">Introduce yourself to potential roommates at NSBM Green University.</p>

                  <div className="wizard-form-grid">
                    <div className="form-group span-2">
                      <label>Select Profile Avatar</label>
                      <div className="avatar-picker-row">
                        {AVATARS.map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`avatar-choice-btn ${formData.avatar === av ? 'selected' : ''}`}
                            onClick={() => handleSelectPill('avatar', av)}
                          >
                            <img src={av} alt={`Avatar ${idx + 1}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group span-2">
                      <label htmlFor="fullName">Full Name</label>
                      <div className="wizard-input-wrapper">
                        <User size={18} className="input-icon-blue" />
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className={fieldErrors.fullName ? 'input-error' : ''}
                          placeholder="e.g. Chamidu Perera"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <span className="field-error-text">{fieldErrors.fullName || ''}</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="age">Age</label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        className={fieldErrors.age ? 'input-error' : ''}
                        placeholder="e.g. 21"
                        value={formData.age}
                        onChange={handleChange}
                        min={16}
                        required
                      />
                      <span className="field-error-text">{fieldErrors.age || ''}</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        name="gender"
                        className={fieldErrors.gender ? 'input-error' : ''}
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="field-error-text">{fieldErrors.gender || ''}</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <div className="wizard-input-wrapper">
                        <Mail size={18} className="input-icon-blue" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className={fieldErrors.email ? 'input-error' : ''}
                          placeholder="name@student.nsbm.ac.lk"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <span className="field-error-text">{fieldErrors.email || ''}</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <div className="wizard-input-wrapper">
                        <Phone size={18} className="input-icon-blue" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className={fieldErrors.phone ? 'input-error' : ''}
                          placeholder="+94 7X XXX XXXX"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <span className="field-error-text">{fieldErrors.phone || ''}</span>
                    </div>

                    <div className="form-group span-2">
                      <label>Occupation / Role</label>
                      <div className="option-pills-row">
                        {['Student', 'Lecturer'].map((role) => (
                          <button
                            key={role}
                            type="button"
                            className={`option-pill ${formData.occupation === role ? 'active' : ''}`}
                            onClick={() => handleSelectPill('occupation', role)}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Housing Needs */}
              {step === 2 && (
                <div className="wizard-tab-content">
                  <h3 className="tab-title">Your Housing Preferences</h3>
                  <p className="tab-subtitle">Specify budget, location and duration requirements for your search.</p>

                  <div className="wizard-form-grid">
                    <div className="form-group span-2">
                      <label htmlFor="preferredCity">Preferred City / Area</label>
                      <div className="wizard-input-wrapper">
                        <MapPin size={18} className="input-icon-blue" />
                        <input
                          type="text"
                          id="preferredCity"
                          name="preferredCity"
                          className={fieldErrors.preferredCity ? 'input-error' : ''}
                          placeholder="e.g. Homagama, Pitipana, Kottawa"
                          value={formData.preferredCity}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <span className="field-error-text">{fieldErrors.preferredCity || ''}</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="minBudget">Min Budget (LKR)</label>
                      <div className="wizard-input-wrapper">
                        <DollarSign size={18} className="input-icon-blue" />
                        <input
                          type="number"
                          id="minBudget"
                          name="minBudget"
                          className={fieldErrors.minBudget ? 'input-error' : ''}
                          placeholder="Min e.g. 5000"
                          value={formData.minBudget}
                          onChange={handleChange}
                          min={0}
                          required
                        />
                      </div>
                      <span className="field-error-text">{fieldErrors.minBudget || ''}</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="maxBudget">Max Budget (LKR)</label>
                      <div className="wizard-input-wrapper">
                        <DollarSign size={18} className="input-icon-blue" />
                        <input
                          type="number"
                          id="maxBudget"
                          name="maxBudget"
                          className={fieldErrors.maxBudget ? 'input-error' : ''}
                          placeholder="Max e.g. 15000"
                          value={formData.maxBudget}
                          onChange={handleChange}
                          min={0}
                          required
                        />
                      </div>
                      <span className="field-error-text">{fieldErrors.maxBudget || ''}</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="moveInDate">Earliest Move-in Date</label>
                      <div className="wizard-input-wrapper">
                        <Calendar size={18} className="input-icon-blue" />
                        <input
                          type="date"
                          id="moveInDate"
                          name="moveInDate"
                          className={fieldErrors.moveInDate ? 'input-error' : ''}
                          value={formData.moveInDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <span className="field-error-text">{fieldErrors.moveInDate || ''}</span>
                    </div>

                    <div className="form-group">
                      <label htmlFor="leaseDuration">Lease Duration (Optional)</label>
                      <div className="wizard-input-wrapper">
                        <Clock size={18} className="input-icon-blue" />
                        <select
                          id="leaseDuration"
                          name="leaseDuration"
                          className={fieldErrors.leaseDuration ? 'input-error' : ''}
                          value={formData.leaseDuration}
                          onChange={handleChange}
                        >
                          <option value="Flexible">Flexible</option>
                          <option value="3 months">3 months</option>
                          <option value="6 months">6 months</option>
                          <option value="1 year">1 year</option>
                        </select>
                      </div>
                      <span className="field-error-text">{fieldErrors.leaseDuration || ''}</span>
                    </div>

                    <div className="form-group span-2">
                      <label>Room Type Preference</label>
                      <div className="option-pills-row">
                        {['Private Room', 'Shared Room', 'Entire Apartment', 'Any'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`option-pill ${formData.roomType === type ? 'active' : ''}`}
                            onClick={() => handleSelectPill('roomType', type)}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: About You */}
              {step === 3 && (
                <div className="wizard-tab-content">
                  <h3 className="tab-title">Introduce Yourself</h3>
                  <p className="tab-subtitle">Write a bio to match with roommates sharing similar lifestyles.</p>

                  <div className="wizard-form-grid">
                    <div className="form-group span-2">
                      <label htmlFor="aboutMe">About Me</label>
                      <textarea
                        id="aboutMe"
                        name="aboutMe"
                        className={fieldErrors.aboutMe ? 'input-error' : ''}
                        rows="6"
                        placeholder="e.g. I am a 2nd year SE student at NSBM. I like quiet study hours, keeping common spaces tidy, and playing football. Looking for a neat roommate..."
                        value={formData.aboutMe}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <span className="field-error-text">{fieldErrors.aboutMe || ''}</span>
                    </div>

                    <div className="form-group span-2">
                      <label>Preferred Contact Method</label>
                      <div className="option-pills-row">
                        {['Email', 'Phone call', 'In-app Chat', 'WhatsApp'].map((method) => (
                          <button
                            key={method}
                            type="button"
                            className={`option-pill ${formData.contactMethod === method ? 'active' : ''}`}
                            onClick={() => handleSelectPill('contactMethod', method)}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Controls */}
              <div className="wizard-form-footer">
                {step > 1 && (
                  <button
                    type="button"
                    className="wizard-btn-back"
                    onClick={handlePrev}
                    disabled={submitting}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    className="wizard-btn-next"
                    onClick={handleNext}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="wizard-btn-submit"
                    disabled={submitting}
                  >
                    <span>Publish My Ad</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Preview Card */}
        <div className="wizard-preview-column">
          <div className="live-preview-container">
            <div className="preview-badge">
              <Sparkles size={14} />
              <span>Real-time Live Preview</span>
            </div>

            <div className="preview-card-el">
              {/* Header profile section */}
              <div className="preview-card-header">
                <div className="preview-avatar">
                  <img src={formData.avatar} alt="Profile Avatar" />
                </div>
                <div className="preview-profile-info">
                  <h4 className="preview-name">{formData.fullName || 'Full Name'}</h4>
                  <div className="preview-role-badges">
                    <span className="role-tag blue">{formData.occupation}</span>
                    {formData.age && <span className="role-tag gray">{formData.age} yrs</span>}
                    <span className="role-tag gray">{formData.gender}</span>
                  </div>
                </div>
              </div>

              {/* Preferences grid */}
              <div className="preview-details-grid">
                <div className="preview-detail-item">
                  <span className="detail-label">City Preference</span>
                  <div className="detail-val-row">
                    <MapPin size={15} className="blue-icon" />
                    <span>{formData.preferredCity || 'Homagama'}</span>
                  </div>
                </div>

                <div className="preview-detail-item">
                  <span className="detail-label">Monthly Budget</span>
                  <div className="detail-val-row">
                    <DollarSign size={15} className="blue-icon" />
                    <span>
                      {formData.minBudget || formData.maxBudget 
                        ? `LKR ${formData.minBudget || 0} - ${formData.maxBudget || 'Max'}`
                        : 'Budget Preference'
                      }
                    </span>
                  </div>
                </div>

                <div className="preview-detail-item">
                  <span className="detail-label">Move-in Date</span>
                  <div className="detail-val-row">
                    <Calendar size={15} className="blue-icon" />
                    <span>{formData.moveInDate || 'Earliest Date'}</span>
                  </div>
                </div>

                <div className="preview-detail-item">
                  <span className="detail-label">Preferred Room</span>
                  <span className="pref-tag">{formData.roomType}</span>
                </div>
              </div>

              {/* Lease duration */}
              <div className="preview-lease-info">
                <Clock size={14} className="blue-icon" />
                <span>Lease Term: <strong>{formData.leaseDuration}</strong></span>
              </div>

              <hr className="preview-divider" />

              {/* About description */}
              <div className="preview-bio-block">
                <h5>About Me</h5>
                <p className="preview-bio-text">
                  {formData.aboutMe || 'Write something in the "About Me" box to see it reflect here. Describe your study schedules, weekend activities, and what flat share vibes you enjoy...'}
                </p>
              </div>

              <hr className="preview-divider" />

              {/* Contact badge */}
              <div className="preview-contact-block">
                <span className="contact-badge-label">Preferred Contact</span>
                <span className="contact-method-tag">{formData.contactMethod}</span>
              </div>

              {/* Footer contact mock */}
              <div className="preview-mock-footer">
                <div className="mock-contact-info">
                  <span>{formData.email || 'email@nsbm.ac.lk'}</span>
                  <span>{formData.phone || '+94 XXXXXXXX'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NsbmRoommateWizard;
