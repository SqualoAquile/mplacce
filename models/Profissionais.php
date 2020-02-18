<?php
class Profissionais extends model {

    protected $table = "profissionais";
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

            $id = addslashes(trim($id));

            //se não achar nenhum usuario associado ao grupo - pode deletar, ou seja, tornar o cadastro situacao=excluído
            $sql = "SELECT alteracoes FROM ". $this->table ." WHERE id = '$id' AND situacao = 'ativo'";
            $sql = self::db()->query($sql);
            
            if($sql->rowCount() > 0){  

                $sql = $sql->fetch();
                $palter = $sql["alteracoes"];
                $ipcliente = $this->permissoes->pegaIPcliente();
                $palter = $palter." | ".ucwords($_SESSION["nomeUsuario"])." - $ipcliente - ".date('d/m/Y H:i:s')." - EXCLUSÃO";

                $sqlA = "UPDATE ". $this->table ." SET alteracoes = '$palter', situacao = 'excluido' WHERE id = '$id' ";
                self::db()->query($sqlA);

                $erro = self::db()->errorInfo();

                if (empty($erro[2])){

                    $_SESSION["returnMessage"] = [
                        "mensagem" => "Registro deletado com sucesso!",
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
    }

    
    public function buscaGruposDeServicos(){
        // echo "aquiiii"; exit;
        $array = array();
        // 
        $sql1 = "SELECT * FROM `gruposervicos` WHERE situacao = 'ativo' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            // print_r($nomesAux); exit;
            // foreach ($nomesAux as $key => $value) {
            //     $nomes[] = array(
            //         "id" => $value["id"],
            //         "label" => $value["nome"],
            //         "value" => $value["nome"],
            //         "grupo" => $value['grupo'],
            //         "porcent_casa" => $value['porcent_casa'],
            //         "porcent_prof" => $value['porcent_prof'],
            //         "duracao" => $value['duracao'],
            //         "preco" => $value['preco'],
            //     );     
            // }
        }

        //fazer foreach e criar um array que cada elemento tenha id: label: e value:
        // print_r($nomes); exit; 
        $array = $nomesAux;
        // $array = $nomesAux;

       return $array;
    }
    
    public function buscaServicos($termo){
        // echo "aquiiii"; exit;
        $array = array();
        // 
        $sql1 = "SELECT * FROM `servicos` WHERE situacao = 'ativo' AND serv_ativo = 'SIM' AND nome LIKE '%$termo%' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            // print_r($nomesAux); exit;
            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "label" => $value["nome"],
                    "value" => $value["nome"],
                    "grupo" => $value['grupo'],
                    "porcent_casa" => $value['porcent_casa'],
                    "porcent_prof" => $value['porcent_prof'],
                    "duracao" => $value['duracao'],
                    "preco" => $value['preco'],
                );     
            }
        }

        //fazer foreach e criar um array que cada elemento tenha id: label: e value:
        // print_r($nomes); exit; 
        $array = $nomes;
        // $array = $nomesAux;

       return $array;
    }

    public function buscaServicosGrupo($grupo){
        // echo "aquiiii"; exit;
        $array = array();
        // 
        $sql1 = "SELECT * FROM `servicos` WHERE situacao = 'ativo' AND serv_ativo = 'SIM' AND grupo = '$grupo' ORDER BY nome ASC";

        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            // print_r($nomesAux); exit;
            foreach ($nomesAux as $key => $value) {
                $nomes[] = array(
                    "id" => $value["id"],
                    "nome" => $value["nome"],
                    "grupo" => $value['grupo'],
                    "porcent_casa" => $value['porcent_casa'],
                    "porcent_prof" => $value['porcent_prof'],
                    "duracao" => $value['duracao'],
                    "preco" => $value['preco'],
                );     
            }
        }

        //fazer foreach e criar um array que cada elemento tenha id: label: e value:
        // print_r($nomes); exit; 
        $array = $nomes;
        // $array = $nomesAux;

       return $array;
    }
    public function buscaProfissionais($termo){
        // echo "aquiiii"; exit;
            //   print_r($_POST); exit;

        $array = array();
        $sql1 = "SELECT * FROM `profissionais` WHERE situacao = 'ativo' AND prof_ativo = 'SIM' AND nome LIKE '%$termo%' ORDER BY nome ASC";
        // echo $sql1; exit;
        $sql1 = self::db()->query($sql1);
        $nomesAux = array();
        $nomes = array();
        if($sql1->rowCount() > 0){  
            
            $nomesAux = $sql1->fetchAll(PDO::FETCH_ASSOC);

            // print_r($nomesAux); exit;
            foreach ($nomesAux as $key => $value) {
                $servs = $value['servicos'];
                $servs = str_replace("[","", $servs);
                $servs = explode("]", $servs);
                $a = array_pop($servs);
                // print_r($servs); exit;
                $servNomes = array();
                $servCompleto = array();

                for( $i=0; $i < count($servs); $i++ ){
                    $servs[$i] = explode("*", $servs[$i]);
                }
                // print_r($servs); exit;
                // $servNomes[] = utf8_decode(utf8_encode($servs[$i][0]));
                // $servCompleto[] = { utf8_decode(utf8_encode($servs[$i][0])) => $servs[$i][4] }; 
                // print_r($servNomes);
                // print_r($servCompleto); exit;
                $nomes[] = array(
                    "id" => $value["id"],
                    "label" => $value["nome"],
                    "value" => $value["nome"],
                    // "servicosNomes" => json_encode($servNomes),
                    "servicosCompleto" => $servs,
                );     
            }
        }

        //fazer foreach e criar um array que cada elemento tenha id: label: e value:
        $array = $nomes;
        return $array;
    }
}