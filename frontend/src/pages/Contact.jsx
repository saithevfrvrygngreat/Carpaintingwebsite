import { MapPin, Phone, Mail, Send, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { toast, Toaster } from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/api/contact`, formData);
            toast.success('Message sent! We will contact you soon.');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden pt-24 pb-12">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=2146&auto=format&fit=crop')] bg-cover bg-center opacity-10 fixed"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/80 fixed"></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Get in <span className="text-primary">Touch</span></h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">We are here to answer any questions you may have about our services. Reach out to us and we'll respond as soon as we can.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-effect p-8 rounded-2xl border border-white/10"
                        >
                            <h2 className="text-2xl font-bold font-display mb-6 text-white border-l-4 border-primary pl-4">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Our Workshop</h3>
                                        <p className="text-gray-400">CX33+HMP, 6th St<br />Thayagaraju Nagar, Jyothi Nagar, Nellore<br />Andhra Pradesh 524004</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Call Us</h3>
                                        <p className="text-gray-400">+91 90004 34825</p>
                                        <p className="text-xs text-gray-500 mt-1">Mon-Sat from 9am to 6pm</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="p-3 bg-white/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">Email Us</h3>
                                        <p className="text-gray-400">kameswarraodasetti@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-effect p-8 rounded-2xl border border-white/10"
                        >
                            <h2 className="text-2xl font-bold font-display mb-6 text-white border-l-4 border-primary pl-4">Opening Hours</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-gray-300 border-b border-white/5 pb-2">
                                    <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> Mon - Sat</span>
                                    <span>09:00 AM - 06:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-300 border-b border-white/5 pb-2">
                                    <span className="flex items-center gap-2"><XCircle size={16} className="text-primary" /> Sunday</span>
                                    <span>Closed</span>
                                </div>
                                <iframe
                                    src="https://maps.google.com/maps?q=Sri+Sai+Paintings,Nellore,Andhra+Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Shop Location"
                                ></iframe>
                            </div>
                        </motion.div>
                    </div>

                    {/* Map & Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-8"
                    >
                        <form onSubmit={handleSubmit} className="glass-effect p-8 rounded-2xl border border-white/10 space-y-4">
                            <h2 className="text-2xl font-bold font-display mb-2 text-white">Send Message</h2>
                            <p className="text-gray-400 text-sm mb-6">Have a specific inquiry? Fill out the form below.</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                                <textarea
                                    rows="4"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                                    placeholder="Your message here..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Message'} <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>

                        <div className="rounded-2xl overflow-hidden h-64 border border-white/10 shadow-2xl relative group">
                            <div className="absolute inset-0 bg-primary/20 pointer-events-none group-hover:bg-transparent transition-colors z-10 text-center flex items-center justify-center">
                                <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full border border-white/10 group-hover:opacity-0 transition-opacity">Interactive Map</span>
                            </div>
                            <iframe
                                src="https://maps.google.com/maps?q=Sri+Sai+Paintings,Nellore,Andhra+Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Shop Location"
                            ></iframe>
                        </div>
                    </motion.div>
                </div>
            </div>
            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#333',
                    color: '#fff',
                },
            }} />
        </div>
    );
};

export default Contact;
