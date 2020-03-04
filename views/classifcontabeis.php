<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL ?>',
        currentModule = '<?php echo $modulo ?>',
        campoPesquisa = '',
        valorPesquisa = '',
        data_add = '<?php echo in_array($modulo . "_add", $_SESSION["permissoesUsuario"]) ? true : false ?>',
        data_edt = '<?php echo in_array($modulo . "_exc", $_SESSION["permissoesUsuario"]) ? true : false ?>',
        data_exc = '<?php echo in_array($modulo . "_edt", $_SESSION["permissoesUsuario"]) ? true : false ?>';
</script>

<script src="<?php echo BASE_URL?>/assets/js/vendor/jquery-ui.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/<?php echo $modulo?>.js" type="text/javascript"></script>

<header class="pt-4 pb-5"> <!-- Cabeçalho -->
    <div class="row align-items-center"> <!-- Alinhar as linhas -->
        <div class="col-lg"> <!--Colunas da esquerda -->
            <h1 class="display-4 text-capitalize font-weight-bold"><?php echo $labelTabela?></h1>
        </div>
        <!-- Verifica se o funcionário tem permissao pra adicionar -->
        <?php if(in_array($modulo . "_add", $infoUser["permissoesUsuario"])):?> <!--$infoUser é um vetor que pega os dados da sessao e armazena, entre outros dados, a permissao do usuario -->
            <div class="col-lg">
                <a href="<?php echo BASE_URL . "/" . (isset($headerData["adicionar"]) ? $headerData["adicionar"]["url"] : $modulo . "/adicionar") ?>" class="btn btn-secondary btn-block">
                    <i class="fas fa-plus-circle mr-1"></i>
                    <span>Adicionar / Editar / Excluir</span>
                </a>
            </div>
        <?php endif ?>
    </div>
</header>

<section class="mb-5">
    <div class="row mr-5">
        <div class="offset-lg-1 col-lg-11">
            <?php for($i=0; $i < count( $todosniveis ); $i++): ?> 
                <?php if( $i ==0 ):?>
                    <div class="row bg-secondary mr-3 px-0 h3"><?php echo $todosniveis[$i]['nivel1']?></div>
                    <div class="row alert-dark mr-3 px-2 h4"><?php echo $todosniveis[$i]['nivel2']?></div>
                    <div class="row alert-secondary mr-3 px-4 h5"><?php echo $todosniveis[$i]['nivel3']?></div>
                    <div class="row mr-3 px-5"><?php echo $todosniveis[$i]['movimentacao'] == 'despesa' ? '<i class="fas fa-minus pr-2"></i>' : '<i class="fas fa-plus pr-2"></i>' ?><?php echo $todosniveis[$i]['nivel4']?></div>
                <?php else:?>
                    <?php if($todosniveis[$i]['nivel1'] == $todosniveis[$i-1]['nivel1'] ):?>
                        <?php if($todosniveis[$i]['nivel2'] == $todosniveis[$i-1]['nivel2'] ):?>
                            <?php if($todosniveis[$i]['nivel3'] == $todosniveis[$i-1]['nivel3'] ):?>
                               <div class="row mr-3 px-5"><?php echo $todosniveis[$i]['movimentacao'] == 'despesa' ? '<i class="fas fa-minus pr-2"></i>' : '<i class="fas fa-plus pr-2"></i>' ?><?php echo $todosniveis[$i]['nivel4']?></div>
                            <?php else:?>
                                <div class="row alert-secondary mr-3 px-4 h5"><?php echo $todosniveis[$i]['nivel3']?></div>
                               <div class="row mr-3 px-5"><?php echo $todosniveis[$i]['movimentacao'] == 'despesa' ? '<i class="fas fa-minus pr-2"></i>' : '<i class="fas fa-plus pr-2"></i>' ?><?php echo $todosniveis[$i]['nivel4']?></div>
                            <?php endif;?>    
                        <?php else:?>
                            <div class="row alert-dark mr-3 px-2 h4"><?php echo $todosniveis[$i]['nivel2']?></div>
                            <div class="row alert-secondary mr-3 px-4 h5"><?php echo $todosniveis[$i]['nivel3']?></div>
                           <div class="row mr-3 px-5"><?php echo $todosniveis[$i]['movimentacao'] == 'despesa' ? '<i class="fas fa-minus pr-2"></i>' : '<i class="fas fa-plus pr-2"></i>' ?><?php echo $todosniveis[$i]['nivel4']?></div>
                        <?php endif;?>    
                    <?php else:?>
                        <div class="row bg-secondary mr-3 px-0 h3"><?php echo $todosniveis[$i]['nivel1']?></div>
                        <div class="row alert-dark mr-3 px-2 h4"><?php echo $todosniveis[$i]['nivel2']?></div>
                        <div class="row alert-secondarymr-3 px-4 h5"><?php echo $todosniveis[$i]['nivel3']?></div>
                       <div class="row mr-3 px-5"><?php echo $todosniveis[$i]['movimentacao'] == 'despesa' ? '<i class="fas fa-minus pr-2"></i>' : '<i class="fas fa-plus pr-2"></i>' ?><?php echo $todosniveis[$i]['nivel4']?></div>
                    <?php endif;?>
                <?php endif;?>
            <?php endfor;?>
        </div>
    </div>    
                           
</section>