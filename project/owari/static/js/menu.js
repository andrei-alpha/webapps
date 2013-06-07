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

function user_getProfile() {
    var data = {}
    data['csrfmiddlewaretoken'] = getCookie('csrftoken');
    data['type'] = 'get_profile';

    $.ajax({
        url: '/backend/user/',
        type: 'post',
        data: data,
        success: function(json) {
            data = $.parseJSON(json);
            $('#curr-user-name').html(data['name']);
        },
        error: function(html) {
            console.log('error on get users');
        }
    });
}

function chat_getUsers() {
    var data = {}
    data['csrfmiddlewaretoken'] = getCookie('csrftoken');
    data['type'] = 'get_users';
    
    $.ajax({
        url: '/backend/messages/',
        type: 'post',
        data: data,
        success: function(json) {
            users = $.parseJSON(json);
            for (var id in users) {
                /* A neet way to clone an object with JQuery. See: 
                stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object */
                //var copyId = $.extend(true, {}, id)[0];
                
                /*var copyId = cloneObject(id, true);
                console.log(copyId, id);
                id = '30';
                console.log(copyId, id);*/

                (function(copyId){
                    var fun = function() { chat_newWindow(copyId, users[copyId]) };
                    menu_addUser(users[copyId], copyId, fun);
                })(id);
            }
        },
        error: function(html) {
            console.log('error on get users');
        }
    });
}

function menu_addUser(name, id, callback) {
    var userItemTemplate = $('#userItemTemplate').html();
    var template = userItemTemplate.format(name, id);

    $('#user-list').append(template);
    $('#user-item-' + id).click(callback);
}

function logout() {
    var data = {}
    data['csrfmiddlewaretoken'] = getCookie('csrftoken');

    $.ajax({
        url: '/backend/logout/',
        type: 'post',
        data: data,
        success: function(result) {
            deleteCookie('usertoken');
            location.reload();
        },
        error: function(html) {
            console.log('error on logout');
        }
    });  
}

$(document).ready(function() {
    setCookie('csrftoken', 'a4d4f6802b0e64489261f2bb25b43b575a875048', 100);
    menu_addItem('User Profile', '#', null);
    menu_addItem('Game History', '#', null);
    menu_addItem('Play Game', '#', function() { openGameWindow('', null, null); });
    menu_addItem('Tutorial', '#', null);
    menu_addItem('Hall of Fame', '#', null);

    /* Set the height for the two menu components */
    var totalH = $(window).height();
    var totalW = $(window).width();
    $('#top-menu ').width(totalW - 220);
    $('#user-list').height(totalH - $('#nav-menu').height() );
    $('#game-window').width(totalW - 220);
    $('#top-menu').fadeIn(500);
    $('#user-list').fadeIn(500);
    chat_getUsers();
    user_getProfile();
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