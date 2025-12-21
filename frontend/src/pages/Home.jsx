import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, Palette } from 'lucide-react';

const Home = () => {
    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-4 rounded-full border border-primary/50 bg-primary/10 text-primary font-bold text-sm mb-6 tracking-widest uppercase">
                            Premium Automotive Studio
                        </span>
                        <h1 className="text-5xl md:text-8xl font-bold mb-6 font-display leading-tight text-white">
                            Forge Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-600 text-glow">Masterpiece</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
                            Beyond painting. We engineer visual perfection for the discerning enthusiast.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="flex flex-col md:flex-row justify-center items-center gap-6"
                    >
                        <Link to="/services" className="px-10 py-4 bg-primary text-white font-bold rounded-full text-lg hover:bg-red-700 transition shadow-[0_0_20px_rgba(255,42,42,0.4)] hover:shadow-[0_0_40px_rgba(255,42,42,0.6)] flex items-center group">
                            Explore Services <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/booking" className="px-10 py-4 border border-white/20 hover:border-white text-white font-bold rounded-full text-lg hover:bg-white/10 transition backdrop-blur-sm">
                            Book Appointment
                        </Link>
                    </motion.div>
                </div>

                {/* Abstract overlay elements */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-black relative">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Palette className="w-10 h-10 text-primary" />}
                            title="Precision Painting"
                            desc="Robotic color matching and dust-free booths ensuring factory-grade finishes."
                        />
                        <FeatureCard
                            icon={<Shield className="w-10 h-10 text-accent" />}
                            title="Ceramic Protection"
                            desc="Nano-coating layers that provide diamond-hard protection against elements."
                        />
                        <FeatureCard
                            icon={<Zap className="w-10 h-10 text-yellow-400" />}
                            title="Rapid Restoration"
                            desc="Express dent removal and visual restoration without compromising quality."
                        />
                    </div>
                </div>
            </section>

            {/* Showroom Section */}
            <section className="py-24 relative overflow-hidden bg-black">
                {/* Background Base */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0"></div>

                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-20 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"></div>

                {/* Ambient Glow Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 z-0 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 z-0"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase">Our Works</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">The Collection</h2>
                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { color: 'Stealth Black', model: 'Mahindra Thar', img: 'https://e0.pxfuel.com/wallpapers/415/581/desktop-wallpaper-mahindra-thar-thar-car.jpg' }, // Black Jeep Wrangler (Thar lookalike)
                            { color: 'Dark Edition', model: 'Tata Harrier', img: 'https://cdn.wallpapersafari.com/12/62/Qt1LTC.jpg' }, // Dark SUV
                            { color: 'Knight Edition', model: 'Hyundai Creta', img: 'https://www.hyundai.com/content/dam/hyundai/ww/en/images/find-a-car/pip/suv/creta-su2/creta-su2-highlights-kv-m.jpg' }, // Black Crossover
                            { color: 'Mod Blue', model: 'Hyundai Verna', img: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Verna/8703/1749449604595/exterior-image-165.jpg?impolicy=resize&imwidth=420' } // Blue Sedan
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -10 }}
                                className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer border border-white/5"
                            >
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${item.img})` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition">{item.color}</h3>
                                    <p className="text-gray-400 font-medium text-sm uppercase tracking-wider mb-3">{item.model}</p>
                                    <div className="h-1 w-12 bg-primary rounded-full group-hover:w-20 transition-all"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-16">Client Stories</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Story 1 */}
                        <div className="glass-effect p-8 rounded-2xl relative">
                            <div className="flex justify-center mb-6 text-yellow-500">
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                            </div>
                            <p className="text-gray-300 italic mb-6">"ABSOLUTELY TRANSFORMED MY CAR. The attention to detail is unmatched in the city. Highly recommended!"</p>
                            <div className="flex items-center justify-center space-x-4">
                                <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-white font-bold text-sm">John Doe</h4>
                                    <span className="text-gray-500 text-xs">BMW M5 Owner</span>
                                </div>
                            </div>
                        </div>

                        {/* Story 2 */}
                        <div className="glass-effect p-8 rounded-2xl relative">
                            <div className="flex justify-center mb-6 text-yellow-500">
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                            </div>
                            <p className="text-gray-300 italic mb-6">"Best service I've ever experienced. My car looks brand new again!"</p>
                            <div className="flex items-center justify-center space-x-4">
                                <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-white font-bold text-sm">Sarah Smith</h4>
                                    <span className="text-gray-500 text-xs">Audi R8 Owner</span>
                                </div>
                            </div>
                        </div>

                        {/* Story 3 */}
                        <div className="glass-effect p-8 rounded-2xl relative">
                            <div className="flex justify-center mb-6 text-yellow-500">
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                                <Star fill="currentColor" size={20} />
                            </div>
                            <p className="text-gray-300 italic mb-6">"Professional, fast, and the quality is outstanding. Will definitely return."</p>
                            <div className="flex items-center justify-center space-x-4">
                                <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                                    <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="User" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-white font-bold text-sm">Mike Johnson</h4>
                                    <span className="text-gray-500 text-xs">Tesla Model S Owner</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className="glass-effect p-10 rounded-2xl border border-white/5 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            {icon}
        </div>
        <div className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
);

export default Home;
