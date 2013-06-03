var chat_system = {};
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

function chat_closeWindow(userId) {
	chat_system[userId] = null;
	chat_refresh();
}

function chat_newWindow(userId, name) {
	chat_system_windowId = chat_system_windowId + 1;

	console.log('new for ' + userId);

	if (chat_system[userId] == null) {
		var window = new ChatWindow(name, chat_system_windowId, userId, chat_system_pos, 
			function() { chat_closeWindow(userId); } );
    	window.init();
    	chat_system[userId] = window;
    	chat_system_pos = chat_system_pos + 1;
	}
}
