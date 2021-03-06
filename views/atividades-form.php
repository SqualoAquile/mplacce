<?php $modulo = str_replace("-form", "", basename(__FILE__, ".php")) ?>
<script type="text/javascript">
    var baselink = '<?php echo BASE_URL;?>',
        currentModule = '<?php echo $modulo ?>',
        campoPesquisa = '', // aqui vai o campo de id-usuario caso seja necessário filtrar o datatable somente para os registros referentes ao usuário logado
        valorPesquisa = '<?php echo in_array('podetudo_ver', $_SESSION['permissoesUsuario']) ? "" : $_SESSION["idUsuario"]; ?>';
</script>

<link href="<?php echo BASE_URL?>/assets/fullcalendar/core/main.min.css" rel="stylesheet" type="text/css"/>
<link href="<?php echo BASE_URL?>/assets/fullcalendar/daygrid/main.min.css" rel="stylesheet" type="text/css"/>
<link href="<?php echo BASE_URL?>/assets/fullcalendar/list/main.min.css" rel="stylesheet" type="text/css"/>
<link href="<?php echo BASE_URL?>/assets/fullcalendar/timegrid/main.min.css" rel="stylesheet" type="text/css"/>
<link href="<?php echo BASE_URL?>/assets/css/agenda.css" rel="stylesheet" type="text/css"/>

<script src="<?php echo BASE_URL?>/assets/js/vendor/jquery-ui.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/<?php echo $modulo?>.js" type="text/javascript"></script>

<script src="<?php echo BASE_URL?>/assets/fullcalendar/core/main.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/fullcalendar/core/locales/pt-br.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/fullcalendar/daygrid/main.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/fullcalendar/interaction/main.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/fullcalendar/list/main.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/fullcalendar/timegrid/main.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/vendor/bootstrap-datepicker.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/vendor/bootstrap-datepicker.pt-BR.min.js" type="text/javascript"></script>
<script src="<?php echo BASE_URL?>/assets/js/principal.js" type="text/javascript"></script>

<section class="mb-0 ">
        <div class="row">
            <div class="col-lg-2 mt-4" id="divDtPicker">
                <div class="row my-2">
                    <div class="col-lg">
                        <label class="font-weight-bold" for="dtcalendario">Data do Calendário</label>
                        <input type="text" name="dtcalendario" id="dtcalendario" class='form-control'
                        data-mascara_validacao="data" >
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-lg">
                        <label class="font-weight-bold" for="funcionarios">Selecione a Equipe</label>
                        <input type="text" name="funcionarios" id="funcionarios" class='form-control'
                        data-mascara_validacao="false" >
                        <ul>
                            
                        </ul> 
                    </div>
                </div>
            </div>
            <div class="col-lg-10 px-3 py-0 border border-dark bg-white" id="divAgendas">
                <div class="row d-flex flex-nowrap mb-0 px-2 agndLinha" >
                </div>
            </div>
        </div>
</section>

<!-- Modal -->
<div class="modal fade modais-require" id="modalEvento" tabindex="-1" role="dialog" aria-labelledby="modalEvento" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header border-0 position-absolute w-100">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body d-flex flex-column justify-content-center py-5">
               <a href="#" class="btn btn-block btn-lg btn-success " id="agendamento">Agendamento</a>
               <a href="#" class="btn btn-block btn-lg btn-warning ">Comanda</a>

            </div>
        </div>
    </div>
</div>