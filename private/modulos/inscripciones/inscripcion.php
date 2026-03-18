<?php
include('../../Config/config.php');
extract($_REQUEST);

$inscripciones = $inscripciones ?? '[]';
$accion = $accion ?? '';

$class_inscripciones = new inscripciones($conexion);
echo json_encode($class_inscripciones->recibir_datos($inscripciones));

class inscripciones{
    private $datos = [], $db, $respuesta=['msg'=>'ok'];

    public function __construct($conexion){
        $this->db = $conexion;
    }
    public function recibir_datos($inscripciones){
        global $accion;
        if($accion==='consultar'){
            return $this->administrar_inscripciones();
        }else if($accion==='eliminar'){
            $this->datos = json_decode($inscripciones, true);
            return $this->administrar_inscripciones();
        }else if($accion==='validar_alumno'){
            return $this->validar_alumno();
        }else{
            $this->datos = json_decode($inscripciones, true);
            return $this->validar_datos();
        }
    }
    private function validar_alumno(){
        global $codigo;
        $codigo = $codigo ?? '';
        $this->db->consultaSQL('SELECT idAlumno FROM alumnos WHERE codigo = ?', $codigo);
        $resultado = $this->db->obtener_datos();
        if(count($resultado) > 0){
            return true;
        }
        return false;
    }
    private function validar_datos(){
        if(empty($this->datos['codigo_alumno'])){
            $this->respuesta['msg'] = 'El codigo del alumno es requerido';
        }
        if(empty($this->datos['materia'])){
            $this->respuesta['msg'] = 'La materia es requerida';
        }
        if(empty($this->datos['fecha_inscripcion'])){
            $this->respuesta['msg'] = 'La fecha de inscripcion es requerida';
        }
        if(empty($this->datos['ciclo_periodo'])){
            $this->respuesta['msg'] = 'El ciclo/periodo es requerido';
        }
        return $this->administrar_inscripciones();
    }
    private function administrar_inscripciones(){
        global $accion;
        if($this->respuesta['msg']!=='ok'){
           return $this->respuesta;
        }
        if($accion==='nuevo'){
            return $this->db->consultaSQL('INSERT INTO inscripciones (idInscripcion, codigo_alumno, materia, fecha_inscripcion, ciclo_periodo, observaciones) VALUES (?, ?, ?, ?, ?, ?)',
            $this->datos['idInscripcion'], $this->datos['codigo_alumno'], $this->datos['materia'], $this->datos['fecha_inscripcion'], $this->datos['ciclo_periodo'], $this->datos['observaciones']);
        }else if($accion==='modificar'){
            return $this->db->consultaSQL('UPDATE inscripciones SET codigo_alumno = ?, materia = ?, fecha_inscripcion = ?, ciclo_periodo = ?, observaciones = ? WHERE idInscripcion = ?',
            $this->datos['codigo_alumno'], $this->datos['materia'], $this->datos['fecha_inscripcion'], $this->datos['ciclo_periodo'], $this->datos['observaciones'], $this->datos['idInscripcion']);
        }else if($accion==='eliminar'){
            return $this->db->consultaSQL('
                DELETE FROM inscripciones 
                WHERE idInscripcion = ?
            ',$this->datos['idInscripcion']);
        }else if($accion==='consultar'){
            $this->db->consultaSQL('
                SELECT i.idInscripcion, i.codigo_alumno, i.materia, i.fecha_inscripcion, i.ciclo_periodo, i.observaciones, a.nombre as nombre_alumno 
                FROM inscripciones i
                LEFT JOIN alumnos a ON i.codigo_alumno = a.codigo
            ');
            return $this->db->obtener_datos();
        }
    }
}

?>
