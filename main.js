const { createApp } = Vue;
const sha256 = CryptoJS.SHA256;

let dbReady = false;

initDatabase().then(() => {
    dbReady = true;
    console.log('✅ Base de datos lista');
    
    const app = createApp({
        components:{
            alumnos,
            materias,
            docentes,
            inscripciones,
            matriculas
        },
        data(){
            return{
                forms:{
                    alumnos:{mostrar:false},
                    materias:{mostrar:false},
                    docentes:{mostrar:false},
                    matriculas:{mostrar:false},
                    inscripciones:{mostrar:false}
                }
            }
        },
        methods:{
            abrirVentana(ventana){
                console.log('Abriendo ventana:', ventana);
                
                // Cerrar TODAS las ventanas primero
                Object.keys(this.forms).forEach(key => {
                    this.forms[key].mostrar = false;
                });
                
                // Abrir SOLO la ventana seleccionada
                this.forms[ventana].mostrar = true;
                
                console.log('Estado actual:', this.forms);
            },
            exportarDB(){
                exportDatabase();
            },
            limpiarDB(){
                clearDatabase();
            }
        },
        mounted(){
            console.log('✅ App montada');
            // Abrir Alumnos por defecto
            this.abrirVentana('alumnos');
        }
    });

    // Registrar directiva (solo si existe)
    if (typeof vDraggable !== 'undefined') {
        app.directive('draggable', vDraggable);
    }

    app.mount("#app");
    
}).catch(error => {
    console.error('❌ Error al inicializar:', error);
    alert('Error al cargar la base de datos');
});