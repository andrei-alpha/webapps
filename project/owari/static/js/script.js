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

function openGameWindow(name, data, callback) {
  $('#game-window').fadeIn(50);
  $('#game-window-close').click(function(event) { closeGameWindow(); });
  startGame();
}

function closeGameWindow() {
  $('#game-window').fadeOut(500);
  cancelGame();
}

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

function deleteCookie(c_name) {
  document.cookie = encodeURIComponent(c_name) + "=deleted; expires=" + new Date(0).toUTCString();
}

function setCookie(c_name, value, exdays)
{
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

