import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Car, Loader, LogOut, Phone, Mail, Save, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import MyBookings from './MyBookings';
import ProfileTab from '../components/ProfileTab';



const UserDashboard = () => {
    const { user, logout, refreshUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('garage'); // garage | profile
    const navigate = useNavigate();

    // Since MyBookings is a page with its own container, we'll need to do a trick.
    // Ideally, MyBookings should just export its list component.
    // For now, let's just use iframe or just conditionally render it if we treat it as a component.
    // Important: MyBookings has absolute positioning backgrounds which might conflict.
    // A clean approach: Creating a wrapper that hides MyBookings header if inside dashboard? 
    // Or just render MyBookings normally when tab is garage.

    // Actually, MyBookings component ALREADY checks for user login. 
    // Let's modify MyBookings slightly to accept a prop `isEmbedded` to hide its big header/backgrounds if we want.
    // OR: Just rebuild the surrounding layout here.

    return (
        <div className="min-h-screen bg-black text-gray-100 pt-24 pb-12 font-sans relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 fixed"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-display font-bold text-white mb-2">My Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {user?.name}</p>
                    </div>

                    <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10 self-center md:self-auto w-full md:w-auto justify-center md:justify-start">
                        <button
                            onClick={() => setActiveTab('garage')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'garage' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Car size={16} /> My Garage
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <User size={16} /> Profile
                        </button>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'garage' && (
                        <motion.div
                            key="garage"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {/* We Render MyBookings but we might want to hide its default full screen layout.
                                For now, let's just render it. It has its own container. 
                                It might look a bit nested (double padding).
                                Let's see. MyBookings has pt-24 which is for Navbar.
                            */}
                            <div className="-mt-24">
                                <MyBookings />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <ProfileTab user={user} refreshUser={refreshUser} />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default UserDashboard;
