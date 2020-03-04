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

<header class="d-lg-flex align-items-center mt-5 mb-2">
    <?php if(in_array($modulo . "_ver", $infoUser["permissoesUsuario"])): ?>
        <a href="<?php echo BASE_URL . '/' . $modulo ?>" class="btn btn-secondary mr-lg-4" title="Voltar">
            <i class="fas fa-chevron-left"></i>
        </a>
    <?php endif ?>

    <h1 class="display-4 text-capitalize text-nowrap font-weight-bold"><?php echo $labelTabela?></h1>
</header>

<section class="mb-5">
    <!-- Nível 1 -->
    <div class="row">
        <div class="col-lg-12">
            <div class="card-header h3 my-0">Nível 1</div>
            <div class="card card-body my-3">
                <div class="row align-items-baseline justify-content-between">
                    <div class="col-lg">
                        <label class="h5 text-capitalize ">Movimentação</label>   
                        <select id="selec1n1" name="selec1n1" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                            <option value="despesa" >Despesa</option>
                            <option value="receita" >Receita</option>
                        </select>
                    </div> 
                    <div class="col-lg">
                        <label class="h5 text-capitalize">Nível 1</label>
                        <input type="text" name="n1" id="n1" class="form-control">    
                    </div>
                    <div class="col-lg align-self-end my-2">
                        <div class="btn btn-md btn-success" id='addn1'><i class="fas fa-plus"></i></div>
                        <div class="btn btn-md btn-primary" id='edtn1'><i class="fas fa-edit"></i></div>
                        <div class="btn btn-md btn-danger"  id='excn1'><i class="fas fa-trash-alt"></i></div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>    
    <!-- Nível 2 -->
    <div class="row">
        <div class="col-lg-12">
            <div class="card-header h3 my-0">Nível 2</div>
            <div class="card card-body my-3">
                <div class="row align-items-baseline">
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize ">Movimentação</label>   
                        <select id="selec1n2" name="selec1n2" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                            <option value="despesa" >Despesa</option>
                            <option value="receita" >Receita</option>
                        </select>
                    </div> 
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize ">Nível 1</label>   
                        <select id="selec2n2" name="selec2n2" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                        </select>
                    </div>  
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize">Nível 2</label>
                        <input type="text" name="n2" id="n2" class="form-control">    
                    </div>
                    <div class="col-lg justify-content-between align-self-end my-2">
                        <div class="btn btn-md btn-success" id="addn2"><i class="fas fa-plus"></i></div>
                        <div class="btn btn-md btn-primary" id="edtn2"><i class="fas fa-edit"></i></div>
                        <div class="btn btn-md btn-danger" id="excn2"><i class="fas fa-trash-alt"></i></div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div> 
    <!-- Nível 3 -->
    <div class="row">
        <div class="col-lg-12">
            <div class="card-header h3 my-0">Nível 3</div>
            <div class="card card-body my-2">
                <div class="row align-items-baseline">
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize ">Movimentação</label>   
                        <select id="selec1n3" name="selec1n3" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                            <option value="despesa" >Despesa</option>
                            <option value="receita" >Receita</option>
                        </select>
                    </div> 
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize ">Nível 1</label>   
                        <select id="selec2n3" name="selec2n3" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                        </select>
                    </div>  
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize ">Nível 2</label>   
                        <select id="selec3n3" name="selec3n3" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                        </select>
                    </div>  
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize">Nível 3</label>
                        <input type="text" name="n3" id="n3" class="form-control">    
                    </div>
                    <div class="col-lg justify-content-between align-self-end my-2">
                        <div class="btn btn-md btn-success" id='addn3' ><i class="fas fa-plus"></i></div>
                        <div class="btn btn-md btn-primary" id='edtn3'><i class="fas fa-edit"></i></div>
                        <div class="btn btn-md btn-danger"  id='excn3'><i class="fas fa-trash-alt"></i></div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    <!-- Nível 4 -->
    <div class="row">
        <div class="col-lg-12">
            <div class="card-header h3 my-0">Nível 4</div>
            <div class="card card-body my-2">
                <div class="row align-items-baseline">
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize ">Movimentação</label>   
                        <select id="selec1n4" name="selec1n4" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                            <option value="despesa" >Despesa</option>
                            <option value="receita" >Receita</option>
                        </select>
                    </div> 
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize ">Nível 1</label>   
                        <select id="selec2n4" name="selec2n4" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                        </select>
                    </div>  
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize ">Nível 2</label>   
                        <select id="selec3n4" name="selec3n4" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                        </select>
                    </div>
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize ">Nível 3</label>   
                        <select id="selec4n4" name="selec4n4" class="form-control mb-2" >
                            <option value="" selected >Selecione</option>
                        </select>
                    </div>    
                    <div class="col-lg justify-content-between">
                        <label class="h5 text-capitalize">Nível 4</label>
                        <input type="text" name="n4" id="n4" class="form-control">    
                    </div>
                    <div class="col-lg justify-content-between align-self-end my-2">
                        <div class="btn btn-md btn-success" id='addn4' ><i class="fas fa-plus"></i></div>
                        <div class="btn btn-md btn-primary" id='edtn4'><i class="fas fa-edit"></i></div>
                        <div class="btn btn-md btn-danger"  id='excn4'><i class="fas fa-trash-alt"></i></div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>                         
</section>