import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import Add1 from '../main_adds/add1';

import './cards.css';

function Cards() {
  const navigate = useNavigate();
  const [mainData, setMainData] = useState([]); // Initialize with empty array

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await fetch('http://localhost:5000/main_data', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Response from server:', jsonResponse);
        setMainData(jsonResponse); // Directly set the aggregated data
      } else {
        console.error('Server error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  function route(category, brand) {
    navigate('/sub_main', { state: { category: category, brand: brand } });
  }

  return (
    <div>
      {mainData.length > 0 && (
        <>
          {mainData.map((genreData, index) => (
            <>
            <h2>{genreData.genre}</h2>
            <br/>
            <div key={index} id="container">
              <Swiper
                modules={[Navigation, Pagination]}
                loop={true}
                spaceBetween={50}
                slidesPerView={4}
                slidesPerGroup={4}
                navigation
                pagination={{ clickable: true }}
              >
                {genreData.movies.map((card) => (
                  <SwiperSlide key={card._id}> {/* Use _id as key */}
                    <div id="card">
                      <div id="img_cont">
                        <img
                          src={`${process.env.PUBLIC_URL}/movies/${genreData.genre}/${card.img}`} // Adjusted path for images
                          className='img'
                          alt={card.name}
                          onClick={() => route(genreData.genre, card._id)} // Adjust click action
                        />
                      </div>
                      <div id="card_det">
                        <p>{card.name}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            </>
          ))}
        </>
      )}
      <Add1 />
    </div>
  );
}

export default Cards;
