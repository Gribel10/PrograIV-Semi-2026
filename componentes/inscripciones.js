const inscripciones = {
    template: `
        <div class="card">
            <div class="card-header bg-info text-white">
                <h4>📋 Gestión de Inscripciones</h4>
            </div>
            <div class="card-body">
                <form @submit.prevent="guardar">
                    <input type="hidden" v-model="inscripcion.idInscripcion">
                    
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Código Alumno *</label>
                            <input type="text" class="form-control" v-model="inscripcion.codigo_alumno" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Materia *</label>
                            <input type="text" class="form-control" v-model="inscripcion.materia" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Fecha Inscripción *</label>
                            <input type="date" class="form-control" v-model="inscripcion.fecha_inscripcion" required>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Ciclo/Periodo</label>
                            <input type="text" class="form-control" v-model="inscripcion.ciclo_periodo">
                        </div>
                    </div>
                    
                    <div class="row g-3 mt-2">
                        <div class="col-md-12">
                            <label class="form-label">Observaciones</label>
                            <textarea class="form-control" v-model="inscripcion.observaciones" rows="2"></textarea>
                        </div>
                    </div>
                    
                    <div class="mt-3">
                        <button type="submit" class="btn btn-success">
                            {{ inscripcion.idInscripcion ? '✏️ Actualizar' : '💾 Guardar' }}
                        </button>
                        <button type="button" class="btn btn-secondary" @click="nuevo">➕ Nuevo</button>
                        <button type="button" class="btn btn-info" @click="mostrarBusqueda = !mostrarBusqueda">
                            {{ mostrarBusqueda ? '❌ Ocultar' : '🔍 Buscar' }}
                        </button>
                    </div>
                </form>

                <!-- TABLA DE BÚSQUEDA -->
                <div v-show="mostrarBusqueda" class="mt-4">
                    <hr>
                    <h5>Búsqueda de Inscripciones</h5>
                    
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" v-model="busqueda" 
                               @keyup="obtenerInscripciones" placeholder="Buscar...">
                        <button class="btn btn-outline-secondary" @click="obtenerInscripciones">🔍</button>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Código Alumno</th>
                                    <th>Materia</th>
                                    <th>Fecha</th>
                                    <th>Ciclo/Periodo</th>
                                    <th>Observaciones</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in inscripciones" :key="item.idInscripcion">
                                    <td>{{ item.codigo_alumno }}</td>
                                    <td>{{ item.materia }}</td>
                                    <td>{{ item.fecha_inscripcion }}</td>
                                    <td>{{ item.ciclo_periodo }}</td>
                                    <td>{{ item.observaciones }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="editar(item)">✏️</button>
                                        <button class="btn btn-sm btn-danger" @click="eliminar(item.idInscripcion)">🗑️</button>
                                    </td>
                                </tr>
                                <tr v-if="inscripciones.length === 0">
                                    <td colspan="6" class="text-center text-muted">No hay inscripciones registradas</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['forms'],
    data() {
        return {
            inscripcion: {
                idInscripcion: '',
                codigo_alumno: '',
                materia: '',
                fecha_inscripcion: new Date().toISOString().split('T')[0],
                ciclo_periodo: '',
                observaciones: ''
            },
            inscripciones: [],
            busqueda: '',
            mostrarBusqueda: false
        };
    },
    mounted() {
        console.log('✅ Componente Inscripciones montado');
        this.obtenerInscripciones();
    },
    methods: {
        async obtenerInscripciones() {
            try {
                if (this.busqueda === '') {
                    this.inscripciones = await selectAll('inscripciones');
                } else {
                    this.inscripciones = await selectAll(
                        'inscripciones', 
                        'codigo_alumno LIKE ? OR materia LIKE ?', 
                        [`%${this.busqueda}%`, `%${this.busqueda}%`]
                    );
                }
                console.log('Inscripciones cargadas:', this.inscripciones.length);
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error al cargar inscripciones');
            }
        },
        async guardar() {
            try {
                if (this.inscripcion.idInscripcion) {
                    await update('inscripciones', this.inscripcion, 'idInscripcion', this.inscripcion.idInscripcion);
                    alertify.success('✅ Inscripción actualizada');
                } else {
                    this.inscripcion.idInscripcion = uuid.v4();
                    await insert('inscripciones', this.inscripcion);
                    alertify.success('✅ Inscripción guardada');
                }
                this.nuevo();
                this.obtenerInscripciones();
            } catch (error) {
                console.error('Error:', error);
                alertify.error('❌ Error al guardar');
            }
        },
        editar(item) {
            this.inscripcion = { ...item };
            this.mostrarBusqueda = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        async eliminar(idInscripcion) {
            if (confirm('⚠️ ¿Eliminar esta inscripción?')) {
                try {
                    await deleteRecord('inscripciones', 'idInscripcion', idInscripcion);
                    alertify.success('✅ Inscripción eliminada');
                    this.obtenerInscripciones();
                } catch (error) {
                    console.error('Error:', error);
                    alertify.error('❌ Error al eliminar');
                }
            }
        },
        nuevo() {
            this.inscripcion = {
                idInscripcion: '',
                codigo_alumno: '',
                materia: '',
                fecha_inscripcion: new Date().toISOString().split('T')[0],
                ciclo_periodo: '',
                observaciones: ''
            };
        }
    }
};