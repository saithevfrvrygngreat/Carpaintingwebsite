import { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Calendar, Car, Wrench, CheckCircle, Loader, Shield, Gauge, Crown } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import API_URL from '../config';

const Booking = () => {
    // ... (lines 10-40)
    try {
        const res = await axios.get(`${API_URL}/api/prices?carType=${formData.carType}`);
        setAvailableServices(res.data);
        // ... (lines 43-101)
        await axios.post(`${API_URL}/api/bookings`, dataToSubmit, {
            headers: { 'x-auth-token': token }
        });

        toast.success('Booking Successful! We will contact you shortly.');
        navigate('/my-bookings');
    } catch (err) {
        console.error(err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            toast.error('Session expired. Please login again.');
            // clear invalid token if any
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/login');
        } else {
            toast.error(err.response?.data?.msg || 'Booking Failed');
        }
    } finally {
        setLoading(false);
    }
};

return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px]"></div>
        </div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect rounded-2xl w-full max-w-5xl overflow-hidden relative z-10 shadow-2xl border border-white/5 flex flex-col md:flex-row"
        >
            {/* Left Side - Visual */}
            <div className="md:w-1/3 bg-gradient-to-br from-secondary to-black p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-display font-bold mb-2">Book Service</h2>
                    <p className="text-gray-400 text-sm">Premium care for your machine.</p>
                </div>

                <div className="relative z-10 space-y-4 md:mt-0 mt-8">
                    <div className="flex items-center space-x-3 text-gray-300">
                        <CheckCircle size={18} className="text-primary" />
                        <span className="text-sm">Factory Grade Paint</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                        <CheckCircle size={18} className="text-primary" />
                        <span className="text-sm">Expert Technicians</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-300">
                        <CheckCircle size={18} className="text-primary" />
                        <span className="text-sm">Timely Delivery</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-2/3 p-8 bg-black/20 backdrop-blur-sm max-h-[85vh] overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* 1. Car Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/10 pb-2 mb-4">Vehicle Details</h3>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 font-semibold uppercase">Car Model</label>
                            <div className="relative">
                                <Car size={16} className="absolute left-3 top-3.5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="e.g. BMW M5"
                                    required
                                    value={formData.carModel}
                                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition"
                                />
                            </div>
                        </div>

                        {/* 2. Service Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Body Type <span className="text-red-500">*</span></label>
                                <select
                                    value={formData.carType}
                                    onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition appearance-none"
                                    required
                                >
                                    <option value="" className="bg-gray-900">Select Body Type</option>
                                    <option value="Hatchback" className="bg-gray-900">Hatchback</option>
                                    <option value="Sedan" className="bg-gray-900">Sedan</option>
                                    <option value="SUV" className="bg-gray-900">SUV</option>
                                    <option value="Luxury" className="bg-gray-900">Luxury</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Service <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Wrench size={16} className="absolute left-3 top-3.5 text-gray-500" />
                                    <select
                                        value={formData.serviceType}
                                        onChange={handleServiceChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition appearance-none"
                                        required
                                    >
                                        <option value="" className="bg-gray-900">Select Service</option>
                                        {availableServices.length > 0 ? (
                                            availableServices.map((service) => (
                                                <option key={service._id} value={service.serviceName} className="bg-gray-900">
                                                    {service.serviceName}
                                                </option>
                                            ))
                                        ) : (
                                            /* Fallback or specific hardcoded options if API fails or empty - optionally keep old list as fallback */
                                            <>
                                                <option value="Dent Removal" className="bg-gray-900">Dent Removal</option>
                                                <option value="Full Paint" className="bg-gray-900">Full Paint</option>
                                                <option value="Stickering" className="bg-gray-900">Stickering</option>
                                                <option value="Custom Mods" className="bg-gray-900">Custom Mods</option>
                                            </>
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Contact & Schedule */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-white/10 pb-2 mb-4">Schedule & Contact</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-semibold uppercase">Phone Number</label>
                                <div className="relative">
                                    <Wrench size={16} className="absolute left-3 top-3.5 text-gray-500" /> {/* Should be Phone icon but keeping context consitent */}
                                    <input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        required
                                        value={formData.phone}
                                        maxLength={10}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/\D/g, '');
                                            if (value.startsWith('0')) {
                                                value = value.substring(1);
                                            }
                                            setFormData({ ...formData, phone: value });
                                        }}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-500 font-semibold uppercase">Preferred Date</label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-3 top-3.5 text-gray-500" />
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.pickupDate}
                                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary & Submit */}
                    <div className="pt-6 border-t border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400">Total Estimation</span>
                            <span className="text-3xl font-display font-bold text-primary text-glow">
                                ₹{Number(formData.price).toLocaleString()}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:bg-primary-dark transform hover:-translate-y-1 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    </div>
);
};

export default Booking;
