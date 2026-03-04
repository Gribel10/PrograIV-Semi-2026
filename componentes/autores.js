const autor = {
    props: ['forms'],
    data() {
        return {
            accion: 'nuevo',
            idAutor: '',
            codigo: '',
            nombre: '',
            pais: '',
            telefono: '',
        }
    },
    methods: {
        buscarAutor() {
            this.forms.buscarAutor.mostrar = !this.forms.buscarAutor.mostrar;
            this.$emit('buscar');
        },
        modificarAutor(autor) {
            this.accion = 'modificar';
            this.idAutor = autor.idAutor;
            this.codigo = autor.codigo;
            this.nombre = autor.nombre;
            this.pais = autor.pais;
            this.telefono = autor.telefono;
        },
        guardarAutor() {
            let autor = {
                codigo: this.codigo,
                nombre: this.nombre,
                pais: this.pais,
                telefono: this.telefono
            };
            if (this.accion == 'modificar') {
                autor.idAutor = this.idAutor;
            }
            db.autores.put(autor);
            this.nuevoAutor();
        },
        nuevoAutor() {
            this.accion = 'nuevo';
            this.idAutor = '';
            this.codigo = '';
            this.nombre = '';
            this.pais = '';
            this.telefono = '';
        }
    },
    template: `
        <div class="row justify-content-center">
            <div class="col-12 col-md-7">
                <form id="frmAutor" name="frmAutor" @submit.prevent="guardarAutor">
                    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div class="card-header text-white py-3" style="background: linear-gradient(135deg, #1a1a2e, #16213e);">
                            <h5 class="mb-0"><i class="bi bi-person-fill me-2"></i>Registro de Autores</h5>
                        </div>
                        <div class="card-body px-4 py-3" style="background-color: #f8f9fa;">
                            <div class="mb-3 row align-items-center">
                                <label class="col-sm-3 col-form-label fw-semibold text-secondary">CÓDIGO</label>
                                <div class="col-sm-4">
                                    <input required v-model="codigo" type="text" class="form-control rounded-3 border-2" style="border-color: #4e54c8;" placeholder="Ej: A001">
                                </div>
                            </div>
                            <div class="mb-3 row align-items-center">
                                <label class="col-sm-3 col-form-label fw-semibold text-secondary">NOMBRE</label>
                                <div class="col-sm-7">
                                    <input required pattern="[A-Za-zñÑáéíóú ]{3,150}" v-model="nombre" type="text" class="form-control rounded-3 border-2" style="border-color: #4e54c8;" placeholder="Nombre completo">
                                </div>
                            </div>
                            <div class="mb-3 row align-items-center">
                                <label class="col-sm-3 col-form-label fw-semibold text-secondary">PAÍS</label>
                                <div class="col-sm-7">
                                    <input required v-model="pais" type="text" class="form-control rounded-3 border-2" style="border-color: #4e54c8;" placeholder="País de origen">
                                </div>
                            </div>
                            <div class="mb-3 row align-items-center">
                                <label class="col-sm-3 col-form-label fw-semibold text-secondary">TELÉFONO</label>
                                <div class="col-sm-4">
                                    <input v-model="telefono" type="text" class="form-control rounded-3 border-2" style="border-color: #4e54c8;" placeholder="Opcional">
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-center py-3" style="background: linear-gradient(135deg, #1a1a2e, #16213e);">
                            <button type="submit" class="btn btn-primary px-4 me-2 rounded-pill fw-semibold">
                                <i class="bi bi-save me-1"></i> Guardar
                            </button>
                            <button type="button" @click="nuevoAutor" class="btn btn-warning px-4 me-2 rounded-pill fw-semibold">
                                <i class="bi bi-plus-circle me-1"></i> Nuevo
                            </button>
                            <button type="button" @click="buscarAutor" class="btn btn-info px-4 rounded-pill fw-semibold text-white">
                                <i class="bi bi-search me-1"></i> Buscar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
};