
// document.addEventListener('DOMContentLoaded', function() {
    // var calendarEl = document.getElementById('calendario');
    // var calendarEl1 = document.getElementById('calendario1');

    // var calendar = new FullCalendar.Calendar(calendarEl, {
    //     defaultDtae: new Date(),
    //     plugins: [ 'dayGrid', 'interaction', 'list', 'timeGrid' ],
    //     defaultView: 'timeGridDay',
    //     header: {
    //         left: '',
    //         center: '',
    //         right: ''    
    //     },
    //     editable: true,
    //     droppable: true,
    //     allDaySlot: false,
    //     events:[
    //         {
    //             title: 'Meu Evento 1',
    //             start: '2020-02-17 16:30:00',
    //             end: '2020-02-17 16:30:00',
    //             color: '#8883232'
    //         },
    //         {
    //             title: 'Meu Evento 2',
    //             start: '2020-02-17 17:35:00',
    //             end: '2020-02-17 18:35:00',
    //             color: '#EEE000'

    //         },
    //         {
    //             title: 'Meu Evento 3',
    //             start: '2020-02-17 10:35:00',
    //             end: '2020-02-17 11:35:00',
    //             color: '#CCC'

    //         }
    //     ]
    // });
    
    // calendar.setOption('locale', 'pt-br');
    // calendar.setOption('height', 'auto');
    // calendar.setOption('width', 'parent');
    // calendar.setOption('minTime', '08:00:00');
    // calendar.setOption('maxTime', '19:00:00');

    // var calendar1 = new FullCalendar.Calendar(calendarEl1, {
    //     defaultDtae: new Date(),
    //     plugins: [ 'dayGrid', 'interaction', 'list', 'timeGrid' ],
    //     defaultView: 'timeGridDay',
    //     header: {
    //         left: '',
    //         center: '',
    //         right: ''    
    //     },
    //     editable: true,
    //     droppable: true,
    //     allDaySlot: false,
    //     events:[
    //         {
    //             title: 'Meu Evento 1',
    //             start: '2020-02-17 16:30:00',
    //             end: '2020-02-17 16:30:00',
    //             color: '#8883232'
    //         },
    //         {
    //             title: 'Meu Evento 2',
    //             start: '2020-02-17 17:35:00',
    //             end: '2020-02-17 18:35:00',
    //             color: '#EEE000'

    //         },
    //         {
    //             title: 'Meu Evento 3',
    //             start: '2020-02-17 10:35:00',
    //             end: '2020-02-17 11:35:00',
    //             color: '#CCC'

    //         }
    //     ]
    // });
    
    // calendar1.setOption('locale', 'pt-br');
    // calendar1.setOption('height', 'auto');
    // calendar1.setOption('width', 'parent');
    // calendar1.setOption('minTime', '08:00:00');
    // calendar1.setOption('maxTime', '19:00:00');

    // calendar.render();
    // calendar1.render();
   
    // $('#calendario th').hide();
    // $('#calendario td.fc-widget-content').hide();
    // $('#calendario1 th.fc-axis').hide();
    // $('#calendario1 td.fc-axis').hide();
    
    // $('#calendario .fc-day-header.fc-widget-header.fc-wed.fc-today').find('span').text('Paula')
    // $('#calendario1 .fc-day-header.fc-widget-header.fc-wed.fc-today').find('span').text('Marcos')

    // calendar1.on('dateClick', function(info) {
    //     console.log('info:', info)
    //     // console.log('clicked on ' + info.dateStr);
    // });

    // calendar1.on('eventClick', function(info) {
    //     console.log('info:', info)
    //     // console.log('clicked on ' + info.dateStr);
    // });

