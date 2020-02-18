// fazer a dinamica dos campos de hora inicial e final e duração - ok
// quando clicar na hora inicial buscar a agenda do profissional e verificar a disponibilidade
// fazer o btn da preferencia do profissional - ok
// fazer o backend via ajax do salvamento na tabela
// criar a tabela de agendamentos e de eventos

$(function () {
    var servicosProfissional = [];
    $.ajax({
        url: baselink + "/ajax/buscarTodosParametros",
        type: "POST",
        data: {
          tabela: "parametros"
        },
        dataType: "json",
        success: function(data) {
        //   console.log(data)
          $('#agnd_hora_final').attr('data-hora_limite_op', data['hora_limite_operacao']);
          $('#agnd_hora_inicio').attr('data-hora_inicio_op', data['hora_inicio_operacao']);
          
        }
      });

    $('#dt_inicio').val(dataAtual());
    $('#dt_inicio').datepicker().on('hide', function(e) {
       $(this).blur();
    });
    $('#dt_inicio').on('blur', function(){
        if( $('#dt_inicio').val() == '' ){

            $('#dt_inicio').val(dataAtual()).blur();
        
        }else{

            dtinicio = $(this).val();
            dtinicio = dtinicio.split('/');
            dtinicio = parseInt( dtinicio[2]+dtinicio[1]+dtinicio[0] );

            dtatual = dataAtual();
            dtatual = dtatual.split('/');
            dtatual = parseInt( dtatual[2]+dtatual[1]+dtatual[0] );
            
            if ( dtinicio < dtatual ){
                $('#dt_inicio').val(dataAtual()).blur();
            }
        }
    });
    $('#dt_inicio').val(dataAtual());

    $( "#cliente" ).blur(function(){
        if ( $(this).val() == '' ){
            $(this).attr('data-id', '' );
            $(this).attr('data-descserv', '' );
            $(this).attr('data-descprod', '' );
        }
    });
    $( "#cliente" ).autocomplete({
        source: function( request, response ) {
        $.ajax( {
            url: baselink + '/ajax/buscaClientes',
            type:"POST",
            dataType: "json",
            data: {
            term: request.term
            },
            success: function( data ) {
                // console.log('resposta:', data);
                response( data );
            }
        } );
        },
        minLength: 2,
        select: function( event, ui ) {
            
            $(this).attr('data-idclie', ui.item.id );
            $(this).attr('data-descserv', ui.item.desc_servico );
            $(this).attr('data-descprod', ui.item.desc_produto );

            // $('#agnd_servico').val(ui.item.grupo).blur();
            // $('#agnd_hora_inicio').val( floatParaPadraoBrasileiro( ui.item.porcent_prof ) + '%').blur();
            // $('#agnd_duracao').val( floatParaPadraoBrasileiro( ui.item.porcent_casa ) + '%').blur();
            // $('#agnd_hora_final').val(ui.item.duracao).blur();
            // $('#serv_preco').val( floatParaPadraoBrasileiro( ui.item.preco ) ).blur();

        },
        response: function( event, ui ) {
            // for (var i = 0; i < ui.content.length; i++){
            //     if(ui.content[i].label.toLowerCase() == "Calhas Venezianas".toLowerCase() ){
            //         console.log('a posição desse cara é: ',i, ui.content[i].label);
            //     }
                    
                
            // }
            // console.log('fonte:', ui.content);
        }
    });
    $( "#cliente" ).focus(function(event) {
      var termo = "";
      termo = $(this).val().trim();
      $(this).autocomplete( "search" , termo );
    });
    $( "#cliente" ).parent('div').addClass('ui-widget');
    $( "#cliente" ).on('click',function(){
        $(this).keyup();
    });

    $( "#agnd_profissional" ).autocomplete({
        source: function( request, response ) {
        $.ajax( {
            url: baselink + '/ajax/buscaProfissionais',
            type:"POST",
            dataType: "json",
            data: {
            term: request.term
            },
            success: function( data ) {
                response( data );
            }
        } );
        },
        minLength: 2,
        select: function( event, ui ) {
            
            $(this).attr('data-idprof', ui.item.id);
            
            $("#agnd_servico").empty().val('').append('<option value="" selected  >Selecione</option>');
            for (i = 0; i < ui.item.servicosCompleto.length; i++) {
                $("#agnd_servico").append('<option value="' + ui.item.servicosCompleto[i][0].trim() + '" data-duracao="'+ parseInt(ui.item.servicosCompleto[i][4]) + '" >' + ui.item.servicosCompleto[i][0].trim() + '</option>');
            }
        },
        response: function( event, ui ) {
        }
    });
    $( "#agnd_profissional" ).focus(function(event) {
      var termo = "";
      termo = $(this).val().trim();
      $(this).autocomplete( "search" , termo );
    });
    $( "#agnd_profissional" ).parent('div').addClass('ui-widget');
    $( "#agnd_profissional" ).on('click',function(){
        $("#agnd_profissional").keyup();
    });

    $('#agnd_servico').on('change', function(){
        var duracao = parseInt( $(this).find(':selected').attr('data-duracao') );
        if( duracao > 0 ){
            $('#agnd_duracao').val( duracao );
        }else{
            $('#agnd_duracao').val( 0 );
        }
        
    });
    
    $('#agnd_hora_inicio').on('blur', function(){
        var horas = parseInt( $('#agnd_hora_inicio').val().slice(0,2) );
        var horalimite = parseInt( $('#agnd_hora_inicio').attr('data-hora_inicio_op') );
        // console.log(horas + '-- ' + horalimite)
        if( $('#agnd_hora_inicio').val() == ''){
            return false;
        }else if ( $('#agnd_duracao').val() == '' ){ 
            $('#agnd_duracao').focus();
            return false;
        }else if (  horas < horalimite ){
            alert('Hora Inicial é anterior a Hora Inicial de Operação.');
            $('#agnd_hora_inicio').val('').focus();
            return ;
        }else{
            calculaHoraFinal();
        }
    });

    $('#agnd_duracao').on('blur', function(){
        if( $('#agnd_duracao').val() == ''){
            return false;
        }else if ( $('#agnd_hora_inicio').val() == '' ){ 
            $('#agnd_hora_inicio').focus();
            return false;
        }else{
            calculaHoraFinal();
        }
    });

    $('#agnd_hora_final').on('blur', function(){
        var horas = parseInt( $('#agnd_hora_final').val().slice(0,2) );
        var horalimite = parseInt( $('#agnd_hora_final').attr('data-hora_limite_op') );

        if( $('#agnd_hora_final').val() == ''){
            return ;
        }else if ( $('#duracao').val() == '' ){ 
            $('#duracao').focus();
            return ;
        }else if (  horas >= horalimite ){
            alert('Hora Final ultrapassa a Hora Limite de Operação.');
            $('#agnd_hora_final').val('').focus();
            return ;
        }else{
            calculaDuracao();
        }
    });

    $('#btn_salvar_agnd').on('click', function(){
        if ( $('#dt_inicio').val() == '' ){
            $('#dt_inicio').focus();
            // console.log('reprovads')
            return ;

        }else{
            $('#dt_inicio').blur();
            if ( $('#dt_inicio').hasClass('is-valid') == false ){
                $('#dt_inicio').focus();
                // console.log('reprovads')
                return false;
            }
        } 
        if ( $('#cliente').val() == '' ){
            $('#cliente').focus();
            // console.log('reprovads')
            return false;

        }else{
            $('#cliente').blur();
            if ( $('#cliente').hasClass('is-valid') == false ){
                $('#cliente').focus();
                // console.log('reprovads')
                return false;
            }
        }         

        if( $('#eventos tbody tr').length <= 0 ){
            alert('Precisa ter pelo menos um evento na tabela.');
            return false;
        }
        
        // montar o array que vai ser usado no model
        var arrayenvio = [], arraylinhas = [], arrayChaves = [];

        for(var j=0; j < $('#eventos tbody tr').length; j++){
                var idprofis = '', idprofissional = '', nomeprofissional = '';
                    idprofis = $('#eventos tbody tr:eq('+j+') td:eq(0)').text();
                    idprofis = idprofis.replace( '(' , '' );
                    idprofis = idprofis.split(')');
                    idprofissional = parseInt(idprofis[0]);
                    nomeprofissional = idprofis[1];
                
                var clien = '', idcliente = '', telefonecliente = '', nomecliente = '';
                    idcliente = parseInt( $('#cliente').attr('data-idclie') );
                    clien = $('#cliente').val();
                    clien = clien.split('--');
                    nomecliente = clien[0];
                    telefonecliente = clien[1];
                
                var servicos = $('input[name=servicos]').val();
                var observacaoAgendamento = $('#observacao').val();

                arrayenvio.push({
                        idprof: idprofissional, 
                        profissional: nomeprofissional,
                        id_cliente: 2,
                        cliente: nomecliente.trim(),
                        tel_cliente: telefonecliente.trim(),
                        servico: $('#eventos tbody tr:eq('+j+') td:eq(1)').text(),
                        preferencia: $('#eventos tbody tr:eq('+j+') td:eq(2)').text(),
                        dt_inicio: $('#dt_inicio').val(),
                        hora_inicio: $('#eventos tbody tr:eq('+j+') td:eq(3)').text(),
                        dt_fim: $('#dt_inicio').val(),
                        hora_fim: $('#eventos tbody tr:eq('+j+') td:eq(5)').text(),
                        duracao: parseInt( $('#eventos tbody tr:eq('+j+') td:eq(4)').text() ),
                        cor: '#CCCCCC',
                        status: 'agendado'
                });
        }
        // console.log('array de envio:', arrayenvio)4
        // console.log('APROVADO')
        
        // enviar pro model, fazer a adição
        if ( confirm("Confirma o(s) Agendamento(s)?") == true ){
            $.ajax( {
                url: baselink + '/ajax/adicionarEventos',
                type:"POST",
                dataType: "json",
                data: {
                    eventos: arrayenvio,
                    servicos: servicos,
                    obsAgnd: observacaoAgendamento
                },
                success: function( data ) {
                    console.log('retorno ajax:', data)
                    // dar retorno da adição
                    if(data == true){
                        Toast({
                            message: 'Agendamento feito com sucesso!',
                            class: 'alert-success'
                        });
                    }else{
                        Toast({
                            message: 'O Agendamento não foi realizado! Tente Novamente.',
                            class: 'alert-danger'
                        });
                    }
                }
            } );
        }else{
            return;
        }
        
        

    });

});// fim do $(function () {

