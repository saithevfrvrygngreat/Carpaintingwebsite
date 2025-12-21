import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const Gallery = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/gallery`);
            setImages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-secondary">Our Work Gallery</h1>
            <div className="grid md:grid-cols-3 gap-6">
                {images.map((img) => (
                    <div key={img._id} className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                        <img
                            src={`${API_URL}${img.imageUrl}`}
                            alt={img.title}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4 bg-white">
                            <p className="font-semibold text-center">{img.title}</p>
                        </div>
                    </div>
                ))}
            </div>
            {images.length === 0 && <p className="text-center text-gray-500">No images uploaded yet.</p>}
        </div>
    );
};

export default Gallery;
