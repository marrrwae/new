const apiKey = 'b6120b2a408b9bbf2e1db90636efc64e';
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNjEyMGIyYTQwOGI5YmJmMmUxZGI5MDYzNmVmYzY0ZSIsIm5iZiI6MTc1MzU0NjIwNC4xNTkwMDAyLCJzdWIiOiI2ODg0ZmRkYzdlMDE4OGQ1Y2I3MmU1ZTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.CxB1tsgytzYpdNS-xvK_tzOTtMXle9-3MAxWBXpTb-s';

// Get popular movies
async function fetchPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

  const response = await fetch(url);
  const data = await response.json();
  displayMovies(data.results);
}

// Display movies on the page
function displayMovies(movies) {
  const container = document.getElementById('movie-container');
  container.innerHTML = '';

  movies.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('movie');

    div.innerHTML = `
      <h3>${movie.title}</h3>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      <p>${movie.overview}</p>
      <button onclick="playTrailer(${movie.id})">Watch Trailer</button>
    `;

    container.appendChild(div);
  });
}

// Fetch and embed trailer
async function playTrailer(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
  const response = await fetch(url);
  const data = await response.json();

  const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

  if (trailer) {
    const trailerContainer = document.getElementById('trailer-container');
    trailerContainer.innerHTML = `
      <iframe width="560" height="315"
        src="https://www.youtube.com/embed/${trailer.key}"
        title="Movie Trailer" frameborder="0"
        allowfullscreen>
      </iframe>
    `;
    trailerContainer.scrollIntoView({ behavior: 'smooth' });
  } else {
    alert('Trailer not available.');
  }
}

// Call the function to load movies on page load
document.addEventListener('DOMContentLoaded', fetchPopularMovies);

const trailerModal = document.getElementById('trailer-modal');
const trailerVideo = document.getElementById('trailer-video');
const closeModalBtn = document.getElementById('close-modal');

// YouTube trailer URLs for each movie by movie card ID
const trailers = {
  'movie-card-1': 'https://www.youtube.com/embed/EXeTwQWrcwY', // The Dark Knight
  'movie-card-2': 'https://www.youtube.com/embed/YoHD9XEInc0', // Inception
  'movie-card-3': 'https://www.youtube.com/embed/zSWdZVtXT7E', // Interstellar
  'movie-card-4': 'https://www.youtube.com/embed/s7EdQ4FqbhY', // Pulp Fiction
  'movie-card-5': 'https://www.youtube.com/embed/vKQi3bBA1y8', // The Matrix
  'movie-card-6': 'https://www.youtube.com/embed/2ilzidi_J8Q'  // Goodfellas
};

// Open modal when clicking a play button
document.querySelectorAll('.play-btn').forEach(button => {
  button.addEventListener('click', () => {
    const movieCardId = button.closest('.movie-card').id;
    const trailerUrl = trailers[movieCardId];
    if (trailerUrl) {
      trailerVideo.src = trailerUrl + '?autoplay=1';
      trailerModal.style.display = 'flex';
    }
  });
});

// Close modal and stop video
closeModalBtn.addEventListener('click', () => {
  trailerVideo.src = '';
  trailerModal.style.display = 'none';
});

// Close modal if clicking outside iframe
trailerModal.addEventListener('click', (e) => {
  if (e.target === trailerModal) {
    trailerVideo.src = '';
    trailerModal.style.display = 'none';
  }
});
