$(function () {
    // dt nasc 
    if ($('#data_nasc').val() == '00/00/0000'){

    }
    // populando o select com os grupos de serviços
    $.ajax( {
        url: baselink + '/ajax/buscaGruposDeServicos',
        type:"POST",
        dataType: "json",
        data: {
            grupo:'servicos'
        },
        success: function( data ) {
            // console.log('resposta:', data);
            // console.log('tam resp:', data.length);
            $("#grupo_servico").empty()
            .val('')
            .append('<option value="" selected  >Selecione</option>');
            if( data.length > 0){
                for (i = 0; i < data.length; i++) {
                    $("#grupo_servico").append('<option value="' + data[i].id + '">' + data[i].nome + '</option>');
                }
            }
            
        }
    } );

    var $formContatos = $('table#servicos thead tr[role=form]'),
        lastInsertId = 0,
        botoes = `
            <td class="col-lg-2">
                <a href="javascript:void(0)" class="editar-contato btn btn-sm btn-primary">
                    <i class="fas fa-edit"></i>
                </a>
                <a href="javascript:void(0)" class="excluir-contato btn btn-sm btn-danger">
                    <i class="fas fa-trash-alt"></i>
                </a>
            </td>
        `;

    // [Editar] Esse trecho de código abaixo serve para quando a pagina for carregada
    // Ler o campo hidden e montar a tabela com os contatos daquele registro
    Contatos().forEach(function (contato) {
        Popula(contato);
    });

    $('#servicos-form').submit(function (event) {
        
        event.preventDefault();

        var $form = $(this)[0],
            $fields = $($form).find('.form-control');

        // Desfocar os campos para validar
        $fields.trigger('blur');

        if ($form.checkValidity() && !$($form).find('.is-invalid').length) {

            Save();

            // Limpar formulario
            $form.reset();
            $($form).removeClass('was-validated');
            
            $fields
                .removeClass('is-valid is-invalid')
                .removeAttr('data-anterior');

            $fields.first().focus();
        } else {
            $($form).addClass('was-validated');

            // Da foco no primeiro campo com erro
            $($form).find('.is-invalid, :invalid').first().focus();
        }
    });

    // Retorna um array de contatos puxados do campo hidden com o atributo nome igual a contatos
    function Contatos() {
        var returnContatos = [];
        if ($('[name=servicos]') && $('[name=servicos]').val().length) {
            var contatos = $('[name=servicos]').val().split('[');
            for (var i = 0; i < contatos.length; i++) {
                var contato = contatos[i];
                if (contato.length) {
                    contato = contato.replace(']', '');
                    var dadosContato = contato.split(' * ');
                    returnContatos.push(dadosContato);
                }
            }
        };
        // console.log(returnContatos)
        return returnContatos;
    };

    // Escreve o html na tabela
    function Popula(values) {

        if (!values) return;

        var currentId = $formContatos.attr('data-current-id'),
            tds = '';

        // Coloca a tag html TD em volta de cada valor vindo do form de contatos
        values.forEach(value => tds += `<td class="col-lg text-truncate">` + value + `</td>`);

        if (!currentId) {
            // Se for undefined então o contato está sendo criado

            // Auto incrementa os ID's dos contatos
            lastInsertId += 1;

            $('#servicos tbody')
                .prepend('<tr class="d-flex flex-column flex-lg-row" data-id="' + lastInsertId + '">' + tds + botoes + '</tr>');

        } else {
            // Caso tenha algum valor é por que o contato está sendo editado

            $('#servicos tbody tr[data-id="' + currentId + '"]')
                .html(tds + botoes);

            // Seta o data id como undefined para novos contatos poderem ser cadastrados
            $formContatos.removeAttr('data-current-id');
        }

        $('.editar-contato').bind('click', Edit);
        $('.excluir-contato').bind('click', Delete);
    };

    // Pega as linhas da tabela auxiliar e manipula o hidden de contatos
    function SetInput() {
        var content = '';
        $('#servicos tbody tr').each(function () {
            var par = $(this).closest('tr');
            var tdNome = par.children("td:nth-child(1)");
            var tdGrupo = par.children("td:nth-child(2)");
            var tdPorcentProf = par.children("td:nth-child(3)");
            var tdPorcentCasa = par.children("td:nth-child(4)");
            var tdDuracao = par.children("td:nth-child(5)");
            var tdPreco = par.children("td:nth-child(6)");

            content += '[' + tdNome.text() + ' * ' + tdGrupo.text() + ' * ' + tdPorcentProf.text() + ' * ' + tdPorcentCasa.text() + ' * ' + tdDuracao.text() + ' * ' + tdPreco.text() + ']';
        });

        $('[name=servicos]')
            .val(content)
            .attr('data-anterior-aux', content)
            .change();
    };

    // Delete contato da tabela e do hidden
    function Delete() {
        var par = $(this).closest('tr');
        par.remove();
        SetInput();
    };

    // Seta no form o contato clicado para editar, desabilita os botoes de ações deste contato e seta o id desse contato
    // no form dos contatos
    function Edit() {

        // Volta para válido todos os botoões de editar e excluir
        $('table#servicos tbody tr .btn')
            .removeClass('disabled');


        var $par = $(this).closest('tr'),
            tdNome = $par.children("td:nth-child(1)"),
            tdGrupo = $par.children("td:nth-child(2)"),
            tdPorcentProf = $par.children("td:nth-child(3)"),
            tdPorcentCasa = $par.children("td:nth-child(4)")
            tdDuracao = $par.children("td:nth-child(5)"),
            tdPreco = $par.children("td:nth-child(6)");

        // Desabilita ele mesmo e os botões irmãos de editar e excluir da linha atual
        $par
            .find('.btn')
            .addClass('disabled');

        $('input[name=serv_nome]').val(tdNome.text()).attr('data-anterior', tdNome.text()).focus();
        $('input[name=serv_grupo]').val(tdGrupo.text()).attr('data-anterior', tdGrupo.text());
        $('input[name=serv_porcent_prof]').val(tdPorcentProf.text()).attr('data-anterior', tdPorcentProf.text());
        $('input[name=serv_porcent_casa]').val(tdPorcentCasa.text()).attr('data-anterior', tdPorcentCasa.text());
        $('input[name=serv_duracao]').val(tdDuracao.text()).attr('data-anterior', tdDuracao.text());
        $('input[name=serv_preco]').val(tdPreco.text()).attr('data-anterior', tdPreco.text());

        $('table#servicos thead tr[role=form]')
            .attr('data-current-id', $par.attr('data-id'))
            .find('.is-valid, .is-invalid')
            .removeClass('is-valid is-invalid');
    };

    // Ao dar submit neste form, chama essa função que pega os dados do formula e Popula a tabela
    function Save() {

        Popula([
            $('input[name=serv_nome]').val(),
            $('input[name=serv_grupo]').val(),
            $('input[name=serv_porcent_prof]').val(),
            $('input[name=serv_porcent_casa]').val(),
            $('input[name=serv_duracao]').val(),
            $('input[name=serv_preco]').val()
        ]);

        SetInput();
    };

    // Validação se o nome já existe entre os contatos daquela tabela auxiliar
    $('[name=serv_nome]').blur(function () {

        var $this = $(this),
            contatos = Contatos(),
            nomes = [];

        $this.removeClass('is-valid is-invalid');
        $this.siblings('.invalid-feedback').remove();

        if (contatos) {

            // Posição 0 é o nome do contato
            contatos.forEach(contato => nomes.push(contato[0].toLowerCase()));

            if ($this.val()) {

                var value = $this.val().toLowerCase(),
                    dtAnteriorLower = $this.attr('data-anterior') ? $this.attr('data-anterior') : '';

                if (dtAnteriorLower.toLowerCase() != value) {

                    $this.removeClass('is-invalid is-valid');
                    $this[0].setCustomValidity('');
                    
                    if (nomes.indexOf(value) == -1) {
                        // Não existe, pode seguir

                        $this.addClass('is-valid');

                        $this[0].setCustomValidity('');
                    } else {
                        // Já existe, erro

                        $this.addClass('is-invalid');

                        $this[0].setCustomValidity('invalid');

                        $this.after('<div class="invalid-feedback">Já existe um contato com este nome</div>');
                    }
                }
            }

        }
    });


    ////////////////////////////
    $( "#serv_nome" ).autocomplete({
        source: function( request, response ) {
        $.ajax( {
            url: baselink + '/ajax/buscaServicos',
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
            
            $('#serv_grupo').val(ui.item.grupo).blur();
            $('#serv_porcent_prof').val( floatParaPadraoBrasileiro( ui.item.porcent_prof ) + '%').blur();
            $('#serv_porcent_casa').val( floatParaPadraoBrasileiro( ui.item.porcent_casa ) + '%').blur();
            $('#serv_duracao').val(ui.item.duracao).blur();
            $('#serv_preco').val( floatParaPadraoBrasileiro( ui.item.preco ) ).blur();

        },
        response: function( event, ui ) {
            // for (var i = 0; i < ui.content.length; i++){
            //     if(ui.content[i].label.toLowerCase() == "Calhas Venezianas".toLowerCase() ){
            //         console.log('a posição desse cara é: ',i, ui.content[i].label);
            //     }
                    
                
            // }
            console.log('fonte:', ui.content);
        }
    }).focus(function(event) {
      var termo = "";
      termo = $(this).val().trim();
      $(this).autocomplete( "search" , termo );
    });
  
    $( "#serv_nome" ).parent('div').addClass('ui-widget');
    $("#serv_nome").on('change blur',function(){
        if( $('#serv_nome').val() == '' ){
            $('#serv_grupo').val('').removeClass('is-valid is-invalid');
            $('#serv_porcent_prof').val('').removeClass('is-valid is-invalid');
            $('#serv_porcent_casa').val('').removeClass('is-valid is-invalid');
            $('#serv_duracao').val('').removeClass('is-valid is-invalid');
            $('#serv_preco').val('').removeClass('is-valid is-invalid');
        }
    });
    $("#serv_nome").on('click',function(){
        $("#serv_nome").keyup();
    });

    $("#serv_porcent_casa").on('blur',function(){
        var $pcasa = $("#serv_porcent_casa");
        var $pprof = $("#serv_porcent_prof");
        var npcasa = $("#serv_porcent_casa").val();
            npcasa = npcasa.replace('%','');
            npcasa = npcasa.replace(',','.');
            npcasa = parseFloat(npcasa) / 100;

        var npprof = $("#serv_porcent_prof").val();
            npprof = npprof.replace('%','');
            npprof = npprof.replace(',','.');
            npprof = parseFloat(npprof) / 100;

        if( npcasa > 1 ){
            $pcasa.val("").blur();
            return false;
        }

        if ( $pcasa.val() == '' ) {
            if ( $pprof.val() == '' ){
                return false;
            }else{
                $pcasa.val( floatParaPadraoBrasileiro( parseFloat(( 1 - npprof ) * 100) )+'%' );
            }    
        }else {
            
            $pprof.val( floatParaPadraoBrasileiro( parseFloat(( 1 - npcasa ) * 100) )+'%' );    
        }
        
    });
    
    $("#serv_porcent_prof").on('blur',function(){
        var $pcasa = $("#serv_porcent_casa");
        var $pprof = $("#serv_porcent_prof");
        var npcasa = $("#serv_porcent_casa").val();
            npcasa = npcasa.replace('%','');
            npcasa = npcasa.replace(',','.');
            npcasa = parseFloat(npcasa) / 100;

        var npprof = $("#serv_porcent_prof").val();
            npprof = npprof.replace('%','');
            npprof = npprof.replace(',','.');
            npprof = parseFloat(npprof) / 100;

        if( npprof > 1 ){
            $pprof.val("").blur();
            return false;
        }

        if ( $pprof.val() == '' ) {
            if ( $pcasa.val() == '' ){
                return false;
            }else{
                $pprof.val( floatParaPadraoBrasileiro( parseFloat(( 1 - npcasa ) * 100) )+'%' );
            }    
        }else {
            
            $pcasa.val( floatParaPadraoBrasileiro( parseFloat(( 1 - npprof ) * 100) )+'%' );    
        }
        
    });

    $('#btn_incluir').on('click', function(){
        if( $('#grupo_servico').val() == '' ){
            $('#grupo_servico').focus();
            return false;
        }else{

            $.ajax( {
                url: baselink + '/ajax/buscaServicosGrupo',
                type:"POST",
                dataType: "json",
                data: {
                    grupo:$('#grupo_servico').find(':selected').text()
                },
                success: function( data ) {
                    console.log('resposta busca:', data);
                    var lastInsertId=0;
                    var ult=0;
                    for (j=0; j < $('#servicos tbody tr').length; j++){
                        ult = $('#servicos tbody tr:eq('+j+')').attr('data-id');
                        console.log('ult ',ult);
                    }
                    console.log('ult final:',ult);
                    lastInsertId = ult;
                    for(i=0; i< data.length; i++){
                        lastInsertId += i;
                        var tds = '';
                            tds += '<tr class="d-flex flex-column flex-lg-row" data-id="' + lastInsertId + '">';
                            tds +=  '<td class="col-lg text-truncate">' + data[i].nome +'</td>';
                            tds +=  '<td class="col-lg text-truncate">' + data[i].grupo +'</td>';
                            tds +=  '<td class="col-lg text-truncate">' + data[i].porcent_prof.replace('.',',') + '%' +'</td>';
                            tds +=  '<td class="col-lg text-truncate">' + data[i].porcent_casa.replace('.',',') + '%' +'</td>';
                            tds +=  '<td class="col-lg text-truncate">' + data[i].duracao +'</td>';
                            tds +=  '<td class="col-lg text-truncate">' + data[i].preco.replace('.',',') +'</td>';
                            tds += botoes;
                            tds +=  '</tr>';  
                        $('#servicos tbody').prepend(tds);
                        $('.editar-contato').bind('click', Edit);
                        $('.excluir-contato').bind('click', Delete);
                    }
                    SetInput();
                }
            } );
        }
    });
});

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