<div class="relacional-dropdown-wrapper dropdown">
    <label class="d-none"><span><?php echo array_key_exists("label", $value["Comment"]) ? $value["Comment"]["label"] : ucwords(str_replace("_", " ", $value['Field'])) ?></span></label>
    <input 
    id="<?php echo $value['Field'] ?>" 
    name="<?php echo $value['Field'] ?>" 
    type="text" 
    class="dropdown-toggle form-control relacional-dropdown-input" 
    data-toggle="dropdown" 
    aria-haspopup="true" 
    aria-expanded="false"
    maxlength="<?php echo $value["tamanhoMax"] ?>"
    value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
    data-tabela="<?php echo $value["Comment"]["info_relacional"]["tabela"] ?>" 
    data-campo="<?php echo $value["Comment"]["info_relacional"]["campo"] ?>" 
    data-pode_nao_cadastrado="<?php echo array_key_exists("pode_nao_cadastrado", $value["Comment"]["info_relacional"]) ? $value["Comment"]["info_relacional"]["pode_nao_cadastrado"] : "false" ?>" 
    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
    data-unico="<?php echo array_key_exists("unico", $value["Comment"]) && $value["Comment"]["unico"]  == true ? "unico" : "" ?>"
    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
    <?php echo $value['Null'] == "NO" ? "required" : "" ?>
    <?php if( array_key_exists("mascara_validacao", $value["Comment"]) && 
                ( $value["Comment"]["mascara_validacao"] == "monetario" || $value["Comment"]["mascara_validacao"] == "porcentagem" )):?>
        data-podeZero="<?php echo array_key_exists("pode_zero", $value["Comment"]) && $value["Comment"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
    <?php endif?> 
    />
    <label data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent" for="<?php echo $value['Field'] ?>" class="btn btn-sm text-secondary icon-dropdown m-0 toggle-btn dropdown-toggle">
        <i class="fas fa-caret-down"></i>
    </label>
    <div class="dropdown-menu w-100 p-0 list-group-flush relacional-dropdown" aria-labelledby="<?php echo $value["Field"] ?>">
        <div class="p-3 nenhum-result d-none">Nenhum resultado encontrado</div>
        <div class="dropdown-menu-wrapper"></div>
    </div>
</div>