function calculaHoraFinal(){
    var $horaI = $('#agnd_hora_inicio');
    var $horaF = $('#agnd_hora_final');
    var $duracao = $('#agnd_duracao') ;
    var horalimite = parseInt( $('#agnd_hora_final').attr('data-hora_limite_op') );
    var minutos = 0, horas = 0; hrmais = 0, hrplus = 0, minmais = 0, texthora = '', durac = 0;
    
    if( $horaI.val() == '' ){
        $horaI.focus();
        return ;
    }
    if( $duracao.val() == '' ){
        $duracao.focus();
        return ;
    }
    texthora = $horaI.val();
    horas = parseInt(  texthora.slice(0,2) );
    minutos = parseInt( texthora.slice(-2) );
    durac = parseInt( $duracao.val() );
    hrmais = parseFloat(  Math.floor( durac / 60 ));
    minmais = Math.round( parseFloat(( parseFloat( durac / 60 ) - hrmais ) * 60 )) ;


    if ( parseInt(minutos + minmais ) > 60 ){
        
        hrplus = parseFloat(  Math.floor( (minmais + minutos)  / 60 ));
        minmais = Math.round( parseFloat(( parseFloat( (minmais + minutos) / 60 ) - hrplus ) * 60 )) ;
        hrmais = parseInt(hrmais + hrplus);
            
    }else if ( parseInt(minutos + minmais ) == 60 ){
        hrplus = parseInt(1);
        hrmais = parseInt(hrmais + hrplus);
        minmais = parseInt(0);

    }else{

        hrplus = parseInt(0);
        minmais = parseInt( minmais + minutos );
        hrmais = parseInt(hrmais + hrplus);
    }

    hrfinal = parseInt( horas + hrmais);
    minfinal = minmais;

    if ( hrfinal >= horalimite ){
        alert('Hora Final ultrapassou a Hora Limite de Operação.');
        $horaI.val('').blur().focus();
        return ;
    }

    if(hrfinal <= 9){
        hrfinal = '0'+ hrfinal;
    }
    if( minfinal <= 9 ){
        minfinal = '0' + minfinal;
    }
    // console.log('hrmais:', hrmais);
    // console.log('minmais:', minmais);
    // console.log('hora final', hrfinal + ":" + minfinal );
    $horaF.val( hrfinal + ":" + minfinal );
}

