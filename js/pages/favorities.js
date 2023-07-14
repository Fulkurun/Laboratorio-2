$(document).ready(function() {
    var favoritesContainer = $('#contenedorFavoritas');
    var emptyMessage = $('#empty-message');

    // Obtiene las películas favoritas guardadas
    var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    showFavorites(storedFavorites, favoritesContainer);

    // Muestra un mensaje si no hay películas favoritas
    updateEmptyMessage();

    // Botón para eliminar de favoritos
    favoritesContainer.on('click', '.button-remove', function() {
        var movieContainer = $(this).closest('.contenedorPelicula');
        var movieId = movieContainer.attr('data-id');
        removeFavorite(movieId);
        movieContainer.remove();

        // Verifica si no hay películas en favoritos
        updateEmptyMessage();
    });

    function showFavorites(favorites, container) {
        container.empty();

        // Crea un contenedor adicional para la cuadrícula horizontal
        var horizontalContainer = $('<div class="horizontal-container"></div>');
        container.append(horizontalContainer);

        favorites.forEach(function(favorite) {
            var movieHTML = `
                <div class="contenedorPelicula" data-id="${favorite.id}">
                    <img src="https://image.tmdb.org/t/p/w500/${favorite.poster_path}" alt="Poster de la película">
                    <div class="movie-details">
                        <h3>${favorite.title}</h3>
                        <p><b>Codigo:</b> ${favorite.id}</p>
                        <p><b>Titulo Original:</b> ${favorite.original_title}</p>
                        <p><b>Idioma Original:</b> ${favorite.original_language}</p>
                        <p><b>Año:</b> ${favorite.release_date}</p>
                    </div>
                    <button class="button-remove">Eliminar de favoritos</button>
                </div>
            `;

            // Agrega cada película al contenedor horizontal
            horizontalContainer.append(movieHTML);
        });
    }

    // Remueve una película de favoritos
    function removeFavorite(movieId) {
        var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

        var updatedFavorites = storedFavorites.filter(function(favorite) {
            return favorite.id !== movieId;
        });

        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }

    // Muestra u oculta el mensaje si no hay películas favoritas
    function updateEmptyMessage() {
        var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (storedFavorites.length === 0) {
            emptyMessage.removeClass('hidden');
        } else {
            emptyMessage.addClass('hidden');
        }
    }
});