import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ProfileTab from '../components/ProfileTab';
import { motion } from 'framer-motion';

const ProfilePage = () => {
    const { user, refreshUser } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-black text-gray-100 pt-24 pb-12 font-sans relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 fixed"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <header className="mb-8">
                    <h1 className="text-4xl font-display font-bold text-white mb-2">My Profile</h1>
                    <p className="text-gray-400">Manage your personal information and account settings</p>
                </header>

                <ProfileTab user={user} refreshUser={refreshUser} />
            </div>
        </div>
    );
};

export default ProfilePage;
