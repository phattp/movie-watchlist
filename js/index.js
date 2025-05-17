import { API_KEY } from "./config.js";
import { API_BASE_URL } from "./constants.js";
import { updateMainContent, renderMovies } from "./util.js";

let myWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || [];
const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", handleSearch);

document.addEventListener("click", (e) => {
  if (e.target.dataset.imdbid) {
    addToWatchlist(e.target.dataset.imdbid, e.target);
  }
});

async function handleSearch(e) {
  e.preventDefault();

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

async function fetchMoviesBySearch(searchTerm) {
  const response = await fetch(
    `${API_BASE_URL}?apikey=${API_KEY}&s=${searchTerm}`
  );
  const data = await response.json();
  return data;
}

async function fetchAllMovieDetails(searchResults) {
  const movieDetailsPromises = searchResults.map((movie) =>
    fetchMovieDetail(movie.imdbID)
  );
  return await Promise.all(movieDetailsPromises);
}

async function fetchMovieDetail(id) {
  const response = await fetch(`${API_BASE_URL}?apikey=${API_KEY}&i=${id}`);
  const data = await response.json();
  return data;
}

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
