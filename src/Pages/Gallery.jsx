import React, { useState, useEffect } from 'react';
import { Info, Play, X } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { API_ENDPOINTS } from "../lib/config";  

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [videoItems, setVideoItems] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // Fetch photo gallery data
    fetch(API_ENDPOINTS.PHOTO)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        return response.json();
      })
      .then((data) => setGalleryItems(data))
      .catch((error) => console.error('Error fetching photos:', error));

    // Fetch video gallery data
    fetch(API_ENDPOINTS.VIDEO)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }
        return response.json();
      })
      .then((data) => setVideoItems(data))
      .catch((error) => console.error('Error fetching videos:', error));
  }, []);

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gray-100">
      {/* Image Header */}
      <header className="relative h-[60vh] overflow-hidden">
        <img 
          className="absolute w-full h-full object-cover"
          src={API_ENDPOINTS.Header}
          alt="Gallery Header"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Our Gallery</h1>
            <p className="text-xl">Discover the beauty of football through our lens</p>
          </div>
        </div>
      </header>

      {/* Image Gallery Grid */}
      <main className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Photo Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <div key={index} className="group relative rounded-lg overflow-hidden shadow-lg h-80">
              <img
              src={API_ENDPOINTS.getPhoto(item.image)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                  <Info className="mx-auto mb-3 h-8 w-8" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Gallery Section */}
        <h2 className="text-3xl font-bold mb-8 mt-16 text-center">Video Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoItems.map((item, index) => (
            <div 
              key={index} 
              className="group relative rounded-lg overflow-hidden shadow-lg h-80 cursor-pointer"
              onClick={() => setSelectedVideo(item)}
            >
              <img
                src={API_ENDPOINTS.getPhoto(item.thumbnail)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                  <Play className="mx-auto mb-3 h-12 w-12 fill-white" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                  <p className="mt-4 text-sm font-semibold">Click to play video</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="relative pt-[56.25%]">
              <video
                className="absolute inset-0 w-full h-full rounded-lg"
                controls
                autoPlay
                src={API_ENDPOINTS.getVideo(selectedVideo.videoUrl)}
              />
            </div>
            <div className="mt-4 text-white">
              <h3 className="text-2xl font-bold">{selectedVideo.title}</h3>
              <p className="mt-2">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </div>
  );
}

export default Gallery;
