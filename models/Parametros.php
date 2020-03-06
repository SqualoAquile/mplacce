<?php
class Parametros extends model {

    protected $table;
    protected $permissoes;
    
    public function __construct() {
        $this->permissoes = new Permissoes();
    }

    public function indexOriginal() {

        $sql = "SHOW TABLES";
        $sql = self::db()->query($sql);
        $tabelas = $sql->fetchAll();

        $infosTabelas = [];
        foreach ($tabelas as $key => $value) {

            $sqlB = "SHOW TABLE STATUS WHERE Name='" . $value[0] . "'";
            $sqlB = self::db()->query($sqlB);
            $infoTabela = $sqlB->fetchAll();

            foreach ($infoTabela as $key => $value) {

                $infoTabela[$key]["Comment"] = json_decode($value["Comment"], true);
            }

            array_push($infosTabelas, $infoTabela);
        }

        return $infosTabelas;
    }
    
    public function index() {
        $sql = "SHOW TABLES";
        $sql = self::db()->query($sql);
        $tabelas = $sql->fetchAll();
        // print_r($tabelas); exit;
        $infosTabelas = [];
        foreach ($tabelas as $key => $value) {
            $sqlB = "SHOW TABLE STATUS WHERE Name='" . $value[0] . "'";
            $sqlB = self::db()->query($sqlB);
            $infoTabela = $sqlB->fetchAll();
            // print_r($infoTabela); exit;
            foreach ($infoTabela as $key => $value) {
                $infoTabela[$key]["Comment"] = json_decode($value["Comment"], true);
                
                if( isset($infoTabela[$key]["Comment"]) && !empty($infoTabela[$key]["Comment"]) ){
                    if( array_key_exists('info_relacao', $infoTabela[$key]["Comment"] )){

                        // buscar na tabela relacionada os valores que vão ser usados no select
                        $tabela =  lcfirst($infoTabela[$key]["Comment"]["info_relacao"]["tabela"]);
                        $campo = lcfirst($infoTabela[$key]["Comment"]["info_relacao"]["campo"]);
                        $lista = array();
                        // echo '<br><br> tabela --- '. $value[0] .' <br><br>';
                        // echo '<br><br>'. $tabela. ' ---- ' . $campo . '<br><br>';
                        if( !empty($tabela) && !empty($campo) ){

                            $sql = "SELECT id, ". $campo ." FROM  ". $tabela ." WHERE situacao = 'ativo'";      
                            $sql = self::db()->query($sql);

                            if($sql->rowCount()>0){
                                $arrayAux = $sql->fetchAll(PDO::FETCH_ASSOC); 

                                foreach ($arrayAux as $chave => $valor){
                                    $lista[] = [
                                        "id" => $valor["id"], 
                                        "$campo" => trim(ucwords($valor["$campo"]))
                                    ];
                                }

                                $infoTabela[$key]["Comment"]['info_relacao']['resultado'] = $lista;
                            }

                        }else{
                            $infoTabela[$key]["Comment"]['info_relacao']['resultado'] = $lista;
                        }
                    }
                }
                
            }
            
            array_push($infosTabelas, $infoTabela);
        }
        // print_r($infosTabelas); exit;
        return $infosTabelas;
    }
    

    public function listar($request) {
        
        $this->table = $request["tabela"];

        $value_sql = "";
        if ($request["value"] && $request["campo"]) {

            $value = trim($request["value"]);
            $value = addslashes($value);
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);

            $value_sql = " AND " . $campo . " LIKE '%" . $value . "%'";
        }

        $sql = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo'" . $value_sql;

        $sql = self::db()->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarDependente($request) {

        $this->table = $request["tabela"];

        $value_sql = "";
        if ($request["value"] && $request["campo"]) {

            $value = trim($request["value"]);
            $value = addslashes($value);
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);

            $value_sql = " AND " . $campo . " LIKE '%" . $value . "%'";
        }

        $chaveext = $request["chaveext"];
        $idchaveext = $request["idtabfonte"];

        $where = " WHERE $chaveext=$idchaveext AND situacao = 'ativo' ";

