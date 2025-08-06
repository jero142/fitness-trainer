import Layout from './components/Layout';
import Home from './pages/Home';
import {HashRouter,Routes, Route } from 'react-router-dom';
import CartTab from './pages/CartTab';
import Workout from './pages/Workout';


function App() {
  
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/:slug'element={<CartTab />} />
          <Route path='/workout'element={<Workout />} />
        </Route>
      </Routes>
    </HashRouter>
    
  );
};

export default App
