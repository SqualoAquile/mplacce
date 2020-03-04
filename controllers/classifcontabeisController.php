<?php
class classifcontabeisController extends controller{

    // Protected - estas variaveis só podem ser usadas nesse arquivo
    protected $table = "classifcontabeis";
    protected $colunas;
    
    protected $model;
    protected $shared;
    protected $usuario;

    public function __construct() {
        
        // Instanciando as classes usadas no controller
        // $this->shared = new Shared($this->table);
        // $tabela = ucfirst($this->table);
        // $this->model = new $tabela();
        $this->usuario = new Usuarios();
    
        // $this->colunas = $this->shared->nomeDasColunas();

        // verifica se tem permissão para ver esse módulo
        if(in_array($this->table . "_ver", $_SESSION["permissoesUsuario"]) == false){
            header("Location: " . BASE_URL . "/home"); 
            exit;
        }
        // Verificar se está logado ou nao
        if($this->usuario->isLogged() == false){
            header("Location: " . BASE_URL . "/login"); 
            exit;
        }
    }
     
    public function index() {
        
        $pm = new Parametros();

        $dados['infoUser'] = $_SESSION;
        $dados["labelTabela"] = 'Plano de Contas';
        $dados['todosniveis'] = $pm->buscaTodosNiveis();

        // print_r($dados['todosniveis']); exit;

        $this->loadTemplate($this->table, $dados);
    }
    
    public function adicionar() {
        
        if(in_array($this->table . "_add", $_SESSION["permissoesUsuario"]) == false ){
            header("Location: " . BASE_URL . "/" . $this->table); 
            exit;
        }
            
        $pm = new Parametros();

        $dados['infoUser'] = $_SESSION;
        $dados["labelTabela"] = 'Plano de Contas - Níveis';
        $this->loadTemplate($this->table.'-form', $dados);
    }
}   
?>