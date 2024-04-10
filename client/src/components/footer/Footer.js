import React from 'react';
import logo from './code_from_finland.png';
import './footer.css'; 

function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Kontti Hub App. All rights reserved. Powered by Koodi CRC Oy</p>
      <p>More information: <a href="/contact">Contact</a></p>
      <img src={logo} alt="Logo" />
    </footer>
  );
}

export default Footer;
