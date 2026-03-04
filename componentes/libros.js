const libro = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            libros: [],
            autores: [],
            idLibro: '',
            idAutor: '',
            isbn: '',
            titulo: '',
            editorial: '',
            edicion: ''
        }
    },
    methods: {
        buscarLibro() {
            this.forms.buscarLibro.mostrar = !this.forms.buscarLibro.mostrar;
            this.$emit('buscar');
        },
        modificarLibro(libro) {
            this.accion = 'modificar';
            this.idLibro = libro.idLibro;
            this.idAutor = libro.idAutor;
            this.isbn = libro.isbn;
            this.titulo = libro.titulo;
            this.editorial = libro.editorial;
            this.edicion = libro.edicion;
        },
        guardarLibro() {
            let libro = {
                idAutor: this.idAutor,
                isbn: this.isbn,
                titulo: this.titulo,
                editorial: this.editorial,
                edicion: this.edicion
            };
            if (this.accion == 'modificar') {
                libro.idLibro = this.idLibro;
            }
            db.libros.put(libro);
            this.nuevoLibro();
        },
        nuevoLibro() {
            this.accion = 'nuevo';
            this.idLibro = '';
            this.idAutor = '';
            this.isbn = '';
            this.titulo = '';
            this.editorial = '';
            this.edicion = '';
        },
        cargarAutores() {
            db.autores.toArray().then(autores => this.autores = autores);
        }
    },
    created() {
        this.cargarAutores();
    },
    template: `
        <div class="row justify-content-center">
            <div class="col-12 col-md-7">
                <form id="frmLibro" name="frmLibro" @submit.prevent="guardarLibro">
                    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div class="card-header text-white py-3" style="background: linear-gradient(135deg, #1a1a2e, #16213e);">
                            <h5 class="mb-0"><i class="bi bi-book-fill me-2"></i>Registro de Libros</h5>
                        </div>
                        <div class="card-body px-4 py-3" style="background-color: #f8f9fa;">
                            <div class="mb-3 row align-items-center">
                                <label class="col-sm-3 col-form-label fw-semibold text-secondary">ISBN</label>
                                <div class="col-sm-4">
                                    <input required v-model="isbn" type="text" class="form-control rounded-3 border-2" style="border-color: #4e54c8;" placeholder="Ej: 978-0-00-000">
                                </div>
                            </div>
                            <div class="mb-3 row align-items-center">
                                <label class="col-sm-3 col-form-label fw-semibold text-secondary">TÍTULO</label>
                                <div class="col-sm-7">
                                    <input required v-model="titulo" type="text" class="form-control rounded-3 border-2" style="border-color: #4e54c8;" placeholder="Título del libro">
                                </div>
                            </div>
                            <div class="mb-3 row align-items-center">
                                <label class="col-sm-3 col-form-label fw-semibold text-secondary">EDITORIAL</label>
                                <div class="col-sm-7">
                                    <input required v-model="editorial" type="text" class="form-control rounded-3 border-2" style="border-color: #4e54c8;" placeholder="Editorial">
                                </div>
                            </div>
                            <div class="mb-3 row align-items-center">
                                <label class="col-sm-3 col-form-label fw-semibold text-secondary">EDICIÓN</label>
                                <div class="col-sm-4">
                                    <input required v-model="edicion" type="text" class="form-control rounded-3 border-2" style="border-color: #4e54c8;" placeholder="Ej: 1ra">
                                </div>
                            </div>
                            <div class="mb-3 row align-items-center">
                                <label class="col-sm-3 col-form-label fw-semibold text-secondary">AUTOR</label>
                                <div class="col-sm-6">
                                    <select required v-model="idAutor" class="form-select rounded-3 border-2" style="border-color: #4e54c8;">
                                        <option value="" disabled>Seleccione un autor</option>
                                        <option v-for="autor in autores" :key="autor.idAutor" :value="autor.idAutor">{{ autor.nombre }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-center py-3" style="background: linear-gradient(135deg, #1a1a2e, #16213e);">
                            <button type="submit" class="btn btn-primary px-4 me-2 rounded-pill fw-semibold">
                                <i class="bi bi-save me-1"></i> Guardar
                            </button>
                            <button type="button" @click="nuevoLibro" class="btn btn-warning px-4 me-2 rounded-pill fw-semibold">
                                <i class="bi bi-plus-circle me-1"></i> Nuevo
                            </button>
                            <button type="button" @click="buscarLibro" class="btn btn-info px-4 rounded-pill fw-semibold text-white">
                                <i class="bi bi-search me-1"></i> Buscar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};