        $sql = "SELECT * FROM " . $this->table . $where . $value_sql;

        // echo $sql; exit;
        $sql = self::db()->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarDoiscampos($request) {

        $sql = "SELECT * FROM " . $request["tabela"] . " WHERE situacao = 'ativo'";

        $sql = self::db()->query($sql);
        
        return $sql->fetchAll(PDO::FETCH_ASSOC);
    }

    public function adicionar($request) {
        // print_r($request); exit;
        $this->table = $request["tabela"];
        
        if(empty($request['chaveext']) && empty($request['idtabfonte']) ){
            if ($request["value"] && $request["campo"]) {
                $value = trim($request["value"]);
                $value = addslashes($value);
                
                $campo = trim($request["campo"]);
                $campo = addslashes($campo);
            }
        }else{
            if ($request["value"] && $request["campo"]) {
                $valuuAux = trim($request["value"]);
                $valuuAux = addslashes($valuuAux);

                $value = `'`.trim($request["idtabfonte"])."','".$valuuAux.`'`;                
                
                $campoAux = trim($request["campo"]);
                $campoAux = addslashes($campoAux);

                $campo = trim($request["chaveext"]).','.$campoAux;
                
            }
        }    
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
        $sql = "INSERT INTO " . $this->table . " (" . $campo . ", alteracoes, situacao) VALUES ('" . $value . "', '" . $alteracoes . "', 'ativo')";
        
        // echo $sql; exit;
        self::db()->query($sql);
        return self::db()->errorInfo();
    }

    public function adicionarDoisCampos($request) {

        $this->table = $request["tabela"];

        if ($request["value1"] && $request["campo1"]) {

            $value1 = trim($request["value1"]);
            $value1 = addslashes($value1);
            
            $campo1 = trim($request["campo1"]);
            $campo1 = addslashes($campo1);
        }

        if ($request["value2"] && $request["campo2"]) {

            $value2 = trim($request["value2"]);
            $value2 = addslashes($value2);
            
            $campo2 = trim($request["campo2"]);
            $campo2 = addslashes($campo2);
        }

        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

        $sql = "INSERT INTO " . $this->table . " (" . $campo1 . ", " . $campo2 . ", alteracoes, situacao) VALUES ('" . $value1 . "', '" . $value2 . "', '" . $alteracoes . "', 'ativo')";
        
        self::db()->query($sql);

        return self::db()->errorInfo();
    }

    public function excluir($request, $id) {

        $this->table = $request["tabela"];

        $id = addslashes(trim($id));

        $sql = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
        $sql = self::db()->query($sql);

        if ($sql->rowCount() > 0) {
            
            $sql = $sql->fetch();
            $palter = $sql["alteracoes"];

            $ipcliente = $this->permissoes->pegaIPcliente();
            $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

            $sqlA = "UPDATE ". $this->table ." SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id' ";
            // echo $sqlA; exit;
            self::db()->query($sqlA);
        }

        return self::db()->errorInfo();
    }

    public function editar($request, $id) {
        
        $this->table = $request["tabela"];

        if ($request["value"] && $request["campo"]) {
            $value = trim($request["value"]);
            $value = addslashes($value);
            
            $campo = trim($request["campo"]);
            $campo = addslashes($campo);
        }
        
        $id = addslashes(trim($id));

        $sqlW = "SELECT $campo, alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
        $sqlW = self::db()->query($sqlW);

        if ($sqlW->rowCount() > 0) {
            
            $sqlW = $sqlW->fetch();
            $palter = $sqlW["alteracoes"];
            $valorAntigo = $sqlW[$campo];

            $ipcliente = $this->permissoes->pegaIPcliente();
            $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> de ($valorAntigo) para ($value)";

            $sql = "UPDATE " . $this->table . " SET " . $campo . " = '" . $value . "', alteracoes = '$palter' WHERE id='" . $id . "'";
            self::db()->query($sql);
            return self::db()->errorInfo();
        } 
    }

