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

		if(window != null && window.visible == true) {
			window.setPosition(chat_system_pos);
			chat_system_pos = chat_system_pos + 1;
		}
	}
}

function chat_addUsers(chat_users) {
	for (var id in chat_users) {
        (function(copyId){
        	if (chat_system[copyId] != null) {
        		menu_changeUser(chat_users[copyId], copyId);
        		chat_system[copyId].change(chat_users[copyId][0], copyId);
        	}
        	else {
        		var fun = function() { chat_newWindow(copyId, chat_users[copyId][0], true) };
            	menu_addUser(chat_users[copyId], copyId, fun);
            	chat_newWindow(copyId, chat_users[copyId][0], false);
            	chat_system_last[copyId] = 0;
            }
        })(id);
	}
}

function chat_getMessages(data) {
	for (id in data) {
    	for(var ind = 0; ind < data[id].length; ++ind) {
    		message = data[id][ind];

    		if (message[2] == false && chat_system[id].visible == false)
    			chat_system[id].show();
    		chat_system[id].receive(message[0], message[1], message[2]);
    		chat_system_last[id] = message[0];
    	}
    }
}

function chat_markMessageRead(messageId) {
	data2 = {};
	data2['type'] = "mark_read";
	data2['id'] = messageId;

	$.ajax({
        url: '/backend/messages/',
        type: 'post',
        data: data2,
        error: function(html) {
        	console.log('cannot mark as read');
        }
    });
}

function chat_closeWindow(userId) {
	chat_refresh();
}

function chat_newWindow(userId, name, show) {
	chat_system_windowId = chat_system_windowId + 1;

	if (chat_system[userId] == null) {
		var window = new ChatWindow(name, chat_system_windowId, userId, chat_system_pos, 
			function() { chat_closeWindow(userId); } );
    	window.init();
    	chat_system[userId] = window;
    	if(show)
    		window.show();
	}
	else if(show && chat_system[userId].visible == false)
		chat_system[userId].show();
}
