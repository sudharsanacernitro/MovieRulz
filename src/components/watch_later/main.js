import React, { useEffect, useState } from 'react';
import './watch_later.css';
import { useNavigate } from 'react-router-dom';
import Header from '../base_components/header';


function WatchLater() {

    const navigate = useNavigate();

  const [watchLaterList, setWatchLaterList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWatchLater();
  }, []);


  function route(category, brand) {
    navigate('/sub_main', { state: { category: category, brand: brand } });
  }

  async function fetchWatchLater() {
    try {
      const response = await fetch('http://localhost:5000/watch_later', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // include cookies for session handling
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.message && jsonResponse.documents) {
          setWatchLaterList(jsonResponse.documents);
        } else {
          setError(true);
        }
      } else {
        console.error('Server error:', response.statusText);
        setError(true);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>There was an error fetching your watch later list.</div>;
  }

  return (
    <>
    <Header />
    <h2>Your Watch Later List</h2>
   
      {watchLaterList.length === 0 ? (
        <p>You have no items in your watch later list.</p>
      ) : (
        <div className="watch-later-container">
          {watchLaterList.map((movie) => (
            <div id="card">
            <div id="img_cont">
              <img
                src={`movies/${movie.Genere}/${movie.img}`} // Adjusted path for images
                className='img'
                alt={movie.name}
                onClick={() => route(movie.Genere, movie._id)} // Adjust click action

              />
            </div>
            <div id="card_det">
              <p>{movie.name}</p>
            </div>
          </div>
          ))}
        </div>
      )}
    </>
  );
}

export default WatchLater;
