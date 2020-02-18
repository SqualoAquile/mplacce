<!-- <script src="<?php// echo BASE_URL;?>/assets/js/agendamentos_servicos.js" type="text/javascript"></script> -->
<form id="eventos-form" autocomplete="off" novalidate>
    <h3 class="mt-5 mb-4">* Serviços</h3>
    <div class="table-responsive mb-lg-5 mb-3">
        <table id="eventos" class="table table-striped table-hover table-fixed bg-white">
            <thead>
                <tr role="form" class="d-flex flex-column flex-lg-row">
                    <th class="col-lg-2">
                        <label class="font-weight-bold" for="agnd_profissional">* Profissional</label>
                        <input type="text" class="form-control" id="agnd_profissional" name="agnd_profissional" data-mascara_validacao="false" required>
                    </th>
                    <th class="col-lg-2">
                        <label class="font-weight-bold" for="agnd_servico">* Serviço</label>
                        <select id="agnd_servico" name="agnd_servico" class="form-control" data-mascara_validacao ="false" required >
                                <option value="" selected >Selecione</option>     
                        </select>
                    </th>
                    <th class="col-lg-1">
                        <label class="font-weight-bold" for="agnd_preferencia">* Preferência</label>
                        <input type="checkbox" class="form-control" id="agnd_preferencia" name="agnd_preferencia" data-mascara_validacao="false" >
                    </th>
                    <th class="col-lg-2">
                        <label class="font-weight-bold" for="agnd_hora_inicio">* Hora Inicial.</label>
                        <input type="text" class="form-control" id="agnd_hora_inicio" name="agnd_hora_inicio" data-mascara_validacao="hora" maxlength="6" required>
                    </th>
                    <th class="col-lg-2">
                        <label class="font-weight-bold" for="agnd_duracao">* Duração</label>
                        <input type="text" class="form-control" id="agnd_duracao" name="agnd_duracao" data-mascara_validacao="numero" maxlength="3" required>
                    </th>
                    <th class="col-lg-2">
                        <label class="font-weight-bold" for="agnd_hora_final">* Hora Final</label>
                        <input type="text" class="form-control" id="agnd_hora_final" name="agnd_hora_final" data-mascara_validacao="hora" maxlength="3" required>
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
