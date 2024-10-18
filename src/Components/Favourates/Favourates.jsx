import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const Favourates = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { user } = state || {}; 
  
    const [songs, setSongs] = useState([]);
    const [groupedSongs, setGroupedSongs] = useState({}); 
    const [searchQuery, setSearchQuery] = useState(''); 
    
  
    useEffect(() => {
      if (!user) {
        navigate('/login');
        return null;
      }
      const fetchSongs = async () => {
        try {
          const response = await axios.post(`https://music-backend-j4oc.onrender.com/api/posts/favourate_fetch`,{
            Email :user
            });
          const fetchedSongs = response.data;
          console.log(fetchedSongs)
  
          // Sort songs alphabetically by 'Title'
          fetchedSongs.sort((a, b) => {
            const titleA = a.Title || ''; // Default to empty string if Title is undefined
            const titleB = b.Title || ''; // Default to empty string if Title is undefined
            return titleA.localeCompare(titleB);
          });
  
          // Group songs by unique 'type'
          const grouped = fetchedSongs.reduce((acc, song) => {
            const { type } = song;
            if (!acc[type]) {
              acc[type] = [];
            }
            acc[type].push(song);
            return acc;
          }, {});
  
          setSongs(fetchedSongs); // Store all songs
          setGroupedSongs(grouped); // Store songs grouped by type
        } catch (error) {
          console.error('Error fetching songs:', error);
        }
      };
  
      if (user) {
        fetchSongs();
      }
    }, [user]);
    
  
    // Filter songs based on the search query
    const filteredSongs = Object.keys(groupedSongs).reduce((acc, type) => {
      const filtered = groupedSongs[type].filter((song) =>
        song.Title && song.Title.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by title
      );
      if (filtered.length > 0) {
        acc[type] = filtered;
      }
      return acc;
    }, {});
  
    // Handle add to favorites
    const handleAddToFavorites = async(song) => {
      // Here you can implement logic to add the song to a favorites list, or make a POST request
      console.log(`Added ${song._id} to favorites!`);
      try{
        const response = await axios.post("https://music-backend-j4oc.onrender.com/api/posts/remove_favourate",{
          id: song._id
        });
        console.log(response)
  
        alert(`${song.Title} removed from your favorites!`);
  
      }
      catch{
  
      }
      
    };
  
    return (
      <div className="songs-container">
        <Header user={user} />

        <h1>Favourites Songs</h1>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by song title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
  
        {Object.keys(filteredSongs).length > 0 ? (
          Object.keys(filteredSongs).map((type) => (
            <div key={type} className="song-group">
              <h2>{type}</h2>
              <ul className="song-list">
                {filteredSongs[type].map((song) => (
                  <li key={song._id} className="song-item">
                    <h3>{song.Title || 'Untitled'}</h3> {/* Default to 'Untitled' if Title is missing */}
                    <audio controls>
                      <source src={song.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <button
                      className="add-to-favorites"
                      onClick={() => handleAddToFavorites(song)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No songs found.</p>
        )}
      </div>
    );
  }
  

export default Favourates