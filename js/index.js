// Import necessary modules
import { API_KEY } from "./config.js";
import { API_BASE_URL } from "./constants.js";
import { updateMainContent, renderMovies } from "./util.js";

// Initialize watchlist from localStorage or create empty array if none exists
let myWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || [];
const searchForm = document.getElementById("search-form");

// Event listeners
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleSearch();
});

document.addEventListener("click", (e) => {
  if (e.target.dataset.imdbid) {
    addToWatchlist(e.target.dataset.imdbid, e.target);
  }
});

/**
 * Handles the search form submission.
 * Fetches and displays search results.
 * @param {Event} e - Form submit event
 */
async function handleSearch() {
  const searchFormData = new FormData(searchForm);
  const searchValue = searchFormData.get("search-bar").trim();

  if (!searchValue) {
    updateMainContent("emptySearch");
    return;
  }

  updateMainContent("loading");

  try {
    const moviesResult = await fetchMoviesBySearch(searchValue);

    if (moviesResult.Response === "True" && moviesResult.Search) {
      const movieDetails = await fetchAllMovieDetails(moviesResult.Search);
      renderMovies(movieDetails, false);
    } else {
      updateMainContent("noResults");
    }

    searchForm.reset();
  } catch (error) {
    console.error("Error fetching data:", error);
    updateMainContent("error");
  }
}

/**
 * Searches for movies by title.
 * @param {string} searchTerm - The movie title to search for
 * @returns {Promise<Object>} - Search results from OMDB API
 */
async function fetchMoviesBySearch(searchTerm) {
  const response = await fetch(
    `${API_BASE_URL}?apikey=${API_KEY}&s=${searchTerm}`
  );
  const data = await response.json();
  return data;
}

/**
 * Fetches detailed information for each movie in search results.
 * @param {Array<Object>} searchResults - Basic movie data from search
 * @returns {Promise<Array<Object>>} - Detailed movie data
 */
async function fetchAllMovieDetails(searchResults) {
  const movieDetailsPromises = searchResults.map((movie) =>
    fetchMovieDetail(movie.imdbID)
  );
  return await Promise.all(movieDetailsPromises);
}

/**
 * Fetches detailed information for a single movie.
 * @param {string} id - IMDB ID of the movie
 * @returns {Promise<Object>} - Detailed movie data
 */
async function fetchMovieDetail(id) {
  const response = await fetch(`${API_BASE_URL}?apikey=${API_KEY}&i=${id}`);
  const data = await response.json();
  return data;
}

/**
 * Adds a movie to the watchlist and updates the button state.
 * @param {string} imdbID - IMDB ID of the movie to add
 * @param {HTMLElement} button - The button element that was clicked
 */
function addToWatchlist(imdbID, button) {
  if (!myWatchlist.includes(imdbID)) {
    myWatchlist.push(imdbID);
  }

  localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist));
  button.innerHTML = `
    <i class="fa-solid fa-circle-check"></i> Added to Watchlist
  `;
  button.style.color = "#63E6BE";
  button.disabled = true;
  button.style.cursor = "auto";
}
