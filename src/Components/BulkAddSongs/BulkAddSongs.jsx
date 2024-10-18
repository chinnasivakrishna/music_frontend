import React, { useState } from 'react';
import axios from 'axios';
import '../AddSong/AddSong.css';
import Header from '../Header/Header';
import { useLocation, useNavigate } from 'react-router-dom';

function BulkAddSongs() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [audioPreviews, setAudioPreviews] = useState([]);
  const [type, setType] = useState('other');  
  const [songsData, setSongsData] = useState([]); 
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { user } = state || "";

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files);
    setAudioFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setAudioPreviews(previews);

    const newSongsData = files.map((file) => ({
      title: file.name,
      audio: '',
      type: type === 'Other' ? file.name : type,
    }));

    setSongsData(newSongsData);
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);

    const updatedSongsData = songsData.map((song) => ({
      ...song,
      type: selectedType === 'Other' ? song.title : selectedType,
    }));
    setSongsData(updatedSongsData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Loop through songsData and upload each audio file
    for (let index = 0; index < audioFiles.length; index++) {
      const file = audioFiles[index];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'post_blog');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dsbuzlxpw/video/upload',
          formData
        );
        const audioUrl = response.data.secure_url;

        // Prepare song data for API submission
        const songData = {
          Email: user,
          Title: songsData[index].title,
          audio: audioUrl,
          type: songsData[index].type,
        };

        // Submit each song data to your API
        const apiResponse = await axios.post("https://music-backend-j4oc.onrender.com/api/posts/add", {
          songData,
        });

        if (apiResponse) {
          alert(`${songsData[index].title} added successfully!`);
        }
      } catch (error) {
        console.error('Error uploading audio or adding song:', error.message);
        alert(`Failed to add ${songsData[index].title}.`);
      }
    }
  };

  return (
    <div className='add'>
      <Header user={user} />
      <div className="add-song-container">
        <h1 className="title">Add Songs in Bulk</h1>
        <form onSubmit={handleSubmit} className="bulk-add-songs-form">
          <div className="form-group">
            <label className="form-label">Upload Audio Files</label>
            <input
              type="file"
              accept="audio/*"
              multiple
              className="form-input"
              onChange={handleAudioUpload}
              required
            />
            {audioPreviews.length > 0 && (
              <div className="audio-previews">
                {audioPreviews.map((preview, index) => (
                  <audio key={index} controls className="audio-preview">
                    <source src={preview} type="audio/*" />
                    Your browser does not support the audio element.
                  </audio>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Type of Song</label>
            <select
              className="form-input"
              value={type}
              onChange={handleTypeChange}
            >
              <option value="">Select a type</option>
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

          <button type="submit" className="submit-button">Add Songs</button>
        </form>
      </div>
    </div>
  );
}

export default BulkAddSongs;