    public function editarDoisCampos($request, $id) {
        
        $this->table = $request["tabela"];
        
        if ($request["value1"] && $request["campo1"]) {
            $value1 = trim($request["value1"]);
            $value1 = addslashes($value1);
            
            $campo1 = trim($request["campo1"]);
            $campo1 = addslashes($campo1);
        }

        if ($request["value2"] && $request["campo2"]) {
            $value2 = trim($request["value2"]);
            $value2 = addslashes($value2);
            
            $campo2 = trim($request["campo2"]);
            $campo2 = addslashes($campo2);
        }

        $id = addslashes(trim($id));
        $sql = "UPDATE " . $this->table . " SET " . $campo1 . " = '" . $value1 . "', " . $campo2 . " = '" . $value2 . "' WHERE id='" . $id . "'";
             
        self::db()->query($sql);
        return self::db()->errorInfo();
    }

    public function pegarFixos() {

        $this->table = "parametros";
        
        $sql = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo'";
        $sql = self::db()->query($sql);
        $result = $sql->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as $key => $value) {
            $result[$key]["comentarios"] = json_decode($value["comentarios"], true);
        }
        
        return $result;
    }

    public function editarFixos($request, $id) {
        
        $this->table = "parametros";

        $ipcliente = $this->permissoes->pegaIPcliente();
        $hist = explode("##", addslashes($request['alteracoes']));

        if(!empty($hist[1])){ 
            $alteracoes = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$hist[1];     
        }

        $value = "";
        if ($request["value"]) {
            $value = trim($request["value"]);
            $value = addslashes($value);
        }

        $id = addslashes(trim($id));

        $update = "UPDATE " . $this->table . " SET valor = '" . $value . "', alteracoes = '" . $alteracoes . "' WHERE id='" . $id . "'";
             
        $update = self::db()->query($update);

        $erro = self::db()->errorInfo();

        if (empty($erro[2])){
            $select = "SELECT * FROM " . $this->table . " WHERE situacao = 'ativo' AND id = '" . $id . "'";
            $select = self::db()->query($select);
            $select = $select->fetch(PDO::FETCH_ASSOC);
        }

        return [
            "result" => $select,
            "erro" => $erro
        ];

    }

    public function buscaParametros(){
        $result = array();
        
        $sql = "SELECT parametro, valor FROM parametros WHERE situacao = 'ativo'";
        $sql = self::db()->query($sql);

        if ($sql->rowCount() > 0) {

            $sql = $sql->fetchAll(PDO::FETCH_ASSOC);         
            foreach ($sql as $key => $value) {
                $result[ $value['parametro'] ] = $value['valor'];
            }
        }
        return $result;

    }

    ///PLANO DE CONTAS NÍVEL 1
    public function buscaTodosNivel1(){
        $array = array();
        $sql1 = "SELECT * FROM `contabeisnivel1` WHERE situacao = 'ativo'";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[$value["id"]] = array(
                    "id" => $value["id"],
                    "movimentacao" => $value["movimentacao"],
                    "nome" => $value["nome"]
                );     
            }

        }

        $array = $nomes;

       return $array;
    }

    public function buscaNivel1($request){
        $movimentacao = addslashes($request['mov']);
        $termo = $request['term'];
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `contabeisnivel1` WHERE situacao = 'ativo' AND movimentacao = '$movimentacao' AND nome LIKE '%$termo%' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "label" => $value["nome"],
                    "value" => $value["nome"]
                );     
            }

        }

        $array = $nomes;

       return $array;
    }
    public function confereTermoNivel1($request){
        $movimentacao = addslashes($request['mov']);
        $termo = $request['term'];
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `contabeisnivel1` WHERE situacao = 'ativo' AND movimentacao = '$movimentacao' AND nome ='$termo'";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "value" => $value["nome"]
                );     
            }
        }

        $array = $nomes;

       return $array;
    }
    public function adicionaNivel1($request){
        $movimentacao = addslashes($request['movimentacao']);
        $termo = ucwords( addslashes($request['conta']) );
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
        $array = array();
        // 
        $sql1 = "INSERT INTO contabeisnivel1 (id, movimentacao, nome, alteracoes, situacao) VALUES (DEFAULT,'$movimentacao','$termo','$alteracoes','ativo')";

        $sql1 = self::db()->query($sql1);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            return true;
        } else {
            return false;
        }
    }
    public function editaNivel1($request){
        $movimentacao = addslashes($request['movimentacao']);
        $termo = ucwords( addslashes($request['conta']) );
        $dataanterior = ucwords( addslashes($request['dataanterior']) );
        $idconta = addslashes($request['idconta']);

        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EDIÇÃO >> de ( $dataanterior ) para ( $termo )";
         
        $sql1 = "UPDATE contabeisnivel1 SET nome='$termo',  alteracoes=CONCAT(alteracoes,' | ', '$alteracoes')WHERE id='$idconta'";
        // print_r($sql1); exit;
        $sql1 = self::db()->query($sql1);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            return true;
        } else {
            return false;
        }
    }
    public function excluiNivel1($request){
        $idconta = addslashes($request['idconta']);
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";
        $array = array();
        // 
        $sql1 = "UPDATE contabeisnivel1 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE id='$idconta'";
        
        $sql2 = "UPDATE contabeisnivel2 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE nivel1='$idconta'";
        
        $sql3 = "UPDATE contabeisnivel3 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE nivel1='$idconta'";

        $sql4 = "UPDATE contabeisnivel4 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE nivel1='$idconta'";
        
        // print_r($sql1); 
        self::db()->query('START TRANSACTION;');
        self::db()->query($sql1);
        $erro1 = self::db()->errorInfo();
        
        self::db()->query($sql2);
        $erro2 = self::db()->errorInfo();

        self::db()->query($sql3);
        $erro3 = self::db()->errorInfo();

        self::db()->query($sql4);
        $erro3 = self::db()->errorInfo();
        
        if ( empty($erro1[2]) && empty($erro2[2]) && empty($erro3[2]) && empty($erro4[2]) ){
            self::db()->query('COMMIT;'); 
            return true;
          
        } else {
            self::db()->query('ROLLBACK;');
            return false;
        }
    }
    ///PLANO DE CONTAS NÍVEL 2
    public function buscaTodosNivel2(){
        $array = array();
        $sql1 = "SELECT * FROM `contabeisnivel2` WHERE situacao = 'ativo'";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[$value["id"]] = array(
                    "id" => $value["id"],
                    "movimentacao" => $value["movimentacao"],
                    "nome" => $value["nome"]
                );     
            }

        }

        $array = $nomes;

       return $array;
    }

    public function buscaNivel2($request){
        $movimentacao = addslashes($request['mov']);
        $nivel1 = addslashes($request['nivel1']);
        $termo = $request['term'];
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `contabeisnivel2` WHERE situacao = 'ativo' AND movimentacao = '$movimentacao' AND nivel1 = '$nivel1' AND nome LIKE '%$termo%' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "label" => $value["nome"],
                    "value" => $value["nome"]
                );     
            }

        }

        $array = $nomes;

       return $array;
    }
    public function confereTermoNivel2($request){
        $movimentacao = addslashes($request['mov']);
        $nivel1 = addslashes($request['nivel1']);
        $termo = $request['term'];
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `contabeisnivel2` WHERE situacao = 'ativo' AND movimentacao = '$movimentacao' AND nivel1 = '$nivel1' AND nome = '$termo' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "value" => $value["nome"]
                );     
            }
        }

        $array = $nomes;

       return $array;
    }
    public function adicionaNivel2($request){
        $movimentacao = addslashes($request['movimentacao']);
        $nivel1 = addslashes($request['nivel1']);
        $termo = ucwords( addslashes( $request['conta'] ));
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

        $sql1 = "INSERT INTO contabeisnivel2 (id, movimentacao, nivel1, nome, alteracoes, situacao) VALUES (DEFAULT,'$movimentacao','$nivel1','$termo','$alteracoes','ativo')";

        $sql1 = self::db()->query($sql1);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            return true;
        } else {
            return false;
        }
    }
    public function editaNivel2($request){
        $movimentacao = addslashes($request['movimentacao']);
        $nivel1 = addslashes($request['nivel1']);
        $termo = ucwords( addslashes($request['conta']) );
        $dataanterior = ucwords( addslashes($request['dataanterior']) );
        $idconta = addslashes($request['idconta']);

        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EDIÇÃO >> de ( $dataanterior ) para ( $termo )";
         
        $sql1 = "UPDATE contabeisnivel2 SET nome='$termo',  alteracoes=CONCAT(alteracoes,' | ', '$alteracoes')WHERE id='$idconta'";
        // print_r($sql1); exit;
        $sql1 = self::db()->query($sql1);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            return true;
        } else {
            return false;
        }
    }
    public function excluiNivel2($request){
        $idconta = addslashes($request['idconta']);
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";
        $array = array();
        // 
        $sql1 = "UPDATE contabeisnivel2 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE id='$idconta'";
        
        $sql2 = "UPDATE contabeisnivel3 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE nivel2='$idconta'";

        $sql3 = "UPDATE contabeisnivel4 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE nivel2='$idconta'";
        
        // print_r($sql1); 
        self::db()->query('START TRANSACTION;');
        self::db()->query($sql1);
        $erro1 = self::db()->errorInfo();
        
        self::db()->query($sql2);
        $erro2 = self::db()->errorInfo();

        self::db()->query($sql3);
        $erro3 = self::db()->errorInfo();
        
        if ( empty($erro1[2]) && empty($erro2[2]) && empty($erro3[2]) ){
            self::db()->query('COMMIT;'); 
            return true;
          
        } else {
            self::db()->query('ROLLBACK;');
            return false;
        }
    }

    ///PLANO DE CONTAS NÍVEL 3
    public function buscaTodosNivel3(){
        $array = array();
        $sql1 = "SELECT * FROM `contabeisnivel3` WHERE situacao = 'ativo'";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[$value["id"]] = array(
                    "id" => $value["id"],
                    "movimentacao" => $value["movimentacao"],
                    "nome" => $value["nome"]
                );     
            }

        }

        $array = $nomes;

       return $array;
    }

    public function buscaNivel3($request){
        $movimentacao = addslashes($request['mov']);
        $nivel1 = addslashes($request['nivel1']);
        $nivel2 = addslashes($request['nivel2']);
        $termo = $request['term'];
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `contabeisnivel3` WHERE situacao = 'ativo' AND movimentacao = '$movimentacao' AND nivel1 = '$nivel1' AND nivel2 = '$nivel2' AND nome LIKE '%$termo%' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "label" => $value["nome"],
                    "value" => $value["nome"]
                );     
            }

        }

        $array = $nomes;

       return $array;
    }
    public function confereTermoNivel3($request){
        $movimentacao = addslashes($request['mov']);
        $nivel1 = addslashes($request['nivel1']);
        $nivel2 = addslashes($request['nivel2']);
        $termo = $request['term'];
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `contabeisnivel3` WHERE situacao = 'ativo' AND movimentacao = '$movimentacao' AND nivel1 = '$nivel1' AND nivel2 = '$nivel2' AND nome LIKE '%$termo%' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "value" => $value["nome"]
                );     
            }
        }

        $array = $nomes;

       return $array;
    }
    public function adicionaNivel3($request){
        $movimentacao = addslashes($request['movimentacao']);
        $nivel1 = addslashes($request['nivel1']);
        $nivel2 = addslashes($request['nivel2']);
        $termo = ucwords( addslashes( $request['conta'] ));
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

        $sql1 = "INSERT INTO contabeisnivel3 (id, movimentacao, nivel1, nivel2, nome, alteracoes, situacao) VALUES (DEFAULT,'$movimentacao','$nivel1','$nivel2','$termo','$alteracoes','ativo')";
        // print_r($sql1); exit;

        $sql1 = self::db()->query($sql1);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            return true;
        } else {
            return false;
        }
    }
    public function editaNivel3($request){
        $movimentacao = addslashes($request['movimentacao']);
        $nivel1 = addslashes($request['nivel1']);
        $nivel2 = addslashes($request['nivel2']);
        $termo = ucwords( addslashes($request['conta']) );
        $dataanterior = ucwords( addslashes($request['dataanterior']) );
        $idconta = addslashes($request['idconta']);

        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EDIÇÃO >> de ( $dataanterior ) para ( $termo )";
         
        $sql1 = "UPDATE contabeisnivel3 SET nome='$termo',  alteracoes=CONCAT(alteracoes,' | ', '$alteracoes')WHERE id='$idconta'";
        // print_r($sql1); exit;
        $sql1 = self::db()->query($sql1);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            return true;
        } else {
            return false;
        }
    }
    public function excluiNivel3($request){
        $idconta = addslashes($request['idconta']);
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";
        $array = array();
        // 
        $sql1 = "UPDATE contabeisnivel3 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE id='$idconta'";

        $sql2 = "UPDATE contabeisnivel4 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE nivel3='$idconta'";
        
        // print_r($sql1); 
        self::db()->query('START TRANSACTION;');
        self::db()->query($sql1);
        $erro1 = self::db()->errorInfo();
        
        self::db()->query($sql2);
        $erro2 = self::db()->errorInfo();
        
        if ( empty($erro1[2]) && empty($erro2[2]) ){
            self::db()->query('COMMIT;'); 
            return true;
          
        } else {
            self::db()->query('ROLLBACK;');
            return false;
        }
    }

    ///PLANO DE CONTAS NÍVEL 4
    public function buscaNivel4($request){
        $movimentacao = addslashes($request['mov']);
        $nivel1 = addslashes($request['nivel1']);
        $nivel2 = addslashes($request['nivel2']);
        $nivel3 = addslashes($request['nivel3']);
        $termo = $request['term'];
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `contabeisnivel4` WHERE situacao = 'ativo' AND movimentacao = '$movimentacao' AND nivel1 = '$nivel1' AND nivel2 = '$nivel2' AND nivel3 = '$nivel3' AND nome LIKE '%$termo%' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "label" => $value["nome"],
                    "value" => $value["nome"]
                );     
            }

        }

        $array = $nomes;

       return $array;
    }
    public function confereTermoNivel4($request){
        $movimentacao = addslashes($request['mov']);
        $nivel1 = addslashes($request['nivel1']);
        $nivel2 = addslashes($request['nivel2']);
        $nivel3 = addslashes($request['nivel3']);
        $termo = $request['term'];
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `contabeisnivel4` WHERE situacao = 'ativo' AND movimentacao = '$movimentacao' AND nivel1 = '$nivel1' AND nivel2 = '$nivel2' AND nivel3 = '$nivel3' AND nome LIKE '%$termo%' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "value" => $value["nome"]
                );     
            }
        }

        $array = $nomes;

       return $array;
    }
    public function adicionaNivel4($request){
        $movimentacao = addslashes($request['movimentacao']);
        $nivel1 = addslashes($request['nivel1']);
        $nivel2 = addslashes($request['nivel2']);
        $nivel3 = addslashes($request['nivel3']);
        $termo = ucwords( addslashes( $request['conta'] ));
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

        $sql1 = "INSERT INTO contabeisnivel4 (id, movimentacao, nivel1, nivel2, nivel3, nome, alteracoes, situacao) VALUES (DEFAULT,'$movimentacao','$nivel1','$nivel2','$nivel3','$termo','$alteracoes','ativo')";
        // print_r($sql1); exit;

        $sql1 = self::db()->query($sql1);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            return true;
        } else {
            return false;
        }
    }
    public function editaNivel4($request){
        $movimentacao = addslashes($request['movimentacao']);
        $nivel1 = addslashes($request['nivel1']);
        $nivel2 = addslashes($request['nivel2']);
        $nivel3 = addslashes($request['nivel3']);
        $termo = ucwords( addslashes($request['conta']) );
        $dataanterior = ucwords( addslashes($request['dataanterior']) );
        $idconta = addslashes($request['idconta']);

        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EDIÇÃO >> de ( $dataanterior ) para ( $termo )";
         
        $sql1 = "UPDATE contabeisnivel4 SET nome='$termo',  alteracoes=CONCAT(alteracoes,' | ', '$alteracoes')WHERE id='$idconta'";
        // print_r($sql1); exit;
        $sql1 = self::db()->query($sql1);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            return true;
        } else {
            return false;
        }
    }
    public function excluiNivel4($request){
        $idconta = addslashes($request['idconta']);
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $alteracoes = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";
        $array = array();
        // 
        $sql1 = "UPDATE contabeisnivel4 SET alteracoes=CONCAT(alteracoes,' | ', '$alteracoes'),situacao='excluido' WHERE id='$idconta'";

        $sql1 = self::db()->query($sql1);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            return true;
        } else {
            return false;
        }
    }


    /// TODOS OS NÍVEIS PLANO DE CONTAS
    public function buscaTodosNiveis(){
        ////nível 1
        $nivel1 = array();
        $sql1 = "SELECT * FROM `contabeisnivel1` WHERE situacao = 'ativo'";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[$value["id"]] = array(
                    "id" => $value["id"],
                    "movimentacao" => $value["movimentacao"],
                    "nome" => $value["nome"]
                );     
            }

        }

        $nivel1 = $nomes;

       ////// nível 2
       $nivel2 = array();
       $sql1 = "SELECT * FROM `contabeisnivel2` WHERE situacao = 'ativo'";

       $sql1 = self::db()->query($sql1);
       $nomesAux = array();
       $nomes = array();
       if($sql1->rowCount() > 0){  
           
           $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

           foreach ($nomesAux as $key => $value) {
               $nomes[$value["id"]] = array(
                   "id" => $value["id"],
                   "movimentacao" => $value["movimentacao"],
                   "nome" => $value["nome"]
               );     
           }

       }

        $nivel2 = $nomes;

        /////// nível 3
        $nivel3 = array();
        $sql1 = "SELECT * FROM `contabeisnivel3` WHERE situacao = 'ativo'";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[$value["id"]] = array(
                    "id" => $value["id"],
                    "movimentacao" => $value["movimentacao"],
                    "nome" => $value["nome"]
                );     
            }

        }

        $nivel3 = $nomes;

        ///////// nível 4
        $nivel4 = array();
        $sql1 = "SELECT * FROM `contabeisnivel4` WHERE situacao = 'ativo' ORDER BY nivel1 ASC, movimentacao ASC, nivel2 ASC, nivel3 ASC, nome ASC";

        $sql1 = self::db()->query($sql1);
        if($sql1->rowCount() > 0){  
            $nivel4 = $sql1->fetchAll(PDO::FETCH_ASSOC);
        }

    //    print_r($nivel1);
    //    print_r($nivel2);
    //    print_r($nivel3);
    /// colocando os nomes no array nivel 4
        $todos = array();
        $moviments = array();
        foreach ($nivel4 as $key => $value) {
            
            $todos[$key] = array(
                "movimentacao" => $value['movimentacao'],
                "nivel1" => $nivel1[ $value['nivel1'] ]['nome'],
                "nivel2" => $nivel2[ $value['nivel2'] ]['nome'],
                "nivel3" => $nivel3[ $value['nivel3'] ]['nome'],
                "nivel4" => $value['nome'],
            );
        
        }
       
    //    print_r($todos);exit;
        return $todos;
    }

    
    public function buscaDetalhe($request){
        $movimentacao = ucfirst(addslashes($request['mov']));
        $nivel1 = addslashes($request['nivel1']);
        $nivel2 = addslashes($request['nivel2']);
        $nivel3 = addslashes($request['nivel3']);
        $nivel4 = addslashes($request['nivel4']);
        $termo = $request['term'];
        $array = array();
        // 
        $sql1 = "SELECT `id`, `detalhe` FROM `fluxocaixa` WHERE situacao = 'ativo' AND despesa_receita = '$movimentacao' AND ccn1 = '$nivel1' AND ccn2 = '$nivel2' AND ccn3 = '$nivel3' AND ccn4 = '$nivel4' AND detalhe LIKE '%$termo%' GROUP BY detalhe ORDER BY detalhe ASC";

        // print_r($sql1); exit;
        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "label" => $value["detalhe"],
                    "value" => $value["detalhe"]
                );     
            }

        }

        $array = $nomes;

       return $array;
    }

}