import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Wrench, ArrowRight, Star, Shield, Zap, Droplet, Loader, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import API_URL from '../config';

const carTypes = [
    { id: 'Hatchback', label: 'Hatchback', desc: 'Compact & agile', icon: <Wrench size={24} /> },
    { id: 'Sedan', label: 'Sedan', desc: 'Executive comfort', icon: <Shield size={24} /> },
    { id: 'SUV', label: 'SUV', desc: 'Built tough', icon: <Zap size={24} /> },
    { id: 'Luxury', label: 'Luxury', desc: 'Elite status', icon: <Star size={24} /> }
];

const Services = () => {
    const [prices, setPrices] = useState([]);
    const [selectedCarType, setSelectedCarType] = useState('Hatchback');
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        fetchPrices();
    }, [selectedCarType]);

    const fetchPrices = async () => {
        try {
            setLoading(true);
            setErrorMessage(null);
            const res = await axios.get(`${API_URL}/api/prices?carType=${selectedCarType}`);
            if (Array.isArray(res.data)) {
                setPrices(res.data);
            } else {
                setPrices([]);
                setErrorMessage('Invalid data received from server.');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching prices:', err);
            setErrorMessage(err.response?.data?.error || err.message || 'Failed to connect to server');
            setPrices([]);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-black relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold mb-4 text-white"
                    >
                        Precision <span className="text-primary text-glow">Pricing</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Transparent rates for world-class automotive craftsmanship. Select your vehicle class to begin.
                    </p>
                </div>

                {/* Car Type Selector */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {carTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedCarType(type.id)}
                            className={`
                                relative pl-12 pr-6 py-4 rounded-xl border transition-all duration-300 min-w-[160px] text-left group overflow-hidden
                                ${selectedCarType === type.id
                                    ? 'bg-primary/10 border-primary text-white shadow-[0_0_20px_rgba(255,42,42,0.2)]'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/10'}
                            `}
                        >
                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${selectedCarType === type.id ? 'text-primary' : 'text-gray-500 group-hover:text-white'}`}>
                                {type.icon}
                            </div>
                            <h3 className="font-bold">{type.label}</h3>
                            <p className="text-xs opacity-60">{type.desc}</p>

                            {/* Active Indicator */}
                            {selectedCarType === type.id && (
                                <motion.div layoutId="activeType" className="absolute inset-0 border-2 border-primary rounded-xl" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader className="animate-spin text-primary w-12 h-12" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {prices.map((service, idx) => (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-effect p-8 rounded-2xl group border border-white/5 hover:border-primary/50 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all"></div>

                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors relative z-10">
                                    {service.serviceName}
                                </h3>
                                <p className="text-gray-400 mb-8 text-sm leading-relaxed min-h-[60px] relative z-10">
                                    {service.description || "Premium restoration service restoring factory specs using advanced techniques."}
                                </p>

                                <div className="flex flex-col space-y-4 relative z-10">
                                    <div className="flex items-end justify-between border-b border-white/10 pb-4">
                                        <span className="text-gray-500 text-sm">Starting form</span>
                                        <span className="text-3xl font-display font-bold text-white">₹{service.price.toLocaleString()}</span>
                                    </div>

                                    <Link
                                        to="/booking"
                                        state={{ serviceName: service.serviceName, carType: selectedCarType, price: service.price }}
                                        className="w-full py-4 bg-white/5 hover:bg-primary text-white text-center font-bold rounded-xl transition-all border border-white/10 hover:border-primary group-hover:shadow-[0_0_20px_rgba(255,42,42,0.4)] flex items-center justify-center gap-2"
                                    >
                                        Select Package <Check size={18} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}

                        {errorMessage && (
                            <div className="col-span-full text-center py-12 glass-effect rounded-2xl border border-red-500/30 p-8">
                                <p className="text-red-400 font-bold text-lg mb-2">Unable to load packages</p>
                                <p className="text-gray-400 text-sm mb-6">{errorMessage} (Connecting to: {API_URL})</p>
                                <button
                                    onClick={fetchPrices}
                                    className="px-6 py-2.5 bg-primary hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,42,42,0.4)]"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {!errorMessage && prices.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-500 text-xl">No packages available for {selectedCarType} currently.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
