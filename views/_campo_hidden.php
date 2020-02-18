<input 
    type="hidden" 
    name="<?php echo lcfirst($value["Field"]) ?>" 
    value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
    <?php echo $value["Null"] == "NO" ? "required" : "" ?>
/>