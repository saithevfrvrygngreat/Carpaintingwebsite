import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import API_URL from '../config';
import { User, Phone, Mail, Save, X, Loader, Camera } from 'lucide-react'; // Added Camera

const ProfileTab = ({ user, refreshUser }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null); // Local preview state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passLoading, setPassLoading] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("New passwords do not match");
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setPassLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/auth/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { 'x-auth-token': token }
            });
            toast.success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || 'Failed to update password');
        } finally {
            setPassLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation (optional, sync with backend limits if needed)
        if (file.size > 50000000) { // 50MB
            toast.error('File is too large (Max 50MB)');
            return;
        }

        // Show local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setSelectedFile(file);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPreview(null);
        setSelectedFile(null);
        // Reset form data to original user data
        setFormData({
            name: user?.name || '',
            phone: user?.phone || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            // 1. If there is a file selected, upload it first
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', selectedFile);

                try {
                    await axios.post(`${API_URL}/api/auth/upload-avatar`, uploadFormData, {
                        headers: { 'x-auth-token': token }
                    });
                } catch (uploadErr) {
                    console.error("Avatar Upload Error:", uploadErr);
                    toast.error(uploadErr.response?.data?.msg || 'Failed to upload avatar');
                    setLoading(false);
                    return; // Stop if avatar upload fails
                }
            }

            // 2. Update Profile Details
            await axios.put(`${API_URL}/api/auth/profile`, formData, {
                headers: { 'x-auth-token': token }
            });

            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setSelectedFile(null);
            setPreview(null);
            if (refreshUser) refreshUser();

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm relative">
                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-primary/20 via-black to-black"></div>
                <div className="px-4 md:px-8 pb-8 relative">
                    {/* Avatar */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-black bg-zinc-900 flex items-center justify-center shadow-xl overflow-hidden relative">
                                {preview ? (
                                    <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                                ) : user?.profileImage ? (
                                    <img src={`${API_URL}${user.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-bold text-primary">{formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}</span>
                                )}

                                {/* Only allow image upload when Editing */}
                                {isEditing && (
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer z-10 animate-fade-in">
                                        <Camera className="text-white drop-shadow-lg" size={32} />
                                        <input type="file" onChange={handleImageFileChange} className="hidden" accept="image/*" />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start pt-4 mb-12">
                        <div className="pt-16 md:pl-4 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-white">{formData.name}</h2>
                            <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">
                                Member Since {user?.date ? new Date(user.date).getFullYear() : new Date().getFullYear()}
                            </p>
                        </div>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="mt-4 md:mt-0 w-full md:w-auto px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition">
                                Edit Profile
                            </button>
                        ) : (
                            <button onClick={handleCancel} className="mt-4 md:mt-0 w-full md:w-auto px-6 py-2 border border-white/20 hover:border-white/50 text-gray-300 hover:text-white rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 hover:bg-white/5">
                                <X size={16} /> Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-400 font-bold ml-2">Full Name</label>
                                <div className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-primary/50 transition">
                                    <User className="text-gray-500" size={20} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="bg-transparent w-full outline-none text-white disabled:text-gray-400 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-400 font-bold ml-2">Phone Number</label>
                                <div className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-primary/50 transition">
                                    <Phone className="text-gray-500" size={20} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="bg-transparent w-full outline-none text-white disabled:text-gray-400 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-2">Email Address</label>
                                <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3 opacity-50 cursor-not-allowed">
                                    <Mail className="text-gray-500" size={20} />
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="bg-transparent w-full outline-none text-gray-400 font-medium cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 ml-2">*Email cannot be changed.</p>
                            </div>
                        </div>

                        {isEditing && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader className="animate-spin" /> : <Save size={20} />}
                                Save Changes
                            </motion.button>
                        )}
                    </form>
                </div>
            </div>
            {/* Change Password Section */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm p-8">
                <h3 className="text-lg font-bold text-white border-l-4 border-primary pl-3 mb-6">Change Password</h3>
                <form onSubmit={submitPasswordChange} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-2">Current Password</label>
                        <div className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-primary/50 transition">
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="Enter your current password"
                                className="bg-transparent w-full outline-none text-white font-medium placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-2">New Password</label>
                            <div className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-primary/50 transition">
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="Enter new password"
                                    className="bg-transparent w-full outline-none text-white font-medium placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-2">Confirm Password</label>
                            <div className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-primary/50 transition">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    placeholder="Confirm new password"
                                    className="bg-transparent w-full outline-none text-white font-medium placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={passLoading}
                            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2 border border-white/10"
                        >
                            {passLoading ? <Loader className="animate-spin" size={18} /> : null}
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ProfileTab;
