import { API_KEY } from "./config.js";
import { API_BASE_URL } from "./constants.js";
import { renderMovies, updateMainContent } from "./util.js";

let myWatchlistArr = JSON.parse(localStorage.getItem("myWatchlist")) || [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadWatchlist();
});

document.addEventListener("click", async (e) => {
  if (e.target.dataset.imdbid) {
    await removeFromWatchlist(e.target.dataset.imdbid);
  }
});

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

async function fetchAllWatchlistItems() {
  const watchlistPromises = myWatchlistArr.map((id) => fetchWatchlist(id));
  return await Promise.all(watchlistPromises);
}

async function fetchWatchlist(id) {
  const response = await fetch(`${API_BASE_URL}?apikey=${API_KEY}&i=${id}`);
  const data = await response.json();
  return data;
}

async function removeFromWatchlist(imdbID) {
  myWatchlistArr = myWatchlistArr.filter((id) => id !== imdbID);
  localStorage.setItem("myWatchlist", JSON.stringify(myWatchlistArr));
  await loadWatchlist();
}
