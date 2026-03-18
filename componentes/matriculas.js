const matriculas = {
    template: `
        <div class="card">
            <div class="card-header bg-warning text-dark">
                <h4>📝 Gestión de Matrículas</h4>
            </div>
            <div class="card-body">
                <form @submit.prevent="guardar">
                    <input type="hidden" v-model="matricula.idMatricula">
                    
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Código Alumno *</label>
                            <input type="text" class="form-control" v-model="matricula.codigo_alumno" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Fecha Matrícula *</label>
                            <input type="date" class="form-control" v-model="matricula.fecha_matricula" required>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Pago</label>
                            <input type="number" step="0.01" class="form-control" v-model="matricula.pago">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Ciclo *</label>
                            <select class="form-control" v-model="matricula.ciclo" required>
                                <option value="">Seleccione</option>
                                <option value="I-2025">I-2025</option>
                                <option value="II-2025">II-2025</option>
                                <option value="III-2025">III-2025</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <label class="form-label">Comprobante</label>
                            <input type="text" class="form-control" v-model="matricula.comprobante">
                        </div>
                    </div>
                    
                    <div class="mt-3">
                        <button type="submit" class="btn btn-success">
                            {{ matricula.idMatricula ? '✏️ Actualizar' : '💾 Guardar' }}
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
                    <h5>Búsqueda de Matrículas</h5>
                    
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" v-model="busqueda" 
                               @keyup="obtenerMatriculas" placeholder="Buscar...">
                        <button class="btn btn-outline-secondary" @click="obtenerMatriculas">🔍</button>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Código Alumno</th>
                                    <th>Fecha</th>
                                    <th>Pago</th>
                                    <th>Ciclo</th>
                                    <th>Comprobante</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in matriculas" :key="item.idMatricula">
                                    <td>{{ item.codigo_alumno }}</td>
                                    <td>{{ item.fecha_matricula }}</td>
                                    <td>\${{ parseFloat(item.pago || 0).toFixed(2) }}</td>
                                    <td>{{ item.ciclo }}</td>
                                    <td>{{ item.comprobante }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="editar(item)">✏️</button>
                                        <button class="btn btn-sm btn-danger" @click="eliminar(item.idMatricula)">🗑️</button>
                                    </td>
                                </tr>
                                <tr v-if="matriculas.length === 0">
                                    <td colspan="6" class="text-center text-muted">No hay matrículas registradas</td>
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
            matricula: {
                idMatricula: '',
                codigo_alumno: '',
                fecha_matricula: new Date().toISOString().split('T')[0],
                pago: 0,
                ciclo: '',
                comprobante: ''
            },
            matriculas: [],
            busqueda: '',
            mostrarBusqueda: false
        };
    },
    mounted() {
        console.log('✅ Componente Matrículas montado');
        this.obtenerMatriculas();
    },
    methods: {
        async obtenerMatriculas() {
            try {
                if (this.busqueda === '') {
                    this.matriculas = await selectAll('matriculas');
                } else {
                    this.matriculas = await selectAll(
                        'matriculas', 
                        'codigo_alumno LIKE ? OR ciclo LIKE ?', 
                        [`%${this.busqueda}%`, `%${this.busqueda}%`]
                    );
                }
                console.log('Matrículas cargadas:', this.matriculas.length);
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error al cargar matrículas');
            }
        },
        async guardar() {
            try {
                if (this.matricula.idMatricula) {
                    await update('matriculas', this.matricula, 'idMatricula', this.matricula.idMatricula);
                    alertify.success('✅ Matrícula actualizada');
                } else {
                    this.matricula.idMatricula = uuid.v4();
                    await insert('matriculas', this.matricula);
                    alertify.success('✅ Matrícula guardada');
                }
                this.nuevo();
                this.obtenerMatriculas();
            } catch (error) {
                console.error('Error:', error);
                alertify.error('❌ Error al guardar');
            }
        },
        editar(item) {
            this.matricula = { ...item };
            this.mostrarBusqueda = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        async eliminar(idMatricula) {
            if (confirm('⚠️ ¿Eliminar esta matrícula?')) {
                try {
                    await deleteRecord('matriculas', 'idMatricula', idMatricula);
                    alertify.success('✅ Matrícula eliminada');
                    this.obtenerMatriculas();
                } catch (error) {
                    console.error('Error:', error);
                    alertify.error('❌ Error al eliminar');
                }
            }
        },
        nuevo() {
            this.matricula = {
                idMatricula: '',
                codigo_alumno: '',
                fecha_matricula: new Date().toISOString().split('T')[0],
                pago: 0,
                ciclo: '',
                comprobante: ''
            };
        }
    }
};