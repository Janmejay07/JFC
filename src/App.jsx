import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import Squad from './Pages/Squad';
import Stats from './Pages/Stats';
import Gallery from './Pages/Gallery';
import ContactUs from './Pages/ContactUs';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { ProfilePage } from './Components/profile';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Squad" element={<CustomBackNavigation target="/" Component={Squad} />} />
        <Route path="/Stats" element={<CustomBackNavigation target="/" Component={Stats} />} />
        <Route path="/Gallery" element={<CustomBackNavigation target="/" Component={Gallery} />} />
        <Route path="/ContactUs" element={<CustomBackNavigation target="/" Component={ContactUs} />} />
        <Route path="/login" element={<CustomBackNavigation target="/" Component={Login} />} />
        <Route path="/signup" element={<CustomBackNavigation target="/" Component={Signup} />} />
        <Route path="/profile" element={<CustomBackNavigation target="/" Component={ProfilePage} />} />
      </Routes>
    </Router>
  );
}

function CustomBackNavigation({ Component, target }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleBackButton = () => {
      navigate(target); 
    };

    window.history.pushState(null, null, window.location.href); 
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton); 
    };
  }, [navigate, target]);

  return <Component />;
}

export default App;
