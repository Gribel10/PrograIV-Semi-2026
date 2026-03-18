const alumnos = {
    template: `
        <div class="card">
            <div class="card-header bg-primary text-white">
                <h4>👨‍🎓 Gestión de Alumnos</h4>
            </div>
            <div class="card-body">
                <form @submit.prevent="guardar">
                    <input type="hidden" v-model="alumno.idAlumno">
                    
                    <div class="row g-3">
                        <div class="col-md-2">
                            <label class="form-label">Código *</label>
                            <input type="text" class="form-control" v-model="alumno.codigo" required>
                        </div>
                        <div class="col-md-5">
                            <label class="form-label">Nombre *</label>
                            <input type="text" class="form-control" v-model="alumno.nombre" required>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Teléfono</label>
                            <input type="text" class="form-control" v-model="alumno.telefono">
                        </div>
                    </div>
                    
                    <div class="row g-3 mt-2">
                        <div class="col-md-6">
                            <label class="form-label">Dirección</label>
                            <input type="text" class="form-control" v-model="alumno.direccion">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" v-model="alumno.email">
                        </div>
                    </div>
                    
                    <div class="mt-3">
                        <button type="submit" class="btn btn-success">
                            {{ alumno.idAlumno ? '✏️ Actualizar' : '💾 Guardar' }}
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
                    <h5>Búsqueda de Alumnos</h5>
                    
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" v-model="busqueda" 
                               @keyup="obtenerAlumnos" placeholder="Buscar por código o nombre...">
                        <button class="btn btn-outline-secondary" @click="obtenerAlumnos">🔍</button>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>Código</th>
                                    <th>Nombre</th>
                                    <th>Dirección</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in alumnos" :key="item.idAlumno">
                                    <td>{{ item.codigo }}</td>
                                    <td>{{ item.nombre }}</td>
                                    <td>{{ item.direccion }}</td>
                                    <td>{{ item.email }}</td>
                                    <td>{{ item.telefono }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-warning" @click="editar(item)">✏️</button>
                                        <button class="btn btn-sm btn-danger" @click="eliminar(item.idAlumno)">🗑️</button>
                                    </td>
                                </tr>
                                <tr v-if="alumnos.length === 0">
                                    <td colspan="6" class="text-center text-muted">No hay alumnos registrados</td>
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
            alumno: {
                idAlumno: '',
                codigo: '',
                nombre: '',
                direccion: '',
                email: '',
                telefono: ''
            },
            alumnos: [],
            busqueda: '',
            mostrarBusqueda: false
        };
    },
    mounted() {
        console.log('✅ Componente Alumnos montado');
        this.obtenerAlumnos();
    },
    methods: {
        async obtenerAlumnos() {
            try {
                if (this.busqueda === '') {
                    this.alumnos = await selectAll('alumnos');
                } else {
                    this.alumnos = await selectAll(
                        'alumnos', 
                        'nombre LIKE ? OR codigo LIKE ?', 
                        [`%${this.busqueda}%`, `%${this.busqueda}%`]
                    );
                }
                console.log('Alumnos cargados:', this.alumnos.length);
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error al cargar alumnos');
            }
        },
        async guardar() {
            try {
                if (this.alumno.idAlumno) {
                    await update('alumnos', this.alumno, 'idAlumno', this.alumno.idAlumno);
                    alertify.success('✅ Alumno actualizado');
                } else {
                    this.alumno.idAlumno = uuid.v4();
                    await insert('alumnos', this.alumno);
                    alertify.success('✅ Alumno guardado');
                }
                this.nuevo();
                this.obtenerAlumnos();
            } catch (error) {
                console.error('Error:', error);
                alertify.error('❌ Error al guardar');
            }
        },
        editar(item) {
            this.alumno = { ...item };
            this.mostrarBusqueda = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        async eliminar(idAlumno) {
            if (confirm('⚠️ ¿Eliminar este alumno?')) {
                try {
                    await deleteRecord('alumnos', 'idAlumno', idAlumno);
                    alertify.success('✅ Alumno eliminado');
                    this.obtenerAlumnos();
                } catch (error) {
                    console.error('Error:', error);
                    alertify.error('❌ Error al eliminar');
                }
            }
        },
        nuevo() {
            this.alumno = {
                idAlumno: '',
                codigo: '',
                nombre: '',
                direccion: '',
                email: '',
                telefono: ''
            };
        }
    }
};