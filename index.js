$('.input-button').on('click', function () {
  const query = $('.input-value').val();

  if (!query) return alert('Masukkan judul film dulu ya!');

  $.ajax({
    url: `https://www.omdbapi.com/?apikey=2cf719f7&s=${query}`,
    success: m => {
      if (m.Response === "False") {
        $('.untuk-tambah').html(`
          <div class="col">
            <div class="alert alert-danger" role="alert">
              ${m.Error}
            </div>
          </div>
        `);
        return;
      }

      const movies = m.Search;
      let card = '';

      movies.forEach(k => {
        card += `<div class="col-md-4 my-3">
                  <div class="card">
                      <img src="${k.Poster}" class="card-img-top" alt="${k.Title}">
                      <div class="card-body">
                          <h5 class="card-title">${k.Title}</h5>
                          <h6 class="card-subtitle mb-2 text-body-secondary">${k.Year}</h6>
                          <a href="#" class="btn btn-primary modal-button-click" data-bs-toggle="modal" data-bs-target="#detailModal" data-imdb="${k.imdbID}">Details Movie</a>
                      </div>
                  </div>
                </div>`;
      });
      $('.untuk-tambah').html(card);

      // Modal Detail
      $('.modal-button-click').on('click', function () {
        const imdbID = $(this).data('imdb');
        $.ajax({
          url: `https://www.omdbapi.com/?apikey=2cf719f7&i=${imdbID}`,
          success: i => {
            if (i.Response === "False") {
              $('.modal-body').html(`<p class="text-danger">${i.Error}</p>`);
              return;
            }

            const detail = `<div class="container-fluid list-details">
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
            $('.modal-body').html(detail);
          },
          error: () => {
            $('.modal-body').html(`<p class="text-danger">Gagal mengambil detail film.</p>`);
          }
        });
      });
    },
    error: () => {
      $('.untuk-tambah').html(`
        <div class="col">
          <div class="alert alert-danger" role="alert">
            Gagal mengambil data dari server. Coba periksa koneksi atau API key.
          </div>
        </div>
      `);
    }
  });
});
