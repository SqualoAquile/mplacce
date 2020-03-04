function floatParaPadraoBrasileiro(valor) {
    var valortotal = valor;
    valortotal = number_format(valortotal, 2, ',', '.');
    return valortotal;
}

function floatParaPadraoInternacional(valor) {

    var valortotal = valor;
    valortotal = valortotal.replace(".", "").replace(".", "").replace(".", "").replace(".", "");
    valortotal = valortotal.replace(",", ".");
    valortotal = parseFloat(valortotal).toFixed(2);
    return valortotal;
}

function number_format(numero, decimal, decimal_separador, milhar_separador) {
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

const parametrosSemAcoes = [
    'dinheiro',
    'cartão débito',
    'cartão crédito',
    'boleto',
    'cheque',
    'transferência',
    'TED',
    'DOC',
    'Elo',
    'Visa',
    'MasterCard',
    'BanriCompras',
    'Hiper',
    'Visa Electron',
    'Hipercard',
    'M²',
    'm²',
    'ml',
    'ML',
    'Contato',
    'contato'
];

function Ajax(url, callback, send = {}) {
    $.ajax({
        url: baselink + '/ajax/' + url,
        type: 'POST',
        data: send,
        dataType: 'json',
        success: callback
    });
};

/// BOLCO DO NÍVEL 1
$(function(){
    
    $('#addn1').hide();
    $('#edtn1').hide();
    $('#excn1').hide();

    $('#selec1n1').blur(function(){
        if( $(this).val() == '' ){
            $('#n1').val('').blur();
        }else{
            $('#n1').blur();
        }
    });

    $( "#n1" ).autocomplete({
        source: function( request, response ) {
        $.ajax( { 
            url: baselink + '/ajax/buscaNivel1',
            type:"POST",
            dataType: "json",
            data: {
            term: request.term.trim(),
            mov:$('#selec1n1').val()
            },
            success: function( data ) {
                response( data );
            }
        } );
        },
        minLength: 2,
        select: function( event, ui ) {
            
            // $(this).attr('data-idn1', ui.item.id );
            // $(this).attr('data-nome1', ui.item.value );

        },
        response: function( event, ui ) {
        }
    });
    $( "#n1" ).focus(function(event) {
        if ( $('#selec1n1').val() == '' ){
            alert('Defina a Movimentação.');
            $('#selec1n1').focus();
        }else{
            var termo = "";
            termo = $(this).val().trim();
            $(this).autocomplete( "search" , termo );
        }
    });
    $( "#n1" ).parent('div').addClass('ui-widget');
    $( "#n1" ).on('click',function(){
        if ( $('#selec1n1').val() == '' ){
            alert('Defina a Movimentação.');
            $('#selec1n1').focus();
        }else{
            $(this).keyup();
        }
    });
    $( "#n1" ).blur(function(){
        if ( $('#n1').val() == '' ){
            $('#n1').attr('data-idn1', '' );
            $('#n1').attr('data-nome1', '' );
            $('#addn1').hide();
            $('#edtn1').hide();
            $('#excn1').hide();
            
        }else{
            //buscar se já existe
            let termo = $('#n1').val(), 
                mov = $('#selec1n1').val(), 
                dataid = $('#n1').attr('data-idn1'),
                dataanterior = $('#n1').attr('data-nome1');

            $.ajax( {
                url: baselink + '/ajax/confereTermoNivel1',
                type:"POST",
                dataType: "json",
                data: {
                term: termo.trim(),
                mov:mov
                },
                success: function( data ) {
                    if( data == false ){
                        console.log('existe?', data)
                        // não encontrado
                        if ( $('#n1').attr('data-idn1') == ''  ){
                            // adicionar a nova conta
                            $('#n1').attr('data-idn1', '' );
                            $('#n1').attr('data-nome1', '' );
                            $('#addn1').show();
                            $('#edtn1').hide();
                            $('#excn1').hide();
                        }else{
                            //editar a conta com esse id
                            
                            if ( confirm('Editar de: << '+dataanterior+' >> para: << '+termo+' >>  ?' ) == true ){
                                $('#edtn1').show();
                                $('#addn1').hide();
                            }else{
                                $('#n1').attr('data-idn1', '' );
                                $('#n1').attr('data-nome1', '' );
                                $('#edtn1').hide();
                                $('#addn1').show();
                            }
                            
                            $('#excn1').hide();
                        }
                       
                    }else{
                        console.log('existe?', data[0].id, data[0].value)
                        // foi encontrado
                        $('#n1').attr('data-idn1', data[0].id );
                        $('#n1').attr('data-nome1', data[0].value );
                        $('#addn1').hide();
                        $('#edtn1').hide();
                        $('#excn1').show();

                    }
                }
            } );               
        }
    });

    $('#addn1').on('click', function(){
        $('#selec1n1').blur();
        $('#n1').blur();

        if( $('#selec1n1').val() != '' && $('#n1').val() != '' && $('#n1').attr('data-idn1') == '' ){
            // adicionar a nova conta
            if ( confirm('Confirma a Adição?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/adicionaNivel1',
                    type:"POST",
                    dataType: "json",
                    data: {
                        conta: $('#n1').val(),
                        movimentacao:$('#selec1n1').val()
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi adicionada com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 2000);
                        }else{
                            Toast({
                                message: 'A Conta não foi adicionada! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });
    $('#edtn1').on('click', function(){
        // $('#selec1n1').blur();
        // $('#n1').blur();

        if( $('#selec1n1').val() != '' && 
            $('#n1').val() != '' && 
            $('#n1').attr('data-idn1') != '' &&
            $('#n1').attr('data-nome1') != '' ){
            // adicionar a nova conta
            if ( confirm('Confirma a Edição?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/editaNivel1',
                    type:"POST",
                    dataType: "json",
                    data: {
                        conta: $('#n1').val(),
                        dataanterior: $('#n1').attr('data-nome1'),
                        movimentacao:$('#selec1n1').val(),
                        idconta: $('#n1').attr('data-idn1') 
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi editada com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 2000);
                        }else{
                            Toast({
                                message: 'A Conta não foi editada! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });
    $('#excn1').on('click', function(){
        $('#selec1n1').blur();
        $('#n1').blur();

        if( $('#selec1n1').val() != '' && $('#n1').val() != '' && $('#n1').attr('data-idn1') != '' ){
            // exclui a conta
            if ( confirm('Confirma a Exclusão?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/excluiNivel1',
                    type:"POST",
                    dataType: "json",
                    data: {
                        idconta: $('#n1').attr('data-idn1')
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi excluída com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 1000);
                        }else{
                            Toast({
                                message: 'A Conta não foi excluída! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });

});
/// BOLCO DO NÍVEL 2
$(function(){
    
    $('#addn2').hide();
    $('#edtn2').hide();
    $('#excn2').hide();

    $('#selec1n2').blur(function(){
        if( $(this).val() == '' ){
            $('#selec2n2').empty().append('<option value="" selected  >Selecione</option>'); 
            $('#selec2n2').val('').blur();
            $('#n2').val('').blur();
        }else{
            // popular o select
            $.ajax( {
                url: baselink + '/ajax/buscaNivel1',
                type:"POST",
                dataType: "json",
                data: {
                    mov:$('#selec1n2').val(),
                    term: ''
                },
                success: function( data ) {
                    if(data != ''){
                        $('#selec2n2').empty().append('<option value="" selected  >Selecione</option>') 
                        for(var i=0; i< data.length; i++){  
                            $('#selec2n2').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                        }
                    }else{
                        $('#selec2n2').empty().append('<option value="" selected  >Selecione</option>')  
                    }
                }
            } );
            $('#selec2n2').blur();
            $('#n2').blur();
        }
    });

    $('#selec2n2').blur(function(){
        if( $(this).val() == '' ){
            $('#n2').val('').blur();
        }else{
            $('#n2').blur();
        }
    });

    $( "#n2" ).autocomplete({
        source: function( request, response ) {
        $.ajax( {
            url: baselink + '/ajax/buscaNivel2',
            type:"POST",
            dataType: "json",
            data: {
            term: request.term.trim(),
            nivel1: $('#selec2n2').val(),
            mov:$('#selec1n2').val()
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
    $( "#n2" ).focus(function(event) {
        if ( $('#selec1n2').val() == '' ){
            alert('Defina a Movimentação.');
            $('#selec1n2').focus();

        }else if ( $('#selec2n2').val() == '' ){
            alert('Defina o Nível 1.');
            $('#selec2n2').focus();

        }else{
            var termo = "";
            termo = $(this).val().trim();
            $(this).autocomplete( "search" , termo );
        }
    });
    $( "#n2" ).parent('div').addClass('ui-widget');
    $( "#n2" ).on('click',function(){
        if ( $('#selec1n2').val() == '' ){
            alert('Defina a Movimentação.');
            $('#selec1n2').focus();

        }else if ( $('#selec2n2').val() == '' ){
            alert('Defina o Nível 1.');
            $('#selec2n2').focus();

        }else{
            $(this).keyup();
        }
    });
    $( "#n2" ).blur(function(){
        if ( $('#n2').val() == '' ){
            $('#n2').attr('data-idn2', '' );
            $('#n2').attr('data-nome2', '' );
            $('#addn2').hide();
            $('#edtn2').hide();
            $('#excn2').hide();
            
        }else{
            //buscar se já existe
            let termo = $('#n2').val(), 
                mov = $('#selec1n2').val(),
                nivel1 = $('#selec2n2').val(),
                dataid = $('#n2').attr('data-idn2'),
                dataanterior = $('#n2').attr('data-nome2');

            $.ajax( {
                url: baselink + '/ajax/confereTermoNivel2',
                type:"POST",
                dataType: "json",
                data: {
                    term: termo.trim(),
                    nivel1:nivel1,
                    mov:mov
                },
                success: function( data ) {
                    if( data == false ){
                        console.log('existe?', data)
                        // não encontrado
                        if ( $('#n2').attr('data-idn2') == ''  ){
                            // adicionar a nova conta
                            $('#n2').attr('data-idn2', '' );
                            $('#n2').attr('data-nome2', '' );
                            $('#addn2').show();
                            $('#edtn2').hide();
                            $('#excn2').hide();
                        }else{
                            //editar a conta com esse id
                            
                            if ( confirm('Editar de: << '+dataanterior+' >> para: << '+termo+' >>  ?' ) == true ){
                                $('#edtn2').show();
                                $('#addn2').hide();
                            }else{
                                $('#n2').attr('data-idn2', '' );
                                $('#n2').attr('data-nome2', '' );
                                $('#edtn2').hide();
                                $('#addn2').show();
                            }
                            
                            $('#excn2').hide();
                        }
                       
                    }else{
                        console.log('existe?', data[0].id, data[0].value)
                        // foi encontrado
                        $('#n2').attr('data-idn2', data[0].id );
                        $('#n2').attr('data-nome2', data[0].value );
                        $('#addn2').hide();
                        $('#edtn2').hide();
                        $('#excn2').show();

                    }
                }
            } );               
        }
    });

    $('#addn2').on('click', function(){
        $('#selec1n2').blur();
        $('#selec2n2').blur();
        $('#n2').blur();

        if( $('#selec1n2').val() != '' && $('#selec2n2').val() != '' && $('#n2').val() != '' && $('#n2').attr('data-idn2') == '' ){
            // adicionar a nova conta
            if ( confirm('Confirma a Adição?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/adicionaNivel2',
                    type:"POST",
                    dataType: "json",
                    data: {
                        conta: $('#n2').val(),
                        nivel1:$('#selec2n2').val(),
                        movimentacao:$('#selec1n2').val()
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi adicionada com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 2000);
                        }else{
                            Toast({
                                message: 'A Conta não foi adicionada! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });
    $('#edtn2').on('click', function(){
        if( $('#selec1n2').val() != '' &&
            $('#selec2n2').val() != '' &&  
            $('#n2').val() != '' && 
            $('#n2').attr('data-idn2') != '' &&
            $('#n2').attr('data-nome2') != '' ){
            // adicionar a nova conta
            if ( confirm('Confirma a Edição?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/editaNivel2',
                    type:"POST",
                    dataType: "json",
                    data: {
                        conta: $('#n2').val(),
                        dataanterior: $('#n2').attr('data-nome2'),
                        movimentacao:$('#selec1n2').val(),
                        nivel1:$('#selec2n2').val(),
                        idconta: $('#n2').attr('data-idn2') 
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi editada com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 2000);
                        }else{
                            Toast({
                                message: 'A Conta não foi editada! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });
    $('#excn2').on('click', function(){
        $('#selec1n2').blur();
        $('#n2').blur();

        if( $('#selec1n2').val() != '' && $('#selec2n2').val() != '' && $('#n2').val() != '' && $('#n2').attr('data-idn2') != '' ){
            // exclui a conta
            if ( confirm('Confirma a Exclusão?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/excluiNivel2',
                    type:"POST",
                    dataType: "json",
                    data: {
                        idconta: $('#n2').attr('data-idn2')
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi excluída com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 1000);
                        }else{
                            Toast({
                                message: 'A Conta não foi excluída! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });

});

/// BOLCO DO NÍVEL 3
$(function(){
    
    $('#addn3').hide();
    $('#edtn3').hide();
    $('#excn3').hide();

    $('#selec1n3').blur(function(){
        if( $(this).val() == '' ){
            $('#selec3n3').empty().append('<option value="" selected  >Selecione</option>');
            $('#selec3n3').val('').blur();
            $('#selec2n3').empty().append('<option value="" selected  >Selecione</option>'); 
            $('#selec2n3').val('').blur();
            $('#n3').val('').blur();
        
        }else{
            // popular o select
            $.ajax( {
                url: baselink + '/ajax/buscaNivel1',
                type:"POST",
                dataType: "json",
                data: {
                    mov:$('#selec1n3').val(),
                    term: ''
                },
                success: function( data ) {
                    if(data != ''){
                        $('#selec2n3').empty().append('<option value="" selected  >Selecione</option>') 
                        for(var i=0; i< data.length; i++){  
                            $('#selec2n3').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                        }
                    }else{
                        $('#selec2n3').empty().append('<option value="" selected  >Selecione</option>')  
                    }
                }
            } );

            $('#selec2n3').blur();
            $('#selec3n3').blur();
            $('#n3').blur();
        }
    });

    $('#selec2n3').blur(function(){
        if( $('#selec1n3').val() != '' ){
            if( $(this).val() == '' ){
                $('#selec3n3').empty().append('<option value="" selected  >Selecione</option>'); 
                $('#selec3n3').val('').blur();
                $('#n3').val('').blur();
            }else{
            // popular o select
            
                $.ajax( {
                    url: baselink + '/ajax/buscaNivel2',
                    type:"POST",
                    dataType: "json",
                    data: {
                        mov:$('#selec1n3').val(),
                        nivel1:$('#selec2n3').val(),
                        term: ''
                    },
                    success: function( data ) {
                        if(data != ''){
                            $('#selec3n3').empty().append('<option value="" selected  >Selecione</option>') 
                            for(var i=0; i< data.length; i++){  
                                $('#selec3n3').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                            }
                        }else{
                            $('#selec3n3').empty().append('<option value="" selected  >Selecione</option>')  
                        }
                    }
                } );
                $('#selec3n3').blur();
                $('#n3').blur();
            }
        }else{
            
            $('#n3').val('').blur();
            $('#selec3n3').val('').blur();
            $('#selec2n3').val('').blur();
        }
    });

    $('#selec3n3').blur(function(){
        if( $(this).val() == '' ){
            $('#n3').val('').blur();
        }else{
            $('#n3').blur();
        }
    });

    $( "#n3" ).autocomplete({
        source: function( request, response ) {
        $.ajax( {
            url: baselink + '/ajax/buscaNivel3',
            type:"POST",
            dataType: "json",
            data: {
                term: request.term.trim(),
                nivel1: $('#selec2n3').val(),
                nivel2: $('#selec3n3').val(),
                mov:$('#selec1n3').val()
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
    $( "#n3" ).focus(function(event) {
        if ( $('#selec1n3').val() == '' ){
            alert('Defina a Movimentação.');
            $('#selec1n3').focus();

        }else if ( $('#selec2n3').val() == '' ){
            alert('Defina o Nível 1.');
            $('#selec2n3').focus();

        }else if ( $('#selec3n3').val() == '' ){
            alert('Defina o Nível 2.');
            $('#selec3n3').focus();

        }else{
            var termo = "";
            termo = $(this).val().trim();
            $(this).autocomplete( "search" , termo );
        }
    });
    $( "#n3" ).parent('div').addClass('ui-widget');
    $( "#n3" ).on('click',function(){
        if ( $('#selec1n3').val() == '' ){
            alert('Defina a Movimentação.');
            $('#selec1n3').focus();

        }else if ( $('#selec2n3').val() == '' ){
            alert('Defina o Nível 1.');
            $('#selec2n3').focus();

        }else if ( $('#selec3n3').val() == '' ){
            alert('Defina o Nível 2.');
            $('#selec2n3').focus();

        }else{
            $(this).keyup();
        }
    });
    $( "#n3" ).blur(function(){
        if ( $('#n3').val() == '' ){
            $('#n3').attr('data-idn3', '' );
            $('#n3').attr('data-nome3', '' );
            $('#addn3').hide();
            $('#edtn3').hide();
            $('#excn3').hide();
            
        }else{
            //buscar se já existe
            let termo = $('#n3').val(), 
                mov = $('#selec1n3').val(),
                nivel1 = $('#selec2n3').val(),
                nivel2 = $('#selec3n3').val(),
                dataid = $('#n3').attr('data-idn3'),
                dataanterior = $('#n3').attr('data-nome3');

            $.ajax( {
                url: baselink + '/ajax/confereTermoNivel3',
                type:"POST",
                dataType: "json",
                data: {
                    term: termo.trim(),
                    nivel1:nivel1,
                    nivel2:nivel2,
                    mov:mov
                },
                success: function( data ) {
                    if( data == false ){
                        console.log('existe3?', data)
                        // não encontrado
                        if ( $('#n3').attr('data-idn3') == ''  ){
                            // adicionar a nova conta
                            $('#n3').attr('data-idn3', '' );
                            $('#n3').attr('data-nome3', '' );
                            $('#addn3').show();
                            $('#edtn3').hide();
                            $('#excn3').hide();
                        }else{
                            //editar a conta com esse id
                            
                            if ( confirm('Editar de: << '+dataanterior+' >> para: << '+termo+' >>  ?' ) == true ){
                                $('#edtn3').show();
                                $('#addn3').hide();
                            }else{
                                $('#n3').attr('data-idn3', '' );
                                $('#n3').attr('data-nome3', '' );
                                $('#edtn3').hide();
                                $('#addn3').show();
                            }
                            
                            $('#excn3').hide();
                        }
                       
                    }else{
                        console.log('existe3?', data[0].id, data[0].value)
                        // foi encontrado
                        $('#n3').attr('data-idn3', data[0].id );
                        $('#n3').attr('data-nome3', data[0].value );
                        $('#addn3').hide();
                        $('#edtn3').hide();
                        $('#excn3').show();

                    }
                }
            } );               
        }
    });

    $('#addn3').on('click', function(){
        $('#selec1n3').blur();
        $('#selec2n3').blur();
        $('#selec3n3').blur();
        $('#n3').blur();

        if( $('#selec1n3').val() != '' && $('#selec2n3').val() != '' && $('#selec3n3').val() != '' && $('#n3').val() != '' && $('#n3').attr('data-idn3') == '' ){
            // adicionar a nova conta
            if ( confirm('Confirma a Adição?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/adicionaNivel3',
                    type:"POST",
                    dataType: "json",
                    data: {
                        conta: $('#n3').val(),
                        nivel1:$('#selec2n3').val(),
                        nivel2:$('#selec3n3').val(),
                        movimentacao:$('#selec1n3').val()
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi adicionada com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 1000);
                        }else{
                            Toast({
                                message: 'A Conta não foi adicionada! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });
    $('#edtn3').on('click', function(){
        if( $('#selec1n3').val() != '' && $('#selec2n3').val() != '' && $('#selec3n3').val() != '' &&  
            $('#n3').val() != '' && $('#n3').attr('data-idn3') != '' && $('#n3').attr('data-nome3') != '' ){
            // adicionar a nova conta
            if ( confirm('Confirma a Edição?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/editaNivel3',
                    type:"POST",
                    dataType: "json",
                    data: {
                        conta: $('#n3').val(),
                        dataanterior: $('#n3').attr('data-nome3'),
                        movimentacao:$('#selec1n3').val(),
                        nivel1:$('#selec2n3').val(),
                        nivel2:$('#selec3n3').val(),
                        idconta: $('#n3').attr('data-idn3') 
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi editada com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 1000);
                        }else{
                            Toast({
                                message: 'A Conta não foi editada! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });
    $('#excn3').on('click', function(){

        if( $('#selec1n3').val() != '' && $('#selec2n3').val() != '' && $('#selec3n3').val() != '' && $('#n3').val() != '' && $('#n3').attr('data-idn3') != '' ){
            // exclui a conta
            if ( confirm('Confirma a Exclusão?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/excluiNivel3',
                    type:"POST",
                    dataType: "json",
                    data: {
                        idconta: $('#n3').attr('data-idn3')
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi excluída com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 1000);
                        }else{
                            Toast({
                                message: 'A Conta não foi excluída! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });

});

/// BOLCO DO NÍVEL 4
$(function(){
    
    $('#addn4').hide();
    $('#edtn4').hide();
    $('#excn4').hide();

    $('#selec1n4').blur(function(){
        if( $(this).val() == '' ){
            $('#selec4n4').empty().append('<option value="" selected  >Selecione</option>');
            $('#selec4n4').val('').blur();
            $('#selec3n4').empty().append('<option value="" selected  >Selecione</option>');
            $('#selec3n4').val('').blur();
            $('#selec2n4').empty().append('<option value="" selected  >Selecione</option>'); 
            $('#selec2n4').val('').blur();
            $('#n4').val('').blur();
        
        }else{
            // popular o select
            $.ajax( {
                url: baselink + '/ajax/buscaNivel1',
                type:"POST",
                dataType: "json",
                data: {
                    mov:$('#selec1n4').val(),
                    term: ''
                },
                success: function( data ) {
                    if(data != ''){
                        $('#selec2n4').empty().append('<option value="" selected  >Selecione</option>') 
                        for(var i=0; i< data.length; i++){  
                            $('#selec2n4').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                        }
                    }else{
                        $('#selec2n4').empty().append('<option value="" selected  >Selecione</option>')  
                    }
                }
            } );

            $('#selec2n4').blur();
            $('#selec3n4').blur();
            $('#selec4n4').blur();
            $('#n4').blur();
        }
    });

    $('#selec2n4').blur(function(){
        if( $('#selec1n4').val() != '' ){
            if( $(this).val() == '' ){
                $('#selec3n4').empty().append('<option value="" selected  >Selecione</option>'); 
                $('#selec3n4').val('').blur();
                $('#selec4n4').empty().append('<option value="" selected  >Selecione</option>'); 
                $('#selec4n4').val('').blur();
                $('#n4').val('').blur();
            }else{
            // popular o select
            
                $.ajax( {
                    url: baselink + '/ajax/buscaNivel2',
                    type:"POST",
                    dataType: "json",
                    data: {
                        mov:$('#selec1n4').val(),
                        nivel1:$('#selec2n4').val(),
                        term: ''
                    },
                    success: function( data ) {
                        if(data != ''){
                            $('#selec3n4').empty().append('<option value="" selected  >Selecione</option>') 
                            for(var i=0; i< data.length; i++){  
                                $('#selec3n4').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                            }
                        }else{
                            $('#selec3n4').empty().append('<option value="" selected  >Selecione</option>')  
                        }
                    }
                } );
                $('#selec3n4').blur();
                $('#selec4n4').blur();
                $('#n4').blur();
            }
        }else{
            
            $('#n4').val('').blur();
            $('#selec4n4').val('').blur();
            $('#selec3n4').val('').blur();
            $('#selec2n4').val('').blur();
        }
    });

    $('#selec3n4').blur(function(){
        if( $(this).val() == '' ){
            $('#selec4n4').empty().append('<option value="" selected  >Selecione</option>'); 
            $('#selec4n4').val('').blur();
            $('#n4').val('').blur();

        }else{

             $.ajax( {
                    url: baselink + '/ajax/buscaNivel3',
                    type:"POST",
                    dataType: "json",
                    data: {
                        mov:$('#selec1n4').val(),
                        nivel1:$('#selec2n4').val(),
                        nivel2:$('#selec3n4').val(),
                        term: ''
                    },
                    success: function( data ) {
                        if(data != ''){
                            $('#selec4n4').empty().append('<option value="" selected  >Selecione</option>') 
                            for(var i=0; i< data.length; i++){  
                                $('#selec4n4').append("<option value='"+data[i]['id']+"' >"+data[i]['value']+"</option>")
                            }
                        }else{
                            $('#selec4n4').empty().append('<option value="" selected  >Selecione</option>')  
                        }
                    }
                } );
                $('#selec4n4').blur();
                $('#n4').blur();
        }
    });

    $('#selec4n4').blur(function(){
        if( $(this).val() == '' ){
            $('#n4').val('').blur();
        }else{
            $('#n4').blur();
        }
    });

    $( "#n4" ).autocomplete({
        source: function( request, response ) {
        $.ajax( {
            url: baselink + '/ajax/buscaNivel4',
            type:"POST",
            dataType: "json",
            data: {
                term: request.term.trim(),
                nivel1: $('#selec2n4').val(),
                nivel2: $('#selec3n4').val(),
                nivel3: $('#selec4n4').val(),
                mov:$('#selec1n4').val()
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
    $( "#n4" ).focus(function(event) {
        if ( $('#selec1n4').val() == '' ){
            alert('Defina a Movimentação.');
            $('#selec1n4').focus();

        }else if ( $('#selec2n4').val() == '' ){
            alert('Defina o Nível 1.');
            $('#selec2n4').focus();

        }else if ( $('#selec3n4').val() == '' ){
            alert('Defina o Nível 2.');
            $('#selec3n4').focus();

        }else if ( $('#selec4n4').val() == '' ){
            alert('Defina o Nível 3.');
            $('#selec4n4').focus();

        }else{
            var termo = "";
            termo = $(this).val().trim();
            $(this).autocomplete( "search" , termo );
        }
    });
    $( "#n4" ).parent('div').addClass('ui-widget');
    $( "#n4" ).on('click',function(){
        if ( $('#selec1n4').val() == '' ){
            alert('Defina a Movimentação.');
            $('#selec1n4').focus();

        }else if ( $('#selec2n4').val() == '' ){
            alert('Defina o Nível 1.');
            $('#selec2n4').focus();

        }else if ( $('#selec3n4').val() == '' ){
            alert('Defina o Nível 2.');
            $('#selec3n4').focus();

        }else if ( $('#selec4n4').val() == '' ){
            alert('Defina o Nível 3.');
            $('#selec4n4').focus();

        }else{
            $(this).keyup();
        }
    });
    $( "#n4" ).blur(function(){
        if ( $('#n4').val() == '' ){
            $('#n4').attr('data-idn4', '' );
            $('#n4').attr('data-nome4', '' );
            $('#addn4').hide();
            $('#edtn4').hide();
            $('#excn4').hide();
            
        }else{
            //buscar se já existe
            let termo = $('#n4').val(), 
                mov = $('#selec1n4').val(),
                nivel1 = $('#selec2n4').val(),
                nivel2 = $('#selec3n4').val(),
                nivel3 = $('#selec4n4').val(),
                dataid = $('#n4').attr('data-idn4'),
                dataanterior = $('#n4').attr('data-nome4');

            $.ajax( {
                url: baselink + '/ajax/confereTermoNivel4',
                type:"POST",
                dataType: "json",
                data: {
                    term: termo.trim(),
                    nivel1:nivel1,
                    nivel2:nivel2,
                    nivel3:nivel3,
                    mov:mov
                },
                success: function( data ) {
                    if( data == false ){
                        console.log('existe3?', data)
                        // não encontrado
                        if ( $('#n4').attr('data-idn4') == ''  ){
                            // adicionar a nova conta
                            $('#n4').attr('data-idn4', '' );
                            $('#n4').attr('data-nome4', '' );
                            $('#addn4').show();
                            $('#edtn4').hide();
                            $('#excn4').hide();
                        }else{
                            //editar a conta com esse id
                            
                            if ( confirm('Editar de: << '+dataanterior+' >> para: << '+termo+' >>  ?' ) == true ){
                                $('#edtn4').show();
                                $('#addn4').hide();
                            }else{
                                $('#n4').attr('data-idn4', '' );
                                $('#n4').attr('data-nome4', '' );
                                $('#edtn4').hide();
                                $('#addn4').show();
                            }
                            
                            $('#excn4').hide();
                        }
                       
                    }else{
                        console.log('existe3?', data[0].id, data[0].value)
                        // foi encontrado
                        $('#n4').attr('data-idn4', data[0].id );
                        $('#n4').attr('data-nome4', data[0].value );
                        $('#addn4').hide();
                        $('#edtn4').hide();
                        $('#excn4').show();

                    }
                }
            } );               
        }
    });

    $('#addn4').on('click', function(){
        $('#selec1n4').blur();
        $('#selec2n4').blur();
        $('#selec3n4').blur();
        $('#selec4n4').blur();
        $('#n4').blur();

        if( $('#selec1n4').val() != '' && $('#selec2n4').val() != '' && 
            $('#selec3n4').val() != '' && $('#selec4n4').val() != '' && 
            $('#n4').val() != '' && $('#n4').attr('data-idn4') == '' ){
            // adicionar a nova conta
            if ( confirm('Confirma a Adição?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/adicionaNivel4',
                    type:"POST",
                    dataType: "json",
                    data: {
                        conta: $('#n4').val(),
                        nivel1:$('#selec2n4').val(),
                        nivel2:$('#selec3n4').val(),
                        nivel3:$('#selec4n4').val(),
                        movimentacao:$('#selec1n4').val()
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi adicionada com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 1000);
                        }else{
                            Toast({
                                message: 'A Conta não foi adicionada! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });
    $('#edtn4').on('click', function(){
        if( $('#selec1n4').val() != '' && $('#selec2n4').val() != '' && 
            $('#selec3n4').val() != '' && $('#selec4n4').val() != '' &&  
            $('#n4').val() != '' && $('#n4').attr('data-idn4') != '' && $('#n4').attr('data-nome4') != '' ){
            // adicionar a nova conta
            if ( confirm('Confirma a Edição?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/editaNivel4',
                    type:"POST",
                    dataType: "json",
                    data: {
                        conta: $('#n4').val(),
                        dataanterior: $('#n4').attr('data-nome4'),
                        movimentacao:$('#selec1n4').val(),
                        nivel1:$('#selec2n4').val(),
                        nivel2:$('#selec3n4').val(),
                        nivel3:$('#selec4n4').val(),
                        idconta: $('#n4').attr('data-idn4') 
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi editada com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 1000);
                        }else{
                            Toast({
                                message: 'A Conta não foi editada! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });
    $('#excn4').on('click', function(){

        if( $('#selec1n4').val() != '' && $('#selec2n4').val() != '' && 
            $('#selec3n4').val() != '' && $('#selec4n4').val() != '' && 
            $('#n4').val() != '' && $('#n4').attr('data-idn4') != '' ){
            // exclui a conta
            if ( confirm('Confirma a Exclusão?') == true ){
                $.ajax( {
                    url: baselink + '/ajax/excluiNivel4',
                    type:"POST",
                    dataType: "json",
                    data: {
                        idconta: $('#n4').attr('data-idn4')
                    },
                    success: function( data ) {
                        if(data == true){
                            Toast({
                                message: 'A Conta foi excluída com sucesso!',
                                class: 'alert-success'
                            });
                            setTimeout(function(){
                                location.reload(true);
                              }, 1000);
                        }else{
                            Toast({
                                message: 'A Conta não foi excluída! Tente Novamente.',
                                class: 'alert-danger'
                            });
                        }
                    }
                } );
            }
              
        }else{
            alert('Preencha os campos corretamente.');
            return false;
        }
    });

});