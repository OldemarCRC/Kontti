import React from 'react';
import './footer.css'; 

function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} KONTTI. All rights reserved.</p>
      <p>More information: <a href="/contact">Contact</a></p>
    </footer>
  );
}

export default Footer;
