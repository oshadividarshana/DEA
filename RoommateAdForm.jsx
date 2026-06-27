import React, { useEffect, useState, useContext } from 'react';
import { roommateService } from '../services/roommateService';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, CheckCircle, Trash2, Loader, Save, Sparkles } from 'lucide-react';

const RoommateAdForm = () => {
  const { user } = useContext(AuthContext);
  const [adId, setAdId] = useState(null);
  const [gender, setGender] = useState('Male');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [budget, setBudget] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchAd = async () => {
    try {
      const ads = await roommateService.searchRoommates();
      const myAd = ads.find(ad => ad.user && ad.user.email === user?.email);
      if (myAd) {
        setAdId(myAd.id);
        setGender(myAd.gender || 'Male');
        setAge(myAd.age || '');
        setOccupation(myAd.occupation || '');
        setBudget(myAd.budget || '');
        setBio(myAd.bio || '');
      }
    } catch (err) {
      console.error("Error loading roommate advertisement:", err);
      setError("Could not load advertisement details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAd();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    const payload = {
      gender,
      age: parseInt(age) || null,
      occupation,
      budget: parseFloat(budget) || null,
      bio
    };

    try {
      if (adId) {
        await roommateService.updateRoommateAd(adId, payload);
        setSuccess("Roommate advertisement updated successfully!");
      } else {
        const created = await roommateService.createRoommateAd(payload);
        setAdId(created.id);
        setSuccess("Roommate advertisement created successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing advertisement form.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your roommate advertisement?")) {
      setError('');
      setSuccess('');
      setSubmitting(true);
      try {
        await roommateService.deleteRoommateAd(adId);
        setAdId(null);
        setGender('Male');
        setAge('');
        setOccupation('');
        setBudget('');
        setBio('');
        setSuccess("Advertisement deleted successfully.");
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting advertisement.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return <div className="loading-placeholder">Loading form...</div>;
  }

  return (
    <div className="roommate-ad-page">
      <div className="page-header">
        <h2>Roommate Advertisement</h2>
        <p>Post a profile detailing your search requirements, budget, and habits to matching roommates.</p>
      </div>

      {success && (
        <div className="profile-success-alert">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="profile-error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="roommate-ad-form glass">
        <div className="ad-form-header">
          <Sparkles size={20} color="#3b82f6" />
          <h3>{adId ? "Update Advertisement" : "Create New Advertisement"}</h3>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="adGender">Gender Identity</label>
            <select 
              id="adGender" 
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
              className="ad-select"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="adAge">Age</label>
            <input 
              type="number" 
              id="adAge" 
              placeholder="e.g. 24" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={18}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="adOccupation">Occupation / Study</label>
            <input 
              type="text" 
              id="adOccupation" 
              placeholder="e.g. Software Engineer" 
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="adBudget">Monthly Budget (LKR)</label>
            <input 
              type="number" 
              id="adBudget" 
              placeholder="e.g. 800" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min={0}
              required
            />
          </div>

          <div className="form-group span-2">
            <label htmlFor="adBio">About You & House Preferences</label>
            <textarea 
              id="adBio" 
              rows="5"
              placeholder="Tell others about yourself, your habits (pets, smoking, sleep schedule), and what kind of roommate you are looking for..." 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            ></textarea>
          </div>
        </div>

        <div className="form-actions-row">
          <button type="submit" disabled={submitting} className="profile-save-btn">
            {submitting ? (
              <Loader size={18} className="spin-animation" />
            ) : (
              <Save size={18} />
            )}
            <span>{adId ? "Update Profile Ad" : "Publish Ad"}</span>
          </button>

          {adId && (
            <button 
              type="button" 
              onClick={handleDelete} 
              disabled={submitting}
              className="delete-ad-btn"
            >
              <Trash2 size={18} />
              <span>Delete Ad</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RoommateAdForm;
