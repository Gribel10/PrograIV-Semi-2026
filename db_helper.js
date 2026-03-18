// db_helper.js - Helper para manejar SQLite en el navegador

let db = null;
let SQL = null;

// Inicializar la base de datos
async function initDatabase() {
    try {
        // Cargar sql.js
        SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        // Intentar cargar BD desde localStorage
        const savedDb = localStorage.getItem('db_academica');
        
        if (savedDb) {
            // Restaurar BD existente
            const uint8Array = new Uint8Array(JSON.parse(savedDb));
            db = new SQL.Database(uint8Array);
            console.log('✅ Base de datos cargada desde localStorage');
        } else {
            // Crear nueva BD
            db = new SQL.Database();
            console.log('✅ Nueva base de datos creada');
            createTables();
        }
        
        return db;
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
}

// Crear las tablas
function createTables() {
    const queries = [
        // Tabla Alumnos
        `CREATE TABLE IF NOT EXISTS alumnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idAlumno TEXT UNIQUE NOT NULL,
            codigo TEXT NOT NULL,
            nombre TEXT NOT NULL,
            direccion TEXT,
            email TEXT,
            telefono TEXT
        )`,
        
        // Tabla Materias
        `CREATE TABLE IF NOT EXISTS materias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idMateria TEXT UNIQUE NOT NULL,
            codigo TEXT NOT NULL,
            nombre TEXT NOT NULL,
            uv INTEGER
        )`,
        
        // Tabla Docentes
        `CREATE TABLE IF NOT EXISTS docentes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idDocente TEXT UNIQUE NOT NULL,
            codigo TEXT NOT NULL,
            nombre TEXT NOT NULL,
            direccion TEXT,
            email TEXT,
            telefono TEXT,
            escalafon TEXT
        )`,
        
        // Tabla Matrículas
        `CREATE TABLE IF NOT EXISTS matriculas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idMatricula TEXT UNIQUE NOT NULL,
            codigo_alumno TEXT NOT NULL,
            fecha_matricula TEXT NOT NULL,
            pago REAL,
            ciclo TEXT,
            comprobante TEXT
        )`,
        
        // Tabla Inscripciones
        `CREATE TABLE IF NOT EXISTS inscripciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idInscripcion TEXT UNIQUE NOT NULL,
            codigo_alumno TEXT NOT NULL,
            materia TEXT NOT NULL,
            fecha_inscripcion TEXT NOT NULL,
            ciclo_periodo TEXT,
            observaciones TEXT
        )`
    ];
    
    queries.forEach(query => {
        db.run(query);
    });
    
    saveDatabase();
    console.log('✅ Tablas creadas correctamente');
}

// Guardar la BD en localStorage
function saveDatabase() {
    if (!db) return;
    
    const data = db.export();
    const array = Array.from(data);
    localStorage.setItem('db_academica', JSON.stringify(array));
}

// Ejecutar una consulta
function executeQuery(query, params = []) {
    if (!db) {
        console.error('❌ Base de datos no inicializada');
        return null;
    }
    
    try {
        const stmt = db.prepare(query);
        stmt.bind(params);
        
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        
        saveDatabase(); // Guardar después de cada operación
        return results;
    } catch (error) {
        console.error('❌ Error en executeQuery:', error);
        throw error;
    }
}

// Ejecutar INSERT/UPDATE/DELETE
function executeUpdate(query, params = []) {
    if (!db) {
        console.error('❌ Base de datos no inicializada');
        return false;
    }
    
    try {
        db.run(query, params);
        saveDatabase();
        return true;
    } catch (error) {
        console.error('❌ Error en executeUpdate:', error);
        throw error;
    }
}

// Funciones CRUD genéricas

// SELECT
async function selectAll(table, where = '', params = []) {
    const query = where 
        ? `SELECT * FROM ${table} WHERE ${where}`
        : `SELECT * FROM ${table}`;
    return executeQuery(query, params);
}

// INSERT
async function insert(table, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    return executeUpdate(query, values);
}

// UPDATE
async function update(table, data, idColumn, idValue) {
    const setClause = Object.keys(data)
        .map(key => `${key} = ?`)
        .join(', ');
    const values = [...Object.values(data), idValue];
    
    const query = `UPDATE ${table} SET ${setClause} WHERE ${idColumn} = ?`;
    return executeUpdate(query, values);
}

// DELETE
async function deleteRecord(table, idColumn, idValue) {
    const query = `DELETE FROM ${table} WHERE ${idColumn} = ?`;
    return executeUpdate(query, [idValue]);
}

// Exportar BD como archivo
function exportDatabase() {
    const data = db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'db_academica.sqlite';
    a.click();
    
    URL.revokeObjectURL(url);
    alertify.success('Base de datos exportada');
}

// Importar BD desde archivo
function importDatabase(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        db = new SQL.Database(uint8Array);
        saveDatabase();
        alertify.success('Base de datos importada correctamente');
        location.reload(); // Recargar la página
    };
    
    reader.readAsArrayBuffer(file);
}

// Limpiar toda la BD
function clearDatabase() {
    if (confirm('⚠️ ¿Está seguro de eliminar TODA la base de datos?')) {
        localStorage.removeItem('db_academica');
        location.reload();
    }
}