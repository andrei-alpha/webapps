var itemId = 0, contactId = 0;

function menu_addItem(name, href, callback) {
	itemId = itemId + 1;
	var menuTemplate = $('#menuItemTemplate').html();
	var template = menuTemplate.format(name, href, itemId);

	$('#nav-menu').append(template);
	// Bind trigger
	$('#menu-item-' + itemId).click( function() { openInfoWindow(name, null, callback); } );
}

function menu_addUser(name, href, callback) {
	contactId = contactId + 1;
	var userItemTemplate = $('#userItemTemplate').html();
	var template = userItemTemplate.format(name, contactId, href);

	$('#user-list').append(template);
}

function menu_getUsers() {
	for (var i = 0; i <= 20; ++i)
		menu_addUser('John Smith', '#', null);
}

$(document).ready(function() {
	menu_addItem('User Profile', '#', null);
	menu_addItem('Game History', '#', null);
	menu_addItem('Forum', '#', null);
	menu_addItem('Tutorial', '#', null);
	menu_addItem('Hall of Fame', '#', null);

	/* Set the height for the two menu components */
	var total = $(window).height();
	$('#user-list').height(total - $('#nav-menu').height() );

	menu_getUsers();
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