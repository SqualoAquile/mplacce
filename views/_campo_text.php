<input 
    type="text" 
    class="form-control" 
    name="<?php echo lcfirst($value["Field"]) ?>" 
    value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
    data-unico="<?php echo ( array_key_exists("unico", $value["Comment"]) && $value["Comment"]["unico"]  == 'true' ) ? "unico" : "" ?>"
    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
    id="<?php echo $value['Field'] ?>"
    <?php echo $value['Null'] == "NO" ? "required" : "" ?>
    maxlength="<?php echo $value["tamanhoMax"] ?>"
    tabindex="<?php echo isset($value["Comment"]["ordem_form"]) ? $value["Comment"]["ordem_form"] : "" ?>"
    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
    <?php if( array_key_exists("mascara_validacao", $value["Comment"]) && 
                ( $value["Comment"]["mascara_validacao"] == "monetario" || $value["Comment"]["mascara_validacao"] == "porcentagem" || $value["Comment"]["mascara_validacao"] == "numero" ) ) :?>
        data-podeZero="<?php echo array_key_exists("pode_zero", $value["Comment"]) && $value["Comment"]["pode_zero"]  == 'true' ? 'true' : 'false' ?>"
    <?php endif?>                                          
/>