import React, { useState } from 'react';
import axios from 'axios';
import './AddSong.css';
import Header from '../Header/Header';
import { useLocation, useNavigate } from 'react-router-dom';

function AddSong() {
  const [title, setTitle] = useState('');
  const [audio, setAudio] = useState(null);
  const [audioPreview, setAudioPreview] = useState('');
  const [type, setType] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const {state} = location;
  const{user} = state || "";
  if (!user) {
    navigate('/login');
    return null;
  }

  

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    setAudio(file);
    setAudioPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'post_blog'); // Ensure this is set for audio

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dsbuzlxpw/video/upload', // Use video/upload for audio files
        formData
      );
      setAudioUrl(response.data.secure_url); 
    } catch (error) {
      console.error('Error uploading audio:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const songData = {
      Email:user,
      Title:title,
      audio: audioUrl,
      type,
    };
    try{
      const response = await axios.post("https://music-backend-j4oc.onrender.com/api/posts/add",{
        songData
      });
      if(response){
        alert("Song Added Successfully")
      }

    }catch{
      alert("Song added failed")

    }
    

    // Handle your submission logic here (e.g., POST to your API)
    console.log('Song data:', songData);
  };

  return (
    <div className='add'>
      <Header user={user} />
    <div className="add-song-container">
      

      <h1 className="title">Add a New Song</h1>
      <form onSubmit={handleSubmit} className="add-song-form">
        <div className="form-group">
          <label className="form-label">Song Title</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Upload Audio</label>
          <input
            type="file"
            accept="audio/*"
            className="form-input"
            onChange={handleAudioUpload}
            required
          />
          {audioPreview && (
            <audio controls className="audio-preview">
              <source src={audioPreview} type="audio/*" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Type of Song</label>
          <select
            className="form-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="" disabled>Select a type</option>
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Hip Hop">Hip Hop</option>
            <option value="Jazz">Jazz</option>
            <option value="Classical">Classical</option>
            <option value="Electronic">Electronic</option>
            <option value="Country">Country</option>
            <option value="Reggae">Reggae</option>
            <option value="R&B">R&B</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Add Song</button>
      </form>
    </div>
    </div>
  );
}

export default AddSong;
