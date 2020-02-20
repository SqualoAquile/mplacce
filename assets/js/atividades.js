  $(function () {

    $('#dtcalendario').val(dataAtual());
    
    buscaAgendas( $('#dtcalendario').val() );
    
    $('#dtcalendario').on('blur change', function(){
        if ( $(this).val() != '' ){
            if ( $('#divAgendas .row .col-lg').length > 0 ){
                $('#divAgendas .row .col-lg').remove();
            }

            buscaAgendas( $(this).val() ); 
        }
        
    });
  });

// eventOverlap vai fazer o bloqueio dos horários que o profissional não puder usar a agenda,

function buscaAgendas(dataRef){
    if( dataRef == ''  ||  dataRef == undefined ||  dataRef == 'Null' ){
        return false;
    }

    // limpar o divAgendas
    if ( $('#divAgendas .row .col-lg').length > 0 ){
        $('#divAgendas .row .col-lg').remove();
    }
    
    var horainicio = '08:00:00', horafim = '20:00:00', iniAux = '0',  fimAux = '0';
    $.ajax({
        url: baselink + "/ajax/buscarTodosParametros",
        type: "POST",
        data: {
            tabela: "parametros"
        },
        dataType: "json",
        success: function(data) {
        //   console.log(data)
            iniAux = data['hora_limite_operacao'];
            fimAux =  data['hora_inicio_operacao'];
            
        }
    });    

    fimAux = $('#divAgendas').attr('data-hora_limite_op');
    if ( parseInt(fimAux) <= 9 ){
        fimAux = '0'+ parseInt(fimAux);
    }
    fimAux = fimAux+":00:00";

    console.log('ini',iniAux,'fim', fimAux)

    var dtref = '', dtCalend = '';
    // dtref = dataAtual();
    dtref = dataRef;
    dtref = dtref.split('/');
    dtCalend = dtref[2]+'-'+dtref[1]+'-'+dtref[0];
    
    $.ajax( {
        url: baselink + '/ajax/buscarAgendas',
        type:"POST",
        dataType: "json",
        data: {
            dtref: dtCalend
        },
        success: function( data ) {
            // console.log('qtd profs evento na data: ', data.length);
            console.log('detalhamento:', data)
            // dar retorno da adição
            if( data.length > 0 ){
                // limpar o divAgendas
                if ( $('#divAgendas .row .col-lg').length > 0 ){
                    $('#divAgendas .row .col-lg').remove();
                }
               for (var i = 0; i < data.length; i++){
                //    if( data[i].eventosDtRef.length > 0 ){
                        
                        // criar  o html desses calendars
                        $('#divAgendas .row').append(`
                            <div class='col-lg my-3 p-0 agndProf' >
                                <div id="calendario`+i+`" ></div>
                            </div>
                        `);

                        // instanciar os calendars
                        if( i > 0){
                            delete(calendario1);
                            delete(calendarioEl1);
                        }
                        let calendario1 = ''; calendarioEl1 = '';

                        calendarioEl1 = document.getElementById('calendario'+i);
                        calendario1 = new FullCalendar.Calendar(calendarioEl1, {
                            // config do calendario
                            defaultDate: new Date(parseInt(dtref[2]),parseInt(dtref[1])-1, parseInt(dtref[0]) ),
                            plugins: [ 'dayGrid', 'interaction', 'list', 'timeGrid' ],
                            defaultView: 'timeGridDay',
                            header: {
                                left: '',
                                center: '',
                                right: ''    
                            },
                            editable: true,
                            droppable: true,
                            allDaySlot: false,
                            locale: 'pt-br',
                            contentHeight: 'auto',
                            width: 'parent',
                            minTime: horainicio,
                            maxTime: horafim,
                            // eventos
                            events:data[i].eventosDtRef,
                            // funções
                            eventClick: function(info) {
                                $('#agendamento').attr('href', baselink+'/agendamentos/editar/'+info.event.extendedProps.idAgnd);
                                $('#modalEvento').modal('show');

                                console.log('info:', info.event.extendedProps.idAgnd)
                            }
                        });

                        // renderizar os calendars
                        calendario1.render();

                        $('#calendario'+i+' th').find('span').text(data[i].nome);
                        $('#calendario'+i).attr('data-idProf', data[i].id)
                        $('#calendario'+i).attr('data-nomeProf', data[i].nome)  

                    // }        
                }
            }else{
               
                // criar  o html desses 
                $('#divAgendas table tbody tr').append(`
                    <th >
                        <div id="calendarioVazio" ></div>
                    </th>
                `);
               
                // instanciar os calendars
                let calendario1 = ''; calendarioEl1 = '';
            
                calendarioEl1 = document.getElementById('calendarioVazio');
                calendario1 = new FullCalendar.Calendar(calendarioEl1, {
                    defaultDate:  new Date(parseInt(dtref[2]),parseInt(dtref[1])-1, parseInt(dtref[0]) ),
                    plugins: [ 'dayGrid', 'interaction', 'list', 'timeGrid' ],
                    defaultView: 'timeGridDay',
                    header: {
                        left: '',
                        center: '',
                        right: ''    
                    },
                    editable: true,
                    droppable: true,
                    allDaySlot: false,
                    locale: 'pt-br',
                    contentHeight: 'auto',
                    width: 'parent',
                    minTime: '08:00:00',
                    maxTime: '19:00:00',
                    events:[]
                });
            
                calendario1.render();

            }
        }
    } );

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
