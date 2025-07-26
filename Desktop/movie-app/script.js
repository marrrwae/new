const apiKey = 'b6120b2a408b9bbf2e1db90636efc64e';
const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNjEyMGIyYTQwOGI5YmJmMmUxZGI5MDYzNmVmYzY0ZSIsIm5iZiI6MTc1MzU0NjIwNC4xNTkwMDAyLCJzdWIiOiI2ODg0ZmRkYzdlMDE4OGQ1Y2I3MmU1ZTYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.CxB1tsgytzYpdNS-xvK_tzOTtMXle9-3MAxWBXpTb-s';

// Global variables
let currentMovies = [];
let currentPage = 1;
let totalPages = 1;
let currentQuery = '';

// DOM elements
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

// Set up event listeners
function setupEventListeners() {
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Close modal functionality
    closeModalBtn.addEventListener('click', closeTrailerModal);
    trailerModal.addEventListener('click', (e) => {
        if (e.target === trailerModal) {
            closeTrailerModal();
        }
    });

    // Add sorting controls
    addSortingControls();
}

// Add sorting controls to the page
function addSortingControls() {
    const sortingContainer = document.createElement('div');
    sortingContainer.className = 'sorting-controls';
    sortingContainer.innerHTML = `
        <div class="sort-options">
            <label for="sort-select">Sort by:</label>
            <select id="sort-select" class="sort-select">
                <option value="popularity">Popularity</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="rating-low">Rating (Low to High)</option>
                <option value="title">Title (A-Z)</option>
                <option value="release-date">Release Date</option>
            </select>
        </div>
    `;
    
    const moviesSection = document.querySelector('.movies-section');
    moviesSection.insertBefore(sortingContainer, moviesGrid);
    
    document.getElementById('sort-select').addEventListener('change', handleSort);
}

// Handle search functionality
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        fetchPopularMovies();
        return;
    }
    
    currentQuery = query;
    currentPage = 1;
    showLoadingState();
    
    try {
        const movies = await searchMovies(query);
        currentMovies = movies;
        displayMovies(movies);
    } catch (error) {
        console.error('Search failed:', error);
        showErrorState('Search failed. Please try again.');
    }
}

// Handle sorting
function handleSort() {
    const sortValue = document.getElementById('sort-select').value;
    const sortedMovies = [...currentMovies];
    
    switch (sortValue) {
        case 'rating':
            sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
            break;
        case 'rating-low':
            sortedMovies.sort((a, b) => a.vote_average - b.vote_average);
            break;
        case 'title':
            sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'release-date':
            sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
            break;
        case 'popularity':
        default:
            sortedMovies.sort((a, b) => b.popularity - a.popularity);
            break;
    }
    
    displayMovies(sortedMovies);
}

// Fetch popular movies from TMDb API
async function fetchPopularMovies() {
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${currentPage}`;
    
    showLoadingState();
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch movies');
        
        const data = await response.json();
        currentMovies = data.results;
        totalPages = data.total_pages;
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        showErrorState('Failed to load movies. Please try again.');
    }
}

// Search movies using TMDb API
async function searchMovies(query) {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=${currentPage}&include_adult=false`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Search request failed');
    
    const data = await response.json();
    totalPages = data.total_pages;
    return data.results;
}

// Display movies in the grid
function displayMovies(movies) {
    if (!movies || movies.length === 0) {
        showEmptyState();
        return;
    }
    
    moviesGrid.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
    
    // Add event listeners to play buttons
    document.querySelectorAll('.play-btn').forEach(button => {
        button.addEventListener('click', () => {
            const movieId = button.getAttribute('data-movie-id');
            playTrailer(movieId);
        });
    });
}

// Create individual movie card HTML
function createMovieCard(movie) {
    const posterUrl = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750/333/fff?text=No+Poster';
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const stars = generateStarRating(movie.vote_average);
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';
    
    return `
        <div class="movie-card" data-movie-id="${movie.id}">
            <div class="movie-poster">
                <img src="${posterUrl}" 
                     alt="${movie.title}" 
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/500x750/333/fff?text=No+Poster'">
                <div class="movie-overlay">
                    <button class="play-btn" data-movie-id="${movie.id}" aria-label="Play trailer for ${movie.title}">▶</button>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="release-year">${releaseYear}</span>
                </div>
                <div class="movie-rating">
                    <span class="rating-stars" title="Rating: ${rating}/10">${stars}</span>
                    <span class="rating-number">${rating}</span>
                </div>
                ${movie.overview ? `<p class="movie-overview" title="${movie.overview}">${truncateText(movie.overview, 100)}</p>` : ''}
            </div>
        </div>
    `;
}

// Generate star rating display
function generateStarRating(rating) {
    if (!rating) return '☆☆☆☆☆';
    
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating % 2) >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + 
           (hasHalfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// Truncate text for overview
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Fetch and play movie trailer
async function playTrailer(movieId) {
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch trailer');
        
        const data = await response.json();
        const trailer = data.results.find(video => 
            video.type === 'Trailer' && 
            video.site === 'YouTube'
        ) || data.results.find(video => video.site === 'YouTube');
        
        if (trailer) {
            trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;
            trailerModal.style.display = 'flex';
            trailerModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            showNotification('Trailer not available for this movie.');
        }
    } catch (error) {
        console.error('Error fetching trailer:', error);
        showNotification('Failed to load trailer. Please try again.');
    }
}

// Close trailer modal
function closeTrailerModal() {
    trailerVideo.src = '';
    trailerModal.style.display = 'none';
    trailerModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Show loading state
function showLoadingState() {
    moviesGrid.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading movies...</p>
        </div>
    `;
}

// Show empty state
function showEmptyState() {
    moviesGrid.innerHTML = `
        <div class="empty-state">
            <p>No movies found. Try a different search term.</p>
        </div>
    `;
}

// Show error state
function showErrorState(message) {
    moviesGrid.innerHTML = `
        <div class="error-state">
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">Retry</button>
        </div>
    `;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && trailerModal.style.display === 'flex') {
        closeTrailerModal();
    }
});
