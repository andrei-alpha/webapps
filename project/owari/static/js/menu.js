var itemId = 0, contactId = 0;

function menu_addItem(name, href, callback) {
    itemId = itemId + 1;
    var menuTemplate = $('#menuItemTemplate').html();
    var template = menuTemplate.format(name, href, itemId);

    $('#nav-menu').append(template);
    // Bind trigger
    var fun = callback == null ?  function() { openInfoWindow(name, null, callback); } : callback;
    $('#menu-item-' + itemId).click(fun);
}

function chat_getUsers() {
    //TO DO: we should obtain data from backend
    //this is just a simple mock for now
    var fun = function() { chat_newWindow(1, 'John Smith') };
    menu_addUser('John Smith', 1, fun);
    
    var fun = function() { chat_newWindow(2, 'Irina Veliche') };
    menu_addUser('Irina Veliche', 2, fun);

    var fun = function() { chat_newWindow(3, 'Mark Zuckerberg') };
    menu_addUser('Mark Zuckerberg', 3, fun);

    var fun = function() { chat_newWindow(4, 'Will I Am') };
    menu_addUser('Will I Am', 4, fun);

    var fun = function() { chat_newWindow(5, 'Gandalf the White') };
    menu_addUser('Gandalf the White', 5, fun);

    var fun = function() { chat_newWindow(6, 'Chuck Norris') };
    menu_addUser('Chuck Norris', 6, fun);
}

function menu_addUser(name, id, callback) {
    var userItemTemplate = $('#userItemTemplate').html();
    var template = userItemTemplate.format(name, id);

    $('#user-list').append(template);
    $('#user-item-' + id).click(callback);
}

$(document).ready(function() {
    menu_addItem('User Profile', '#', null);
    menu_addItem('Game History', '#', null);
    menu_addItem('Play Game', '#', function() { openGameWindow('', null, null); });
    menu_addItem('Tutorial', '#', null);
    menu_addItem('Hall of Fame', '#', null);

    /* Set the height for the two menu components */
    var total = $(window).height();
    $('#user-list').height(total - $('#nav-menu').height() );
    chat_getUsers();
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