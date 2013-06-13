var searchItemCurr = -1, searchItemId = 0, itemId = 0, contactId = 0, curr_user;
var getUsers = 9999;
var users = {};

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
            curr_user = $.parseJSON(json);
            $('#curr-user-pic').css('background-image', 'url(' + curr_user['image'] + ')');
            $('#curr-user-name').html(curr_user['name']);
        },
        error: function(html) {
            console.log('error on get users');
        }
    });
}

function menu_addUser(user, id, callback) {
    var userItemTemplate = $('#userItemTemplate').html();
    var template = userItemTemplate.format(user[0], id);

    $('#user-list').append(template);
    $('#user-item-' + id).click(callback);
    $('#user-item-pic-' + id).css('background-image', 'url(' + user[2] + ')');
    if (user[1] == true)
        $('#user-item-status-pic-' + id).css('background-position', '-15px 0px');
    else
        $('#user-item-status-pic-' + id).css('background-position', '-15px 15px');
}

function menu_changeUser(user, id) {
    $('#user-item-name-' + id).html(user[0]);
    $('#user-item-pic-' + id).css('background-image', 'url(' + user[2] + ')');
    if (user[1] == true)
        $('#user-item-status-pic-' + id).css('background-position', '-15px 0px');
    else
        $('#user-item-status-pic-' + id).css('background-position', '-15px 15px');
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

function getUpdates() {
    data = {};
    for (var id in chat_system_last) {
        (function(copyId){
            data[copyId] = chat_system_last[copyId];
        })(id);
    }
    /* If I am playing and waiting for oponent or just registered on a game. */  
    if (gameState == true || curr_user['gameid'] != 0)
        data['gameMoves'] = gameMoves;

    /* Every 30 seconds we want to get all the users and profile pics. */
    if (getUsers > 10) {
        getUsers = 0;
        data['getUsers'] = true;
    }

    $.ajax({
        url: '/backend/updates/',
        type: 'post',
        data: data,
        success: function(json) {
            data = $.parseJSON(json);
            // First we need to update users
            if ('users' in data)
                system_updateUsers(data['users']);
            chat_getMessages(data['messages']);
            invite_getInvites(data['invites']);
            if ('game' in data)
                game_getMoves(data['game']);
        },
        error: function(html) {
            console.log('error on get updates');
        }
    });

    getUsers = getUsers + 1;
}

function system_updateUsers(usersData) {
    // Recreate users
    users = {};

    for (var id in usersData) {
        (function(copyId){
            if (copyId != curr_user['id'])
                users[copyId] = usersData[copyId];
        })(id);
    }
    chat_addUsers(users);
}

function searchClick(id) {
    $('.search-result-box').remove();
    $('#search-results').css('height', '60px');

    var message = sendInvite(id);
    $('#search-results').append('<div id="invite-reply" class="search-result-name">' + message + '</div>');
    if (message == 'Invite was sent')
        $('#invite-reply').css('color', 'green');
    else
        $('#invite-reply').css('color', 'red');
}

function search(keypress) {
    if (keypress == 38) {
        if (searchItemCurr == -1)
            searchItemCurr = 0;
        else {
            $('#search-result-box-' + searchItemCurr).css('background-color', '#fff');
            if (searchItemCurr > 0)
                searchItemCurr = searchItemCurr - 1;
        }
        $('#search-result-box-' + searchItemCurr).css('background-color', 'rgba(0, 0, 250, 0.6)');
        return;
    }
    else if(keypress == 40) {
        if (searchItemCurr == -1)
            searchItemCurr = 0;
        else {
            $('#search-result-box-' + searchItemCurr).css('background-color', '#fff');
            if (searchItemCurr < searchItemId)
                searchItemCurr = searchItemCurr + 1;
        }
        $('#search-result-box-' + searchItemCurr).css('background-color', 'rgba(0, 0, 250, 0.6)');
        return;
    }
    else if(keypress == 13) {
        if (searchItemCurr != -1)
            $('#search-result-box-' + searchItemCurr).trigger('click');
        return;
    }

    searchItemCurr = -1;
    text = $('#search-box').val();
    template = $('#searchResultTemplate').html();

    $('#search-results').empty();
    if (text.length == 0) {
        $('#search-results').css('height', '0px');
        return;
    }

    data = {};
    data['type'] = 'search_users';
    data['name'] = text;

    $.ajax({
        url: '/backend/user/',
        type: 'post',
        data: data,
        success: function(json) {
            resultUsers = $.parseJSON(json);
            $('#search-results').css('height', (50 * resultUsers.length) + 'px');

            searchItemId = 0;
            for (indx in resultUsers) {
                (function(i){
                    var name = resultUsers[i][1];
                    var id = resultUsers[i][0];
                    var fun = function() { searchClick(id); };

                    item = template.format(searchItemId);
                    $('#search-results').append(item);
                    $('#search-result-name-' + searchItemId).html(name);
                    $('#search-result-pic-' + searchItemId).css('background-image', 'url(' + users[id][2] + ')');
                    $('#search-result-box-' + searchItemId).click(fun);                    
                    searchItemId = searchItemId + 1;
                })(indx);
            }
        },
        error: function(html) {
            console.log('error on get results');
        }
    });
}

$(document).ready(function() {
    menu_addItem('User Profile', '#', function() { openUserProfile(); } );
    menu_addItem('Game History', '#', null);
    menu_addItem('Tutorial', '#', null);
    menu_addItem('Play Game', '#', function() { startGame(curr_user['id'], -10, 1, true); } );
    menu_addItem('Hall of Fame', '#', null);
    $('#search-box').keyup(function(event) { search(event.which); } );

    /* Set the height for the two menu components */
    var totalH = $(window).height();
    var totalW = $(window).width();
    $('#top-menu ').width(totalW - 220);
    $('#user-list').height(totalH - $('#nav-menu').height() );
    $('#game-window').width(totalW - 220);
    $('#top-menu').fadeIn(500);
    $('#user-list').fadeIn(500);
    $('#search-results').css('left', 390 + $('#top-menu ').width() / 5);

    /* Get all users and current user's profile. */
    user_getProfile();
    setInterval(getUpdates, 1000);
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
