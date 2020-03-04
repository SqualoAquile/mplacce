<?php
class Agendamentos extends model {

    protected $table = "agendamentos";
    protected $permissoes;
    protected $shared;

    public function __construct() {
        
        $this->permissoes = new Permissoes();
        $this->shared = new Shared($this->table);
    }
    
    public function infoItem($id) {
        $array = array();
        $arrayAux = array();

        $id = addslashes(trim($id));
        $sql = "SELECT * FROM " . $this->table . " WHERE id='$id' AND situacao = 'ativo'";      
        $sql = self::db()->query($sql);

        if($sql->rowCount()>0){
            $array = $sql->fetch(PDO::FETCH_ASSOC);
            $array = $this->shared->formataDadosDoBD($array);
        }
        
        return $array; 
    }

    public function adicionar($request) {
        
        $ipcliente = $this->permissoes->pegaIPcliente();
        $request["alteracoes"] = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
        
        $request["situacao"] = "ativo";

        $keys = implode(",", array_keys($request));

        $values = "'" . implode("','", array_values($this->shared->formataDadosParaBD($request))) . "'";

        $sql = "INSERT INTO " . $this->table . " (" . $keys . ") VALUES (" . $values . ")";
        
        self::db()->query($sql);

        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            $_SESSION["returnMessage"] = [
                "mensagem" => "Registro inserido com sucesso!",
                "class" => "alert-success"
            ];
        } else {
            $_SESSION["returnMessage"] = [
                "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                "class" => "alert-danger"
            ];
        }
    }

    public function editar($id, $request) {

        if(!empty($id)){

            $id = addslashes(trim($id));

            $ipcliente = $this->permissoes->pegaIPcliente();
            $hist = explode("##", addslashes($request['alteracoes']));

            if(!empty($hist[1])){ 
                $request['alteracoes'] = $hist[0]." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$hist[1];
            }else{
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> Registro sem histórico de alteração.",
                    "class" => "alert-danger"
                ];
                return false;
            }

            $request = $this->shared->formataDadosParaBD($request);

            // Cria a estrutura key = 'valor' para preparar a query do sql
            $output = implode(', ', array_map(
                function ($value, $key) {
                    return sprintf("%s='%s'", $key, $value);
                },
                $request, //value
                array_keys($request)  //key
            ));

            $sql = "UPDATE " . $this->table . " SET " . $output . " WHERE id='" . $id . "'";
             
            self::db()->query($sql);

            $erro = self::db()->errorInfo();

            if (empty($erro[2])){

                $_SESSION["returnMessage"] = [
                    "mensagem" => "Registro alterado com sucesso!",
                    "class" => "alert-success"
                ];
            } else {
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                    "class" => "alert-danger"
                ];
            }
        }
    }
    
    public function excluir($id){
        if(!empty($id)) {

            $idAgnd = addslashes(trim($id));
            
            $ipcliente = $this->permissoes->pegaIPcliente();
            $palter = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

            $sql = "UPDATE eventos SET situacao = 'excluido' , alteracoes = CONCAT(alteracoes, ' | ', '$palter') WHERE idagnd = '$idAgnd' ";

            self::db()->query('START TRANSACTION;');
            $sql = self::db()->query($sql);
            $erroExc = self::db()->errorInfo();

            if (empty($erroExc[2])){

                $sqlA = "UPDATE agendamentos SET alteracoes = CONCAT(alteracoes, ' | ', '$palter'), situacao = 'excluido' WHERE id = '$idAgnd' ";
                self::db()->query($sqlA);

                $erro = self::db()->errorInfo();

                if (empty($erro[2])){

                    self::db()->query('COMMIT;');    
                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Registro deletado com sucesso!",
                        "class" => "alert-success"
                    ];

                } else {

                    self::db()->query('ROLLBACK;');
                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                        "class" => "alert-danger"
                    ];
                }

            }else{

                self::db()->query('ROLLBACK;');
                $_SESSION["returnMessage"] = [
                    "mensagem" => "Houve uma falha, tente novamente! <br /> ".$erro[2],
                    "class" => "alert-danger"
                ];

            }
        }
    }

    public function nomeClientes($termo){
        // echo "aquiiii"; exit;
        $array = array();
        // 
        $sql1 = "SELECT `id`, `nome` FROM `generico` WHERE situacao = 'ativo' AND nome LIKE '%$termo%' ORDER BY nome ASC";

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

        // fazer foreach e criar um array que cada elemento tenha id: label: e value:
        // print_r($nomes); exit; 
        $array = $nomes;

       return $array;
    }

    public function adicionarEventos($requestCompleto) {
        // print_r($requestCompleto); exit;
        $request = $requestCompleto['eventos'];
        $event = new Shared('eventos');

        $ipcliente = $this->permissoes->pegaIPcliente();
        $sql = '';
        $qtdServicos = count($request);            

        foreach ($request as $linha => $arrayRegistro) {

            $arrayRegistro["alteracoes"] = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
            $arrayRegistro["situacao"] = "ativo";
            
            // print_r($arrayRegistro); exit;
            // $keys = implode(",", array_keys($arrayRegistro));
            $keys = implode(",", array_keys($event->formataDadosParaBD2($arrayRegistro)));
            // print_r($arrayRegistro); exit;
            $values = "'" . implode("','", array_values($event->formataDadosParaBD2($arrayRegistro))) . "'";
            // print_r($values); exit;
            $sql .= "INSERT INTO eventos (" . $keys . ") VALUES (" . $values . ");";               
        }

        // print_r($request[0]['dt_inicio']); exit;
        
        $dtInicioAgnd = $request[0]['dt_inicio'];
        $dtInicioAgnd = explode('/', $dtInicioAgnd);
        $dtInicioAgnd = $dtInicioAgnd[2].'-'.$dtInicioAgnd[1].'-'.$dtInicioAgnd[0];
        
        $idClienteAgnd = $request[0]['id_cliente'];
        $clienteAgnd = $request[0]['cliente'];
        $servicosAgnd = $requestCompleto['servicos'];
        $obsAgnd = $requestCompleto['obsAgnd'];
        $alteracoesAgnd = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";

        // print_r($sql); exit;
        self::db()->query('START TRANSACTION;');

        self::db()->query($sql);
        $erro = self::db()->errorInfo();

        if (empty($erro[2])){

            $ultimoIdDepois = self::db()->lastInsertId();
            $idservicos = '';
            for($i=0; $i < $qtdServicos; $i++){
                $idservicos .= intval($ultimoIdDepois - $i).','; 
            }
            $idservicos = substr($idservicos,0, strlen($idservicos) - 1);
            // echo 'ids:    '. $idservicos; exit;   

            $sqlA = "INSERT INTO agendamentos (id, dt_inicio, id_cliente, cliente, observacao, id_servicos, servicos, alteracoes, situacao) VALUES (DEFAULT,'$dtInicioAgnd','$idClienteAgnd','$clienteAgnd','$obsAgnd','$idservicos','$servicosAgnd','$alteracoesAgnd','ativo')";

            // print_r($sqlA); exit;
            self::db()->query($sqlA);
            $erroA = self::db()->errorInfo();

            if(  empty($erroA[2]) ){

                $idAgnd = self::db()->lastInsertId();
                $idservicos2 = explode(',' , $idservicos); 
                $sqlB = '';
                for($i=0; $i < $qtdServicos; $i++){
                    
                    $sqlB .= "UPDATE eventos SET idagnd = '$idAgnd' WHERE id = '$idservicos2[$i]'; ";  
                }

                self::db()->query($sqlB);
                $erroB = self::db()->errorInfo();

                if(  empty($erroB[2]) ){
                    // print_r($sqlB); exit;
                    self::db()->query('COMMIT;');
                    return true;
                }else{
                    
                    self::db()->query('ROLLBACK;');
                    return false;
                }    
            }else{

                self::db()->query('ROLLBACK;');
                return false;
            }   

        } else {

            self::db()->query('ROLLBACK;');
            return false;
        }
    }

    public function editarEventos($requestCompleto) {
        // print_r($requestCompleto); exit;
        $idAgnd = addslashes( $requestCompleto['idAgnd'] );
        $alteraAgnd = addslashes( $requestCompleto['alteracao'] );
        
        

        $request = $requestCompleto['eventos'];
        $event = new Shared('eventos');

        $ipcliente = $this->permissoes->pegaIPcliente();
        $sql = '';
        $qtdServicos = count($request);            

        foreach ($request as $linha => $arrayRegistro) {

            $arrayRegistro["alteracoes"] = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - CADASTRO";
            $arrayRegistro["situacao"] = "ativo";
            
            // print_r($arrayRegistro); exit;
            // $keys = implode(",", array_keys($arrayRegistro));
            $keys = implode(",", array_keys($event->formataDadosParaBD2($arrayRegistro)));
            // print_r($arrayRegistro); exit;
            $values = "'" . implode("','", array_values($event->formataDadosParaBD2($arrayRegistro))) . "'";
            // print_r($values); exit;
            $sql .= "INSERT INTO eventos (" . $keys . ") VALUES (" . $values . ");";               
        }

        // print_r($request[0]['dt_inicio']); exit;
        
        $dtInicioAgnd = $request[0]['dt_inicio'];
        $dtInicioAgnd = explode('/', $dtInicioAgnd);
        $dtInicioAgnd = $dtInicioAgnd[2].'-'.$dtInicioAgnd[1].'-'.$dtInicioAgnd[0];
        
        $idClienteAgnd = $request[0]['id_cliente'];
        $clienteAgnd = $request[0]['cliente'];
        $servicosAgnd = $requestCompleto['servicos'];
        $obsAgnd = $requestCompleto['obsAgnd'];
        $alteracoesEvnt = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EDIÇÃO ( desativado )";

        $sqlExclusao = "UPDATE eventos SET situacao = 'excluido' , alteracoes = CONCAT(alteracoes, ' | ', '$alteracoesEvnt') WHERE idagnd = '$idAgnd' ";
        // print_r($sqlExclusao); exit;
        self::db()->query('START TRANSACTION;');

        // excluiu os eventos dessse agendamento
        self::db()->query($sqlExclusao);
        $erroExc = self::db()->errorInfo();

        if (empty($erroExc[2])){

            // incluiu os eventos alterados dess agendamento
            self::db()->query($sql);
            $erro = self::db()->errorInfo();

            if (empty($erro[2])){

                $ultimoIdDepois = self::db()->lastInsertId();
                $idservicos = '';
                for($i=0; $i < $qtdServicos; $i++){
                    $idservicos .= intval($ultimoIdDepois - $i).','; 
                }
                $idservicos = substr($idservicos,0, strlen($idservicos) - 1);

                $alteracoesAgnd = ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - ALTERAÇÃO >> ".$alteraAgnd;
                // echo 'ids:    '. $idservicos; exit;   
                $sqlA = "UPDATE agendamentos SET dt_inicio='$dtInicioAgnd',id_cliente='$idClienteAgnd',cliente='$clienteAgnd',observacao='$obsAgnd',id_servicos='$idservicos',servicos='$servicosAgnd',alteracoes=CONCAT(alteracoes,' | ', '$alteracoesAgnd') WHERE id='$idAgnd'";

                // print_r($sqlA); exit;
                // atualiza a tabela de agendamentos com os novos ids
                self::db()->query($sqlA);
                $erroA = self::db()->errorInfo();

                if(  empty($erroA[2]) ){

                    $idservicos2 = explode(',' , $idservicos); 
                    $sqlB = '';
                    for($i=0; $i < $qtdServicos; $i++){
                        
                        $sqlB .= "UPDATE eventos SET idagnd = '$idAgnd' WHERE id = '$idservicos2[$i]'; ";  
                    }

                    self::db()->query($sqlB);
                    $erroB = self::db()->errorInfo();

                    if(  empty($erroB[2]) ){
                        // print_r($sqlB); exit;
                        self::db()->query('COMMIT;');
                        return true;
                    }else{
                        
                        self::db()->query('ROLLBACK;');
                        return false;
                    }    
                }else{

                    self::db()->query('ROLLBACK;');
                    return false;
                }   

            } else {

                self::db()->query('ROLLBACK;');
                return false;
            }
        }else{
            self::db()->query('ROLLBACK;');
            return false;
        }

        
    }

}