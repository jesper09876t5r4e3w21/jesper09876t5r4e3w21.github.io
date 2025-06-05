const apiKey = "14edad8fdb814769628821ca7bce3222"; // <- Vervang dit
let randomMoviesInterval; // <- Globale variabele om interval-ID op te slaan

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("homeButton").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("genreSelect").value = "";
    loadRandomMovies();
  
    // Als interval gestopt was (door zoeken), start het opnieuw
    if (!randomMoviesInterval) {
      randomMoviesInterval = setInterval(loadRandomMovies, 7000);
    }
  });
  
  loadGenres();
  loadCarousel();
  loadRandomMovies();
  randomMoviesInterval = setInterval(loadRandomMovies, 7000); // sla ID op

  const form = document.getElementById("searchForm");
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    console.log("Form submission intercepted");
    searchMovies();
  });  
});

  

async function loadGenres() {
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=nl-NL`;
  const res = await fetch(url);
  const data = await res.json();
  const select = document.getElementById("genreSelect");

  data.genres.forEach(genre => {
    const opt = document.createElement("option");
    opt.value = genre.id;
    opt.textContent = genre.name;
    select.appendChild(opt);
  });
}

async function loadCarousel() {
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=nl-NL&page=1`;
  const res = await fetch(url);
  const data = await res.json();

  let current = 0;
  const carousel = document.getElementById("carousel");

  function updateSlide() {
    const movie = data.results[current];
    carousel.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
    carousel.innerHTML = `
      <div class="carousel-item active">
        <h2>${movie.title}</h2>
      </div>
    `;
    current = (current + 1) % data.results.length;
  }

  updateSlide();
  setInterval(updateSlide, 5000); // elke 5 sec volgende slide
}

async function loadRandomMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=nl-NL&page=1`;
  const res = await fetch(url);
  const data = await res.json();
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  const randomMovies = data.results.sort(() => 0.5 - Math.random()).slice(0, 4);

  randomMovies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/150x225?text=No+Image";

      card.innerHTML = `
      <a href="details.html?id=${movie.id}">
        <img src="${poster}" alt="${movie.title}">
        <div class="title">${movie.title}</div>
      </a>
    `;
    

    resultsContainer.appendChild(card);
  });
}

async function searchMovies() {
  clearInterval(randomMoviesInterval); // 🛑 Stop het automatisch verversen

  const query = document.getElementById("searchInput").value.trim();
  const genreId = document.getElementById("genreSelect").value;
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=nl-NL`;

  if (!query && genreId) {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=nl-NL`;
  }

  const res = await fetch(url);
  const data = await res.json();

  if (data.results.length === 0) {
    resultsContainer.innerHTML = "<p>Geen resultaten gevonden.</p>";
    return;
  }

  data.results.slice(0, 8).forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/150x225?text=No+Image";

    card.innerHTML = `
      <a href="details.html?id=${movie.id}">
        <img src="${poster}" alt="${movie.title}">
        <div class="title">${movie.title}</div>
      </a>
    `;

    resultsContainer.appendChild(card);
  });
}
