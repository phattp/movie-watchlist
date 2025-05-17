export function createMovieCardHtml(movie, isWatchlist = false) {
  const buttonHtml = isWatchlist
    ? `<button class="add-watchlist-btn" data-imdbid="${movie.imdbID}">
         <i class="fa-solid fa-circle-minus"></i> Remove
       </button>`
    : `<button class="add-watchlist-btn" data-imdbid="${movie.imdbID}">
         <i class="fa-solid fa-circle-plus"></i> Watchlist
       </button>`;

  return `
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
                    ${buttonHtml}
                </div>
                <p class="plot">${movie.Plot}</p>
            </div>
        </article>
    `;
}

export function updateMainContent(type, message = "") {
  const mainElement = document.querySelector("main");

  switch (type) {
    case "loading":
      mainElement.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin film-icon"></i>
        <h2>Searching for movies...</h2>
      `;
      mainElement.style.justifyContent = "center";
      break;

    case "error":
      mainElement.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation sad-icon"></i>
        <h2 class="no-movie">${
          message || "An error occurred. Please try again later."
        }</h2>
      `;
      mainElement.style.justifyContent = "center";
      break;

    case "noResults":
      mainElement.innerHTML = `
        <i class="fa-solid fa-face-frown sad-icon"></i>
        <h2 class="no-movie">${
          message || "No movies found. Try another search."
        }</h2>
      `;
      mainElement.style.justifyContent = "center";
      break;

    case "emptyWatchlist":
      mainElement.innerHTML = `
        <h2>Your watchlist is looking a little empty...</h2>
        <a class="add-movie-a" href="../index.html"><i class="fa-solid fa-circle-plus"></i> Let's add some movies!</a>
      `;
      mainElement.style.justifyContent = "center";
      break;

    case "emptySearch":
      mainElement.innerHTML = `
        <i class="fa-solid fa-magnifying-glass sad-icon"></i>
        <h2 class="no-movie">${message || "Please enter a movie title"}</h2>
      `;
      mainElement.style.justifyContent = "center";
      break;
  }

  return mainElement;
}

export function renderMovies(movies, isWatchlist = false) {
  const mainElement = document.querySelector("main");

  let moviesHtml = "";
  movies.forEach((movie) => {
    moviesHtml += createMovieCardHtml(movie, isWatchlist);
  });

  mainElement.innerHtml = `<section class="movie-cards">${moviesHtml}</section>`;
  mainElement.style.justifyContent = "flex-start";
}
