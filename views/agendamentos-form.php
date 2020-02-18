<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>',
        campoPesquisa = '', // aqui vai o campo de id-usuario caso seja necessário filtrar o datatable somente para os registros referentes ao usuário logado
        valorPesquisa = '<?php echo in_array('podetudo_ver', $_SESSION['permissoesUsuario']) ? "" : $_SESSION["idUsuario"]; ?>';
</script>

<style>
    .ui-autocomplete {
        max-height: 200px;
        overflow-y: auto;
        /* prevent horizontal scrollbar */
        overflow-x: hidden;
    }
    /* IE 6 doesn't support max-height
    * we use height instead, but this forces the menu to always be this tall
    */
    * html .ui-autocomplete {
        height: 200px;
  }</style>

<script src="<?php echo BASE_URL?>/assets/js/vendor/jquery-ui.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/vendor/bootstrap-datepicker.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/vendor/bootstrap-datepicker.pt-BR.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/principal.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/<?php echo $modulo?>.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL;?>/assets/js/agendamentos_servicos.js" type="text/javascript"></script>

<header class="d-lg-flex align-items-center my-5">
    <?php if(in_array($modulo . "_ver", $infoUser["permissoesUsuario"])): ?>
        <a href="<?php echo BASE_URL . '/' . $modulo ?>" class="btn btn-secondary mr-lg-4" title="Voltar">
            <i class="fas fa-chevron-left"></i>
        </a>
    <?php endif ?>
    <h1 class="display-4 m-0 text-capitalize font-weight-bold"><?php echo $viewInfo["title"]." ".ucfirst($labelTabela["labelForm"]); ?></h1>
</header>

<?php $table = false ?>

<section class="mb-5">
    <form id="form-principal" method="POST" class="needs-validation" autocomplete="off" novalidate>
        <div class="row">
            <?php foreach ($colunas as $key => $value): ?>
                <?php if(isset($value["Comment"]) && array_key_exists("form", $value["Comment"]) && $value["Comment"]["form"] != "false") : ?>
                    <?php if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "table"): ?> 
                        <?php $table = true ?>
                        <?php include "_campo_hidden.php" ?>
                    <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "hidden"): ?>
                        <?php include "_campo_hidden.php" ?>
                    <?php else: ?>
                        <div    class="col-lg-<?php echo isset($value["Comment"]["column"]) ? $value["Comment"]["column"] : "12" ?>" 
                                style="order:<?php echo isset($value["Comment"]["ordem_form"]) ? $value["Comment"]["ordem_form"] : 100 ?>;">
                            <div class="form-group">
                                <?php include "_campo_label.php" ?>
                                <?php if(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "relacional"): ?>
                                    <?php include "_campo_select.php" ?>
                                <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "checkbox"): ?>
                                    <?php include "_campo_checkbox.php" ?>
                                <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "textarea"): ?>
                                    <?php include "_campo_textarea.php" ?>
                                <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "radio"): ?>
                                    <?php include "_campo_radio.php" ?>
                                    
                                <?php elseif(array_key_exists("type", $value["Comment"]) && $value["Comment"]["type"] == "dropdown"): ?>
                                    <?php include "_campo_dropdown.php" ?>
                                <?php else: ?>
                                    <?php include "_campo_text.php" ?>
                                <?php endif ?>
                            </div>
                        </div>
                    <?php endif ?>
                <?php endif ?>
            <?php endforeach ?>        
        </div>
        <button id="main-form" class="d-none"></button>
    </form>
    
    <?php if($table) include "_agendamentos_servicos.php" ?>
    <div class="row">
        <div class="col-lg-9"></div>
        <div class="col-lg-3">
            <div class="btn btn-primary btn-block" tabindex="0" id="btn_salvar_agnd" > Salvar Agendamentos</div>
        </div>
    </div>
    <!-- <div class="row">
        <div class="col-xl-2 col-lg-3">
            <label for="main-form" class="btn btn-primary btn-block" tabindex="0">Salvar</label>
        </div>
        <?php if (isset($item)): ?>
        <div class="col-xl-2 col-lg-3">
            <button class="btn btn-dark btn-block" type="button" data-toggle="collapse" data-target="#historico" aria-expanded="false" aria-controls="historico">Histórico de Alterações</button>
        </div>
        <?php endif ?>
    </div>
    <?php include "_historico.php" ?> -->
</section>