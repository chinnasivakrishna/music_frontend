import React from 'react';
import './Header.css'; 
import logo from '../photos/logo.png'
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const register = () => {
    navigate("/register")
  }
  const login = () => {
    navigate("/login")
  }

  
  
  return (
    <header style={{ "backgroundColor": "lightblue" }}>
      <nav>
        <div className="logo">
          <img src={logo} className='img' />
        
        </div>
      
        <div className="auth-buttons">
          <button className="login" onClick={login}>Login</button>
          <button className="signup" onClick={register}>Sign Up</button>
        </div>
      </nav>
    </header>
  )
};

export default Header;