//   });

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
                        $('#divAgendas').find('.row').append(`
                            <div class="col-lg m-0 p-0 agndProf">
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
                            minTime: '08:00:00',
                            maxTime: '19:00:00',
                            // eventos
                            events:data[i].eventosDtRef,
                            // funções
                            eventClick: function(info) {
                                console.log('info:', info)
                            }
                        });

                        // renderizar os calendars
                        calendario1.render();

                        $('#calendario'+i+' th').find('span').text(data[i].nome);  

                    // }        
                }
            }else{
               
                // criar  o html desses calendars
                $('#divAgendas').find('.row').append(`
                    <div class="col-lg m-0 p-0 agndProf">
                        <div id="calendarioVazio" ></div>
                    </div>
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
                    events:[]
                });
            
                calendario1.setOption('locale', 'pt-br');
                calendario1.setOption('height', 'auto');
                calendario1.setOption('width', 'parent');
                calendario1.setOption('minTime', '08:00:00');
                calendario1.setOption('maxTime', '19:00:00');

                // renderizar os calendars
                calendario1.render();

            }
        }
    } );

}
function buscaAgendas2(dataRef){
    if( dataRef == ''  ||  dataRef == undefined ||  dataRef == 'Null' ){
        return false;
    }

    // limpar o divAgendas
    if ( $('#divAgendas .row .col-lg').length > 0 ){
        $('#divAgendas .row .col-lg').remove();
    }
    
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
                   if( data[i].eventosDtRef.length > 0 ){
                        
                        // criar  o html desses calendars
                        $('#divAgendas').find('.row').append(`
                            <div class="col-lg m-0 p-0 agndProf">
                                <div id="calendario`+i+`" ></div>
                            </div>
                        `);

                        // instanciar os calendars
                        if( i > 0){
                            delete(calendario1);
                            delete(calendarioEl1);
                        }
                        let calendario1 = ''; calendarioEl1 = '';
                        
                        // console.log('data usada: ', dataRef);
                        // console.log('eventos na data: ', data[i].eventosDtRef);

                        calendarioEl1 = document.getElementById('calendario'+i);
                        calendario1 = new FullCalendar.Calendar(calendarioEl1, {
                            defaultDtae: new Date(dtref),
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
                            events: {
                                url: baselink + '/ajax/buscarAgendas2',
                            }  
                        });
                    
                        calendario1.setOption('locale', 'pt-br');
                        calendario1.setOption('height', 'auto');
                        calendario1.setOption('width', 'parent');
                        calendario1.setOption('minTime', '08:00:00');
                        calendario1.setOption('maxTime', '19:00:00');

                        // renderizar os calendars
                        calendario1.render();

                        $('#calendario'+i+' th').find('span').text(data[i].nome);  

                    }        
                }
            }
        }              
    } );

}

function trocaDiaAgenda(dataRef){
    if( dataRef == ''  ||  dataRef == undefined ||  dataRef == 'Null' ){
        return false;
    }
    
    var dtref = '', dtCalend = '';
    // dtref = dataAtual();
    dtref = dataRef;
    dtref = dtref.split('/');
    dtCalend = dtref[2]+'-'+dtref[1]+'-'+dtref[0];

    for (let i = 0; i < $('#divAgendas .row .col-lg').length ; i++) {
    if( i > 0){
        delete(calendario);
        delete(calendarioEl);
    }
    let calendario = ''; calendarioEl = '';
    calendarioEl = document.getElementById('calendario'+i);
    calendario = new FullCalendar.Calendar(calendarioEl, {});
    calendario.gotoDate(dtCalend);
        
    }
}

function eventosPorData(dataRef){
    var eventos = [];
    if( dataRef == ''  ||  dataRef == undefined ||  dataRef == 'Null' ){
        return eventos;
    }

    var dtref = '';
    // dtref = dataAtual();
    dtref = dataRef;
    dtref = dtref.split('/');
    dtref = dtref[2]+'-'+dtref[1]+'-'+dtref[0];

    $.ajax( {
        url: baselink + '/ajax/buscarAgendas',
        type:"POST",
        dataType: "json",
        data: {
            dtref: dtref
        },
        success: function( data ) {
            // console.log('eventos na data: '+dataRef, data)

            if( data.length > 0 ){
               eventos = data;
            }
            return eventos;
        }
    } );

    return eventos;

}

function montaAgenda(arrayEventos){
    if( arrayEventos.length <= 0 ){
        // o que mostrar quando não existir eventos
    }else{
        // montar agenda quando existem eventos 
        // limpar o divAgendas
        if ( $('#divAgendas .row .col-lg').length > 0 ){
            $('#divAgendas .row .col-lg').remove();
        }

        for (var i = 0; i < arrayEventos.length; i++){
            if( arrayEventos[i].eventosDtRef.length > 0 ){
                 // criar  o html desses calendars
                 $('#divAgendas').find('.row').append(`
                     <div class="col-lg m-0 p-0 agndProf">
                         <div id="calendario`+i+`" ></div>
                     </div>
                 `);

                 // instanciar os calendars
                 if( i > 0){
                     delete(calendario);
                     delete(calendarioEl1);
                 }
                 let calendario = ''; calendarioEl = '';
             
                 calendarioEl = document.getElementById('calendario'+i);
                 calendario = new FullCalendar.Calendar(calendarioEl, {
                     defaultDtae: new Date(),
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
                     events:arrayEventos[i].eventosDtRef
                 });
             
                 calendario.setOption('locale', 'pt-br');
                 calendario.setOption('height', 'auto');
                 calendario.setOption('width', 'parent');
                 calendario.setOption('minTime', '08:00:00');
                 calendario.setOption('maxTime', '19:00:00');

                 // renderizar os calendars
                 calendario.render();

                 $('#calendario'+i+' th').find('span').text(data[i].nome);                            

             }        
         }

    } // final da montagem
}