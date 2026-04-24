import React, { useState, useEffect } from 'react';
import API from '../api';
import { User, Mail, Phone, MapPin, Package, Settings, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zip: '' }
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('info');
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/users/profile');
        const userData = res.data.data;
        // Ensure address exists
        if (!userData.address) {
          userData.address = { street: '', city: '', state: '', zip: '' };
        }
        setProfile(userData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      await API.put('/users/profile', profile);
      setMessage({ type: 'success', text: 'Profile updated successfully! ✅' });
      setUpdating(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
      setUpdating(false);
    }
  };

  if (loading) return <div className="profile-loading"><div className="loader"></div></div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="user-avatar-large">
          {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="user-meta">
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
        </div>
      </div>

      <div className="profile-container">
        {/* Sidebar Tabs */}
        <div className="profile-sidebar">
          <button 
            className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <User size={18} />
            <span>Account Info</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            <MapPin size={18} />
            <span>Shipping Address</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Settings size={18} />
            <span>Security</span>
          </button>
          <button 
            className="tab-btn"
            onClick={() => window.location.href = '/orders'}
          >
            <Package size={18} />
            <span>My Orders</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="profile-content">
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div 
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="content-card"
              >
                <h3>Personal Information</h3>
                <form onSubmit={handleUpdate}>
                  <div className="input-group">
                    <label><User size={16} /> Full Name</label>
                    <input 
                      type="text" 
                      value={profile.name} 
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div className="input-group disabled">
                    <label><Mail size={16} /> Email Address</label>
                    <input type="email" value={profile.email} disabled />
                    <span className="hint">Email cannot be changed</span>
                  </div>
                  <div className="input-group">
                    <label><Phone size={16} /> Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+91 99999 99999"
                      value={profile.phone} 
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="save-btn" disabled={updating}>
                    {updating ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'shipping' && (
              <motion.div 
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="content-card"
              >
                <h3>Delivery Address</h3>
                <form onSubmit={handleUpdate}>
                  <div className="input-group full-width">
                    <label>Street Address</label>
                    <input 
                      type="text" 
                      value={profile.address.street} 
                      onChange={(e) => setProfile({...profile, address: {...profile.address, street: e.target.value}})}
                      placeholder="House No., Street Name"
                    />
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>City</label>
                      <input 
                        type="text" 
                        value={profile.address.city} 
                        onChange={(e) => setProfile({...profile, address: {...profile.address, city: e.target.value}})}
                      />
                    </div>
                    <div className="input-group">
                      <label>State</label>
                      <input 
                        type="text" 
                        value={profile.address.state} 
                        onChange={(e) => setProfile({...profile, address: {...profile.address, state: e.target.value}})}
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Zip Code</label>
                    <input 
                      type="text" 
                      value={profile.address.zip} 
                      onChange={(e) => setProfile({...profile, address: {...profile.address, zip: e.target.value}})}
                    />
                  </div>
                  <button type="submit" className="save-btn" disabled={updating}>
                    {updating ? 'Saving...' : <><Save size={18} /> Update Address</>}
                  </button>
                </form>
              </motion.div>
            )}
            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="content-card"
              >
                <h3>Account Security</h3>
                <form onSubmit={handleUpdate}>
                  <div className="input-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.currentPassword} 
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.newPassword} 
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="input-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.confirmPassword} 
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="save-btn" disabled={updating}>
                    {updating ? 'Updating...' : <><Save size={18} /> Change Password</>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {message.text && (
            <div className={`form-message ${message.type}`}>
              {message.type === 'error' ? <AlertCircle size={18} /> : null}
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
