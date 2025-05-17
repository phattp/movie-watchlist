// Import necessary modules
import { API_KEY } from "./config.js";
import { API_BASE_URL } from "./constants.js";
import { renderMovies, updateMainContent } from "./util.js";

// Initialize watchlist from localStorage or create empty array if none exists
let myWatchlistArr = JSON.parse(localStorage.getItem("myWatchlist")) || [];

// Load watchlist when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  await loadWatchlist();
});

// Handle click events (for removing movies)
document.addEventListener("click", async (e) => {
  if (e.target.dataset.imdbid) {
    await removeFromWatchlist(e.target.dataset.imdbid);
  }
});

/**
 * Loads and displays the user's watchlist.
 * Shows empty state if watchlist is empty.
 */
async function loadWatchlist() {
  if (!myWatchlistArr || myWatchlistArr.length === 0) {
    updateMainContent("emptyWatchlist");
    return;
  }

  try {
    updateMainContent("loading", "Loading your watchlist...");
    const watchlistData = await fetchAllWatchlistItems();
    renderMovies(watchlistData, true);
  } catch (error) {
    console.error("Error loading watchlist:", error);
    updateMainContent(
      "error",
      "An error loading your watchlist. Please try again later."
    );
  }
}

/**
 * Fetches detailed information for all movies in the watchlist.
 * @returns {Promise<Array<Object>>} - Detailed data for watchlist movies
 */
async function fetchAllWatchlistItems() {
  const watchlistPromises = myWatchlistArr.map((id) => fetchWatchlist(id));
  return await Promise.all(watchlistPromises);
}

/**
 * Fetches detailed information for a single movie.
 * @param {string} id - IMDB ID of the movie
 * @returns {Promise<Object>} - Detailed movie data
 */
async function fetchWatchlist(id) {
  const response = await fetch(`${API_BASE_URL}?apikey=${API_KEY}&i=${id}`);
  const data = await response.json();
  return data;
}

/**
 * Removes a movie from the watchlist and updates the UI.
 * @param {string} imdbID - IMDB ID of the movie to remove
 */
async function removeFromWatchlist(imdbID) {
  myWatchlistArr = myWatchlistArr.filter((id) => id !== imdbID);
  localStorage.setItem("myWatchlist", JSON.stringify(myWatchlistArr));
  await loadWatchlist();
}
