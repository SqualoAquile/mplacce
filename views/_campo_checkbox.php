<?php 
    $opcoes = $value['Comment']['info_relacional']['resultado'];
    $opcoes =  array_map('strtolower', $opcoes);
    $opcoes =  array_map('trim', $opcoes);
    
    $checados = array();
    if(isset($item) && !empty($item)){
        $checados =  explode(",",$item[$value['Field']]);
        $checados =  array_map('strtolower', $checados);
        $checados =  array_map('trim', $checados);
    }
?>
<div class="form-check-wrapper position-relative form-checkbox pr-4" tabindex="0">
    <?php for($j = 0; $j < count($opcoes); $j++):?>
        <div class="form-check form-check-inline">
            <input 
                id="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>" 
                type="checkbox" 
                class="form-check-input" 
                tabindex="<?php echo isset($value["Comment"]["ordem_form"]) ? $value["Comment"]["ordem_form"] : "" ?>"
                value="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>"
                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>" 
                <?php
                if(isset($item)){
                    if( in_array($opcoes[$j], $checados) == true){
                        echo "checked='checked'";
                    }
                }
                ?>
            />
            <label class="form-check-label" for="<?php echo $value["Comment"]['info_relacional']['resultado'][$j];?>" ><?php echo $value["Comment"]['info_relacional']['resultado'][$j];?></label>
        </div>
    <?php endfor?>
    <input 
        type="hidden" 
        name="<?php echo lcfirst($value["Field"]) ?>" 
        value="<?php echo isset($item) && !empty($item) ? $item[$value["Field"]] : "" ?>"
        data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
        data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
        <?php echo $value["Null"] == "NO" ? "required" : "" ?>
    />
</div>