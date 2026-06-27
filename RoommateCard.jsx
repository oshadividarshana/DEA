import React, { useContext } from 'react';
import { MessageSquare, Briefcase, DollarSign, Calendar, Info } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RoommateCard = ({ ad, onCardClick }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMessageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    navigate(`/dashboard/messages?userId=${ad.user.id}`);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(ad);
    }
  };

  return (
    <div className="roommate-card clickable-card" onClick={handleCardClick}>
      <div className="roommate-card-header">
        <div className="roommate-card-avatar">
          <img 
            src={ad.user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} 
            alt={ad.user?.name}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100?text=" + encodeURIComponent(ad.user?.name?.charAt(0) || 'R');
            }}
          />
        </div>
        <div className="roommate-card-user-info">
          <h4 className="roommate-name">{ad.user?.name}</h4>
          <span className="roommate-gender-age">{ad.gender || 'Any'}, {ad.age || 'N/A'} yrs</span>
        </div>
      </div>

      <div className="roommate-card-body">
        <div className="roommate-meta-grid">
          <div className="meta-item">
            <Briefcase size={16} />
            <span>{ad.occupation || 'Student / Worker'}</span>
          </div>
          <div className="meta-item">
            <DollarSign size={16} />
            <span>Budget: LKR {ad.budget}/mo</span>
          </div>
        </div>

      </div>

      <div className="roommate-card-footer">
        {user?.id !== ad.user?.id ? (
          <button onClick={handleMessageClick} className="roommate-contact-btn">
            <MessageSquare size={16} />
            <span>Message</span>
          </button>
        ) : (
          <span className="own-ad-badge">Your Advertisement</span>
        )}
      </div>
    </div>
  );
};

export default RoommateCard;
