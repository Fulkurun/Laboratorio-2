$(document).ready(function() {
    var favoritesContainer = $('#contenedorFavoritas');
    var emptyMessage = $('#empty-message');
    var loader = $('#loader');

    // obtiene las películas favoritas guardadas
    var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    showFavorites(storedFavorites, favoritesContainer);
    updateEmptyMessage();

    // botón para eliminar de favoritos
    favoritesContainer.on('click', '.button-remove', function() {
        var movieContainer = $(this).closest('.contenedorPelicula');
        var movieId = movieContainer.attr('data-id');
        removeFavorite(movieId);
        movieContainer.remove();

        // mira  si no hay películas en favoritos
        updateEmptyMessage();
    });

    function showFavorites(favorites, container) {
        container.empty();

        // crea un contenedor adicional para la cuadrícula horizontal
        var horizontalContainer = $('<div class="horizontal-container"></div>');
        container.append(horizontalContainer);

        var promises = [];

        favorites.forEach(function(favorite) {
            var promise = $.ajax({
                url: `https://api.themoviedb.org/3/movie/${favorite.id}?api_key=4d99c08c8adc19218dd31e7d7794329c`,
                method: 'GET',
                dataType: 'json'
            });

            promises.push(promise);
        });

        // espera la llamada de la api
        $.when.apply($, promises).done(function() {
            var responses = Array.prototype.slice.call(arguments);

            responses.forEach(function(response) {
                var movieData = response[0];
                var description = movieData.overview;

                // hacer la traduccion a español
                $.ajax({
                    url: `https://api.mymemory.translated.net/get?q=${encodeURIComponent(description)}&langpair=en|es`,
                    method: 'GET',
                    dataType: 'json'
                }).done(function(translation) {
                    if (translation.responseStatus === 200) {
                        var translatedDescription = translation.responseData.translatedText;

                        var movieHTML = `
                            <div class="contenedorPelicula" data-id="${movieData.id}">
                                <img src="https://image.tmdb.org/t/p/w500/${movieData.poster_path}" alt="Poster de la película">
                                <div class="movie-details">
                                    <h3>${movieData.title}</h3>
                                    <p><b>Codigo:</b> ${movieData.id}</p>
                                    <p><b>Titulo Original:</b> ${movieData.original_title}</p>
                                    <p><b>Idioma Original:</b> ${movieData.original_language}</p>
                                    <p><b>Año:</b> ${movieData.release_date}</p>
                                    <p><b>Descripción:</b> ${translatedDescription}</p>
                                </div>
                                <button class="button-remove">Eliminar de favoritos</button>
                            </div>
                        `;

                        // agrega cada película al contenedor horizontal
                        horizontalContainer.append(movieHTML);
                    }
                }).fail(function() {
                    console.log('Error al traducir la descripción');
                });
            });
        }).fail(function() {
            console.log('Error al cargar los datos de la API');
        }).always(function() {
            // ocultar la pantalla de carga 
            setTimeout(function() {
                hideLoader();
            }, 2000);
        });
    }

    // remueve una película de favoritos
    function removeFavorite(movieId) {
        var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

        var updatedFavorites = storedFavorites.filter(function(favorite) {
            return favorite.id !== movieId;
        });

        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }

    // muestra y oculta el mensaje si no hay películas favoritas
    function updateEmptyMessage() {
        var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (storedFavorites.length === 0) {
            emptyMessage.removeClass('hidden');
        } else {
            emptyMessage.addClass('hidden');
        }
    }

    // mostrar rueda de carga y la oculta
    function showLoader() {
        loader.removeClass('hidden');
    }

    function hideLoader() {
        loader.fadeOut(2000, function() {
            loader.addClass('hidden');
        });
    }

    showLoader();
});