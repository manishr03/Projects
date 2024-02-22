import React, { useState } from 'react';
import './App.css';

function App() {
  // dynamically update movies and user's rating
  const [movies, setMovies] = useState([
    { title: '', rating: 0 },
    { title: '', rating: 0 },
    { title: '', rating: 0 }
  ]);
  // store recommendations from backend
  const [recommendations, setRecommendations] = useState('');
  // track whether user has clicked button to generate recommendations
  const [hasClickedRecommend, setHasClickedRecommend] = useState(false);

  // send POST request to fetch movie recommendations
  const handleSubmit = async () => {
    // tries to run code without errors
    try {
      const response = await fetch('http://localhost:3001/get-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // You can send movie data to your backend if needed
        // body: JSON.stringify({ movies: movies })
        body: JSON.stringify({ movies: movies })
      });
      // changing the earlier variables and sending data to user if request works 
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
        setHasClickedRecommend(true);
      // throw an error if the reponse fails
      } else {
        console.error('Failed to retrieve recommendations');
      }
    // log the error 
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // JSX for UI 
  return (
    // Container
    <div className="App">
      <header className="App-header">
        <p>Hello User!</p>
        /* prevent reloads when user submits data */
        <form onSubmit={e => e.preventDefault()}>
          {movies.map((movie, index) => (
            <div key={index}>
               /* generate an input field for movie title */
              <input 
                placeholder="Movie title" 
                value={movie.title}
                onChange={e => handleInputChange(index, 'title', e.target.value)}
              />
              <div>
                /* set option for number of stars for user to choose */
                {[1, 2, 3, 4, 5].map(starNumber => (
                  <span
                    key={starNumber}
                    onClick={() => handleStarClick(index, starNumber)}
                    style={{ cursor: 'pointer' }}
                  >
                    {starNumber <= movie.rating ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
          ))}
          /* button to get recommendations */
          <button onClick={handleSubmit}>Get Recommendations</button>
        </form>
        /* Returning recommendations when button is clicked */
        {hasClickedRecommend && (
          <div>
            <h2>Based on your preferences, here are some more movie recommendations:</h2>
            <p>{recommendations}</p>
          </div>
        )}
      </header>
    </div>
  );
  // updates the title of movies in the earlier array 
  function handleInputChange(index, field, value) {
    const newMovies = [...movies];
    newMovies[index][field] = value;
    setMovies(newMovies);
  }
  // updates the rating of a movie when stars are selected 
  function handleStarClick(index, starNumber) {
    handleInputChange(index, 'rating', starNumber);
  }
}

export default App;
