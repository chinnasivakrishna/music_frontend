import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import Header from '../Header/Header';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { user, id } = state || {}; 

  const [songs, setSongs] = useState([]); 
  const [groupedSongs, setGroupedSongs] = useState({}); 
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    // Redirect to login if user is not defined
    if (!user) {
      navigate('/login'); // Adjust this path according to your route setup
      return;
    }

    const fetchSongs = async () => {
      try {
        const response = await axios.post(`https://music-backend-j4oc.onrender.com/api/posts/fetch`, {
          Email: user
        });
        const fetchedSongs = response.data;

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

    fetchSongs();
  }, [user, navigate]);
  
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
    try {
      const response = await axios.post("https://music-backend-j4oc.onrender.com/api/posts/favourate", {
        id: song._id
      });
      console.log(response);
      alert(`${song.Title} added to your favorites!`);
    } catch {
      alert("Failed to add to favorites.");
    }
  };

  return (
    <div className="songs-container">
      <Header user={user} />
      <h1>Songs Dashboard</h1>
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
                    Add to Favorites
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

export default Dashboard;
