// Esperar a que Vue.js se cargue completamente
window.addEventListener('DOMContentLoaded', function() {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                alumno: {
                    codigo: '',
                    nombre: '',
                    direccion: '',
                    municipio: '',
                    departamento: '',
                    telefono: '',
                    fechaNacimiento: '',
                    sexo: ''
                },
                alumnos: [],
                modoEdicion: false,
                codigoOriginal: '',
                busqueda: ''
            }
        },
        computed: {
            alumnosFiltrados() {
                if (this.busqueda === '') {
                    return this.alumnos;
                }
                
                const busquedaLower = this.busqueda.toLowerCase().trim();
                
                return this.alumnos.filter(alumno => {
                    return (
                        alumno.codigo.toLowerCase().includes(busquedaLower) ||
                        alumno.nombre.toLowerCase().includes(busquedaLower) ||
                        alumno.municipio.toLowerCase().includes(busquedaLower) ||
                        alumno.departamento.toLowerCase().includes(busquedaLower)
                    );
                });
            }
        },
        mounted() {
            this.cargarAlumnos();
        },
        methods: {
            guardarAlumno() {
                // Validar que no exista código duplicado (solo en modo nuevo)
                if (!this.modoEdicion) {
                    const existe = this.alumnos.find(a => 
                        a.codigo.trim().toUpperCase() === this.alumno.codigo.trim().toUpperCase()
                    );
                    
                    if (existe) {
                        alert(`El código del alumno ya existe: ${existe.nombre}`);
                        return;
                    }
                }

                // Crear copia del alumno
                const alumnoGuardar = { ...this.alumno };

                if (this.modoEdicion) {
                    // Actualizar alumno existente
                    const index = this.alumnos.findIndex(a => a.codigo === this.codigoOriginal);
                    if (index !== -1) {
                        this.alumnos[index] = alumnoGuardar;
                    }
                } else {
                    // Agregar nuevo alumno
                    this.alumnos.push(alumnoGuardar);
                }

                // Guardar en localStorage
                this.guardarEnLocalStorage();

                // Limpiar formulario
                this.limpiarFormulario();

                // Mostrar mensaje
                alert(this.modoEdicion ? 'Alumno actualizado exitosamente' : 'Alumno guardado exitosamente');
            },

            modificarAlumno(alumno) {
                this.alumno = { ...alumno };
                this.codigoOriginal = alumno.codigo;
                this.modoEdicion = true;
                
                // Scroll al formulario
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },

            eliminarAlumno(codigo) {
                const alumno = this.alumnos.find(a => a.codigo === codigo);
                
                if (confirm(`¿Está seguro de eliminar al alumno ${alumno.nombre}?`)) {
                    this.alumnos = this.alumnos.filter(a => a.codigo !== codigo);
                    this.guardarEnLocalStorage();
                    alert('Alumno eliminado exitosamente');
                }
            },

            limpiarFormulario() {
                this.alumno = {
                    codigo: '',
                    nombre: '',
                    direccion: '',
                    municipio: '',
                    departamento: '',
                    telefono: '',
                    fechaNacimiento: '',
                    sexo: ''
                };
                this.modoEdicion = false;
                this.codigoOriginal = '';
            },

            limpiarBusqueda() {
                this.busqueda = '';
            },

            cargarAlumnos() {
                const datosGuardados = localStorage.getItem('alumnos');
                if (datosGuardados) {
                    try {
                        this.alumnos = JSON.parse(datosGuardados);
                    } catch (error) {
                        console.error('Error al cargar datos:', error);
                        this.alumnos = [];
                    }
                }
            },

            guardarEnLocalStorage() {
                localStorage.setItem('alumnos', JSON.stringify(this.alumnos));
            }
        }
    }).mount('#app');
});