import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { roommateService } from '../services/roommateService';
import { AuthContext } from '../context/AuthContext';
import RoommateCard from '../components/RoommateCard';
import { Users, Briefcase, DollarSign, SlidersHorizontal, X, Calendar, MapPin, MessageSquare, Info, Home } from 'lucide-react';

const Roommates = () => {
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOccupation = searchParams.get('occupation') || '';

  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);

  const [gender, setGender] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [occupation, setOccupation] = useState(initialOccupation);
  const [preferredCity, setPreferredCity] = useState('');
  const [roomType, setRoomType] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchRoommates = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (gender) filters.gender = gender;
      if (minAge) filters.minAge = parseInt(minAge);
      if (maxAge) filters.maxAge = parseInt(maxAge);
      if (occupation) filters.occupation = occupation;
      if (preferredCity) filters.preferredCity = preferredCity;
      if (roomType) filters.roomType = roomType;
      if (minBudget) filters.minBudget = parseFloat(minBudget);
      if (maxBudget) filters.maxBudget = parseFloat(maxBudget);

      const data = await roommateService.searchRoommates(filters);
      setRoommates(data);
    } catch (error) {
      console.error("Error loading roommate ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchRoommates();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (occupation) params.occupation = occupation;
    if (preferredCity) params.preferredCity = preferredCity;
    if (roomType) params.roomType = roomType;
    setSearchParams(params);
    setCurrentPage(1);
    fetchRoommates();
  };

  const parseBio = (bio) => {
    if (!bio) return { aboutMe: '', roomType: 'N/A', moveInDate: 'N/A', preferredCity: 'N/A', contactMethod: 'N/A' };
    const parts = bio.split(' | ');
    const result = {
      aboutMe: bio,
      roomType: 'N/A',
      moveInDate: 'N/A',
      preferredCity: 'N/A',
      contactMethod: 'N/A'
    };
    parts.forEach(part => {
      if (part.startsWith('About me:')) {
        result.aboutMe = part.replace('About me:', '').trim();
      } else if (part.startsWith('Room Type Preference:')) {
        result.roomType = part.replace('Room Type Preference:', '').trim();
      } else if (part.startsWith('Move-in Date:')) {
        result.moveInDate = part.replace('Move-in Date:', '').trim();
      } else if (part.startsWith('Preferred City:')) {
        result.preferredCity = part.replace('Preferred City:', '').trim();
      } else if (part.startsWith('Preferred Contact:')) {
        result.contactMethod = part.replace('Preferred Contact:', '').trim();
      }
    });
    return result;
  };

  return (
    <div className="search-directory-page">
      <div className="directory-header">
        <h2>Find Compatible Roommates</h2>
        <p>Connect with people looking for rooms who match your budget and habits.</p>
      </div>

      <div className="roommates-search-container">
        {/* Left Sidebar Panel */}
        <aside className="roommates-sidebar-panel glass">
          <form onSubmit={handleFilterSubmit} className="sidebar-filter-form">
            <h3 className="sidebar-filter-title">Advanced Search</h3>
            
            {/* Preferred City (text input) */}
            <div className="filter-group">
              <label htmlFor="preferredCity"><MapPin size={16} /> Preferred City</label>
              <input
                type="text"
                id="preferredCity"
                placeholder="e.g. Homagama, Pitipana"
                value={preferredCity}
                onChange={(e) => setPreferredCity(e.target.value)}
              />
            </div>

            {/* Room Type Preference (select dropdown) */}
            <div className="filter-group">
              <label htmlFor="roomType"><Home size={16} /> Room Type Preference</label>
              <select
                id="roomType"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Private Room">Private Room</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Entire Apartment">Entire Apartment</option>
              </select>
            </div>

            {/* Min Budget and Max Budget (side-by-side numeric inputs) */}
            <div className="filter-group">
              <label><DollarSign size={16} /> Budget Range (LKR)</label>
              <div className="side-by-side-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  min={0}
                />
                <span className="range-dash">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  min={0}
                />
              </div>
            </div>

            {/* Gender filter */}
            <div className="filter-group">
              <label htmlFor="gender"><Users size={16} /> Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Occupation filter */}
            <div className="filter-group">
              <label htmlFor="occupation"><Briefcase size={16} /> Occupation</label>
              <input
                type="text"
                id="occupation"
                placeholder="e.g. Student"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
              />
            </div>

            {/* Age Range filter */}
            <div className="filter-group">
              <label>Age Range</label>
              <div className="side-by-side-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                />
                <span className="range-dash">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                />
              </div>
            </div>

            {/* Apply Filters (deep blue primary button) */}
            <button type="submit" className="apply-filters-sidebar-btn">
              <SlidersHorizontal size={16} />
              <span>Apply Filters</span>
            </button>
          </form>
        </aside>

        {/* Right Area (Grid / Results) */}
        <main className="roommates-results-area">
          {(() => {
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentRoommates = roommates.slice(indexOfFirstItem, indexOfLastItem);
            const totalPages = Math.ceil(roommates.length / itemsPerPage);

            return loading ? (
              <div className="loading-placeholder">Searching roommate profiles...</div>
            ) : currentRoommates.length > 0 ? (
              <div className="roommates-grid-container">
                <div className="roommates-grid">
                  {currentRoommates.map(rm => (
                    <RoommateCard 
                      key={rm.id} 
                      ad={rm} 
                      onCardClick={(ad) => setSelectedAd(ad)} 
                    />
                  ))}
                </div>

                {/* Pagination Toolbar */}
                {totalPages > 1 && (
                  <div className="roommates-pagination-bar">
                    <button
                      type="button"
                      className="pagination-btn pagination-prev"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    
                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`pagination-btn pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="pagination-btn pagination-next"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-results-box glass">
                <h3>No matching roommates found</h3>
                <p>Try relaxing your filters or budget range to view more profiles.</p>
              </div>
            );
          })()}
        </main>
      </div>

      {/* Roommate Details Modal Overlay */}
      {selectedAd && (
        <div className="roommate-modal-overlay" onClick={() => setSelectedAd(null)}>
          <div className="roommate-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedAd(null)}>
              <X size={20} />
            </button>
            
            <div className="modal-profile-header">
              <div className="modal-profile-avatar">
                <img 
                  src={selectedAd.user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} 
                  alt={selectedAd.user?.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100?text=" + encodeURIComponent(selectedAd.user?.name?.charAt(0) || 'R');
                  }}
                />
              </div>
              <div className="modal-profile-title">
                <h3>{selectedAd.user?.name}</h3>
                <span className="modal-profile-subtitle">
                  {selectedAd.gender || 'Any'}, {selectedAd.age || 'N/A'} yrs — {selectedAd.occupation || 'Student'}
                </span>
              </div>
            </div>

            <div className="modal-details-grid">
              <div className="modal-detail-item">
                <span className="detail-label">Budget</span>
                <span className="detail-value">LKR {selectedAd.budget} / month</span>
              </div>
              <div className="modal-detail-item">
                <span className="detail-label">Preferred City</span>
                <span className="detail-value">{parseBio(selectedAd.bio).preferredCity}</span>
              </div>
              <div className="modal-detail-item">
                <span className="detail-label">Room Type Preference</span>
                <span className="detail-value">{parseBio(selectedAd.bio).roomType}</span>
              </div>
              <div className="modal-detail-item">
                <span className="detail-label">Earliest Move-in</span>
                <span className="detail-value">{parseBio(selectedAd.bio).moveInDate}</span>
              </div>
              <div className="modal-detail-item">
                <span className="detail-label">Preferred Contact</span>
                <span className="detail-value">{parseBio(selectedAd.bio).contactMethod}</span>
              </div>
              <div className="modal-detail-item">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{selectedAd.user?.email || 'N/A'}</span>
              </div>
            </div>

            <div className="modal-bio-section">
              <h4>About Me</h4>
              <p>"{parseBio(selectedAd.bio).aboutMe}"</p>
            </div>

            <div className="modal-footer-actions">
              {currentUser?.id !== selectedAd.user?.id ? (
                <button 
                  onClick={() => {
                    setSelectedAd(null);
                    if (!currentUser) {
                      navigate('/login');
                    } else {
                      window.dispatchEvent(new CustomEvent('open-chat-drawer', { detail: { userId: selectedAd.user.id } }));
                    }
                  }} 
                  className="modal-contact-btn-new"
                >
                  <MessageSquare size={16} />
                  <span>Send Message</span>
                </button>
              ) : (
                <button onClick={() => setSelectedAd(null)} className="modal-close-action-btn">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roommates;
