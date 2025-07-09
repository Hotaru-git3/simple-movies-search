const searchButton = document.querySelector('.input-button');
const inputField = document.querySelector('.input-value');

function MoviesSearch() {
    const inputValue = inputField.value.trim();

    // Validasi input kosong
    if (inputValue === '') {
        return document.querySelector('.untuk-tambah').innerHTML = `
                <div class="col">
                    <div class="alert alert-danger" role="alert">
                        Masukkan Judul Terlebih Dahulu
                    </div>
                </div>
            `
    }

    fetch('https://www.omdbapi.com/?apikey=2cf719f7&s=' + inputValue)
        .then(response => {
            if (!response.ok) {
                throw new Error('Gagal terhubung ke server! Periksa kembali jaringan anda');
            }
            return response.json();
        })
        .then(response => {
            if (response.Response === "False") {
                throw new Error(response.Error || 'Movies not found');
            }

            let card = '';
            const movies = response.Search;

            movies.forEach(m => {
                card += moviesFunct(m);
            });

            document.querySelector('.untuk-tambah').innerHTML = card;

            // Tambahkan event ke semua tombol detail
            const detailsMovies = document.querySelectorAll('.modal-button-click');
            detailsMovies.forEach(btn => {
                btn.addEventListener('click', function () {
                    const imdbID = this.dataset.imdb;

                    fetch(`https://www.omdbapi.com/?apikey=2cf719f7&i=${imdbID}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Gagal mengambil detail film');
                            }
                            return response.json();
                        })
                        .then(i => {
                            if (i.Response === "False") {
                                throw new Error(i.Error || 'Detail film tidak ditemukan');
                            }

                            const detail = showMovies(i);
                            document.querySelector('.modal-body').innerHTML = detail;
                        })
                        .catch(err => {
                            alert('Error saat menampilkan detail: ' + err.message);
                        });
                });
            });
        })
        .catch(err => {
            document.querySelector('.untuk-tambah').innerHTML = `
                <div class="col">
                    <div class="alert alert-danger" role="alert">
                        ${err.message}
                    </div>
                </div>
            `;
        });
}

searchButton.addEventListener('click', MoviesSearch);
inputField.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        MoviesSearch();
    }
});

function moviesFunct(m) {
    return `<div class="col-md-4 my-3">
        <div class="card">
            <img src="${m.Poster}" class="card-img-top" alt="${m.Title}">
            <div class="card-body">
                <h5 class="card-title">${m.Title}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${m.Year}</h6>
                <a href="#" class="btn btn-primary modal-button-click" data-bs-toggle="modal" data-bs-target="#detailModal" data-imdb="${m.imdbID}">Details Movie</a>
            </div>
        </div>
    </div>`;
}

function showMovies(i) {
    return `<div class="container-fluid list-details">
        <div class="row">
            <div class="col-md-4">
                <img src="${i.Poster}" class="img-fluid">
            </div>
            <div class="col-md">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Title:</strong> ${i.Title}</li>
                    <li class="list-group-item"><strong>Director:</strong> ${i.Director}</li>
                    <li class="list-group-item"><strong>Released:</strong> ${i.Released}</li>
                    <li class="list-group-item"><strong>Actors:</strong> ${i.Actors}</li>
                    <li class="list-group-item"><strong>Plot:</strong> ${i.Plot}</li>
                </ul>
            </div>
        </div>
    </div>`;
}
