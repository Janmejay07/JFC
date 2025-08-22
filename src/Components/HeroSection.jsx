import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../lib/config";  

const HeroSection = () => {
  const [heroSection, setHeroSection] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.HERO) 
      .then((res) => res.json())
      .then((data) => {
        setHeroSection(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching hero section:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-white py-10">Loading Hero Section...</div>;

  return (
    <div className="relative h-screen">
      
        {heroSection && heroSection.imageUrl ? (
          <>
            <img
              className="absolute w-full h-full object-cover"
              src={API_ENDPOINTS.getImage(heroSection.imageUrl)}
              alt="Hero Section"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl font-bold mb-4">{heroSection.title}</h1>
                <p className="text-xl">{heroSection.subtitle}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-white py-10">Loading Hero Section...</div>
        )}
      
    </div>
  );
};

export default HeroSection;
