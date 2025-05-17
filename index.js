const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", handleSearch);

async function handleSearch(e) {
  e.preventDefault();

  const searchFormData = new FormData(searchForm);
  const searchValue = searchFormData.get("search-bar");

  const response = await fetch(
    `http://www.omdbapi.com/?apikey=3e17a545&s=${searchValue}`
  );
  const data = await response.json();

  if (data.Response === "True" && data.Search) {
    const movieDetailsPromises = data.Search.map((movie) =>
      fetchMovieDetail(movie.imdbID)
    );

    const movieDetails = await Promise.all(movieDetailsPromises);

    let movieCardHtml = "";
    movieDetails.forEach((movie, index) => {
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
                          ${movie.Ratings[0].Value.slice(0, -3)}
                        </p>
                    </div>
                    <div class="movie-subheading">
                        <p>${movie.Runtime}</p>
                        <p>${movie.Genre}</p>
                        <button class="add-watchlist-btn">
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
  } else {
    document.querySelector("main").innerHTML = `
      <i class="fa-solid fa-face-frown sad-icon"></i>
      <h2 class="no-movie">No movies found. Try another search.</h2>
    `;
  }

  searchForm.reset();
}

async function fetchMovieDetail(id) {
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=3e17a545&i=${id}`
  );
  const data = await response.json();
  return data;
}
