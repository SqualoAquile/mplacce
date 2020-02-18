<script src="<?php echo BASE_URL;?>/assets/js/profissionais_servicos.js" type="text/javascript"></script>
<div class="row mt-4 mb-2">
    <div class="col-lg">
        <h3 class="mt-2 mb-2">* Serviços</h3>   
    </div>
    <div class="col-lg">
        <select id="grupo_servico" 
                name="grupo_servico"
                class="form-control"
                data-mascara_validacao = "false"                
        >
            <option value="" selected >Selecione</option>
        </select>
    </div>
    <div class="col-lg">
        <div class="btn btn-primary" id="btn_incluir"> Incluir Todos os Serviços desse Grupo</div>
    </div>
</div>    
<form id="servicos-form" autocomplete="off" novalidate>
    <div class="table-responsive mb-lg-5 mb-3">
        <table id="servicos" class="table table-striped table-hover table-fixed bg-white">
            <thead>
                <tr role="form" class="d-flex flex-column flex-lg-row">
                    <th class="col-lg-3">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="serv_nome">Serviço</label>
                        <input type="text" class="form-control" id="serv_nome" name="serv_nome" maxlength="40" required>
                    </th>
                    <th class="col-lg-3">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="serv_grupo">Grupo</label>
                        <input type="text" class="form-control" id="serv_grupo" name="serv_grupo" data-mascara_validacao="false" maxlength="20" required readonly>
                    </th>
                    <th class="col-lg-1">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="serv_porcent_prof">% do Prof.</label>
                        <input type="text" class="form-control" id="serv_porcent_prof" name="serv_porcent_prof" data-mascara_validacao="porcentagem" data-podeZero="true" maxlength="6" required>
                    </th>
                    <th class="col-lg-1">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="serv_porcent_casa">% da Casa</label>
                        <input type="text" class="form-control" id="serv_porcent_casa" name="serv_porcent_casa" data-mascara_validacao="porcentagem" data-podeZero="true" maxlength="6" required>
                    </th>
                    <th class="col-lg-1">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="serv_duracao">Duração</label>
                        <input type="text" class="form-control" id="serv_duracao" name="serv_duracao" data-mascara_validacao="numero" maxlength="3" required>
                    </th>
                    <th class="col-lg-2">
                        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
                        <label for="serv_preco">Preço</label>
                        <input type="text" class="form-control" id="serv_preco" name="serv_preco" data-mascara_validacao="monetario" data-podeZero="true" maxlength="14" required>
                    </th>
                    <th class="col-lg-1">
                        <label>Ações</label>
                        <br>
                        <button type="submit" class="btn btn-primary">Incluir</a>
                    </th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</form>