const buscarlibro = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'titulo',
            libros: [],
            autores: []
        }
    },
    methods: {
        modificarLibro(libro) {
            this.$emit('modificar', libro);
        },
        eliminarLibro(libro) {
            alertify.confirm('Eliminar Libro', `¿Está seguro de eliminar el libro ${libro.titulo}?`, () => {
                db.libros.delete(libro.idLibro);
                this.listarLibros();
                alertify.success(`Libro ${libro.titulo} eliminado`);
            }, () => { });
        },
        async listarLibros() {
            this.libros = await db.libros.filter(libro => libro[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
        },
        async cargarAutores() {
            this.autores = await db.autores.toArray();
        },
        getNombreAutor(idAutor) {
            const autor = this.autores.find(a => a.idAutor === idAutor);
            return autor ? autor.nombre : 'Sin autor';
        }
    },
    created() {
        this.listarLibros();
        this.cargarAutores();
    },
    template: `
        <div class="row justify-content-center mt-3">
            <div class="col-12 col-md-10">
                <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
                    <div class="card-header text-white py-3" style="background: linear-gradient(135deg, #1a1a2e, #16213e);">
                        <h5 class="mb-0"><i class="bi bi-search me-2"></i>Búsqueda de Libros</h5>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover mb-0">
                            <thead style="background-color: #e8eaf6;">
                                <tr>
                                    <th class="px-3 py-2 text-secondary">BUSCAR POR</th>
                                    <th class="px-3 py-2">
                                        <select v-model="buscarTipo" class="form-select form-select-sm rounded-3" style="border-color: #4e54c8;">
                                            <option value="isbn">ISBN</option>
                                            <option value="titulo">TÍTULO</option>
                                            <option value="editorial">EDITORIAL</option>
                                            <option value="edicion">EDICIÓN</option>
                                        </select>
                                    </th>
                                    <th colspan="4" class="px-3 py-2">
                                        <input type="text" @keyup="listarLibros()" v-model="buscar" class="form-control form-control-sm rounded-3" style="border-color: #4e54c8;" placeholder="Escriba para buscar...">
                                    </th>
                                </tr>
                                <tr style="background-color: #3f51b5; color: white;">
                                    <th class="px-3 py-2">ISBN</th>
                                    <th class="px-3 py-2">TÍTULO</th>
                                    <th class="px-3 py-2">AUTOR</th>
                                    <th class="px-3 py-2">EDITORIAL</th>
                                    <th class="px-3 py-2">EDICIÓN</th>
                                    <th class="px-3 py-2 text-center">ACCIÓN</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="libro in libros" :key="libro.idLibro" @click="modificarLibro(libro)" style="cursor:pointer;" class="align-middle">
                                    <td class="px-3">{{ libro.isbn }}</td>
                                    <td class="px-3">{{ libro.titulo }}</td>
                                    <td class="px-3">{{ getNombreAutor(libro.idAutor) }}</td>
                                    <td class="px-3">{{ libro.editorial }}</td>
                                    <td class="px-3">{{ libro.edicion }}</td>
                                    <td class="px-3 text-center">
                                        <button class="btn btn-danger btn-sm rounded-pill px-3" @click.stop="eliminarLibro(libro)">
                                            <i class="bi bi-trash"></i> DEL
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="libros.length === 0">
                                    <td colspan="6" class="text-center text-muted py-3">No se encontraron libros</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};