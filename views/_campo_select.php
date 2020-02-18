<select id="<?php echo lcfirst($value['Field']);?>" 
    name="<?php echo lcfirst($value['Field']);?>"
    class="form-control"
    data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
    tabindex="<?php echo isset($value["Comment"]["ordem_form"]) ? $value["Comment"]["ordem_form"] : "" ?>"
    data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
    <?php echo $value['Null'] == "NO" ? "required" : "" ?>
    >
    <option value="" selected >Selecione</option>
    <?php for($j = 0; $j < count($value["Comment"]['info_relacional']['resultado']); $j++):?>
        
        <option value="<?php echo $value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']];?>"
            <?php if(isset($item[$value["Field"]])):?>
                <?php if(strtoupper($item[$value["Field"]]) == strtoupper($value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']])):?>
                    <?php echo "selected"?>
                <?php endif?>    
            <?php endif?>    

        ><?php echo $value["Comment"]['info_relacional']['resultado'][$j][$value["Comment"]['info_relacional']['campo']];?></option>
        
    <?php endfor;?>     
</select>