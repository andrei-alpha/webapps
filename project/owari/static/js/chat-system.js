var chat_system = {};
var chat_system_last = {};
var chat_system_pos = 0;
var chat_system_windowId = 0;

/* Reposition all the windows. Will be called when we close
a window */
function chat_refresh() {
	chat_system_pos = 0;
	for (userId in chat_system) {
		var window = chat_system[userId];

		if(window != null) {
			window.setPosition(chat_system_pos);
			chat_system_pos = chat_system_pos + 1;
		}
	}
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
                (function(copyId){
                    var fun = function() { chat_newWindow(copyId, users[copyId]) };
                    menu_addUser(users[copyId], copyId, fun);
                    chat_system_last[copyId] = 0;
                })(id);
            }

            chat_get_messages();
        },
        error: function(html) {
            console.log('error on get users');
        }
    });
}

function chat_get_messages() {
	data = {};
	data['csrfmiddlewaretoken'] = getCookie('csrftoken');
	data['type'] = 'get_messages';
	data['users'] = {};
	data['users'] = [{'1' : 0, '2': 0, '3': 0}];

	$.ajax({
        url: '/backend/messages/',
        type: 'post',
        data: data,
        success: function(json) {
            console.log('WTF');
        },
        error: function(html) {
            console.log('error on get messages');
        }
    });
}

function chat_closeWindow(userId) {
	chat_system[userId] = null;
	chat_refresh();
}

function chat_newWindow(userId, name) {
	chat_system_windowId = chat_system_windowId + 1;

	if (chat_system[userId] == null) {
		var window = new ChatWindow(name, chat_system_windowId, userId, chat_system_pos, 
			function() { chat_closeWindow(userId); } );
    	window.init();
    	chat_system[userId] = window;
    	chat_system_last[userId] = 0;
    	chat_system_pos = chat_system_pos + 1;
	}
}
