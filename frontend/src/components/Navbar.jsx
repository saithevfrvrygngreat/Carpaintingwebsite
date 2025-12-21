import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react'; // Renamed User to UserIcon to avoid conflict if any

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const location = useLocation();

    // Removed scrolled state since we want permanent black background

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Contact', path: '/contact' },
    ];

    if (user) {
        navLinks.push({ name: 'Book Now', path: '/booking' });
        // Removed Dashboard from main links, will be in User Menu or separate
        if (user.role !== 'admin') {
            navLinks.push({ name: 'My Bookings', path: '/my-bookings' });
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out bg-black/95 backdrop-blur-xl border-b border-white/5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 group relative z-10">
                        <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-primary blur-md opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
                            <img src="/logo_round.png" alt="AutoGlow Logo" className="w-10 h-10 object-cover relative z-10" />
                        </motion.div>
                        <span className="text-2xl font-display font-bold text-white tracking-widest group-hover:text-glow transition-all">
                            AUTO<span className="text-primary">GLOW</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1 bg-white/10 rounded-full p-1 border border-white/20 backdrop-blur-md shadow-inner">
                        {user?.role === 'admin' ? (
                            <>
                                <NavLink to="/admin" mobile={false} active={location.pathname === '/admin'} index={0} hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex}>Dashboard</NavLink>
                                <div className="w-px h-5 bg-white/20 mx-2"></div>
                                <LogoutButton onClick={logout} />
                            </>
                        ) : (
                            <>
                                {navLinks.map((link, index) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        mobile={false}
                                        active={location.pathname === link.path}
                                        index={index}
                                        hoveredIndex={hoveredIndex}
                                        setHoveredIndex={setHoveredIndex}
                                    >
                                        {link.name}
                                    </NavLink>
                                ))}
                            </>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {!user && (
                            <Link to="/login" className="relative group overflow-hidden px-6 py-2 bg-transparent border border-primary text-primary font-bold rounded-full hover:text-white transition-all">
                                <span className="absolute inset-0 w-full h-full bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                                <span className="relative z-10">Login</span>
                            </Link>
                        )}
                        {user && user.role !== 'admin' && <UserMenu user={user} logout={logout} />}
                        {user && user.role === 'admin' && <LogoutButton onClick={logout} />}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4">
                            {user?.role === 'admin' ? (
                                <>
                                    <NavLink to="/admin" mobile={true} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
                                    <button onClick={() => { logout(); setIsOpen(false); }} className="text-left py-3 text-gray-400 hover:text-primary transition-colors">Logout</button>
                                </>
                            ) : (
                                <>
                                    {navLinks.map((link) => (
                                        <NavLink key={link.path} to={link.path} mobile={true} onClick={() => setIsOpen(false)}>
                                            {link.name}
                                        </NavLink>
                                    ))}
                                    {!user && (
                                        <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-4 bg-primary text-white font-bold rounded-xl mt-4">
                                            Login
                                        </Link>
                                    )}
                                    {user && (
                                        <button onClick={() => { logout(); setIsOpen(false); }} className="text-left py-3 text-red-500 font-bold border-t border-white/10 mt-2 pt-4">Logout</button>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const NavLink = ({ to, children, mobile, active, onClick, index, hoveredIndex, setHoveredIndex }) => (
    <Link
        to={to}
        onClick={onClick}
        onMouseEnter={() => !mobile && setHoveredIndex(index)}
        onMouseLeave={() => !mobile && setHoveredIndex(null)}
        className={`
            relative px-5 py-2 font-medium transition-colors duration-300 z-10
            ${mobile ? 'text-lg block border-l-2 border-transparent hover:border-primary pl-4 text-gray-300 hover:text-white hover:bg-white/5 rounded-r-lg' : 'text-sm rounded-full'}
            ${active && !mobile ? 'text-white' : ''}
            ${!active && !mobile ? 'text-gray-400 hover:text-white' : ''}
        `}
    >
        {/* Hover Pill Animation */}
        <AnimatePresence>
            {!mobile && hoveredIndex === index && (
                <motion.div
                    className="absolute inset-0 bg-primary rounded-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </AnimatePresence>

        {/* Active Indicator (Dot) */}
        {!mobile && active && (
            <motion.span
                layoutId="navbar-active-dot"
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#ff2a2a]"
            />
        )}

        <span className="relative z-10">{children}</span>
    </Link>
);

const LogoutButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="relative group overflow-hidden px-6 py-2 bg-transparent border border-primary text-primary font-bold rounded-full hover:text-white transition-all"
    >
        <span className="absolute inset-0 w-full h-full bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
        <span className="relative z-10">Logout</span>
    </button>
);

const UserMenu = ({ user, logout }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all group">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-primary/50">
                    {user.profileImage ? (
                        <img src={`http://localhost:5000${user.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-primary font-bold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">{user.name.split(' ')[0]}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden py-2"
                    >
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                            <UserIcon size={16} /> My Profile
                        </Link>

                        <div className="h-px bg-white/10 my-1 mx-4"></div>
                        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left">
                            <LogOut size={16} /> Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
