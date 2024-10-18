import React from 'react';
import './Header.css'; 
import logo from '../photos/logo.png'
import { useNavigate } from 'react-router-dom';

const Header = ({user}) => {
  const navigate = useNavigate()
  console.log(user)
  
  const addsong = () => {
    navigate('/addsong',{state:{user:user}})
  }
  const dashboard = () => {
    navigate("/",{state:{user:user}})
  }

 
  const favourates = () => {
    navigate('/favourates', { state: { user: user } });
  }

  const bulk = () => {
    navigate('/bulk', { state: { user: user } });
  }
  
  const logout = () => {
    navigate("/login", { replace: true });
      window.history.replaceState(null, '', '/login');
  }

  return (
    <header style={{ "backgroundColor": "lightblue" }} className='main'>
      <nav>
        <div className="logo" onClick={dashboard}>
          <img src={logo} className='img' />
        
        </div>
      
        <div className="auth-buttons">
        <button className="download-button" onClick={addsong}>Add Song</button>
        <button className="download-button" onClick={bulk}>Add Bulk Songs</button>
        <button className="download-button" onClick={favourates}>Favourites</button>
          
          <button className="download-button" onClick={logout} >Logout</button>
        </div>
      </nav>
    </header>
  )
};

export default Header;
