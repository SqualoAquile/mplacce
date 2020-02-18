$(function () {

    var $formContatos = $('table#eventos thead tr[role=form]'),
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

    $('#eventos-form').submit(function (event) {
        
        event.preventDefault();

        // var $form = $(this)[0],
        var $fields = $('#eventos-form').find('.form-control');

        // Desfocar os campos para validar
        $fields.trigger('blur');
        var validados = false;
        var id = '';
        $fields.each(function( index, ele ){
            
            if ( $(ele).attr('required') == undefined ){
               
            }else{
                if( $(ele).val() == '' || $(ele).hasClass('is-valid') == false ){
                    id = $(ele).attr('id');
                }
            }     
        });

        if (id != ''){
            id = '#' + id;
            $(id).focus();
            return ;
        }
        
        Save();

        $fields.val('').removeClass('is-valid is-invalid').removeAttr('data-anterior');
        $("#agnd_servico").empty().val('').append('<option value="" selected  >Selecione</option>');
        if ( $("#agnd_preferencia").is(':checked') == true ){
            $("#agnd_preferencia").click();
        }
        $fields.first().focus();

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

            $('#eventos tbody')
                .prepend('<tr class="d-flex flex-column flex-lg-row" data-id="' + lastInsertId + '">' + tds + botoes + '</tr>');

        } else {
            // Caso tenha algum valor é por que o contato está sendo editado

            $('#eventos tbody tr[data-id="' + currentId + '"]')
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
        $('#eventos tbody tr').each(function () {
            var par = $(this).closest('tr');
            var tdProfissional = par.children("td:nth-child(1)");
            var tdServico = par.children("td:nth-child(2)");
            var tdPreferencia = par.children("td:nth-child(3)");
            var tdHoraInicio = par.children("td:nth-child(4)");
            var tdDuracao = par.children("td:nth-child(5)");
            var tdHoraFim = par.children("td:nth-child(6)");

            var checado = '';
            if ($('#agnd_preferencia').is(':checked') == true){
                checado = '(P)';
            }else{
                checado = '(C)';
            }
            content += '[' + tdProfissional.text() + ' * ' + tdServico.text() + ' * '+ checado +' * ' + tdHoraInicio.text() + ' * ' + tdDuracao.text() + ' * ' + tdHoraFim.text() + ']';
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
        $('table#eventos tbody tr .btn')
            .removeClass('disabled');


        var $par = $(this).closest('tr'),
            tdProfissional = $par.children("td:nth-child(1)"),
            tdServico = $par.children("td:nth-child(2)"),
            tdPreferencia = $par.children("td:nth-child(3)"),
            tdHoraInicio = $par.children("td:nth-child(4)"),
            tdDuracao = $par.children("td:nth-child(5)")
            tdHoraFim = $par.children("td:nth-child(6)"),

        // Desabilita ele mesmo e os botões irmãos de editar e excluir da linha atual
        $par.find('.btn').addClass('disabled');
        var prof = tdProfissional.text(), profi = '',  nomeprof = [];
            nomeprof = prof.split(')');
            profi = nomeprof[1].trim();

        $('input[name=agnd_profissional]').val(profi).attr('data-anterior', profi).focus();
        $('[name=agnd_servico]').val(tdServico.text()).attr('data-anterior', tdServico.text());

        $('input[name=agnd_preferencia]').attr('data-anterior', tdPreferencia.text());
        if (tdPreferencia.text() == '(P)' ){
            if( $('input[name=agnd_preferencia]').is(':checked') == false ){
                $('input[name=agnd_preferencia]').click();
            }    
        }else{
            if( $('input[name=agnd_preferencia]').is(':checked') == true ){
                $('input[name=agnd_preferencia]').click();
            }    
        }
        
        $('input[name=agnd_hora_inicio]').val(tdHoraInicio.text()).attr('data-anterior', tdHoraInicio.text());
        $('input[name=agnd_duracao]').val(tdDuracao.text()).attr('data-anterior', tdDuracao.text());
        $('input[name=agnd_hora_final]').val(tdHoraFim.text()).attr('data-anterior', tdHoraFim.text());

        $('table#eventos thead tr[role=form]')
            .attr('data-current-id', $par.attr('data-id'))
            .find('.is-valid, .is-invalid')
            .removeClass('is-valid is-invalid');
    };

    // Ao dar submit neste form, chama essa função que pega os dados do formula e Popula a tabela
    function Save() {
        var checado = '';
        if ($('#agnd_preferencia').is(':checked') == true){
            checado = '(P)';
        }else{
            checado = '(C)';
        }

        Popula([
            '(' + $('input[name=agnd_profissional]').attr('data-idprof') + ')' + $('input[name=agnd_profissional]').val(),
            $('[name=agnd_servico]').val(),
            checado,
            $('input[name=agnd_hora_inicio]').val(),
            $('input[name=agnd_duracao]').val(),
            $('input[name=agnd_hora_final]').val()
        ]);

        SetInput();
    };

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