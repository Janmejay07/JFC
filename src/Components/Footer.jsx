import React from 'react';
import { Dribbble, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-blue-900 border-t border-blue-800/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Brand and Social */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-3">
              <Dribbble className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-white">JaunpurFC</span>
            </div>
            <div className="flex space-x-4">
              <SocialLink icon={<Facebook className="h-4 w-4" />} />
              <SocialLink icon={<Twitter className="h-4 w-4" />} />
              <SocialLink icon={<Instagram className="h-4 w-4" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex space-x-8">
            <FooterLink text="About" href="/" />
            <FooterLink text="Teams" href="/squad" />
            <FooterLink text="Contact" href="/contactus" />
            <FooterLink text="Privacy" href="/" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-blue-800/30 text-center">
          <p className="text-blue-100/60 text-sm">
            © 2024 JaunpurFC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ text, href }) => (
  <a
    href={href}
    className="text-blue-100/80 hover:text-white transition-colors duration-300"
  >
    {text}
  </a>
);

const SocialLink = ({ icon }) => (
  <a
    href="https://www.instagram.com/offside_jfc?igsh=MWhpcXlmY2RtMm4ydw=="
    className="p-2 rounded-full bg-blue-800/30 hover:bg-gradient-to-br hover:from-blue-400 hover:to-emerald-400 
               text-blue-100 hover:text-white transition-all duration-300 transform hover:scale-110"
  >
    {icon}
  </a>
);

export default Footer;
