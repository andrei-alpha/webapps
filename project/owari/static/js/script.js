function openInfoWindow(name, data, callback) {
	var windowTemplate = $('#infoWindowTemplate').html();
	var template = windowTemplate.format(name);

	$('#info-window').html(template);
	$('#info-window').fadeIn(500);
	$('#info-window-close').click(function(event) { closeInfoWindow(); });
}

function closeInfoWindow() {
	$('#info-window').fadeOut(500);
}

$(document).ready(function() {
});

//first, checks if it isn't implemented yet
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}