import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import RegisterForm from './Components/Register/Register';
import LoginForm from './Components/Login/EmployeeLogin';
import Dashboard from './Components/Dashboard/Dashboard';
import AddSong from './Components/AddSong/AddSong';
import BulkAddSongs from './Components/BulkAddSongs/BulkAddSongs';
import Favourates from './Components/Favourates/Favourates';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/bulk" element={<BulkAddSongs />} />
        <Route path="/addsong" element={<AddSong />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/favourates" element={<Favourates />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
