const busqueda_alumnos = {
    template: `
        <div class="card m-3">
            <div class="card-header bg-info text-white">
                <h4>🔍 Búsqueda de Alumnos</h4>
            </div>
            <div class="card-body">
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
                            <tr v-for="alumno in alumnos" :key="alumno.idAlumno">
                                <td>{{ alumno.codigo }}</td>
                                <td>{{ alumno.nombre }}</td>
                                <td>{{ alumno.direccion }}</td>
                                <td>{{ alumno.email }}</td>
                                <td>{{ alumno.telefono }}</td>
                                <td>
                                    <button class="btn btn-sm btn-warning" @click="$emit('modificar', alumno)">✏️</button>
                                    <button class="btn btn-sm btn-danger" @click="eliminar(alumno.idAlumno)">🗑️</button>
                                </td>
                            </tr>
                            <tr v-if="alumnos.length === 0">
                                <td colspan="6" class="text-center">No hay alumnos registrados</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    props: ['forms'],
    data() {
        return {
            alumnos: [],
            busqueda: ''
        };
    },
    mounted() {
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
            } catch (error) {
                console.error('Error:', error);
                alertify.error('Error al cargar alumnos');
            }
        },
        async eliminar(idAlumno) {
            if (confirm('¿Eliminar este alumno?')) {
                try {
                    await deleteRecord('alumnos', 'idAlumno', idAlumno);
                    alertify.success('Alumno eliminado correctamente');
                    this.obtenerAlumnos();
                } catch (error) {
                    console.error('Error:', error);
                    alertify.error('Error al eliminar');
                }
            }
        }
    }
};