import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Wrench, AlertCircle, CheckCircle, Trash2, XCircle, Star, Car, Loader } from 'lucide-react';
import API_URL from '../config';
import { toast } from 'react-hot-toast';

const MyBookings = () => {
    // Force Re-deploy
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [feedbackModal, setFeedbackModal] = useState({ isOpen: false, bookingId: null, rating: 0, hover: 0 });
    const [otpModal, setOtpModal] = useState({ isOpen: false, bookingId: null, step: 'request', otp: '' });
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        let interval;
        if (otpModal.isOpen && otpModal.step === 'verify' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpModal.isOpen, otpModal.step, timer]);

    useEffect(() => {
        if (user) {
            fetchBookings();
            // Real-time polling every 5 seconds
            const interval = setInterval(() => {
                fetchBookings(true);
            }, 5000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchBookings = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await axios.get(`${API_URL}/api/my-bookings`, {
                headers: { 'x-auth-token': token }
            });
            // Sort by latest created (or pickup date if createdAt missing)
            const sortedBookings = res.data.sort((a, b) => new Date(b.createdAt || b.pickupDate) - new Date(a.createdAt || a.pickupDate));
            setBookings(sortedBookings);
        } catch (err) {
            console.error(err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleCancelClick = (id) => {
        setOtpModal({ isOpen: true, bookingId: id, step: 'request', otp: '' });
        setTimer(60); // Reset timer on new open
    };

    const handleResend = () => {
        setTimer(60);
        handleSendOtp();
    };

    const handleSendOtp = async () => {
        const loadingToast = toast.loading('Sending OTP...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/api/bookings/${otpModal.bookingId}/request-cancel-otp`, {}, {
                headers: { 'x-auth-token': token }
            });

            // Check if backend returned the OTP (New Version) or not (Old Version)
            if (res.data.debugOtp) {
                const otpMessage = `OTP Sent! Code is in the modal.`;
                toast.success(otpMessage, { id: loadingToast, duration: 5000, icon: '🔓' });
                setOtpModal(prev => ({ ...prev, step: 'verify', debugOtp: res.data.debugOtp }));
            } else {
                // Backend is running intermediate version (Ping works, OTP route exists, but NO debugOtp)
                toast.error('UPDATE PENDING: Restart "backend" terminal to see OTP.', { id: loadingToast, duration: 8000 });
                // Still allow proceeding in case they can see the server console
                setOtpModal(prev => ({ ...prev, step: 'verify' }));
            }
        } catch (err) {
            console.error("OTP Error:", err);
            let errorMsg = 'Failed to send OTP';
            if (err.response) {
                if (err.response.status === 404) {
                    errorMsg = 'Server Endpoint Not Found (Restart Backend Terminal)';
                } else if (err.response.data && err.response.data.msg) {
                    errorMsg = err.response.data.msg;
                } else {
                    errorMsg = `Server Error (${err.response.status})`;
                }
            } else if (err.request) {
                errorMsg = 'Network Error - Backend likely down';
            }
            toast.error(errorMsg, { id: loadingToast, duration: 5000 });
        }
    };

    const handleVerifyAndCancel = async () => {
        if (!otpModal.otp || otpModal.otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        const loadingToast = toast.loading('Verifying & Cancelling...');
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/bookings/${otpModal.bookingId}/cancel`, {
                otp: otpModal.otp
            }, {
                headers: { 'x-auth-token': token }
            });

            toast.success('Booking Cancelled Successfully', { id: loadingToast });

            // Update local state
            setBookings(prev => prev.map(b => b._id === otpModal.bookingId ? { ...b, status: 'Cancelled' } : b));
            setOtpModal({ isOpen: false, bookingId: null, step: 'request', otp: '' });
        } catch (err) {
            console.error("Cancellation Error:", err);
            const errorMsg = err.response?.data?.msg || 'Failed to verify OTP';
            toast.error(errorMsg, { id: loadingToast, duration: 4000 });
        }
    };

    const handleFeedback = async (id, rating, comment) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/api/bookings/${id}/feedback`, { rating, comment }, {
                headers: { 'x-auth-token': token }
            });
            // Update local state to show feedback submitted or re-fetch
            fetchBookings();
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.msg || err.message || 'Failed to submit feedback';
            alert(`Error: ${errorMsg}`);
        }
    };

    const handleStarClick = (rating) => {
        if (feedbackModal.bookingId) {
            handleFeedback(feedbackModal.bookingId, rating, "");
            setFeedbackModal({ ...feedbackModal, isOpen: false, rating: 0, hover: 0 });
        }
    };

    const getStarColor = (rating) => {
        if (rating <= 1) return "text-red-500 fill-red-500";
        if (rating <= 2) return "text-orange-500 fill-orange-500";
        if (rating <= 3) return "text-yellow-400 fill-yellow-400";
        if (rating <= 4) return "text-lime-400 fill-lime-400";
        return "text-green-500 fill-green-500";
    };

    if (!user) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
            Please <button onClick={() => navigate('/login')} className="text-primary hover:underline ml-1">login</button> to view your bookings.
        </div>
    );

    if (loading) return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">Loading your garage...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden pt-24 pb-12">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 fixed"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black/80 fixed"></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">My <span className="text-primary">Garage</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Track the status of your paint jobs and service history.</p>
                </motion.div>

                {bookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm max-w-2xl mx-auto"
                    >
                        <Car size={64} className="mx-auto text-gray-600 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">No Bookings Found</h3>
                        <p className="text-gray-400 mb-8">You haven't booked any services yet.</p>
                        <button
                            onClick={() => navigate('/services')}
                            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-primary/30"
                        >
                            Explore Services
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 max-w-4xl mx-auto">
                        {bookings.map((booking, index) => (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-effect p-6 md:p-8 rounded-2xl border border-white/10 hover:border-primary/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-primary/20 transition-all"></div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                                            <Car className="text-white" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{booking.carModel}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                                <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{booking.carType}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Wrench size={12} /> {booking.serviceType}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:items-end gap-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Calendar size={14} />
                                            {new Date(booking.pickupDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                        <div className="text-2xl font-display font-bold text-white">₹{booking.price?.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Status:</span>
                                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${booking.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            booking.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {booking.status === 'Completed' ? <CheckCircle size={14} /> :
                                                booking.status === 'In Progress' ? <Loader size={14} className="animate-spin" /> :
                                                    booking.status === 'Cancelled' ? <XCircle size={14} /> :
                                                        <Clock size={14} />}
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        {booking.status === 'Pending' && (
                                            <button
                                                onClick={() => handleCancelClick(booking._id)}
                                                className="w-full mt-4 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-2 px-5 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition group"
                                            >
                                                <Trash2 size={16} className="group-hover:scale-110 transition" /> Cancel
                                            </button>
                                        )}



                                        {booking.status === 'Completed' && booking.feedback && (
                                            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i < booking.feedback.rating ? getStarColor(booking.feedback.rating) : "text-gray-700"}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* OTP Cancellation Modal */}
            <AnimatePresence>
                {otpModal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111] border border-white/10 p-6 rounded-2xl w-full max-w-md relative shadow-2xl"
                        >
                            <button
                                onClick={() => setOtpModal({ isOpen: false, bookingId: null, step: 'request', otp: '' })}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white"
                            >
                                <XCircle size={24} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-2">Cancel Booking</h2>

                            {otpModal.step === 'request' ? (
                                <div className="space-y-4">
                                    <p className="text-gray-400">
                                        To ensure security, we need to verify your identity. <br />
                                        Click below to receive a 6-digit OTP on your registered mobile number.
                                    </p>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex items-center gap-3 text-yellow-400 text-sm">
                                        <AlertCircle size={20} />
                                        <span>This action is irreversible.</span>
                                    </div>
                                    <button
                                        onClick={handleSendOtp}
                                        className="w-full bg-primary hover:bg-red-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                                    >
                                        Send OTP & Proceed
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-gray-400">
                                        Enter the 6-digit OTP sent to your mobile.
                                        <br /><span className="text-xs text-gray-500">(Check server console if testing locally)</span>
                                    </p>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={otpModal.otp}
                                        onChange={(e) => setOtpModal({ ...otpModal, otp: e.target.value.replace(/\D/g, '') })}
                                        placeholder="Enter 6-digit OTP"
                                        className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest focus:border-primary outline-none"
                                    />
                                    {otpModal.debugOtp && (
                                        <div className="text-center bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm py-2 rounded-lg">
                                            DEV MODE OTP: <span className="font-mono font-bold text-lg select-all">{otpModal.debugOtp}</span>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleVerifyAndCancel}
                                        disabled={otpModal.otp.length !== 6}
                                        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition"
                                    >
                                        Confirm Cancellation
                                    </button>

                                    <div className="flex justify-between items-center text-sm mt-4">
                                        <span className="text-gray-400">Didn't receive code?</span>
                                        {timer > 0 ? (
                                            <span className="text-gray-500 font-mono">Resend in 00:{timer.toString().padStart(2, '0')}</span>
                                        ) : (
                                            <button
                                                onClick={handleResend}
                                                className="text-primary hover:text-red-400 underline transition font-medium"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feedback Modal */}
            {feedbackModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-zinc-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl relative"
                    >
                        <button onClick={() => setFeedbackModal({ ...feedbackModal, isOpen: false })} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <XCircle size={24} />
                        </button>
                        <h3 className="text-xl font-display font-bold text-white mb-2">Rate Your Experience</h3>
                        <p className="text-gray-400 text-sm mb-6">How was the service provided?</p>

                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setFeedbackModal(prev => ({ ...prev, hover: star }))}
                                    onMouseLeave={() => setFeedbackModal(prev => ({ ...prev, hover: 0 }))}
                                    onClick={() => handleStarClick(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={32}
                                        className={`${star <= (feedbackModal.hover || feedbackModal.rating)
                                            ? getStarColor(feedbackModal.hover || feedbackModal.rating)
                                            : "text-gray-800 fill-gray-800"
                                            } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">Click a star to submit</p>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
