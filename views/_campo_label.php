<label class="<?php echo $value["Null"] == "NO" ? "font-weight-bold" : "" ?>" for="<?php echo $value['Field'] ?>">
    <!-- Asterisco de campo obrigatorio -->
    <?php if ($value["Null"] == "NO"): ?>
        <i class="font-weight-bold" data-toggle="tooltip" data-placement="top" title="Campo Obrigatório">*</i>
    <?php endif ?>
    <span><?php echo array_key_exists("label", $value["Comment"]) ? ucwords($value["Comment"]["label"]) : ucwords(str_replace("_", " ", $value['Field'])) ?></span>
</label>