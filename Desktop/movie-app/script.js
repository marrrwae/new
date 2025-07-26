const apiKey = 'b6120b2a408b9bbf2e1db90636efc64e';
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNjEyMGIyYTQwOGI5YmJmMmUxZGI5MDYzNmVmYzY0ZSIsIm5iZiI6MTc1MzU0NjIwNC4xNTkwMDAyLCJzdWIiOiI2ODg0ZmRkYzdlMDE4OGQ1Y2I3MmU1ZTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.CxB1tsgytzYpdNS-xvK_tzOTtMXle9-3MAxWBXpTb-s';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const searchInput = document.getElementById('movie-search-input');
const searchButton = document.getElementById('search-button');
const moviesGrid = document.getElementById('movies-grid');
const trailerModal = document.getElementById('trailer-modal');
const trailerVideo = document.getElementById('trailer-video');
const closeModalBtn = document.getElementById('close-modal');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchPopularMovies();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Modal event listeners
    closeModalBtn.addEventListener('click', closeModal);
    trailerModal.addEventListener('click', (e) => {
        if (e.target === trailerModal) {
            closeModal();
        }
    });
}

// Handle search functionality
async function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        await searchMovies(query);
    } else {
        await fetchPopularMovies();
    }
}

// Fetch popular movies (default view)
async function fetchPopularMovies() {
    try {
        const url = `${BASE_URL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        showError('Failed to load popular movies');
    }
}

// Search for movies
async function searchMovies(query) {
    try {
        const url = `${BASE_URL}/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results.length === 0) {
            showNoResults();
        } else {
            displayMovies(data.results);
        }
    } catch (error) {
        console.error('Error searching movies:', error);
        showError('Failed to search movies');
    }
}

// Display movies in the grid
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    
    movies.forEach((movie, index) => {
        if (movie.poster_path) { // Only show movies with posters
            const movieCard = createMovieCard(movie, index);
            moviesGrid.appendChild(movieCard);
        }
    });
}

// Create individual movie card
function createMovieCard(movie, index) {
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    movieCard.setAttribute('data-movie-id', movie.id);
    
    const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const stars = generateStars(movie.vote_average);
    
    movieCard.innerHTML = `
        <div class="movie-poster">
            <img src="${posterUrl}" alt="${movie.title}" loading="lazy">
            <div class="movie-overlay">
                <button class="play-btn" onclick="playTrailer(${movie.id})">▶</button>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
            <div class="movie-rating">
                <span class="rating-stars">${stars}</span>
                <span class="rating-number">${rating}</span>
            </div>
        </div>
    `;
    
    return movieCard;
}

// Generate star rating based on vote average
function generateStars(rating) {
    if (!rating) return '☆☆☆☆☆';
    
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating % 2) >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

// Fetch and play trailer
async function playTrailer(movieId) {
    try {
        const url = `${BASE_URL}/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        const data = await response.json();
        
        const trailer = data.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        );
        
        if (trailer) {
            trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            trailerModal.style.display = 'flex';
        } else {
            alert('Trailer not available for this movie.');
        }
    } catch (error) {
        console.error('Error fetching trailer:', error);
        alert('Failed to load trailer.');
    }
}

// Close modal and stop video
function closeModal() {
    trailerVideo.src = '';
    trailerModal.style.display = 'none';
}

// Show error message
function showError(message) {
    moviesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <h2 style="color: #ff6b6b; margin-bottom: 10px;">Error</h2>
            <p>${message}</p>
            <button onclick="fetchPopularMovies()" style="margin-top: 20px; padding: 10px 20px; background: #4ecdc4; border: none; border-radius: 5px; color: white; cursor: pointer;">
                Try Again
            </button>
        </div>
    `;
}

// Show no results message
function showNoResults() {
    moviesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <h2 style="color: #96ceb4; margin-bottom: 10px;">No Results Found</h2>
            <p>Try searching with different keywords.</p>
            <button onclick="fetchPopularMovies()" style="margin-top: 20px; padding: 10px 20px; background: #4ecdc4; border: none; border-radius: 5px; color: white; cursor: pointer;">
                Show Popular Movies
            </button>
        </div>
    `;
}
