import React from 'react';
import './Footer.css'

const Footer = () => (
  <footer style={{"backgroundColor":"lightblue"}}>
    <div className="footer-content">
      <p>&copy; 2024 Musics. All rights reserved.</p>
      <div className="social-media">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
