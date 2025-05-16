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

    let movieHtml = "";
    movieDetails.forEach((movie, index) => {
      movieHtml += `
            <article class="movie-card">
                <img
                  src="${movie.Poster}" 
                  alt="${movie.Title} Poster"
                  class="movie-poster"
                >
                <div class="movie-content">
                    <div class="movie-title">
                        <h2>${movie.Title}</h2>
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

    document.querySelector("main").innerHTML = movieHtml;
  } else {
    document.querySelector("main").innerHTML =
      "<p>No movies found. Try another search.</p>";
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
