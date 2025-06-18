  // config.js
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  export const API_ENDPOINTS = {
      PLAYERS: `${BASE_URL}/api/player`,
      MATCHES: `${BASE_URL}/api/matches`,
      UPCOMING_MATCHES: `${BASE_URL}/api/Upcomingmatches`,
      ABOUT_SECTION: `${BASE_URL}/api/aboutsection`,
      PLAYER_PROFILES: `${BASE_URL}/api/playerProfiles/Players`,
      STANDINGS: `${BASE_URL}/api/standings`,
      PHOTO: `${BASE_URL}/api/Photos`,
      VIDEO: `${BASE_URL}/api/videos`,
      SEND: `${BASE_URL}/send-email`,
      HERO: `${BASE_URL}/api/heroSection`,
      PROFILE: `${BASE_URL}/api/auth/profile`,
      LOGIN: `${BASE_URL}/api/auth/login`,
      REGISTER: `${BASE_URL}/api/auth/register`,
      LOGO_URL: `${BASE_URL}/assets/logo.jpg`,
      
      // Image URL methods
      getImageUrl: (imagePath) => `${BASE_URL}${imagePath}`,
      getPlayerImage: (playerImage) => `${BASE_URL}${playerImage}`,
      getAboutImage: (aboutImage) => `${BASE_URL}${aboutImage}`,
      getPlayerImage: (imagePath) => `${BASE_URL}${imagePath}`,
      getPhoto: (imagePath) => `${BASE_URL}${imagePath}`,
      getVideo: (imagePath) => `${BASE_URL}${imagePath}`,
      getImage: (imagePath) => `${BASE_URL}${imagePath}`,
  };
