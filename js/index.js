import { API_KEY } from "./config.js";
import { API_BASE_URL } from "./constants.js";

let myWatchlist = JSON.parse(localStorage.getItem("myWatchlist")) || [];
const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", handleSearch);

document.addEventListener("click", (e) => {
  if (e.target.dataset.imdbid) {
    if (!myWatchlist.includes(e.target.dataset.imdbid)) {
      myWatchlist.push(e.target.dataset.imdbid);
    }

    localStorage.setItem("myWatchlist", JSON.stringify(myWatchlist));
    e.target.innerHTML = `
      <i class="fa-solid fa-circle-check"></i> Added to Watchlist
    `;
    e.target.style.color = "#63E6BE";
    e.target.disabled = true;
    e.target.style.cursor = "auto";
  }
});

async function handleSearch(e) {
  e.preventDefault();

  const searchFormData = new FormData(searchForm);
  const searchValue = searchFormData.get("search-bar").trim();
  if (!searchValue) {
    document.querySelector("main").innerHTML = `
      <i class="fa-solid fa-magnifying-glass sad-icon"></i>
      <h2 class="no-movie">Please enter a movie title</h2>
    `;
    document.querySelector("main").style.justifyContent = "center";
    return;
  }

  document.querySelector("main").innerHTML = `
      <i class="fa-solid fa-spinner fa-spin film-icon"></i>
      <h2>Searching for movies...</h2>
    </div>
  `;
  document.querySelector("main").style.justifyContent = "center";

  try {
    const moviesResult = await fetchMoviesBySearch(searchValue);

    if (moviesResult.Response === "True" && moviesResult.Search) {
      const movieDetailsPromises = moviesResult.Search.map((movie) =>
        fetchMovieDetail(movie.imdbID)
      );

      const movieDetails = await Promise.all(movieDetailsPromises);

      let movieCardHtml = "";
      movieDetails.forEach((movie) => {
        movieCardHtml += `
            <article class="movie-card">
                <img
                  src="${movie.Poster}" 
                  alt="${movie.Title} Poster"
                  class="movie-poster"
                >
                <div class="movie-content">
                    <div class="movie-title">
                        <h3>${movie.Title}</h3>
                        <p class="rating">
                          <i class="fa-solid fa-star"></i>
                          ${
                            movie.Ratings && movie.Ratings.length > 0
                              ? movie.Ratings[0].Value.slice(0, -3)
                              : "N/A"
                          }
                        </p>
                    </div>
                    <div class="movie-subheading">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <button 
                          class="add-watchlist-btn"
                          data-imdbid="${movie.imdbID}"
                        >
                          <i class="fa-solid fa-circle-plus"></i>
                          Watchlist
                        </button>
                    </div>
                    <p class="plot">${movie.Plot}</p>
                </div>
            </article>
        `;
      });

      const movieCardsHtml = `
        <section class="movie-cards">${movieCardHtml}</section>
      `;

      document.querySelector("main").innerHTML = movieCardsHtml;
      document.querySelector("main").style.justifyContent = "flex-start";
    } else {
      document.querySelector("main").innerHTML = `
      <i class="fa-solid fa-face-frown sad-icon"></i>
      <h2 class="no-movie">No movies found. Try another search.</h2>
    `;
      document.querySelector("main").style.justifyContent = "center";
    }

    searchForm.reset();
  } catch (error) {
    console.error("Error fetching data:", error);
    document.querySelector("main").innerHTML = `
      <i class="fa-solid fa-triangle-exclamation sad-icon"></i>
      <h2 class="no-movie">An error occurred. Please try again later.</h2>
    `;
    document.querySelector("main").style.justifyContent = "center";
  }
}

async function fetchMoviesBySearch(searchTerm) {
  const response = await fetch(
    `${API_BASE_URL}?apikey=${API_KEY}&s=${searchTerm}`
  );
  const data = await response.json();
  return data;
}

async function fetchMovieDetail(id) {
  const response = await fetch(`${API_BASE_URL}?apikey=${API_KEY}&i=${id}`);
  const data = await response.json();
  return data;
}