function calculaHoraInicial(){
    var $horaI = $('#agnd_hora_inicio');
    var $horaF = $('#agnd_hora_final');
    var $duracao = $('#agnd_duracao') ;
    var horaInicio = parseInt( $('#agnd_hora_inicio').attr('data-hora_inicio_op') );
    
    if( $horaF.val() == '' ){
        $horaF.focus();
        return ;
    }
    if( $duracao.val() == '' ){
        $duracao.focus();
        return ;
    }
    
    texthora = $horaF.val();
    horas = parseInt(  texthora.slice(0,2) );
    minutos = parseInt( texthora.slice(-2) );
    durac = parseInt( $duracao.val() );
    hrmais = parseFloat(  Math.floor( durac / 60 ));
    minmais = Math.round( parseFloat(( parseFloat( durac / 60 ) - hrmais ) * 60 )) ;

    var mintot = parseInt(horas*60) + minutos;
        mintot = mintot - durac;
    var hrmenos = parseFloat(  Math.floor( mintot / 60 ));
        minmenos = Math.round( parseFloat(( parseFloat( mintot / 60 ) - hrmenos ) * 60 )) ;

    if ( hrmenos < horaInicio ){
        alert('Hora Inicial é menor do que a hora de Início da Operação.');
        $horaF.val('').blur().focus();
        return false;
    }

    if(hrmenos <= 9){
        hrmenos = '0'+ hrmenos;
    }
    if( minmenos <= 9 ){
        minmenos = '0' + minmenos;
    }
    
    $horaI.val( hrmenos + ":" + minmenos );
}

function calculaDuracao(){
    // console.log('calculando duração...')
    var $horaI = $('#agnd_hora_inicio');
    var $horaF = $('#agnd_hora_final');
    var $duracao = $('#agnd_duracao') ;
    
    if( $horaF.val() == '' ){
        $horaF.focus();
        return ;
    }
    if( $duracao.val() == '' ){
        $duracao.focus();
        return ;
    }
    if( $horaI.val() == '' ){
        $horaI.focus();
        return ;
    }
    
    texthoraF = $horaF.val();
    horasF = parseInt(  texthoraF.slice(0,2) );
    minutosF = parseInt( texthoraF.slice(-2) );

    texthoraI = $horaI.val();
    horasI = parseInt(  texthoraI.slice(0,2) );
    minutosI = parseInt( texthoraI.slice(-2) );
    
    durac = ( parseInt( parseInt( horasF * 60 ) + minutosF )  - parseInt( parseInt( horasI * 60 ) + minutosI ) ) 
    
    if ( durac > 0 ){
        $duracao.val( durac );
    
    }else {
        $horaF.val('').removeClass('is-valid is-invalid').focus();
    }
    
}

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