import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="headerStyle">
      <div className="header-left">
        <Link to="/" className={(nav) => (nav.isActive ? "nav-active" : "")}>
          Home
        </Link>
      </div>

      <div className="header-center">
        <h1 className="app-title">Fitness Trainer</h1>
      </div>

      <div className="header-right">
      </div>
    </header>
  );
};

export default Header;