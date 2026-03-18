<?php
include('../../Config/config.php');
extract($_REQUEST);

$matriculas = $matriculas ?? '[]';
$accion = $accion ?? '';

$class_matriculas = new matriculas($conexion);
echo json_encode($class_matriculas->recibir_datos($matriculas));

class matriculas{
    private $datos = [], $db, $respuesta=['msg'=>'ok'];

    public function __construct($conexion){
        $this->db = $conexion;
    }
    public function recibir_datos($matriculas){
        global $accion;
        if($accion==='consultar'){
            return $this->administrar_matriculas();
        }else if($accion==='eliminar'){
            $this->datos = json_decode($matriculas, true);
            return $this->administrar_matriculas();
        }else if($accion==='validar_alumno'){
            return $this->validar_alumno();
        }else{
            $this->datos = json_decode($matriculas, true);
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
        if(empty($this->datos['fecha_matricula'])){
            $this->respuesta['msg'] = 'La fecha de matricula es requerida';
        }
        if(empty($this->datos['pago'])){
            $this->respuesta['msg'] = 'El pago es requerido';
        }
        if(empty($this->datos['ciclo'])){
            $this->respuesta['msg'] = 'El ciclo es requerido';
        }
        return $this->administrar_matriculas();
    }
    private function administrar_matriculas(){
        global $accion;
        if($this->respuesta['msg']!=='ok'){
           return $this->respuesta;
        }
        if($accion==='nuevo'){
            return $this->db->consultaSQL('INSERT INTO matriculas (idMatricula, codigo_alumno, fecha_matricula, pago, ciclo, comprobante) VALUES (?, ?, ?, ?, ?, ?)',
            $this->datos['idMatricula'], $this->datos['codigo_alumno'], $this->datos['fecha_matricula'], $this->datos['pago'], $this->datos['ciclo'], $this->datos['comprobante']);
        }else if($accion==='modificar'){
            return $this->db->consultaSQL('UPDATE matriculas SET codigo_alumno = ?, fecha_matricula = ?, pago = ?, ciclo = ?, comprobante = ? WHERE idMatricula = ?',
            $this->datos['codigo_alumno'], $this->datos['fecha_matricula'], $this->datos['pago'], $this->datos['ciclo'], $this->datos['comprobante'], $this->datos['idMatricula']);
        }else if($accion==='eliminar'){
            return $this->db->consultaSQL('
                DELETE FROM matriculas 
                WHERE idMatricula = ?
            ',$this->datos['idMatricula']);
        }else if($accion==='consultar'){
            $this->db->consultaSQL('
                SELECT idMatricula, codigo_alumno, fecha_matricula, pago, ciclo, comprobante 
                FROM matriculas
            ');
            return $this->db->obtener_datos();
        }
    }
}
?>
