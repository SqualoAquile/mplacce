
// acertar a função fluxo de caixa para colocar valor e compor a tabela de lançamento de acordo com os itens que aparecem no form 
// preencher o quem lançou de acordo com questiver logado - ok
// fazer a parte de backend do fluxocaixa adicionar - ok
// fazer a parte de backend do fluxocaixa editar - 
// fazer a parte de backend do fluxocaixa excluir - 
// tirar todos os console.log
// dropdown do favorecido não tá automático - precisa acertar de acordo com o banco de dados linha 115
var apareceLancamento = [];
for( var i=0; i < colunas.length; i++ ){
    // console.log( colunas[i]['Field'],  colunas[i]['Comment']['form'],  colunas[i]['Comment']['ver'])  
    if( colunas[i]['Comment']['form'] == 'true' || colunas[i]['Comment']['ver'] == 'true' ){
        apareceLancamento.push(colunas[i]['Field']) ;
    }
}

$(function () {
    
    // console.log('colunas e form: ', apareceLancamento)
    // console.log('conta_analitica: ', apareceLancamento.indexOf('conta_analitica')) 
    var colunasComOrdemForm = [];
    for ( var j=0; j < colunas.length; j++){
        if( colunas[j].Comment.ordem_form != undefined ){
            var indx = parseInt( colunas[j].Comment.ordem_form );
            colunasComOrdemForm[indx] = {
                Field:colunas[j].Field,
                Null:colunas[j].Null,
                form:colunas[j].Comment.form,
                type:colunas[j].Comment.type
            }
        }     
    }
    var primeiro = colunasComOrdemForm.shift();
    // var ultimo = colunasComOrdemForm.pop();
    // console.log('colunasordem', colunasComOrdemForm);

    $('input[type=radio]').on('change', function(){
        var movimentacao = '';
        
        if( $('#Despesa').is(':checked') == true ){
            movimentacao = 'despesa';
        }else{
            movimentacao = 'receita';
        }
        // console.log(id_mov)
        $('#ccn4').empty().append('<option value="" selected  >Selecione</option>');
        $('#ccn4').val('').blur();
        $('#ccn3').empty().append('<option value="" selected  >Selecione</option>');
        $('#ccn3').val('').blur();
        $('#ccn2').empty().append('<option value="" selected  >Selecione</option>'); 
        $('#ccn2').val('').blur();
        $('#ccn1').empty().append('<option value="" selected  >Selecione</option>'); 
        $('#ccn1').val('').blur();

        $.ajax( {
            url: baselink + '/ajax/buscaNivel1',
            type:"POST",
            dataType: "json",
            data: {
                mov:movimentacao,
                term: ''
            },
            success: function( data ) {
                if(data != ''){
                    $('#ccn1').empty().append('<option value="" selected  >Selecione</option>') 
                    for(var i=0; i< data.length; i++){  
                        $('#ccn1').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                    }
                }else{
                    alert('Não foram encontradas contas do nível 1.');
                    $('#ccn1').empty().append('<option value="" selected  >Selecione</option>')  ;
                }
            }
        } );
    });

    ////// começa os níveis contábeis
    $('#ccn1').blur(function(){
        var movimentacao = '';
        
        if( $('#Despesa').is(':checked') == true ){
            movimentacao = 'despesa';
        }else{
            movimentacao = 'receita';
        }

        if( $(this).val() == '' ){
            $('#ccn4').empty().append('<option value="" selected  >Selecione</option>');
            $('#ccn4').val('').blur();
            $('#ccn3').empty().append('<option value="" selected  >Selecione</option>');
            $('#ccn3').val('').blur();
            $('#ccn2').empty().append('<option value="" selected  >Selecione</option>'); 
            $('#ccn2').val('').blur();
        
        }else{
            // popular o select
            var nivel1 = $('#ccn1').val();
            $.ajax( {
                url: baselink + '/ajax/buscaNivel2',
                type:"POST",
                dataType: "json",
                data: {
                    mov:movimentacao,
                    nivel1:nivel1,
                    term: ''
                },
                success: function( data ) {
                    if(data != ''){
                        $('#ccn2').empty().append('<option value="" selected  >Selecione</option>') 
                        for(var i=0; i< data.length; i++){  
                            $('#ccn2').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                        }
                    }else{
                        $('#ccn2').empty().append('<option value="" selected  >Selecione</option>')  
                    }
                }
            } );

            $('#ccn2').blur();
            $('#ccn3').blur();
            $('#ccn4').blur();
        }
    });

    $('#ccn2').blur(function(){
        if( $(this).val() == '' ){
            $('#ccn4').empty().append('<option value="" selected  >Selecione</option>');
            $('#ccn4').val('').blur();
            $('#ccn3').empty().append('<option value="" selected  >Selecione</option>');
            $('#ccn3').val('').blur();

        }else{
            var movimentacao = '';
        
            if( $('#Despesa').is(':checked') == true ){
                movimentacao = 'despesa';
            }else{
                movimentacao = 'receita';
            }
            var nivel1 = $('#ccn1').val(), nivel2 = $('#ccn2').val();

             $.ajax( {
                    url: baselink + '/ajax/buscaNivel3',
                    type:"POST",
                    dataType: "json",
                    data: {
                        mov:movimentacao,
                        nivel1:nivel1,
                        nivel2:nivel2,
                        term: ''
                    },
                    success: function( data ) {
                        if(data != ''){
                            $('#ccn3').empty().append('<option value="" selected  >Selecione</option>') 
                            for(var i=0; i< data.length; i++){  
                                $('#ccn3').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                            }
                        }else{
                            $('#ccn3').empty().append('<option value="" selected  >Selecione</option>')  
                        }
                    }
                } );
                $('#ccn3').blur();
                $('#ccn4').blur();
        }
    });

    $('#ccn3').blur(function(){
        if( $(this).val() == '' ){
            $('#ccn4').empty().append('<option value="" selected  >Selecione</option>');
            $('#ccn4').val('').blur();

        }else{
            var movimentacao = '';
        
            if( $('#Despesa').is(':checked') == true ){
                movimentacao = 'despesa';
            }else{
                movimentacao = 'receita';
            }
            var nivel1 = $('#ccn1').val(), nivel2 = $('#ccn2').val(), nivel3 = $('#ccn3').val();

             $.ajax( {
                    url: baselink + '/ajax/buscaNivel4',
                    type:"POST",
                    dataType: "json",
                    data: {
                        mov:movimentacao,
                        nivel1:nivel1,
                        nivel2:nivel2,
                        nivel3:nivel3,
                        term: ''
                    },
                    success: function( data ) {
                        if(data != ''){
                            $('#ccn4').empty().append('<option value="" selected  >Selecione</option>') 
                            for(var i=0; i< data.length; i++){  
                                $('#ccn4').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                            }
                        }else{
                            $('#ccn4').empty().append('<option value="" selected  >Selecione</option>')  
                        }
                    }
                } );
                $('#ccn4').blur();
        }
    });
    
    $( "#detalhe" ).autocomplete({
        source: function( request, response ) {
            if ( $('#ccn1').val() == '' ){
                alert('Defina o Nível 1.');
                $('#ccn1').focus();
    
            }else if ( $('#ccn2').val() == '' ){
                alert('Defina o Nível 2.');
                $('#ccn2').focus();
    
            }else if ( $('#ccn3').val() == '' ){
                alert('Defina o Nível 3.');
                $('#ccn3').focus();
    
            }else if ( $('#ccn4').val() == '' ){
                alert('Defina o Nível 4.');
                $('#ccn4').focus();
    
            }else{
                var movimentacao = '';
            
                if( $('#Despesa').is(':checked') == true ){
                    movimentacao = 'despesa';
                }else{
                    movimentacao = 'receita';
                }
                var nivel1 = $('#ccn1').find(':selected').text(), 
                    nivel2 = $('#ccn2').find(':selected').text(),
                    nivel3 = $('#ccn3').find(':selected').text(),
                    nivel4 = $('#ccn4').find(':selected').text();

                $.ajax( {
                    url: baselink + '/ajax/buscaDetalhe',
                    type:"POST",
                    dataType: "json",
                    data: {
                        mov:movimentacao,
                        nivel1:nivel1,
                        nivel2:nivel2,
                        nivel3:nivel3,
                        nivel4:nivel4,
                        term: request.term.trim(),
                    },
                    success: function( data ) {
                        response( data );
                    }
                } );
            }    
        },
        minLength: 2,
        select: function( event, ui ) {
        },
        response: function( event, ui ) {
        }
    });
    $( "#detalhe" ).focus(function(event) {
        if ( $('#ccn1').val() == '' ){
            alert('Defina o Nível 1.');
            $('#ccn1').focus();

        }else if ( $('#ccn2').val() == '' ){
            alert('Defina o Nível 2.');
            $('#ccn2').focus();

        }else if ( $('#ccn3').val() == '' ){
            alert('Defina o Nível 3.');
            $('#ccn3').focus();

        }else if ( $('#ccn4').val() == '' ){
            alert('Defina o Nível 4.');
            $('#ccn4').focus();

        }else{
            var termo = "";
            termo = $(this).val().trim();
            $(this).autocomplete( "search" , termo );
        }
    });
    $( "#detalhe" ).parent('div').addClass('ui-widget');
    $( "#detalhe" ).on('click',function(){
        if ( $('#ccn1').val() == '' ){
            alert('Defina o Nível 1.');
            $('#ccn1').focus();

        }else if ( $('#ccn2').val() == '' ){
            alert('Defina o Nível 2.');
            $('#ccn2').focus();

        }else if ( $('#ccn3').val() == '' ){
            alert('Defina o Nível 3.');
            $('#ccn3').focus();

        }else if ( $('#ccn4').val() == '' ){
            alert('Defina o Nível 4.');
            $('#ccn4').focus();

        }else{
            $(this).keyup();
        }
    });
    
    //só para teste de programação
    $('#Receita').click();

    $('#favorecido').parent().parent().find('span').text('Pago Por');

    $('#quem_lancou').val(logado).attr('readonly', 'readonly');
    calcularesumo();

    ///////////////////////////////////////CONDIÇÕES INICIAIS DA TELA

    $("#adm_cartao").parent().parent().hide();
    $labeladm = $("#adm_cartao");
    $labeladm.siblings('label')
        .addClass('font-weight-bold')
        .find('span')
        .prepend('<i> * </i>');

    $("#bandeira").parent().parent().hide();
    $labelband = $("#bandeira");
    $labelband.siblings('label')
        .addClass('font-weight-bold')
        .find('span')
        .prepend('<i> * </i>');

    $("#taxa-cartao").parent().parent().hide();
    $("#dia_venc").parent().parent().hide();
    $("#custo_financ").parent().parent().hide();

    $("#nro_parcela").parent().parent().hide();
    $("#nro_parcela").empty()
        .val('')
        .append('<option value="" selected  >Selecione</option>');
    for (i = 1; i <= 12; i++) {
        $("#nro_parcela").append('<option value="' + i + '">' + i + '</option>');
    }

    $("#cond_pgto").attr("disabled", "disabled");

    $("#tabela_lancamento").hide();
    
    $("#btn_incluir").click(function(){
        confirmaPreenchimento();
    });    
    

    ////////////////////////////////// INÍCIO DAS OPERAÇÕES QUANDO TEM MUDANÇAS NOS CAMPOS
    $('input[type=radio]').change(function () {
        
        $("#forma_pgto").val("").removeClass('is-valid is-invalid').siblings('.invalid-feedback').remove();
        limpaCondPgto();

        if ($("#Receita").is(":checked")) {            

            //troca a base de informações do dropdown do favorecido
            $('#favorecido').parent().parent().find('span').text('Pago Por');
            $( "#favorecido" ).autocomplete({
                source: function( request, response ) {
                $.ajax( { 
                    url: baselink + '/ajax/buscaClientes',
                    type:"POST",
                    dataType: "json",
                    data: {
                        term: request.term.trim()
                    },
                    success: function( data ) {
                        response( data );
                    }
                } );
                },
                minLength: 2,
                select: function( event, ui ) {
                },
                response: function( event, ui ) {
                }
            });
            $( "#favorecido" ).focus(function(event) {
                var termo = "";
                termo = $(this).val().trim();
                $(this).autocomplete( "search" , termo );
            });
            $( "#favorecido" ).parent('div').addClass('ui-widget');
            $( "#favorecido" ).on('click',function(){
                $(this).keyup();
            });
            $( "#favorecido" ).blur(function(){});
            

        } else {

            //troca a base de informações do dropdown do favorecido
            $('#favorecido').parent().parent().find('span').text('Favorecido');
            $( "#favorecido" ).autocomplete({
                source: function( request, response ) {
                $.ajax( { 
                    url: baselink + '/ajax/buscaFornecedores1',
                    type:"POST",
                    dataType: "json",
                    data: {
                        term: request.term.trim()
                    },
                    success: function( data ) {
                        response( data );
                    }
                } );
                },
                minLength: 2,
                select: function( event, ui ) {
                },
                response: function( event, ui ) {
                }
            });
            $( "#favorecido" ).focus(function(event) {
                var termo = "";
                termo = $(this).val().trim();
                $(this).autocomplete( "search" , termo );
            });
            $( "#favorecido" ).parent('div').addClass('ui-widget');
            $( "#favorecido" ).on('click',function(){
                $(this).keyup();
            });
            $( "#favorecido" ).blur(function(){});
        }
    });
    $('input[type=radio]').change();
    $('#data_operacao').on('change blur', function(){
        if($("#cond_pgto").find(':selected').val() == 'À Vista' ){
            $("#cond_pgto").change();
        }
    });

    $('#valor_total').blur(function(){
        if($('#valor_total').val() != '' & $("#Receita").is(':checked')){
            if($("#forma_pgto").find(':selected').val() == 'Cartão Débito' || $("#forma_pgto").find(':selected').val() == 'Cartão Crédito'){
                if($('#bandeira').find(':selected').val() != ''){
                    calculatxcartao();
                }
            }
        }
    });

    //quando muda o select forma de pagamento - preenche adequadamente o select condição de pagamento
    $('#forma_pgto').change(function () {

        formapgto = $('#forma_pgto');
        condpgto = $('#cond_pgto');
        
        condpgto.val('').change();
        condpgto.siblings('.invalid-feedback').remove();
        condpgto.removeClass('is-valid is-invalid');

        limpaCondPgto();

        if (formapgto.find(":selected").val() != "") {
            condpgto.val("");
            condpgto.removeAttr("disabled");

            switch (formapgto.find(":selected").text()) {
                case ('Cartão Débito'):
                    condpgto.empty()
                        .append('<option value="" disabled>Selecione</option>')
                        .append('<option value="À Vista" selected>À Vista</option>')
                        .attr("disabled", "disabled")
                        .change()
                        .addClass('is-valid');
                    condpgto[0].setCustomValidity('');
                    break;
                case ('Cartão Crédito'):
                    if ($("#Despesa").is(":checked")) {
                        condpgto.empty()
                            .append('<option value="" disabled>Selecione</option>')
                            .append('<option value="Parcelado" selected>Parcelado</option>')
                            .attr("disabled", "disabled")
                            .change()
                            .addClass('is-valid');
                        condpgto[0].setCustomValidity('');
                    } else {
                        condpgto.empty()
                            .append('<option value="" disabled selected>Selecione</option>')
                            .append('<option value="Com Juros">Com Juros</option>')
                            .append('<option value="Parcelado">Parcelado</option>')
                            .append('<option value="Antecipado">Antecipado</option>')
                            .removeAttr("disabled");
                    }
                    break;
                default:
                    condpgto.empty()
                        .append('<option value="" disabled selected>Selecione</option>')
                        .append('<option value="À Vista">À Vista</option>')
                        .append('<option value="Parcelado">Parcelado</option>')
                        .removeAttr("disabled");
                    break;
            }
        } else {
            condpgto.empty()
                .append('<option value="" disabled selected>Selecione</option>')
                .attr("disabled", "disabled");
        }
    });

    $('#cond_pgto').change(function () {
        
        formapgto = $('#forma_pgto');
        dtop = $('#data_operacao');
        valortot = $('#valor_total');
        condpgto = $('#cond_pgto');
        admcartao = $("#adm_cartao");
        bandeira = $("#bandeira");
        nroparcela = $("#nro_parcela");
        diavenc = $("#dia_venc");
        txcobrada = $("#taxa-cartao");
        custofin = $("#custo_financ");

        if (dtop.val() == "" | valortot.val() == "") {
            formapgto.val("").blur();
            limpaCondPgto();
            valortot.val() == '' ? valortot.focus() : dtop.focus() ;
            //  alert("Preencha a data e/ou o valor do lançamento.");
            return;
        }

        if (condpgto.find(":selected").val() == "") {
            limpaCondPgto();
            return;
        }

        switch (formapgto.find(":selected").val()) {
            case ('Dinheiro'):
            case ('Cheque'):
            case ('Boleto'):
            case ('TED'):
            case ('DOC'):
            case ('Transferência'):

                admcartao.val("").attr("disabled", "disabled").parent().parent().hide();
                bandeira.val("").attr("disabled", "disabled").parent().parent().hide();
                txcobrada.val("0").attr("disabled", "disabled").parent().parent().hide();
                
                if ($("#Despesa").is(":checked")) {
                    if ( formapgto.find(":selected").val() == "Dinheiro" | formapgto.find(":selected").val() == "Cheque" | formapgto.find(":selected").val() == "Boleto" ) {
                            custofin.val(0).attr('disabled','disabled').parent().parent().hide();
                    } else {
                            custofin.val("").removeAttr("disabled").parent().parent().show();
                    }
                } else {
                    if (formapgto.find(":selected").val() == "Boleto") {
                        custofin.val("").removeAttr("disabled").parent().parent().show();
                    } else {
                        custofin.val(0).attr('disabled','disabled').parent().parent().hide();
                    }
                }


                if (condpgto.find(":selected").val() == "À Vista") {
                    
                    nroparcela.val("").attr('disabled','disabled').parent().parent().hide();

                    var diaaux = dtop.val();
                    diaaux = diaaux.split("/");
                    var dia = parseInt(diaaux[0]);
                    diavenc.val(dia).attr('disabled','disabled').parent().parent().hide();
                    
                    
                } else {
                    nroparcela.val("").removeAttr("disabled").parent().parent().show();
                    diavenc .val("").removeAttr("disabled").parent().parent().show();
                }
                break;

            case ('Cartão Débito'):
            case ('Cartão Crédito'):
                if (condpgto.find(":selected").val() == "À Vista") {
                    nroparcela.val("").attr("disabled", "disabled").parent().parent().hide();

                    var diaaux = dtop.val();
                    diaaux = diaaux.split("/");
                    var dia = parseInt(diaaux[0]);
                    diavenc.val(dia).attr('disabled','disabled').parent().parent().hide();

                } else {

                    nroparcela.val("").removeAttr("disabled").parent().parent().show();
                    diavenc.val(dia).removeAttr("disabled").parent().parent().show();

                }

                txcobrada.val("0").attr("disabled", "disabled").parent().parent().hide();
                custofin.val("0").attr("disabled", "disabled").parent().parent().hide();

                if ($("#Despesa").is(":checked")) {
                    admcartao.val("").attr("disabled", "disabled").parent().parent().hide();
                    bandeira.val("").attr("disabled", "disabled").parent().parent().hide();
                } else {
                    admcartao.val("").removeAttr("disabled").parent().parent().show();
                    bandeira.val("").removeAttr("disabled").show();
                }
                break;
            default:
                    admcartao.val("").attr("disabled", "disabled").parent().parent().hide();
                    bandeira.val("").attr("disabled", "disabled").parent().parent().hide();
                    txcobrada.val("0").attr("disabled", "disabled").parent().parent().hide();
                    custofin.val("").removeAttr("disabled").parent().parent().show();

                    if (condpgto.find(":selected").val() == "À Vista") {
                        nroparcela.val(0).attr("disabled", "disabled").parent().parent().hide();
    
                        var diaaux = dtop.val();
                        diaaux = diaaux.split("/");
                        var dia = parseInt(diaaux[0]);
                        diavenc.val(dia).attr('disabled','disabled').parent().parent().hide();
    
                    } else {
    
                        nroparcela.val("").removeAttr("disabled").parent().parent().show();
                        diavenc.val(dia).removeAttr("disabled").parent().parent().show();
    
                    }

                break;
        }

    });

     // quando troca a administradora de cartão
     $('#adm_cartao').change(function () {
        
        $('#taxa-cartao').val(0);
        $('#bandeira').removeClass('is-valid is-invalid');

        if ($("#Receita").is(":checked")) {
            if ($('#cond_pgto').find(":selected").val() != "À vista") {
                
                $('#bandeira').val("").attr('disabled', 'disabled').parent().parent().show();
                
            }
        }
        var id = $(this).val();
        var action = "buscaBandeiras";
        if (id != '') {
            $.ajax({
                url: baselink + "/ajax/" + action,
                type: "POST",
                data: { q: id },   //acentos, cedilha, caracteres diferentes causam erro, precisam ser passados para utf8 antes de receber
                dataType: "json", //o json só aceita utf8 - logo, se o retorno da requisição não estiver nesse padrão dá erro
                success: function (json) {
                    //limpei o select e coloquei a primeira opção (placeholder) 
                    $('#bandeira').empty();
                    //adiciona os options respectivos
                    $('#bandeira').append('<option value="" selected disabled>Selecione</option>');
                    if (json.length > 0) {
                        //insere as contas sinteticas especificas
                        for (var i = 0; i < json.length; i++) {
                            $('#bandeira').append('<option value=' + json[i].id + ' data-info=' + json[i].informacoes + ' data-txant=' + json[i].txantecipacao + '\
                                                     data-txcred='+ json[i].txcredito + '>' + json[i].nome + '</option>');
                        }
                        $('#bandeira').removeAttr('disabled');
                    }
                    
                }
            });
        }
        calculatxcartao();
    });
    $('#adm_cartao').blur(function () {
        $('#bandeira').removeClass('is-valid is-invalid'); 
        calculatxcartao();
    });

    //quando troca o select da bandeira
    $('#bandeira').change(function () {
        if($('#bandeira').find(":selected").val() == ''){
            $('#bandeira').removeClass('is-valid is-invalid');
        }
        calculatxcartao();
    });
    $('#bandeira').blur(function () {
        if($('#bandeira').find(":selected").val() == ''){
            $('#bandeira').removeClass('is-valid is-invalid');
        }
        calculatxcartao();
    });

    //quando sai do select número de parcelas
    $('#nro_parcela').change(function () {
        if ($("#Receita").is(":checked")) {
            calculatxcartao();
        }
    });
    $('#nro_parcela').blur(function () {
        if ($('#cond_pgto').find(":selected").val() != "À Vista") {
            if ($('#nro_parcela').find(':selected').val() != '' & $('#nro_parcela').find(':selected').val() == 0) {
                $('#nro_parcela').val("");
                alert("O número de parcelas não pode ser igual a zero.");
                return;
            }
        }
        calculatxcartao();
    });

    $("#btn_limparCampos").click(function(){
        limparCampos();
    });

    function limpaCondPgto() {
        $('#cond_pgto')     .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $('#cond_pgto')     .siblings('.invalid-feedback').remove();

        $("#adm_cartao")    .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#adm_cartao")    .parent().parent().hide();
        $("#adm_cartao")    .siblings('.invalid-feedback').remove();

        $("#bandeira")      .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#bandeira")      .parent().parent().hide();
        $("#bandeira")      .siblings('.invalid-feedback').remove();

        $("#nro_parcela")   .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#nro_parcela")   .parent().parent().hide();
        $("#nro_parcela")   .siblings('.invalid-feedback').remove();

        $("#dia_venc")      .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#dia_venc")      .parent().parent().hide();
        $("#dia_venc")      .siblings('.invalid-feedback').remove();

        $("#taxa-cartao")   .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#taxa-cartao")   .parent().parent().hide();
        $("#taxa-cartao")   .siblings('.invalid-feedback').remove();

        $("#custo_financ")  .val("").attr("disabled", "disabled").removeClass('is-valid is-invalid');
        $("#custo_financ")  .parent().parent().hide();
        $("#custo_financ")  .siblings('.invalid-feedback').remove();
        
    }

    function calculatxcartao() {
        
        $('#taxa-cartao').val(0);
        $("#custo_financ").val(0);

        //pegar as taxas quando o pagamento é débito - credito com jutos, parcelado e antecipado
        if ($("#forma_pgto").find(":selected").val() != "" & $("#cond_pgto").find(":selected").val() != "" & $("#adm_cartao").find(":selected").val() != "" & $("#bandeira").find(":selected").val() != "" & $("#valor_total").val() != "") {
            if ($("#Receita").is(":checked")) {
                if ($("#nro_parcela").find(":selected").val() != '' & $("#nro_parcela").find(":selected").val() != 0) {
                    $('#taxa-cartao').val(0);
                    if ($("#forma_pgto").find(":selected").val() == "Cartão Crédito") {
                        if ($("#cond_pgto").find(":selected").val() == "Com Juros") {
                            var txsa = $('#bandeira').find(":selected").attr("data-info");
                            txsa = txsa.split("-");
                            txsa = parseFloat(txsa[2]).toFixed(2);
                            $('#taxa-cartao').val(txsa + "%");
                            
                            var vltot = $("#valor_total").val();
                            vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                            vltot = vltot.replace(",", ".");
                            vltot = parseFloat(vltot);
                            vltot = vltot * parseFloat((txsa / 100));
                            vltot = parseFloat(vltot).toFixed(2);
                            vltot = vltot.replace(".", ",");
                            $("#custo_financ").val(vltot);

                        }else if ($("#cond_pgto").find(":selected").val() == "Parcelado") {
                            var txsb = $('#bandeira :selected').attr("data-txcred");
                            txsb = txsb.split("-");
                            var nropa = $("#nro_parcela").find(":selected").val();
                            txsb = parseFloat(txsb[(nropa - 1)]).toFixed(2);
                            $('#taxa-cartao').val(txsb + "%");
    
                            var vltot = $("#valor_total").val();
                            vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                            vltot = vltot.replace(",", ".");
                            vltot = parseFloat(vltot);
                            vltot = vltot * parseFloat((txsb / 100));
                            vltot = parseFloat(vltot).toFixed(2);
                            vltot = vltot.replace(".", ",");
                            $("#custo_financ").val(vltot);

                        }else if ($("#cond_pgto").find(":selected").val() == "Antecipado") {
                            var txsc = $('#bandeira').find(':selected').attr("data-txant");
                            txsc = txsc.split("-");
                            var nropb = $("#nro_parcela").find(":selected").val();
                            txsc = parseFloat(txsc[(nropb - 1)]).toFixed(2);
                            $('#taxa-cartao').val(txsc + "%");
    
                            var vltot = $("#valor_total").val();
                            vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                            vltot = vltot.replace(",", ".");
                            vltot = parseFloat(vltot);
                            vltot = vltot * parseFloat((txsc / 100));
                            vltot = parseFloat(vltot).toFixed(2);
                            vltot = vltot.replace(".", ",");
                            $("#custo_financ").val(vltot);

                        }
                    }
                }else if ($("#forma_pgto").find(":selected").val() == "Cartão Débito") {
                    var txsd = $('#bandeira').find(":selected").attr("data-info");
                    txsd = txsd.split("-");
                    txsd = parseFloat(txsd[0]).toFixed(2);
                    $('#taxa-cartao').val(txsd + "%");
                    
                    var vltot = $("#valor_total").val();

                    vltot = vltot.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
                    vltot = vltot.replace(",", ".");
                    vltot = parseFloat(vltot);
                    vltot = vltot * parseFloat((txsd / 100));
                    vltot = parseFloat(vltot).toFixed(2);
                    vltot = vltot.replace(".", ",");
                    $("#custo_financ").val(vltot);

                }
            }
        }
    }

    function confirmaPreenchimento() {
        var colunasComOrdemForm = [];
        for ( var j=0; j < colunas.length; j++){
            if( colunas[j].Comment.ordem_form != undefined ){
                var indx = parseInt( colunas[j].Comment.ordem_form );
                colunasComOrdemForm[indx] = {
                    Field:colunas[j].Field,
                    Null:colunas[j].Null,
                    form:colunas[j].Comment.form,
                    type:colunas[j].Comment.type
                }
            }     
        }
        var primeiro = colunasComOrdemForm.shift();
        // console.log('colunasordem', colunasComOrdemForm);
        // testa se o preenchimento dos campos necessários está ok
        for (var k=0; k < colunasComOrdemForm.length; k++){
            
            if (    colunasComOrdemForm[k].Null == 'NO' && 
                    colunasComOrdemForm[k].form == 'true' && 
                    colunasComOrdemForm[k].type != 'hidden' &&
                    $('#'+colunasComOrdemForm[k].Field).is(':visible') == true ){
                
                if( colunasComOrdemForm[k].type == 'relacional' ){
                    if ( $('#'+colunasComOrdemForm[k].Field).find(':selected').val() == '' ){
                        $('#'+colunasComOrdemForm[k].Field).focus();
                        // console.log(colunasComOrdemForm[k].Field);
                        return false;
                    }
                }else if ( colunasComOrdemForm[k].type == 'text' ){
                    if ( $('#'+colunasComOrdemForm[k].Field).val() == '' ){
                        $('#'+colunasComOrdemForm[k].Field).focus();
                        // console.log(colunasComOrdemForm[k].Field);
                        return false;
                    }else{
                        if ( $('#'+colunasComOrdemForm[k].Field).hasClass('is-valid') == false ){
                            $('#'+colunasComOrdemForm[k].Field).focus();
                            // console.log(colunasComOrdemForm[k].Field);
                            return false;
                        }
                    }
                }else{

                }
            }       
        }
        // console.log('sai do for')
        /// 
        if( $("#dia_venc").find(':selected').val() == "" ){
            $("#dia_venc").focus();             
            return;
        }
        if( $("#taxa-cartao").val() == "" ){
            $("#taxa-cartao").focus();             
            return;
        }
        if( $("#custo_financ").val() == "" ){
            $("#custo_financ").focus();             
            return;
        }
        
        if( $("#cond_pgto").find(':selected').val() != "À Vista" ){
            if( $("#nro_parcela").find(':selected').val() == "" ){
                $("#nro_parcela").focus();             
                return;
            }
        }

        if ($("#Despesa").is(":checked")) {
            if( $("#adm_cartao").find(':selected').val() != "" || $("#bandeira").find(':selected').val() != "" ){
                $("#Despesa").focus();             
                return;
            }
        }else{
            if($('#forma_pgto').find(':selected').val() == 'Cartão Crédito' || $('#forma_pgto').find(':selected').val() == 'Cartão Débito' ){
                if( $("#adm_cartao").find(':selected').val() == "" ){
                    $("#adm_cartao").focus();             
                    return;
                } else if( $("#bandeira").find(':selected').val() == "" ){
                    $("#bandeira").focus();             
                    return;
                }
            }else{
                if( $("#adm_cartao").find(':selected').val() != "" || $("#bandeira").find(':selected').val() != "" ){
                    $("#forma_pgto").focus();             
                    return;
                }
            }    
        }

        //início da inserção da nova linha          
        var movimentacao, nropedido, nronf, dtemissaonf, ccn1, ccn2, ccn3, ccn4, contacorrente, detalhe, quemlancou, favorecido, dtoperacao, valortotal, formapgto, condpgto, nroparcela, diavenc, admcartao, bandeira, observacao, distdias;
        if ($("#Receita").is(":checked")) {
            movimentacao = "Receita";
        } else {
            movimentacao = "Despesa";
        }
    
        if ($("#nro_pedido").val() != "") {
            nropedido = parseInt($("#nro_pedido").val());
        } else {
            nropedido = "";
        }

        if ($("#nro_nf").val() != "") {
            nronf = $("#nro_nf").val();
        } else {
            nronf = "";
        }

        if ($("#data_emissao_nf").val() != "") {
            dtemissaonf = $("#data_emissao_nf").val();
        } else {
            dtemissaonf = "";
        }
        
        ccn1 = $("#ccn1").find(":selected").text();
        ccn2 = $("#ccn2").find(":selected").text();
        ccn3 = $("#ccn3").find(":selected").text();
        ccn4 = $("#ccn4").find(":selected").text();
        contacorrente = $("#conta_corrente").find(":selected").val();
        detalhe = $("#detalhe").val();
        quemlancou = $("#quem_lancou").val();
        favorecido = $("#favorecido").val();
        dtoperacao = $("#data_operacao").val();
        valortotal = floatParaPadraoInternacional($('#valor_total').val());   
        formapgto = $("#forma_pgto").find(":selected").val();
        condpgto = $("#cond_pgto").find(":selected").val();
        
        if($("#nro_parcela").find(":selected").val() == ""){
            nroparcela = '';
        }else{
            nroparcela = parseInt($("#nro_parcela").find(":selected").val());
        }
        
        diavenc = parseInt($("#dia_venc").find(":selected").val());
        

        if ($("#adm_cartao").find(":selected").val() == "") {
            admcartao = "";
            bandeira = "";
        } else {
            admcartao = $("#adm_cartao").find(":selected").val();
            bandeira = $("#bandeira").find(":selected").text();
        }
        
        var txcartao;
        if(movimentacao == 'Receita' && (formapgto == 'Cartão Débito' || formapgto == 'Cartão Crédito' ) ){
            if($("#taxa-cartao").val() == ''){
                txcartao = parseFloat(0);
            }else{
                txcartao = floatParaPadraoInternacional($("#taxa-cartao").val()) / 100;   
            }    
            if( parseFloat(txcartao) <= parseFloat(0)){
                alert('A bandeira escolhida não permite essa forma e/ou condição de pagamento.\nA taxa de cartão nessa condição é igual a zero (0).\nA taxa de cartão deve ter valor diferente de zero (0).');
                return;
            }
        }else{
            txcartao = parseFloat(0);
        }
        
        custofinanc = floatParaPadraoInternacional($("#custo_financ").val());
        observacao = $("#observacao").val().trim();
    
        if ($("#Receita").is(":checked")) {
            if (formapgto == "Cartão Débito" & condpgto == "À Vista") {
                distdias = $('#bandeira').find(':selected').attr("data-info");
                distdias = distdias.split("-");
                distdias = parseInt(distdias[1]);
    
            } else if (formapgto == "Cartão Crédito" & condpgto == "Com Juros") {
                distdias = $('#bandeira').find(':selected').attr("data-info");
                distdias = distdias.split("-");
                distdias = parseInt(distdias[3]);
    
            } else if (formapgto == "Cartão Crédito" & condpgto == "Antecipado") {
                distdias = $('#bandeira').find(':selected').attr("data-info");
                distdias = distdias.split("-");
                distdias = parseInt(distdias[4]);
    
            } else {
                distdias = 0;
            }
        } else {
            distdias = 0;
        }

        // lança o valor da receita ou despesa
        var linha = new Array();
        linha = lancaFluxo(movimentacao, nropedido, nronf, dtemissaonf, ccn1, ccn2, ccn3, ccn4, contacorrente, detalhe, quemlancou, favorecido, dtoperacao, valortotal, formapgto, condpgto, nroparcela, diavenc, admcartao, bandeira, observacao, distdias, apareceLancamento); 
          
        if (linha.length > 1) {
            for (var i = 0; i < linha.length; i++) {
                $('#tabela_lancamento tbody').append(linha[i]);
            }
        } else {
            $('#tabela_lancamento tbody').append(linha[0]);
        }
    
        //lança o custo financeiro caso ele exista
        var custoAux = floatParaPadraoInternacional($('#custo_financ').val());
        if (custoAux > 0) {
            //testar se já tem na tabela os itens selecionados   
            var linhab = new Array();
            if( formapgto.indexOf('cartão') > 0 ){
                ccn2 = 'Despesas Operacionais';
                ccn3 = 'Despesas Financeiras';
                ccn4 = 'Administradoras de Cartão';
            }else{
                ccn2 = 'Despesas Operacionais';
                ccn3 = 'Despesas Financeiras';
                ccn4 = 'Despesas Financeiras';
            }
            linhab = lancaFluxo('Despesa', nropedido, nronf, dtemissaonf, ccn1, ccn2, ccn3, ccn4, contacorrente, 'Taxa - ' + formapgto + ' - ' + detalhe, quemlancou, favorecido, dtoperacao, custoAux, formapgto, condpgto, nroparcela, diavenc, admcartao, bandeira, observacao, distdias, apareceLancamento); 
            if (linhab.length > 1) {
                for (var i = 0; i < linhab.length; i++) {
                    $('#tabela_lancamento tbody').append(linhab[i]);
                }
            } else {
                $('#tabela_lancamento tbody').append(linhab[0]);
            }
        }
        
        botarMascaraInputs();
        cancelaEdicoes();
        formataTabela();
        calcularesumo();
        $('#tabela_lancamento').show().focus();
    
    }

    function limparCampos(){

        // $('#form-principal').trigger('reset');

        $("#valor_total").val('').removeClass('is-invalid is-valid');
        $("#data_operacao").val('').removeClass('is-invalid is-valid');               
        $("#favorecido").val('').removeClass('is-invalid is-valid');
        $("#quem_lancou").removeClass('is-invalid is-valid');
        $("#detalhe").val('').removeClass('is-invalid is-valid');
        $("#conta_corrente").val('').removeClass('is-invalid is-valid');
        $("#forma_pgto").val('').change().removeClass('is-invalid is-valid');
        $("#nro_pedido").val('').removeClass('is-invalid is-valid');
        $("#nro_nf").val('').removeClass('is-invalid is-valid');
        $("#data_emissao_nf").val('').removeClass('is-invalid is-valid');
        $('#ccn1').val('').blur();

        $('#form-principal').removeClass('was-validated');
        $("#Receita").click().focus();
        $("#Receita").parent().parent().removeClass('is-invalid is-valid');
        $("#cond_pgto").removeClass('is-invalid is-valid');
        $("#observacao").val('').removeClass('is-invalid is-valid');

    }

    $('#form_lancamento').on('submit', function(e){
        if( confirm('Tem Certeza?') == false ){
            e.preventDefault();
            return;
        }else{
            $(this).find('input').removeAttr('disabled');

        }

    });
});

    function dataAtual(){
        var dt, dia, mes, ano, dtretorno;
        dt = new Date();
        dia = dt.getDate();
        mes = dt.getMonth() + 1;
        ano = dt.getFullYear();

        if (dia.toString().length == 1) {
            dia = "0" + dt.getDate();
        }
        if (mes.toString().length == 1) {
            mes = "0" + mes;
        }

        dtretorno = dia + "/" + mes + "/" + ano;

        return dtretorno;
    }

    function proximoDiaUtilParcela(dataInicial, nroParcelas, diavenc){
        var dtaux = dataInicial.split("/");
        var dtvenc = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);

        //soma a quantidade de meses para o recebimento/pagamento
        dtvenc.setMonth(dtvenc.getMonth() + (nroParcelas + 1));
        //transforma em data para verificar o dia da semana
        dtvenc.setDate(diavenc);

        //verifica se a data final cai no final de semana, se sim, coloca para o primeiro dia útil seguinte
        if (dtvenc.getDay() == 6) {
            dtvenc.setDate(dtvenc.getDate() + 2);
        }
        if (dtvenc.getDay() == 0) {
            dtvenc.setDate(dtvenc.getDate() + 1);
        }

        //monta a data no padrao brasileiro
        var dia = dtvenc.getDate();
        var mes = dtvenc.getMonth() + 1;
        var ano = dtvenc.getFullYear();
        if (dia.toString().length == 1) {
            dia = "0" + dtvenc.getDate();
        }
        if (mes.toString().length == 1) {
            mes = "0" + mes;
        }
        dtvenc = dia + "/" + mes + "/" + ano;

        return dtvenc;
    }

    function proximoDiaUtil(dataInicio, distdias){
        
        if(dataInicio == undefined || dataInicio == ''){
            return 
        }

        if (distdias != 0) {
            var dtaux = dataInicio.split("/");
            var dtvenc = new Date(dtaux[2], parseInt(dtaux[1]) - 1, dtaux[0]);

            //soma a quantidade de dias para o recebimento/pagamento
            dtvenc.setDate(dtvenc.getDate() + distdias);

            //verifica se a data final cai no final de semana, se sim, coloca para o primeiro dia útil seguinte
            if (dtvenc.getDay() == 6) {
                dtvenc.setDate(dtvenc.getDate() + 2);
            }
            if (dtvenc.getDay() == 0) {
                dtvenc.setDate(dtvenc.getDate() + 1);
            }

            //monta a data no padrao brasileiro
            var dia = dtvenc.getDate();
            var mes = dtvenc.getMonth() + 1;
            var ano = dtvenc.getFullYear();
            if (dia.toString().length == 1) {
                dia = "0" + dtvenc.getDate();
            }
            if (mes.toString().length == 1) {
                mes = "0" + mes;
            }
            dtvenc = dia + "/" + mes + "/" + ano;
            return dtvenc;
        }else{
            return dataInicio;
        }
    }

    function floatParaPadraoBrasileiro(valor){
        var valortotal = valor;
        valortotal = number_format(valortotal,2,',','.');
        return valortotal;
    }

    function floatParaPadraoInternacional(valor){
        
        var valortotal = valor;
        valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
        valortotal = valortotal.replace(",", ".");
        valortotal = parseFloat(valortotal).toFixed(2);
        return valortotal;
    }

    function number_format( numero, decimal, decimal_separador, milhar_separador ){ 
            numero = (numero + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+numero) ? 0 : +numero,
                prec = !isFinite(+decimal) ? 0 : Math.abs(decimal),
                sep = (typeof milhar_separador === 'undefined') ? ',' : milhar_separador,
                dec = (typeof decimal_separador === 'undefined') ? '.' : decimal_separador,
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + Math.round(n * k) / k;
                };
     
            // Fix para IE: parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
    }
    
    function calcularesumo() {
        if ($("#tabela_lancamento tbody").length > 0) {
            var receita = 0;
            var recaux = 0;
            var despesa = 0;
            var despaux = 0;
            var total = 0;
            var mov = "";
    
            $("#tabela_lancamento tbody tr").each(function () {
                mov = "";
                recaux = 0;
                despaux = 0;
                mov = $(this).closest('tr').children('td:eq('+apareceLancamento.indexOf('despesa_receita')+')').children('input:eq(0)').attr('value');
                if (mov == "Despesa") {
                    despaux = $(this).closest('tr').children('td:eq('+apareceLancamento.indexOf('valor_total')+')').children('input:eq(0)').val();
                    despaux = floatParaPadraoInternacional(despaux);
                    despaux = parseFloat(despaux);
                    despesa = despesa + despaux;
                } else {
                    recaux = $(this).closest('tr').children('td:eq('+apareceLancamento.indexOf('valor_total')+')').children('input:eq(0)').val();
                    recaux = floatParaPadraoInternacional(recaux);
                    recaux = parseFloat(recaux);
                    receita = receita + recaux;
                }
    
                total = (receita - despesa);
            });

            receita = parseFloat(receita);
            receita = floatParaPadraoBrasileiro(receita);
            
            despesa = parseFloat(despesa);
            despesa = floatParaPadraoBrasileiro(despesa);
    
            total = parseFloat(total);
            total = floatParaPadraoBrasileiro(total);
            
            $("#receita_lanc").html(receita);
            $("#despesa_lanc").html(despesa);
            $("#total_lanc").html(total);
            
            // console.log('total resumo', despesa);
            if (parseFloat(total) < 0) {
                $("#total_lanc").parent('div').parent('div').removeClass('text-success').addClass('text-danger');
                
            } else if (parseFloat(total) > 0) {
                $("#total_lanc").parent('div').parent('div').removeClass('text-danger').addClass('text-success');

            } else {
                $("#total_lanc").parent('div').parent('div').removeClass('text-danger text-success');
            }
    
        } else {
            $("#receita_lanc").html("0,00");
            $("#despesa_lanc").html("0,00");
            $("#total_lanc").html("0,00");
            $("#total_lanc").parent('div').parent('div').removeClass('text-danger text-success');
        }
        
        if ($('#tabela_lancamento tbody tr').length <= 0) {
            $('#resumo_lancamento').hide();
            $('#lbl_btn_salvar').hide();    
        }else{
            $('#resumo_lancamento').show();
            $('#lbl_btn_salvar').show();    
        }
    }

    function excluir(obj) {
        $(obj).closest('tr').remove();
        formataTabela();
        cancelaEdicoes();
        calcularesumo();
        // limparPreenchimento();    
    }

    function formataTabela() {
        
        if ($('#tabela_lancamento tbody tr ').length > 0) {
            var lin, col, larg, largaux;
            for ( col = 1; col <= $('#tabela_lancamento tbody tr td').length; col++) {
                
                larg = $('#tabela_lancamento thead tr').children('th:eq(' + col + ')').children('span').text().length;
                
                //varre as linhas pra ver a largura maxima
                for ( lin = 0; lin < $('#tabela_lancamento tbody tr').length; lin++) {
                    
                    if( $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq(' + col + ')').children('input:eq(0)').val() == '' ||
                        $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq(' + col + ')').children('input:eq(0)').val() == undefined ){
                        
                        largaux = parseInt(0);
                    }else{

                        largaux = parseInt($('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq(' + col + ')').children('input:eq(0)').val().length) * 8;
                    }
                    if( parseInt(largaux) >= parseInt(larg) ){
                        larg = largaux;
                    }
                }

                //varre as linhas pra definir o tamanho dos inputs com a largura máxima
                $('#tabela_lancamento thead').children('tr:eq(0)').children('th:eq(' + col + ')').width(larg);
                for ( lin = 0; lin < $('#tabela_lancamento tbody tr').length; lin++) {
                    $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq(' + col + ')').children('input:eq(0)').width(larg*1.25);
                    $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq(' + col + ')').width(larg*1.25);
                }
            }
        calcularesumo();    
        }
    }

    function cancelaEdicoes() {
        
        if ($('#tabela_lancamento tbody tr ').length > 0) {
            var lin, val, dtanterior ;    
            //varre as linhas pra ver a largura maxima
            for ( lin = 0; lin < $('#tabela_lancamento tbody tr').length; lin++) {
                if( $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq(0)').find('i').hasClass('fas fa-save') ){
                  //  a linha está editável
                  botarMascaraInputs();    
            
                  // retornar o botão de editar
                  $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq(0)').find('div.btn-success').find('i').removeClass('fas fa-save').addClass('fas fa-edit');
                  $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq(0)').find('div.btn-success').removeClass('btn-success').addClass('btn-primary');
                  
                  val = $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq('+apareceLancamento.indexOf('valor_total')+')').children('input:eq(0)').attr('data-anterior');
                  $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq('+apareceLancamento.indexOf('valor_total')+')').children('input:eq(0)')
                          .attr('readonly','readonly').attr('disabled','disabled')
                          .removeClass('form-control').addClass('form-control-plaintext')
                          .val(val);
      
                          
                  dtanterior = $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq('+apareceLancamento.indexOf('data_vencimento')+')').children('input:eq(0)').attr('data-anterior');       
                  $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq('+apareceLancamento.indexOf('data_vencimento')+')').children('input:eq(0)')
                          .attr('readonly','readonly').attr('disabled','disabled')
                          .removeClass('form-control').addClass('form-control-plaintext')
                          .val(dtanterior);
      
                  $('#tabela_lancamento tbody').children('tr:eq(' + lin + ')').children('td:eq('+apareceLancamento.indexOf('observacao')+')').children('input:eq(0)')
                          .attr('readonly','readonly').attr('disabled','disabled')
                          .removeClass('form-control').addClass('form-control-plaintext');

                }
            }
        calcularesumo();    
        }
    }

    function botarMascaraInputs(){
        // inputs de valor total
        $("#tabela_lancamento tbody tr td:eq("+apareceLancamento.indexOf('valor_total')+") input:eq(0)").each(function () {
            
            $('#tabela_lancamento tbody tr [data-mascara_validacao="monetario"]')
            .mask('#.##0,00', {
                reverse: true
            })
            .on('blur touchstart', function () {
    
                var $this = $(this),
                    value = $this.val(),
                    anterior = $this.attr('data-anterior'),
                    pode_zero = $this.attr('data-podeZero');

                if (pode_zero != undefined && pode_zero == 'true') {
                    pode_zero = true;
                } else {
                    pode_zero = false;
                }
    
                if (value) {
    
                    if (anterior != value) {
                        
                        var value = value.replace('.', '').replace('.', '').replace('.', '').replace('.', '').replace('.', ''),
                            value = value.replace(',', '.');
                        value = parseFloat(value);

                        if ( value <= parseFloat(0) ) {
                        
                            if (pode_zero == false) {
                                $this.val(anterior);
                            } 
                        
                        } else {
                            $this.val(floatParaPadraoBrasileiro(value));
                        }
                    }
                } else {
                    $this.val(anterior);
                }
                calcularesumo();
            });
        });

        $("#tabela_lancamento tbody tr td:eq("+apareceLancamento.indexOf('data_operacao')+") input:eq(0)").each(function () {
            $('#tabela_lancamento tbody tr [data-mascara_validacao="data"]')
            .mask('00/00/0000')
            .datepicker()
            .on('change blur', function () {

                var $this = $(this),
                    valor = $this.val()
                    anterior = $this.attr('data-anterior')
                
                if (valor != '') {    
                
                    dtop = $this.closest('tr').children('td:eq('+apareceLancamento.indexOf('data_operacao')+')').children('input:eq(0)').val();
                    dtop = dtop.split('/')[2] + dtop.split('/')[1] + dtop.split('/')[0];
                    dtop = parseInt(dtop);

                    dtatual = $this.val();
                    dtatual = dtatual.split('/')[2] + dtatual.split('/')[1] + dtatual.split('/')[0];
                    dtatual = parseInt(dtatual);

                    valor = valor.split('/');
                    var data = valor[0] + '/' + valor[1] + '/' + valor[2];

                
                    if ($this.attr('data-anterior') != $this.val()) {
                        if (
                            (typeof valor[1] == 'undefined' || typeof valor[2] == 'undefined') ||
                            (valor[2].length > 4 || valor[0].length > 2 || valor[1].length > 2) ||
                            (validaDat(data) == false)
                        ) {
                            // Inválido
                            $this.val(anterior);
                                
                        } else {
                            // Valido
                            if(dtatual <= dtop){
                                $this.val(anterior);
                            }else{
                                $this.val(data);
                            }                            
                        }
                    }
                }else{
                    // Inválido
                    $this.val(anterior);
                }
                
            });
           
        });

        
    }

    function validaDat(valor) {
        var date = valor;
        var ardt = new Array;
        var ExpReg = new RegExp('(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[12][0-9]{3}');
        ardt = date.split('/');
        erro = false;
        if (date.search(ExpReg) == -1) {
            erro = true;
        }
        else if (((ardt[1] == 4) || (ardt[1] == 6) || (ardt[1] == 9) || (ardt[1] == 11)) && (ardt[0] > 30))
            erro = true;
        else if (ardt[1] == 2) {
            if ((ardt[0] > 28) && ((ardt[2] % 4) != 0))
                erro = true;
            if ((ardt[0] > 29) && ((ardt[2] % 4) == 0))
                erro = true;
        }
        if (erro) {
            return false;
        }
        return true;
    }

    function editar(obj) {
        var valor, dtanteior;
        if($(obj).find('i').hasClass('fas fa-edit')){ // o botão de editar

            //botao de editar
            $(obj).removeClass('btn-primary').addClass('btn-success');
            $(obj).find('i').removeClass('fas fa-edit').addClass('fas fa-save');
            
            // input de valor total
            $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('valor_total')+')').children('input:eq(0)')
                    .width(200)
                    .removeAttr('readonly').removeAttr('disabled')
                    .removeClass('form-control-plaintext').addClass('form-control').focus();
            
            // input de data de vencimento
            $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('data_vencimento')+')').children('input:eq(0)')
                    .width(150)
                    .removeAttr('readonly').removeAttr('disabled')
                    .removeClass('form-control-plaintext').addClass('form-control');
            
            // input de observação
            $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('observacao')+')').children('input:eq(0)')
                    .width(300)
                    .removeAttr('readonly').removeAttr('disabled')
                    .removeClass('form-control-plaintext').addClass('form-control');

        }else{ //botão de salvar
            
            $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('valor_total')+')').children('input:eq(0)').blur();        
            $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('data_vencimento')+')').children('input:eq(0)').blur();
            
            // fazer a validação dos inputs se estão preenchidos
            botarMascaraInputs();
            
            // retornar o botão de editar
            $(obj).removeClass('btn-success').addClass('btn-primary');
            $(obj).find('i').removeClass('fas fa-save').addClass('fas fa-edit');

            valor = $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('valor_total')+')').children('input:eq(0)').val();
            
            // input de valor total
            $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('valor_total')+')').children('input:eq(0)')
                    .attr('readonly','readonly').attr('disabled','disabled')
                    .removeClass('form-control').addClass('form-control-plaintext')
                    .attr('data-anterior', valor);

            // input de data vencimento
            dtanteior = $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('data_vencimento')+')').children('input:eq(0)').val();       
            $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('data_vencimento')+')').children('input:eq(0)')
                    .attr('readonly','readonly').attr('disabled','disabled')
                    .removeClass('form-control').addClass('form-control-plaintext')
                    .attr('data-anterior', dtanteior);
            
            // input de observação
            $(obj).closest('tr').children('td:eq('+apareceLancamento.indexOf('observacao')+')').children('input:eq(0)')
                    .attr('readonly','readonly').attr('disabled','disabled')
                    .removeClass('form-control').addClass('form-control-plaintext');
            
            formataTabela();
            calcularesumo();        
        }
    }

    function maiorData(data1, data2){
        // console.log('dt1:',data1);
        // console.log('dt2:', data2);
        if(data1 != '' && data1 != undefined && data2 != '' && data2 != undefined){
            var dt1aux, dt2aux;
            dt1aux = data1.split('/');
            dt1aux = parseInt( dt1aux[2]+dt1aux[1]+dt1aux[0] );
            
            dt2aux = data2.split('/');
            dt2aux = parseInt( dt2aux[2]+dt2aux[1]+dt2aux[0] );
    
            if( dt1aux > dt2aux ){
                return data1;
            }else if( dt1aux < dt2aux ){
                return data2;
            }else{
                return 'iguais';
            }
        }else{
            return 'erro';
        }
    }

    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }
    // Decimal round
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }

    function lancaFluxo(movimentacao, nropedido, nronf, dataemissaonf, ccn1, ccn2, ccn3, ccn4, contacorrente, detalhe, quemlancou, favorecido, dtoperacao, valortotal, formapgto, condpgto, nroparcela, diavenc, admcartao, bandeira, observacao, distdias = 0, apareceLancamento = [], dtVencLncVnd = '') {
        // console.log('foi acionado lancaFluxo'); 
        /////////////////////////// LANÇAMENTO INTEIRO FEITO A VISTA - EXCLUINDO RECEITA DE CARTÃO DÉBITO
        if ((condpgto == "À Vista" && formapgto != "Cartão Débito" && formapgto != "Cartão Crédito" ) || ( formapgto == 'Cartão Débito' && bandeira == '') ){
            
            dtentrada = dataAtual();
            valortotal = floatParaPadraoBrasileiro(valortotal);
            randomico = Math.random();
            
            var arraylinhas = new Array();
            var linha = "<tr>";
                linha   += "<td>" + "<div class='btn btn-sm btn-danger mr-1' onclick='excluir(this)' data-ident=" + randomico + " '><i class='fas fa-trash-alt'></i></div>" 
                                  + "<div class='btn btn-primary btn-sm ml-1' onclick='editar(this)' data-ident=" + randomico + " '><i class='fas fa-edit'></i></div>" 
                        + "</td>";
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[despesa_receita]'  value='" + movimentacao + "' />" +"</td>";

                if( apareceLancamento.indexOf('ccn4') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn4]'  value='" + ccn4 + "'    />" +"</td>";
                }

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[detalhe]'          value='" + detalhe + "' />"      +"</td>";

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_operacao]'    value='" + dtoperacao + "' />"   +"</td>";

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled data-mascara_validacao='monetario' data-podeZero='false' required maxlength='20' "
                                + "name='linha"+randomico+"[valor_total]' value='" + valortotal + "' data-anterior='"+ valortotal +"' ' />"
                      +"</td>";

                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled data-mascara_validacao='data' maxlength='10' required "
                            + "name='linha"+randomico+"[data_vencimento]' value ='" + dtoperacao + "' data-anterior='"+ dtoperacao +"' data-dtop='" + dtoperacao + "' />"   
                    +"</td>";

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[forma_pgto]'        value='" + formapgto + "' />"    +"</td>";

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[cond_pgto]'         value='" + condpgto + "' />"     +"</td>";

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[nro_parcela]'          value=     '1|1' />"             +"</td>";

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_quitacao]'    value='" + dtoperacao + "' />"   +"</td>";

                if( apareceLancamento.indexOf('favorecido') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[favorecido]'       value='" + favorecido +"' />"    +"</td>";
                }
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[conta_corrente]'   value='" + contacorrente + "'/>" +"</td>";


                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[quem_lancou]'      value='" + quemlancou +"' />"    +"</td>";

                if( apareceLancamento.indexOf('nro_pedido') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[nro_pedido]'       value='" + nropedido + "' />"    +"</td>";
                }

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[status]'           value=     'Quitado' />"         +"</td>";

                if( apareceLancamento.indexOf('ccn1') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn1]'  value='" + ccn1 + "'    />" +"</td>";
                }
                
                if( apareceLancamento.indexOf('ccn2') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn2]'  value='" + ccn2 + "'    />" +"</td>";
                }

                if( apareceLancamento.indexOf('ccn3') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn3]'  value='" + ccn3 + "'    />" +"</td>";
                }

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[adm_cartao]'       value='" + admcartao +"' />"     +"</td>";

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[bandeira]'         value='" + bandeira +"' />"      +"</td>";

                if( apareceLancamento.indexOf('nro_nf') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[nro_nf]'           value='" + nronf +"'/>"          +"</td>";
                }
                
                if( apareceLancamento.indexOf('data_emissao_nf') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_emissao_nf]'  value='" + dataemissaonf +"'/>"  +"</td>";
                }              
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_entrada_sistema]' value='" +dtentrada+"'/>"    +"</td>";

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[observacao]'       value='" + observacao +"' />"    +"</td>";

            arraylinhas.push(linha);
            return arraylinhas;
        
        /////////////////////////// LANÇAMENTO INTEIRO FEITO EM UMA VEZ - DISTÂNCIA DO VENCIMENTO EM DIAS
        } else if ( ( formapgto == "Cartão Débito" && bandeira != '')  || (formapgto == "Cartão Crédito" && condpgto == "Com Juros") || (formapgto == "Cartão Crédito" && condpgto == "Antecipado")) {
        
            
            var arraylinhas = new Array();
            var dtentrada = dataAtual();
            valortotal = floatParaPadraoBrasileiro(valortotal);
            var dtvenc = proximoDiaUtil(dtoperacao, distdias);
            randomico = Math.random();

            var linha = "<tr>";
                linha += "<td>" + "<div class='btn btn-sm btn-danger mr-1' onclick='excluir(this)' data-ident=" + randomico + " '><i class='fas fa-trash-alt'></i></div>" 
                                + "<div class='btn btn-primary btn-sm ml-1' onclick='editar(this)' data-ident=" + randomico + " '><i class='fas fa-edit'></i></div>" 
                      + "</td>";
            ///
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[despesa_receita]'  value='" + movimentacao + "' />" +"</td>";

            if( apareceLancamento.indexOf('ccn4') > 0 ){
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn4]'  value='" + ccn4 + "'    />" +"</td>";
            }

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[detalhe]'          value='" + detalhe + "' />"      +"</td>";

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_operacao]'    value='" + dtoperacao + "' />"   +"</td>";

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled data-mascara_validacao='monetario' data-podeZero='false' required maxlength='20' "
                            + "name='linha"+randomico+"[valor_total]' value='" + valortotal + "' data-anterior='"+ valortotal +"' ' />"
                    +"</td>";
            
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled data-mascara_validacao='data' maxlenght='10' required "
                + "name='linha"+randomico+"[data_vencimento]' value ='" + dtvenc + "' data-anterior='"+ dtvenc +"' data-dtop='" + dtoperacao + "' />"   
                + "</td>";

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[forma_pgto]'        value='" + formapgto + "' />"    +"</td>";

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[cond_pgto]'         value='" + condpgto + "' />"     +"</td>";

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[nro_parcela]'          value=     '1|1' />"             +"</td>";

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_quitacao]'    value='" + dtoperacao + "' />"   +"</td>";

            if( apareceLancamento.indexOf('favorecido') > 0 ){
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[favorecido]'       value='" + favorecido +"' />"    +"</td>";
            }
            
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[conta_corrente]'   value='" + contacorrente + "'/>" +"</td>";


            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[quem_lancou]'      value='" + quemlancou +"' />"    +"</td>";

            if( apareceLancamento.indexOf('nro_pedido') > 0 ){
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[nro_pedido]'       value='" + nropedido + "' />"    +"</td>";
            }

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[status]'           value=     'A Quitar' />"         +"</td>";

            if( apareceLancamento.indexOf('ccn1') > 0 ){
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn1]'  value='" + ccn1 + "'    />" +"</td>";
            }
            
            if( apareceLancamento.indexOf('ccn2') > 0 ){
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn2]'  value='" + ccn2 + "'    />" +"</td>";
            }

            if( apareceLancamento.indexOf('ccn3') > 0 ){
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn3]'  value='" + ccn3 + "'    />" +"</td>";
            }

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[adm_cartao]'       value='" + admcartao +"' />"     +"</td>";

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[bandeira]'         value='" + bandeira +"' />"      +"</td>";

            if( apareceLancamento.indexOf('nro_nf') > 0 ){
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[nro_nf]'           value='" + nronf +"'/>"          +"</td>";
            }
            
            if( apareceLancamento.indexOf('data_emissao_nf') > 0 ){
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_emissao_nf]'  value='" + dataemissaonf +"'/>"  +"</td>";
            }              
            
            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_entrada_sistema]' value='" +dtentrada+"'/>"    +"</td>";

            linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[observacao]'       value='" + observacao +"' />"    +"</td>";
            ////          
            linha += "</tr>";

            arraylinhas.push(linha);
            return arraylinhas;

        /////////////////////////// LANÇAMENTO INTEIRO FEITO PARCELADO - DISTANCIA DO VENCIMENTO EM MESES
        }else if (condpgto == "Parcelado" && nroparcela > 0) {
            // console.log('acionado parcelado')
            
            var dtentrada = dataAtual();
        
            var arraylinhas = new Array();
            var linha, valortotAux, valInicio, valtot, recalc ;

            valInicio = parseFloat(valortotal.replace(",", ".")); /// 1000
            valortotAux = parseFloat(parseFloat( valInicio / parseInt(nroparcela)).toFixed(2)); // 333.333
            recalc = parseFloat(valortotAux * parseInt(nroparcela));
            soma = parseFloat(valInicio - recalc).toFixed(2);
                        
            valtot = parseFloat(parseFloat(valInicio) / parseInt(nroparcela)).toFixed(2);            
            
            
            for (var pr = 0; pr < nroparcela; pr++) {
                
                dtvenc = proximoDiaUtilParcela(dtoperacao, pr, diavenc);
                randomico = Math.random();
                
                valtot = 0;
                if(pr == 0){
                    valtot = parseFloat(parseFloat(valortotAux) + parseFloat(soma)).toFixed(2); 
                    valtot = floatParaPadraoBrasileiro(valtot);
                }else{
                    valtot = parseFloat(parseFloat(valInicio) / parseInt(nroparcela)).toFixed(2); 
                    valtot = floatParaPadraoBrasileiro(valtot);
                }
                

                var linha = "<tr>";
                linha += "<td>" + "<div class='btn btn-sm btn-danger mr-1' onclick='excluir(this)' data-ident=" + randomico + " '><i class='fas fa-trash-alt'></i></div>" 
                                + "<div class='btn btn-primary btn-sm ml-1' onclick='editar(this)' data-ident=" + randomico + " '><i class='fas fa-edit'></i></div>" 
                      + "</td>";
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[despesa_receita]'  value='" + movimentacao + "' />"               +"</td>";
                
                if( apareceLancamento.indexOf('ccn4') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn4]'  value='" + ccn4 + "' />"           +"</td>";
                }

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[detalhe]'          value='" + detalhe + "' />"                    +"</td>";
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_operacao]'    value='" + dtoperacao + "' />"                 +"</td>";
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled data-mascara_validacao='monetario' data-podeZero='false' required maxlenght='20' "
                                + "name='linha"+randomico+"[valor_total]' value='" + valtot + "' data-anterior='"+ valtot +"' />"
                      + "</td>";
                
                if( dtVencLncVnd == '' ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled data-mascara_validacao='data' maxlenght='10' required "
                                + "name='linha"+randomico+"[data_vencimento]' value ='" + dtvenc + "' data-anterior='"+ dtvenc +"' data-dtop='" + dtoperacao + "' />"   
                      + "</td>";

                }else{

                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled data-mascara_validacao='data' maxlenght='10' required "
                                + "name='linha"+randomico+"[data_vencimento]' value ='" + dtVencLncVnd + "' data-anterior='"+ dtVencLncVnd +"' data-dtop='" + dtoperacao + "' />"   
                      + "</td>";
                }
                
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[forma_pgto]'        value='" + formapgto + "' />"                  +"</td>";
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[cond_pgto]'         value='" + condpgto + "' />"                   +"</td>";
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[nro_parcela]'          value='" + (pr + 1) + "|" + nroparcela + "' />"   +"</td>";
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_quitacao]'    value=     ''    />"                           +"</td>";
                
                if( apareceLancamento.indexOf('favorecido') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[favorecido]'       value='" + favorecido +"' />"                  +"</td>";
                }
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[conta_corrente]'   value='" + contacorrente + "'/>"               +"</td>";

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[quem_lancou]'      value='" + quemlancou +"' />"                  +"</td>";

                if( apareceLancamento.indexOf('nro_pedido') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[nro_pedido]'       value='" + nropedido + "' />"                  +"</td>";
                }
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[status]'           value=     'A Quitar' />"                      +"</td>";
                
                if( apareceLancamento.indexOf('ccn1') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn1]'  value='" + ccn1 + "' />"           +"</td>";
                }

                if( apareceLancamento.indexOf('ccn2') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn2]'  value='" + ccn2 + "' />"           +"</td>";
                }

                if( apareceLancamento.indexOf('ccn3') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[ccn3]'  value='" + ccn3 + "' />"           +"</td>";
                }
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[adm_cartao]'       value='" + admcartao +"' />"                   +"</td>";
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[bandeira]'         value='" + bandeira +"' />"                    +"</td>";
                
                if( apareceLancamento.indexOf('nro_nf') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[nro_nf]'           value='" + nronf +"'/>"                        +"</td>";
                }
                
                if( apareceLancamento.indexOf('data_emissao_nf') > 0 ){
                    linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_emissao_nf]'  value='" + dataemissaonf +"'/>"                +"</td>";
                }

                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[data_entrada_sistema]' value='" +dtentrada+"'/>"                +"</td>";
                
                linha += "<td>" + "<input type='text' class='form-control-plaintext' readonly disabled required name='linha"+randomico+"[observacao]'       value='" + observacao +"' />"                  +"</td>";
                
                linha += "</tr>";

                arraylinhas.push(linha);
            }

            // console.log('array linha', arraylinhas);

            return arraylinhas;

        }else{
            // console.log('não achou a condição');
        }

    }