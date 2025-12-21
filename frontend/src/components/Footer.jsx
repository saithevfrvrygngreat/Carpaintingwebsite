import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8 relative z-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Company</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            India's premier automotive customization studio. We bring your dream car to life with premium paints, ceramic coatings, and custom modifications.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Facebook size={18} />} href="#" />
                            <SocialIcon icon={<Twitter size={18} />} href="#" />
                            <SocialIcon icon={<Instagram size={18} />} href="#" />
                            <SocialIcon icon={<Linkedin size={18} />} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <FooterLink to="/">Home</FooterLink>
                            <FooterLink to="/services">Our Services</FooterLink>
                            <FooterLink to="/booking">Book Appointment</FooterLink>
                            <FooterLink to="/my-bookings">My Bookings</FooterLink>
                            <FooterLink to="/contact">Contact Us</FooterLink>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <ContactItem icon={<MapPin size={18} />} text="CX33+HMP, 6th St, Thayagaraju Nagar, Jyothi Nagar, Nellore, AP 524004" />
                            <ContactItem icon={<Phone size={18} />} text="+91 90004 34825" />
                            <ContactItem icon={<Mail size={18} />} text="kameswarraodasetti@gmail.com" />
                            <ContactItem icon={<Clock size={18} />} text="Mon - Sat: 09:00 AM - 06:00 PM" />
                        </ul>
                    </div>

                    {/* Policy */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Policy</h3>
                        <ul className="space-y-3">
                            <FooterLink to="#">Privacy Policy</FooterLink>
                            <FooterLink to="#">Terms and Conditions</FooterLink>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex justify-center items-center">
                    <p className="text-gray-500 text-xs tracking-wider uppercase text-center">
                        &copy; 2025 AutoGlow Customs™ • All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon, href }) => (
    <a href={href} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 border border-white/10 hover:border-primary">
        {icon}
    </a>
);

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block text-sm">
            {children}
        </Link>
    </li>
);

const ContactItem = ({ icon, text }) => (
    <li className="flex items-start gap-3 text-gray-400 text-sm">
        <span className="text-primary mt-1">{icon}</span>
        <span>{text}</span>
    </li>
);

export default Footer;
