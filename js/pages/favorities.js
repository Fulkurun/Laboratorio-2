$(document).ready(function() {
    var favoritesContainer = $('#contenedorFavoritas');
    var emptyMessage = $('#empty-message');

    // obtine la pelicula favorita guardada 
    var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    showFavorites(storedFavorites, favoritesContainer);

    // mensaje que muestra si no hay peli favorita
    if (storedFavorites.length === 0) {
        showEmptyMessage();
    }

    // boton de eliminar de favoritos
    favoritesContainer.on('click', '.button-remove', function() {
        var movieContainer = $(this).closest('.contenedorPeliculas');
        var movieId = movieContainer.attr('data-id');
        removeFavorite(movieId);
        movieContainer.remove();

        // mira si si no hay peliculas en favoritos
        if (favoritesContainer.children().length === 0) {
            showEmptyMessage();
        }
    });

    // parte que muetra las peliculas favoritas
    function showFavorites(favorites, container) {
        container.empty();

        favorites.forEach(function(favorite) {
            var movieHTML = `
                <div class="contenedorPeliculas" data-id="${favorite.id}">
                    <img src="https://image.tmdb.org/t/p/w500/${favorite.poster_path}" alt="Poster de la película">
                    <h3>${favorite.title}</h3>
                    <p><b>Codigo:</b> ${favorite.id}</p>
                    <p><b>Titulo Original:</b> ${favorite.original_title}</p>
                    <p><b>Idioma Original:</b> ${favorite.original_language}</p>
                    <p><b>Año:</b> ${favorite.release_date}</p>
                    <button class="button-remove">Eliminar de favoritos</button>
                </div>
            `;

            container.append(movieHTML);
        });
    }

    // Parte para remover la peliculas favoritas
    function removeFavorite(movieId) {
        var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

        var updatedFavorites = storedFavorites.filter(function(favorite) {
            return favorite.id !== movieId;
        });

        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }

    // lo que dice si hay pelicula vacia 
    function showEmptyMessage() {
        emptyMessage.removeClass('hidden');
    }
});