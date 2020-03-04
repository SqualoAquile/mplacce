$(function () {
    /// FORNECEDORES
    $( "#fornecedor" ).autocomplete({
        source: function( request, response ) {
        $.ajax( {
            url: baselink + '/ajax/buscaFornecedores',
            type:"POST",
            dataType: "json",
            data: {
                term: request.term.trim(),
                negocio:$('#negocio').val()
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
    $( "#fornecedor" ).focus(function(event) {
        if( $('#negocio').val() == '' ){
            $(this).val('').blur();
            $('#negocio').focus();
        }else{
            var termo = "";
            termo = $(this).val().trim();
            $(this).autocomplete( "search" , termo );
        }
        
      
    });
    $( "#fornecedor" ).parent('div').addClass('ui-widget');
    $( "#fornecedor" ).on('click',function(){
        if( $('#negocio').val() == '' ){
            $(this).val('').blur();
            $('#negocio').focus();
        }else{
            $(this).keyup();
        }
        
    });

    $('#un_entrada').blur(function(){
        if( $(this).val() == '' ){
            $('#equiv_unidades').val('').blur();
            $('#un_saida').val('').blur();
        }
    });
    
    // $('#un_saida').parent().parent().addClass('btn btn-lg btn-danger')
    // $('#un_saida').parent().parent().attr('data-container','body');
    // $('#un_saida').parent().parent().attr('data-placement','top');
    // $('#un_saida').parent().parent().attr('data-content','Conteúdo do Popover afudê!');
    // $('#un_saida').parent().parent().attr('data-toggle','popover');
    // $('#un_saida').parent().parent().attr('title','teste de Popover');
    
    $('#un_saida').blur(function(){
        let $unEntrada = $('#un_entrada'), $unSaida = $(this), $equiv = $('#equiv_unidades');
        if ( $unSaida.val() != '' ){
            if ( $unEntrada.val() == '' ){
                $unSaida.val('').blur();
                $unEntrada.focus();
                
            }else if( $equiv.val() == '' ){
                $unSaida.val('').blur();
                $equiv.focus();
            
            }else{
                var text = '1 '+ $unEntrada.find(':selected').text() + ' Equivale a ' + $equiv.val() + '  ' + $unSaida.find(':selected').text(); 
                if ( confirm( text ) == false  ){
                    $unSaida.val('').blur();
                }
            }
        }
    });
    

    $("#custo_unsaida, #preco_unsaida").blur(function(){
        var $custo = $("#custo_unsaida");
        var $preco = $("#preco_unsaida");

        if( $custo.val() != "" && $preco.val() == "" ){

            return
        }
        
        if( $custo.val() == "" && $preco.val() != "" ){
            $preco.removeClass('is-valid').addClass('is-invalid');
            $preco[0].setCustomValidity('invalid');
            $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo..</div>');
            $preco.val("");
            return;
        }
        
        if( $custo.val() != "" && $preco.val() != "" ){
            if( maiorque($custo , $preco) == false){
                //custo não é maior que
                $preco.removeClass('is-valid').addClass('is-invalid');
                $preco[0].setCustomValidity('invalid');
                $preco.after('<div class="invalid-feedback">O valor do preço deve ser maior do que o valor do custo.</div>');
                $preco.val("");
                return;
            }    
        }
    });

    $('#preco_unsaida').blur(function(){
        if( $(this).val() != '' ){
            var preco, precoaux, custo, custoaux, margemaux, margem;
            precoaux = $(this).val(); 
            precoaux = precoaux.replace(',','.').replace(',','.').replace(',','.').replace(',','.');
            preco = parseFloat(precoaux); 
            custoaux = $('#custo_unsaida').val();
            custoaux = custoaux.replace(',','.').replace(',','.').replace(',','.').replace(',','.');
            custo = parseFloat(custoaux);
            
            margemaux = parseFloat(100 * (( preco / custo ) - 1))
            margemaux = margemaux.toFixed(2).replace('.',',');
            margem = margemaux+"%";
            $('#margem_revenda').val(margem);
           
        }else{
            $('#margem_revenda').val('');
        }
    });
});

function floatPadroaInternacional(valor1){
    valor = valor1.val();

    if(valor != ""){
        valor = valor.replace(".","").replace(".","").replace(".","").replace(".","");
        valor = valor.replace(",",".");
        valor = parseFloat(valor);
        return valor;
    }else{
        valor = '';
        return valor;
    }
}

function maiorque (valMenor, valMaior){

    valorMenor = floatPadroaInternacional(valMenor);
    valorMaior = floatPadroaInternacional(valMaior);        

    if( valorMenor != '' && valorMaior != ''){

        if(valorMenor < valorMaior){
           return true; 
        }else{
            return false;
        }
    }else{
        return false;
    }
}