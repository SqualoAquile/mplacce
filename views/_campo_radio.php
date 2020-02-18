<?php $indexRadio = 0 ?>
<div class="form-check-wrapper form-radio d-table position-relative pr-4" tabindex="0">
    <?php foreach ($value["Comment"]["options"] as $valueRadio => $label): ?>
        <div class="form-check form-check-inline position-static">
            <input 
                type="radio" 
                id="<?php echo $valueRadio ?>" 
                value="<?php echo $valueRadio ?>" 
                name="<?php echo $value["Field"] ?>" 
                tabindex="<?php echo isset($value["Comment"]["ordem_form"]) ? $value["Comment"]["ordem_form"] : "" ?>"
                data-anterior="<?php echo isset($item) ? $item[$value["Field"]] : "" ?>"
                data-mascara_validacao = "<?php echo array_key_exists("mascara_validacao", $value["Comment"]) ? $value["Comment"]["mascara_validacao"] : "false" ?>"
                class="form-check-input" 
                <?php echo $value['Null'] == "NO" ? "required" : "" ?>

                <?php if(isset($item[$value["Field"]])):?>
                    <?php if(strtolower($item[$value["Field"]]) == strtolower($valueRadio) ):?>
                        <?php echo "checked" ?>
                    <?php endif?>
                <?php else:?>        
                    <?php echo $indexRadio == 0 ? "checked" : "" ?>
                    <?php $indexRadio++ ?>
                <?php endif?>
            >
            <label class="form-check-label" for="<?php echo $valueRadio ?>"><?php echo $label ?></label>
        </div>
    <?php endforeach ?>
</div>