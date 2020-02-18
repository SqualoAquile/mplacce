    $(function () {
    
    var $cpf_cnpj = $('[name=cpf_cnpj]');
    $('#pf').attr('checked', 'checked');

    //
    // Escuta o clique dos radios CPF/CPNJ pra mostra e esconder os inputs de CPF/CNPJ
    //
    $('[name=tipo_pessoa]')
        .change(function () {
            if ($(this).is(':checked')) {

                var $input = $('[name=cpf_cnpj]'),
                    $nome = $('[name=nome]'),
                    $dtNascimento = $('[name=data_nascimento]'),
                    $celular = $('[name=celular]');
                
                $input.removeClass('is-valid is-invalid');

                $input.siblings('.invalid-feedback').remove();
                
                $input[0].setCustomValidity('');

                if ($(this).attr('value') == 'pj') {

                    $input
                        .mask('00.000.000/0000-00')
                        .siblings('label')
                        .find('span')
                        .text('CNPJ');

                    $nome
                        .siblings('label')
                        .find('span')
                        .text('Nome Fantasia');

                } else {
                    
                    $input
                        .mask('000.000.000-00')
                        .siblings('label')
                        .find('span')
                        .text('CPF');

                    $nome
                        .siblings('label')
                        .find('span')
                        .text('Nome');

                }
            }
        })
        .change();

    $cpf_cnpj
        .on('blur checar', function () {

            var $this = $(this),
                text_label = $this.siblings('label').find('span').text();

            $this.removeClass('is-valid is-invalid');
            $this.siblings('.invalid-feedback').remove();
            // $this[0].setCustomValidity('');

            if ($this.val()) {
                if ($this.attr('data-anterior') != $this.val()) {

                    if ($('[name=tipo_pessoa]:checked').val() == 'pj') {
                        // Cnpj
                        if ($this.validationLength(18)) {
                            // Valido
                            if ($this.attr('data-unico')) {

                                $this.unico(function (json) {

                                    $this.removeClass('is-valid is-invalid');
                                    $this.siblings('.invalid-feedback').remove();
                                    $this[0].setCustomValidity('');

                                    if (json.length) {

                                        // Já existe, erro

                                        $this.addClass('is-invalid');

                                        $this[0].setCustomValidity('invalid');

                                        $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');

                                    } else {

                                        $this.addClass('is-valid');

                                        $this[0].setCustomValidity('');

                                    }

                                });

                            } else {

                                $this.addClass('is-valid');

                                $this[0].setCustomValidity('');

                            }
                        } else {
                            // Inválido
                            $this.addClass('is-invalid');

                            $this[0].setCustomValidity('invalid');

                            $this.after('<div class="invalid-feedback">Preencha o campo no formato: 00.000.000/0000-00</div>');
                        }
                    } else {
                        // Cpf
                        if ($this.validationLength(14)) {
                            // Valido
                            if ($this.attr('data-unico')) {
                                $this.unico(function (json) {

                                    $this.removeClass('is-valid is-invalid');
                                    $this.siblings('.invalid-feedback').remove();
                                    $this[0].setCustomValidity('');

                                    if (json.length) {

                                        // Já existe, erro

                                        $this.addClass('is-invalid');

                                        $this[0].setCustomValidity('invalid');
                                        
                                        $this.after('<div class="invalid-feedback">Este ' + text_label.toLowerCase() + ' já está sendo usado</div>');

                                    } else {

                                        $this.addClass('is-valid');

                                        $this[0].setCustomValidity('');

                                    }

                                });
                            } else {

                                $this.addClass('is-valid');

                                $this[0].setCustomValidity('');

                            }
                        } else {

                            // Inválido

                            $this.addClass('is-invalid');

                            $this[0].setCustomValidity('invalid');

                            $this.after('<div class="invalid-feedback">Preencha o campo no formato: 000.000.000-00</div>');

                        }
                    }
                }
            }
        })
        .on('keyup', function () {
            if ($('[name=tipo_pessoa]:checked').val() == 'pj') {
                if ($(this).val().length >= 18) {
                    $(this).trigger('checar');
                }
            } else {
                if ($(this).val().length >= 14) {
                    $(this).trigger('checar');
                }
            }
        });
});