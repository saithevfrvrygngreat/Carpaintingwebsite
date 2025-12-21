import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader, Check, X } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Password Strength Logic
    const getPasswordStrength = (pass) => {
        let score = 0;
        if (!pass) return 0;
        if (pass.length >= 8) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        return score; // Max 4
    };

    const passwordScore = getPasswordStrength(formData.password);

    const getStrengthColor = () => {
        switch (passwordScore) {
            case 0: return 'bg-gray-700';
            case 1: return 'bg-red-500';
            case 2: return 'bg-yellow-500';
            case 3: return 'bg-blue-500';
            case 4: return 'bg-green-500';
            default: return 'bg-gray-700';
        }
    };

    const getStrengthLabel = () => {
        switch (passwordScore) {
            case 0: return '';
            case 1: return 'Weak';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Strong';
            default: return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            // Allow empty string for deletion
            if (value === '') {
                setFormData(prev => ({ ...prev, phone: value }));
                return;
            }
            // Enforce numbers only
            if (!/^\d+$/.test(value)) return;
            // First digit cannot be 0
            if (value[0] === '0') return;
            // Max 10 digits
            if (value.length > 10) return;

            setFormData(prev => ({ ...prev, phone: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (passwordScore < 2) {
            setError("Password is too weak. Please include numbers or uppercase letters.");
            return;
        }

        setLoading(true);
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center relative overflow-hidden bg-black">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-effect p-1 bg-gradient-to-br from-white/10 to-transparent m-4 rounded-2xl w-full max-w-md relative z-10"
            >
                <div className="bg-black/80 backdrop-blur-xl p-8 rounded-xl border border-white/5">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-display font-bold text-white mb-2">Join <span className="text-primary">AutoGlow</span></h2>
                        <p className="text-gray-400">Create your premium account</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 flex items-center gap-2 text-sm"
                        >
                            <X size={16} /> {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-3.5 text-gray-500" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition placeholder-gray-600"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition placeholder-gray-600"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1">Phone Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-3.5 text-gray-500" />
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition placeholder-gray-600"
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold ml-1">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-10 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition placeholder-gray-600"
                                    placeholder="Create a strong password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {/* Password Strength Meter */}
                            {formData.password && (
                                <div className="space-y-1 px-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Strength</span>
                                        <span className={`${passwordScore <= 1 ? 'text-red-400' :
                                            passwordScore === 2 ? 'text-yellow-400' :
                                                passwordScore === 3 ? 'text-blue-400' : 'text-green-400'
                                            } font-bold transition-colors`}>{getStrengthLabel()}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${getStrengthColor()} transition-all duration-500 ease-out`}
                                            style={{ width: `${(passwordScore / 4) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 pt-1">
                                        Use 8+ chars, numbers & symbols.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:bg-primary-dark transform hover:-translate-y-1 transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-400 text-sm">
                        Already have an account? <Link to="/login" className="text-primary hover:text-white transition font-semibold hover:underline">Login</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
