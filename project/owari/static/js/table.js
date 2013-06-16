var aDataSet = [];
var dataLength = 0;
var oTable;

function table_getPlayerName(playerId) {
	if (playerId == null)
		return 'Mistery';

	if (playerId <= 0)
		return 'Ai level ' + (-1 * playerId);
	if (playerId == curr_user['id'])
		return 'You';
	return users[playerId][0];
}

function initDataTable(type) {
	$.ajax({
        url: '/backend/stats/',
        type: 'post',
        data: {'type': type},
        success: function(json) {
        	aDataSet = $.parseJSON(json);

        	for (id in aDataSet) {
        		aDataSet[id][1] = table_getPlayerName(aDataSet[id][1]);
        		aDataSet[id][3] = table_getPlayerName(aDataSet[id][3]);
        		
        		if (type == 'hall_of_fame')
        			aDataSet[id][6] = table_getPlayerName(aDataSet[id][6]);
        	}

        	renderTable(type);
        },
        error: function(html) {
            console.log('error on get data for table');
        }
    });
}

function openGameTable() {
	var windowTemplate = $('#infoWindowTemplate').html();
  	var template = windowTemplate.format('Game History');

  	$('#info-window').html(template);
  	$('#info-window').fadeIn(500);
  	$('#info-window-close').click(function(event) { closeInfoWindow(); });
	
	initDataTable('game_history');
}

function openHallFameTable() {
	var windowTemplate = $('#infoWindowTemplate').html();
  	var template = windowTemplate.format('Hall of Fame');

  	$('#info-window').html(template);
  	$('#info-window').fadeIn(500);
  	$('#info-window-close').click(function(event) { closeInfoWindow(); });
	
	initDataTable('hall_of_fame');
}

function closeGameTable() {
	closeInfoWindow();
}

function renderTable(type) {
	dataLength = aDataSet.length;

 	$(document).ready(function() {
		$('#info-window-content').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );
		$("#example tbody tr").click( function( e ) {
			if ( $(this).hasClass('row_selected') ) {
				$(this).removeClass('row_selected');
			}
			else {
				oTable.$('tr.row_selected').removeClass('row_selected');
				$(this).addClass('row_selected');
			}
		} );					

		$('#delete').click( function() {
			var anSelected = fnGetSelected( oTable );
			if ( anSelected.length !== 0 ) {
				oTable.fnDeleteRow( anSelected[0] );
			}
		} );
				
		/* Init the table */
		if (type == 'game_history') {
			oTable = $('#example').dataTable( {
			"aaData": aDataSet,
			"aoColumns": [
				{ "sTitle": "Date", "sWidth": "20%", "sClass": "center" },
				{ "sTitle": "Player 1", "sClass": "center" },
				{ "sTitle": "Score 1", "sClass": "center" },
				{ "sTitle": "Player 2", "sClass": "center" },
				{ "sTitle": "Score 2", "sClass": "center" },
				{ "sTitle": "Moves", "sClass": "center"},
				{ "sTitle": "Winner", "sClass": "center"}
			],
			"iDisplayLength": 16,
			aLengthMenu: [16],
			//"bFilter": false,  //hides search bar
			});
		}
		else {
			oTable = $('#example').dataTable( {
			"aaData": aDataSet,
			"aoColumns": [
				{ "sTitle": "Date", "sWidth": "20%", "sClass": "center", "bSortable": false},
				{ "sTitle": "Winner", "sClass": "center", "bSortable": false},
				{ "sTitle": "Win Score", "sClass": "center"},
				{ "sTitle": "Oponent", "sClass": "center", "bSortable": false},
				{ "sTitle": "Score", "sClass": "center", "bSortable": false},
				{ "sTitle": "Moves", "sClass": "center"}
			],
			"iDisplayLength": 15,
			aLengthMenu: [15],
			"aaSorting": [[ 2, "desc" ]]
			//"bFilter": false,  //hides search bar
			});
		}	
 	});
}

function fnGetSelected( oTableLocal ){
	return oTableLocal.$('tr.row_selected');
}