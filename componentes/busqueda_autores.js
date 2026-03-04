const buscarautor = {
    data() {
        return {
            buscar: '',
            buscarTipo: 'nombre',
            autores: [],
        }
    },
    methods: {
        modificarAutor(autor) {
            this.$emit('modificar', autor);
        },
        eliminarAutor(autor) {
            alertify.confirm('Eliminar Autor', `¿Está seguro de eliminar el autor ${autor.nombre}?`, () => {
                db.autores.delete(autor.idAutor);
                this.listarAutores();
                alertify.success(`Autor ${autor.nombre} eliminado`);
            }, () => { });
        },
        async listarAutores() {
            this.autores = await db.autores.filter(autor => autor[this.buscarTipo].toLowerCase().includes(this.buscar.toLowerCase())).toArray();
        },
    },
    created() {
        this.listarAutores();
    },
    template: `
        <div class="row justify-content-center mt-3">
            <div class="col-12 col-md-9">
                <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
                    <div class="card-header text-white py-3" style="background: linear-gradient(135deg, #1a1a2e, #16213e);">
                        <h5 class="mb-0"><i class="bi bi-search me-2"></i>Búsqueda de Autores</h5>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover mb-0">
                            <thead style="background-color: #e8eaf6;">
                                <tr>
                                    <th class="px-3 py-2 text-secondary">BUSCAR POR</th>
                                    <th class="px-3 py-2">
                                        <select v-model="buscarTipo" class="form-select form-select-sm rounded-3" style="border-color: #4e54c8;">
                                            <option value="codigo">CÓDIGO</option>
                                            <option value="nombre">NOMBRE</option>
                                            <option value="pais">PAÍS</option>
                                            <option value="telefono">TELÉFONO</option>
                                        </select>
                                    </th>
                                    <th colspan="3" class="px-3 py-2">
                                        <input type="text" @keyup="listarAutores()" v-model="buscar" class="form-control form-control-sm rounded-3" style="border-color: #4e54c8;" placeholder="Escriba para buscar...">
                                    </th>
                                </tr>
                                <tr style="background-color: #3f51b5; color: white;">
                                    <th class="px-3 py-2">CÓDIGO</th>
                                    <th class="px-3 py-2">NOMBRE</th>
                                    <th class="px-3 py-2">PAÍS</th>
                                    <th class="px-3 py-2">TELÉFONO</th>
                                    <th class="px-3 py-2 text-center">ACCIÓN</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="autor in autores" :key="autor.idAutor" @click="modificarAutor(autor)" style="cursor:pointer;" class="align-middle">
                                    <td class="px-3">{{ autor.codigo }}</td>
                                    <td class="px-3">{{ autor.nombre }}</td>
                                    <td class="px-3">{{ autor.pais }}</td>
                                    <td class="px-3">{{ autor.telefono }}</td>
                                    <td class="px-3 text-center">
                                        <button class="btn btn-danger btn-sm rounded-pill px-3" @click.stop="eliminarAutor(autor)">
                                            <i class="bi bi-trash"></i> DEL
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="autores.length === 0">
                                    <td colspan="5" class="text-center text-muted py-3">No se encontraron autores</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `
};