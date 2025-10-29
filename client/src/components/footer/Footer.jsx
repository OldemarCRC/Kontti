import React from 'react';
import './footer.css'; 

function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Kontti Hub App. All rights reserved.</p>
      <p>Powered by Koodi CRC.</p>
    </footer>
  );
}

export default Footer;