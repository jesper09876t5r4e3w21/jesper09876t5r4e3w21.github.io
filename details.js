const apiKey = "14edad8fdb814769628821ca7bce3222";
const movieId = new URLSearchParams(window.location.search).get("id");

if (movieId) {
  fetchMovieDetails(movieId);
}

async function fetchMovieDetails(id) {
  const [detailsRes, providersRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=nl-NL`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`)
  ]);

  const movie = await detailsRes.json();
  const providersData = await providersRes.json();

  document.getElementById("movieTitle").textContent = movie.title;

  const genres = movie.genres.map(g => g.name).join(", ");
  let providers = "Geen streaming info beschikbaar";

  if (providersData.results && providersData.results.NL && providersData.results.NL.flatrate) {
    providers = providersData.results.NL.flatrate
      .map(p => p.provider_name === "Max" ? "HBO Max" : p.provider_name)
      .join(", ");
  }
  


  document.getElementById("movieDetails").innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" style="max-width:200px;">
    <p><strong>Uitgebracht op:</strong> ${movie.release_date}</p>
    <p><strong>Genres:</strong> ${genres}</p>
    <p><strong>Beschrijving:</strong> ${movie.overview}</p>
    <p><strong>Beschikbaar op:</strong> ${providers}</p>
  `;
}
