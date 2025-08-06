import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';


const Layout = () => {
  return (
    <div className="layoutStyle">
    <main>
      <Header />
      <Outlet />
    </main>
    
  </div>
    );
  };
  

export default Layout;