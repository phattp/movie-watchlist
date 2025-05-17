import { API_KEY } from "./config.js";
import { API_BASE_URL } from "./constants.js";

let myWatchlistArr = JSON.parse(localStorage.getItem("myWatchlist")) || [];

if (myWatchlistArr) {
  const myWatchlistPromises = myWatchlistArr.map((movie) =>
    fetchWatchlist(movie)
  );
  const myWatchlistData = await Promise.all(myWatchlistPromises);
  renderWatchlist(myWatchlistData);
}

document.addEventListener("click", async (e) => {
  if (e.target.dataset.imdbid) {
    myWatchlistArr = myWatchlistArr.filter(
      (movie) => movie !== e.target.dataset.imdbid
    );
    localStorage.setItem("myWatchlist", JSON.stringify(myWatchlistArr));
    const myWatchlistPromises = myWatchlistArr.map((movie) =>
      fetchWatchlist(movie)
    );
    const myWatchlistData = await Promise.all(myWatchlistPromises);
    renderWatchlist(myWatchlistData);
  }
});

async function fetchWatchlist(id) {
  const response = await fetch(`${API_BASE_URL}?apikey=${API_KEY}&i=${id}`);
  const data = await response.json();
  return data;
}

function renderWatchlist(watchlist) {
  let watchListHtml = "";
  watchlist.forEach((movie) => {
    watchListHtml += `
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
                    <button class="add-watchlist-btn" data-imdbid="${
                      movie.imdbID
                    }">
                        <i class="fa-solid fa-circle-minus"></i>
                        Remove
                    </button>
                </div>
                <p class="plot">${movie.Plot}</p>
            </div>
        </article>
    `;
  });

  const watchlistCardsHtml = `
      <section class="movie-cards">${watchListHtml}</section>
    `;

  document.querySelector("main").innerHTML = watchlistCardsHtml;
  document.querySelector("main").style.justifyContent = "flex-start";
}
