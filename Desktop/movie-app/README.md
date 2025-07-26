# VibeFlix - Movie Search App

A modern movie search application that connects to The Movie Database (TMDb) API to display movies with their titles, posters, and ratings.

## Features

- **Search Movies**: Search for movies by title using the search bar
- **Popular Movies**: View popular movies by default when the page loads
- **Movie Details**: Each movie displays:
  - Movie poster
  - Title
  - Star rating (based on TMDb rating)
  - Numerical rating
- **Trailers**: Click the play button on any movie to watch its trailer
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

1. **View Popular Movies**: The app loads popular movies by default
2. **Search**: Type a movie title in the search bar and press Enter or click the search button
3. **Watch Trailers**: Click the play button (▶) on any movie card to watch the trailer
4. **Clear Search**: Leave the search bar empty and search to return to popular movies

## Technical Details

- **API**: Uses The Movie Database (TMDb) API v3
- **Technologies**: HTML, CSS, JavaScript (Vanilla)
- **Features**:
  - Async/await for API calls
  - Error handling for failed requests
  - Dynamic star rating generation
  - Responsive grid layout
  - Modal for trailer playback

## Running the App

1. Serve the files using a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
2. Open your browser and navigate to `http://localhost:8000`

## API Key

The app includes a TMDb API key for demonstration purposes. For production use, you should:
1. Get your own API key from [TMDb](https://www.themoviedb.org/settings/api)
2. Replace the `apiKey` variable in `script.js`
3. Keep your API key secure (use environment variables)

## File Structure

- `index.html` - Main HTML structure
- `script.js` - JavaScript functionality and TMDb API integration
- `style.css` - Styling and responsive design
- `README.md` - This documentation file