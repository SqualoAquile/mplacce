<textarea
    class="form-control" 
    name="<?php echo lcfirst($value['Field']);?>" 
    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
    tabindex="<?php echo isset($value["Comment"]["ordem_form"]) ? $value["Comment"]["ordem_form"] : "" ?>"
    id="<?php echo lcfirst($value['Field']);?>"
    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
    <?php echo $value['Null'] == "NO" ? "required" : "" ?>
><?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?></textarea>