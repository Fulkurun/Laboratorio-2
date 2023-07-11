$(document).ready(function() {
    var container = $('#contenedorPeliculas');
    var favoritesContainer = $('#contenedorFavoritas');
    var successMessage = $('#success-message');
    var existingMovieMessage = $('#existing-movie-message');

    // soli, para ver las pelis en la pagina 
    $.ajax({
        url: 'https://api.themoviedb.org/3/movie/popular?api_key=4d99c08c8adc19218dd31e7d7794329c',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            var movies = response.results;
            showMovies(movies, container);
        },
        error: function() {
            console.log('Error al cargar los datos de la API');
        }
    });


    $('#search-form').submit(function(event) {
        event.preventDefault();
        var movieName = $('#movie-input').val();
        searchMovie(movieName);
    });

    // agrega  peli favorita
    $(document).on('click', '.button-favorite', function() {
        var movieContainer = $(this).closest('.contenedorPeliculas');
        var movieData = extractMovieData(movieContainer);
        var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

        // mira si la peli esta en favoritos
        var existingFavorite = storedFavorites.find(function(favorite) {
            return favorite.id === movieData.id;
        });

        if (existingFavorite) {
            existingMovieMessage.removeClass('hidden');
            setTimeout(function() {
                existingMovieMessage.addClass('hidden');
            }, 3000);
        } else {
            storedFavorites.push(movieData);
            localStorage.setItem('favorites', JSON.stringify(storedFavorites));
            favoritesContainer.append(movieContainer.clone());
            $(this).text('Agregada a favoritos').prop('disabled', true);
            successMessage.removeClass('hidden');
            setTimeout(function() {
                successMessage.addClass('hidden');
            }, 3000);
        }
    });
});

function showMovies(movies, container) {
    container.empty();

    movies.forEach(function(movie) {
        var movieHTML = `
            <div class="contenedorPeliculas">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="Poster de la película">
                <h3>${movie.title}</h3>
                <p><b>Codigo:</b> ${movie.id}</p>
                <p><b>Titulo Original:</b> ${movie.original_title}</p>
                <p><b>Idioma Original:</b> ${movie.original_language}</p>
                <p><b>Año:</b> ${movie.release_date}</p>
                <section id="sec_paginador_peliculas">
                    <!--Seccion de Paginacion-->
                    <div class="paginacion" id="paginacion">
                        <button class="button-favorite">Agregar favoritos</button>
                    </div>
                </section>
            </div>
        `;

        container.append(movieHTML);
    });
}

function extractMovieData(movieContainer) {
    var posterPath = movieContainer.find('img').attr('src');
    var title = movieContainer.find('h3').text();
    var id = movieContainer.find('p').eq(0).text().replace('Codigo:', '').trim();
    var originalTitle = movieContainer.find('p').eq(1).text().replace('Titulo Original:', '').trim();
    var originalLanguage = movieContainer.find('p').eq(2).text().replace('Idioma Original:', '').trim();
    var releaseDate = movieContainer.find('p').eq(3).text().replace('Año:', '').trim();

    return {
        poster_path: posterPath,
        title: title,
        id: id,
        original_title: originalTitle,
        original_language: originalLanguage,
        release_date: releaseDate
    };
}

function searchMovie(movieName) {
    var container = $('#contenedorPeliculas');
    container.empty();

    $.ajax({
        url: `https://api.themoviedb.org/3/search/movie?api_key=4d99c08c8adc19218dd31e7d7794329c&query=${movieName}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            var movies = response.results;
            showMovies(movies, container);
        },
        error: function() {
            console.log('Error al cargar los datos de la API');
        }
    });
}