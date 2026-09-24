import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, KeyRound, Check } from 'lucide-react';
import Toast from '../components/Toast';
import { updateProfile } from '../store/authSlice';
import API from '../services/api';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Address
  const addr = user?.addresses?.[0] || {};
  const [street, setStreet] = useState(addr.street || '');
  const [city, setCity] = useState(addr.city || '');
  const [state, setState] = useState(addr.state || '');
  const [postalCode, setPostalCode] = useState(addr.postalCode || '');

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateProfile({
          name,
          phone,
          avatar,
          addresses: [
            {
              street,
              city,
              state,
              postalCode,
              country: 'India',
              isDefault: true
            }
          ]
        })
      ).unwrap();
      setToastMessage('Profile updated successfully!');
    } catch (err) {
      setToastMessage(err || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    try {
      await API.put('/auth/change-password', { currentPassword, newPassword });
      setToastMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      <div className="border-b border-slate-200 pb-6 flex items-center gap-4">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'User Profile'}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
          />
        ) : null}
        <div
          className={`w-16 h-16 rounded-2xl bg-indigo-100 border-2 border-indigo-500 text-indigo-700 font-extrabold text-xl items-center justify-center ${
            user?.avatar ? 'hidden' : 'flex'
          }`}
        >
          {user?.name ? user.name[0].toUpperCase() : <User size={24} />}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
          <p className="text-xs text-slate-500">{user?.email} • Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <User size={18} className="text-indigo-600" /> Account Details & Saved Address
        </h3>

        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Avatar Image URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-indigo-600 mb-3 uppercase tracking-wider">Default Shipping Address</h4>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State & PIN Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
              />
              <input
                type="text"
                placeholder="PIN Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <KeyRound size={18} className="text-indigo-600" /> Change Security Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          {passwordError && <p className="text-xs font-semibold text-rose-600">{passwordError}</p>}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
