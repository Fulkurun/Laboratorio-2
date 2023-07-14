$(document).ready(function() {
    var container = $('#contenedorPeliculas');
    var successMessage = $('#success-message');
    var existingMovieMessage = $('#existing-movie-message');
    var loader = $('#loader');
    var pagina = 1;

    function statusBtnAnterior(pag) {
        if (pag > 1) {
            $('#btnAnterior').prop('disabled', false).removeClass('btnDisabled');
        } else {
            $('#btnAnterior').prop('disabled', true).addClass('btnDisabled');
        }
    }

    // Obtener las películas de la API al cargar la página
    function obtenerPeliculas() {
        showLoader();

        setTimeout(function() {
            $.ajax({
                url: 'https://api.themoviedb.org/3/movie/popular?api_key=4d99c08c8adc19218dd31e7d7794329c',
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                    var movies = response.results;
                    showMovies(movies, container);
                    hideLoader();
                },
                error: function() {
                    console.log('Error al cargar los datos de la API');
                    hideLoader();
                }
            });
        }, 3000); // Duración de 3 segundos (3000 milisegundos)
    }

    // Mostrar las películas en el contenedor
    function showMovies(movies, container) {
        container.empty();
        container.addClass('grid-container'); // Agregar la clase 'grid-container' al contenedor

        movies.forEach(function(movie) {
            var movieHTML = `
          <div class="contenedorPelicula">
            <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" alt="Poster de la película">
            <div class="movie-details">
              <h3>${movie.title}</h3>
              <p><b>Código:</b> ${movie.id}</p>
              <p><b>Título Original:</b> ${movie.original_title}</p>
              <p><b>Idioma Original:</b> ${movie.original_language}</p>
              <p><b>Año:</b> ${movie.release_date}</p>
              <div class="paginacion">
                <button class="button-favorite">Agregar favoritos</button>
              </div>
            </div>
          </div>
        `;

            container.append(movieHTML);
        });
    }

    obtenerPeliculas();

    $(document).on('click', '.button-favorite', function() {
        var movieContainer = $(this).closest('.contenedorPelicula');
        var movieData = extractMovieData(movieContainer);
        var storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

        var existingFavorite = storedFavorites.find(function(favorite) {
            return favorite.id === movieData.id;
        });

        if (existingFavorite) {
            showExistingMovieMessage();
        } else {
            storedFavorites.push(movieData);
            localStorage.setItem('favorites', JSON.stringify(storedFavorites));
            $(this).text('Agregada a favoritos').prop('disabled', true);
            showSuccessMessage();
        }
    });

    // Mostrar mensaje de película existente en favoritos
    function showExistingMovieMessage() {
        existingMovieMessage.removeClass('hidden');
        setTimeout(function() {
            existingMovieMessage.addClass('hidden');
        }, 3000);
    }

    // Mostrar mensaje de éxito al agregar a favoritos
    function showSuccessMessage() {
        successMessage.removeClass('hidden');
        setTimeout(function() {
            successMessage.addClass('hidden');
        }, 3000);
    }

    // Obtener datos de la película
    function extractMovieData(movieContainer) {
        var posterPath = movieContainer.find('img').attr('src');
        var title = movieContainer.find('h3').text();
        var id = movieContainer.find('p').eq(0).text().replace('Código:', '').trim();
        var originalTitle = movieContainer.find('p').eq(1).text().replace('Título Original:', '').trim();
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

    // Buscar película
    $('#search-form').submit(function(event) {
        event.preventDefault();
        var movieName = $('#movie-input').val();
        searchMovie(movieName);
    });

    // Buscar película en la API
    function searchMovie(movieName) {
        container.empty();
        showLoader();

        $.ajax({
            url: `https://api.themoviedb.org/3/search/movie?api_key=4d99c08c8adc19218dd31e7d7794329c&query=${movieName}`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                var movies = response.results;
                showMovies(movies, container);
                hideLoader();
            },
            error: function() {
                console.log('Error al cargar los datos de la API');
                hideLoader();
            }
        });
    }

    // Paginación
    $('#btnSiguiente').click(function() {
        pagina++;
        obtenerPeliculasPaginadas(pagina);
        statusBtnAnterior(pagina);
    });

    $('#btnAnterior').click(function() {
        if (pagina > 1) {
            pagina--;
            obtenerPeliculasPaginadas(pagina);
            statusBtnAnterior(pagina);
        }
    });

    // Obtener películas paginadas
    function obtenerPeliculasPaginadas(page) {
        showLoader();
        $.ajax({
            url: `https://api.themoviedb.org/3/movie/popular?api_key=4d99c08c8adc19218dd31e7d7794329c&page=${page}`,
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                var movies = response.results;
                showMovies(movies, container);
                $('#nroPaginacion').text(page);
                hideLoader();
            },
            error: function() {
                console.log('Error al cargar los datos de la API');
                hideLoader();
            }
        });
    }

    // Mostrar rueda de carga
    function showLoader() {
        loader.removeClass('hidden');
    }

    // Ocultar rueda de carga después de 3 segundos
    function hideLoader() {
        setTimeout(function() {
            loader.addClass('hidden');
        }, 3000);
    }
});