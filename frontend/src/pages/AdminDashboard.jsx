import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, Search, Filter, Mail, User, DollarSign, Activity, Calendar, CheckCircle, Clock, XCircle, MoreVertical, Edit2, Play, Wrench, Star, MessageSquare } from 'lucide-react';
import API_URL from '../config';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    // Removed stats state to derive from bookings directly
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [statusUpdating, setStatusUpdating] = useState(null);
    const [sortOption, setSortOption] = useState('date'); // 'date' | 'status'

    useEffect(() => {
        fetchDashboardData();
        // Real-time polling every 5 seconds
        const interval = setInterval(() => {
            fetchDashboardData(true);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async (silent = false) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };

            // Fetch core data first
            try {
                const [bookingsRes, usersRes, contactsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/all-bookings`, config),
                    axios.get(`${API_URL}/api/auth/users`, config),
                    axios.get(`${API_URL}/api/contacts`, config)
                ]);
                setBookings(bookingsRes.data);
                setUsers(usersRes.data);
                setContacts(contactsRes.data);
            } catch (coreError) {
                console.error("Error fetching core admin data", coreError);
            }

            if (!silent) setLoading(false);
        } catch (error) {
            console.error("Critical dashboard error", error);
            if (!silent) setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setStatusUpdating(id);
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };

            await axios.put(`${API_URL}/api/bookings/${id}`, { status: newStatus }, config);

            // Optimistic update
            setBookings(bookings.map(b => b._id === id ? { ...b, status: newStatus } : b));
            setStatusUpdating(null);
        } catch (error) {
            console.error("Failed to update status", error);
            setStatusUpdating(null);
        }
    };

    const getStarColor = (rating) => {
        if (rating <= 1) return "text-red-500 fill-red-500";
        if (rating <= 2) return "text-orange-500 fill-orange-500";
        if (rating <= 3) return "text-yellow-400 fill-yellow-400";
        if (rating <= 4) return "text-lime-400 fill-lime-400";
        return "text-green-500 fill-green-500";
    };

    // Derived Stats
    const revenue = bookings.reduce((acc, curr) => acc + (curr.price || 0), 0);
    // Active: Confirmed or In Progress
    const activeOrders = bookings.filter(b => b.status === "In Progress" || b.status === "Confirmed").length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
    const totalCustomers = users.filter(user => user.role !== 'admin').length;

    // Revenue Chart Data
    const getRevenueData = () => {
        const months = {};
        bookings.forEach(booking => {
            const month = new Date(booking.pickupDate || booking.createdAt || Date.now()).toLocaleString('default', { month: 'short' });
            months[month] = (months[month] || 0) + (booking.price || 0);
        });
        return Object.keys(months).map(m => ({ name: m, revenue: months[m] }));
    };

    // Sorting Logic
    const sortedBookings = [...bookings].sort((a, b) => {
        if (sortOption === 'date') {
            // Newest at top
            return new Date(b.createdAt || b.pickupDate) - new Date(a.createdAt || a.pickupDate);
        } else if (sortOption === 'status') {
            // Priority: Pending (Top) > Confirmed > In Progress > Completed (Bottom)
            // We can assign weights:
            const weights = {
                'Pending': 4,
                'Confirmed': 3,
                'In Progress': 2,
                'Completed': 1,
                'Cancelled': 0
            };
            const weightA = weights[a.status] || 0;
            const weightB = weights[b.status] || 0;
            return weightB - weightA; // Descending weight
        }
        return 0;
    });

    const revenueData = getRevenueData().length > 0 ? getRevenueData() : [
        { name: 'Jan', revenue: 0 }, { name: 'Feb', revenue: 0 }, { name: 'Mar', revenue: 0 }
    ];

    if (loading) return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">Loading Command Center...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-gray-100 p-6 pt-24 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white mb-2">Command Center</h1>
                        <p className="text-gray-400">Welcome back, Administrator. Monitoring real-time metrics.</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                        {['overview', 'orders', 'customers', 'messages'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-full font-medium transition-all capitalize ${activeTab === tab
                                    ? 'bg-primary text-white shadow-lg shadow-red-900/40'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Revenue" value={`₹${revenue.toLocaleString()}`} icon={<DollarSign />} change="--%" color="text-green-400" />
                    <StatCard title="Active Jobs" value={activeOrders} icon={<Activity />} change="Live" color="text-blue-400" />
                    <StatCard title="Total Customers" value={totalCustomers} icon={<Users />} change="Lifetime" color="text-purple-400" />
                    <StatCard title="Pending Requests" value={pendingBookings} icon={<Calendar />} change="Action Needed" color="text-yellow-400" />
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-2 gap-8"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                    <DollarSign className="text-primary" size={20} /> Revenue Trends
                                </h3>
                                <div className="h-80 relative z-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ff2a2a" stopOpacity={0.5} />
                                                    <stop offset="95%" stopColor="#ff2a2a" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                            <XAxis dataKey="name" stroke="#666" axisLine={false} tickLine={false} />
                                            <YAxis stroke="#666" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                                formatter={(value) => [`₹${value}`, "Revenue"]}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#ff2a2a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                                <div className="space-y-3">
                                    {bookings.slice(0, 5).map((booking, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/20 transition group">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${booking.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                                                    booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-500' :
                                                            'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {booking.status === 'Completed' ? <CheckCircle size={18} /> :
                                                        booking.status === 'Pending' ? <Clock size={18} /> :
                                                            booking.status === 'Cancelled' ? <XCircle size={18} /> :
                                                                <Activity size={18} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white group-hover:text-primary transition-colors">{booking.carModel}</div>
                                                    <div className="text-sm text-gray-500">{booking.serviceType} • {booking.userName}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-white">₹{booking.price?.toLocaleString()}</div>
                                                <span className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {bookings.length === 0 && <p className="text-gray-500 text-center py-6">No activity recorded yet.</p>}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'orders' && (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Booking Management</h3>
                                <div className="flex gap-3">
                                    <div className="bg-black/50 p-1 rounded-lg border border-white/10 flex items-center gap-1">
                                        <button
                                            onClick={() => setSortOption('date')}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${sortOption === 'date' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            Latest
                                        </button>
                                        <button
                                            onClick={() => setSortOption('status')}
                                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${sortOption === 'status' ? 'bg-primary/20 text-primary' : 'text-gray-500 hover:text-gray-300'}`}
                                        >
                                            Incomplete
                                        </button>
                                    </div>

                                    <div className="bg-black/50 p-2 rounded-lg border border-white/10 flex items-center gap-2 text-gray-400">
                                        <Search size={18} />
                                        <input type="text" placeholder="Search orders..." className="bg-transparent border-none outline-none text-sm w-48 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-gray-400 text-sm uppercase">
                                            <th className="p-4 font-semibold">Order ID</th>
                                            <th className="p-4 font-semibold">Customer</th>
                                            <th className="p-4 font-semibold">Phone</th>
                                            <th className="p-4 font-semibold">Service</th>
                                            <th className="p-4 font-semibold">Date</th>
                                            <th className="p-4 font-semibold">Amount</th>
                                            <th className="p-4 font-semibold">Status</th>
                                            <th className="p-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {sortedBookings.map((booking) => (
                                            <tr key={booking._id} className="hover:bg-white/5 transition">
                                                <td className="p-4 font-mono text-xs text-gray-500">{booking._id.slice(-6).toUpperCase()}</td>
                                                <td className="p-4 font-medium">{booking.userName || 'Unknown'}</td>
                                                <td className="p-4 text-gray-400">{booking.phone || 'N/A'}</td>
                                                <td className="p-4 text-gray-400">{booking.carModel} - {booking.serviceType}</td>
                                                <td className="p-4 text-gray-400">{new Date(booking.pickupDate).toLocaleDateString()}</td>
                                                <td className="p-4 font-bold text-white">₹{booking.price?.toLocaleString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${booking.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                        booking.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                            booking.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Actions Logic:
                                                            Pending -> Confirmed -> In Progress -> Completed
                                                        */}

                                                        {(booking.status === 'Pending') && (
                                                            <button
                                                                disabled={statusUpdating === booking._id}
                                                                onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                                                                title="Confirm Order"
                                                                className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition disabled:opacity-50"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                        )}

                                                        {(booking.status === 'Confirmed') && (
                                                            <button
                                                                disabled={statusUpdating === booking._id}
                                                                onClick={() => handleStatusUpdate(booking._id, 'In Progress')}
                                                                title="Start Job"
                                                                className="p-2 hover:bg-purple-500/20 text-purple-400 rounded-lg transition disabled:opacity-50"
                                                            >
                                                                <Wrench size={18} />
                                                            </button>
                                                        )}

                                                        {(booking.status === 'In Progress' || booking.status === 'Confirmed') && (
                                                            <button
                                                                disabled={statusUpdating === booking._id}
                                                                onClick={() => handleStatusUpdate(booking._id, 'Completed')}
                                                                title="Mark Complete"
                                                                className="p-2 hover:bg-green-500/20 text-green-400 rounded-lg transition disabled:opacity-50"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                        )}

                                                        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                                                            <button
                                                                disabled={statusUpdating === booking._id}
                                                                onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                                                                title="Cancel Order"
                                                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition disabled:opacity-50"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'customers' && (
                        <motion.div
                            key="customers"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Admin Section */}
                            <div className="bg-purple-900/10 border border-purple-500/20 rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-purple-500/20">
                                    <h3 className="text-xl font-bold text-purple-400">Administration Team</h3>
                                </div>
                                <div className="p-6">
                                    {users.filter(u => u.role === 'admin').map((admin) => (
                                        <div key={admin._id} className="flex items-center justify-between p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg">
                                                    {admin.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-lg">{admin.name} <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full ml-2">Admin</span></div>
                                                    <div className="text-sm text-gray-400">{admin.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-gray-300 font-mono">900434825</div>
                                                <div className="text-xs text-purple-400">Emergency Contact</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customers Table */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-white/10">
                                    <h3 className="text-xl font-bold">Registered Customers</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-white/5 text-gray-400 text-sm uppercase">
                                                <th className="p-4 font-semibold">Customer</th>
                                                <th className="p-4 font-semibold">Contact</th>
                                                <th className="p-4 font-semibold">Join Date</th>
                                                <th className="p-4 font-semibold">Total Spent</th>
                                                <th className="p-4 font-semibold text-right">Role</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.filter(u => u.role !== 'admin').map((user) => {
                                                const spent = bookings.filter(b => b.userId === user._id).reduce((acc, curr) => acc + (curr.price || 0), 0);
                                                return (
                                                    <tr key={user._id} className="hover:bg-white/5 transition">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-white">{user.name}</div>
                                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-gray-400">{user.phone || 'N/A'}</td>
                                                        <td className="p-4 text-gray-400">{new Date(user.date || Date.now()).toLocaleDateString()}</td>
                                                        <td className="p-4 font-bold text-white">₹{spent.toLocaleString()}</td>
                                                        <td className="p-4 text-right">
                                                            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gray-500/10 text-gray-400 border-gray-500/20">
                                                                Customer
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'messages' && (
                        <motion.div
                            key="messages"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10">
                                <h3 className="text-xl font-bold flex items-center gap-2">Contact Messages</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 text-gray-400 text-sm uppercase">
                                            <th className="p-4 font-semibold">Date</th>
                                            <th className="p-4 font-semibold">Name</th>
                                            <th className="p-4 font-semibold">Email</th>
                                            <th className="p-4 font-semibold">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {contacts.length > 0 ? contacts.map((contact) => (
                                            <tr key={contact._id} className="hover:bg-white/5 transition">
                                                <td className="p-4 text-gray-400 whitespace-nowrap">{new Date(contact.date || contact.createdAt || Date.now()).toLocaleDateString()}</td>
                                                <td className="p-4 font-medium text-white">{contact.firstName} {contact.lastName}</td>
                                                <td className="p-4 text-gray-400">{contact.email}</td>
                                                <td className="p-4 text-gray-300 max-w-md truncate">{contact.message}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-gray-500">No messages found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'feedbacks' && (
                        <motion.div
                            key="feedbacks"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10">
                                <h3 className="text-xl font-bold flex items-center gap-2"><MessageSquare size={20} /> Customer Feedbacks</h3>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {bookings.filter(b => b.feedback && b.feedback.rating).map((booking, i) => (
                                    <div key={i} className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-white/20 transition group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                                    {booking.userName ? booking.userName.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white text-sm">{booking.userName || 'Customer'}</div>
                                                    <div className="text-xs text-gray-500">{new Date(booking.pickupDate).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                                                {[...Array(5)].map((_, index) => (
                                                    <Star
                                                        key={index}
                                                        size={12}
                                                        className={index < booking.feedback.rating ? getStarColor(booking.feedback.rating) : "text-gray-700"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <p className="text-gray-300 italic text-sm">"{booking.feedback.comment}"</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-white/5">
                                            <div className="flex items-center gap-1"><Wrench size={10} /> {booking.serviceType}</div>
                                            <span>•</span>
                                            <div>{booking.carModel}</div>
                                        </div>
                                    </div>
                                ))}
                                {bookings.filter(b => b.feedback && b.feedback.rating).length === 0 && (
                                    <div className="col-span-full py-12 text-center text-gray-500">
                                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>No feedbacks received yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, change, color }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition group hover:border-white/20">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-white/5 ${color} group-hover:scale-110 transition duration-300 shadow-lg`}>
                {icon}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-white/5 text-gray-400`}>
                {change}
            </span>
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-display font-bold text-white tracking-wide">{value}</p>
    </div>
);

export default AdminDashboard;
