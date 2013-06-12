var invite_pos = 0;
var invite_system = {};
var invite_system_pos = 0;

function Invite(type, otherId, position, callback) {
	this.windowId = otherId;
	this.otherId = otherId;
	this.name = users[otherId][0];
	this.position = position;
	this.callback = callback;
	this.height = 100 + 4;
	invite_system[otherId] = this;
	this.type = type;
}

Invite.prototype.init = function() {
	// Remove the code if was added before
	$('#invite-window-' + this.windowId).remove();

	// Add the html code from a invite window template
    var windowTemplate = $('#inviteWindowTemplate').html();   
    var template;

    // See if this invite was sent or received
    if (this.type == "received")
    	template = windowTemplate.format(this.windowId, this.name + ' would like to play a game with you');
    else
    	template = windowTemplate.format(this.windowId, 'Waiting for ' + this.name + "'" + 's response');

    $('body').append(template);

    // Place the window and set the name
    this.place();
    
    if (this.type == "sent") {
    	$('#invite-close-' + this.windowId).fadeOut(0);
    	$('#invite-accept-' + this.windowId).fadeOut(0);
    }

    // Bind all events
    var _this = this;
    $('#invite-accept-' + this.windowId).click(function(event) { _this.accept(); });
    $('#invite-close-' + this.windowId).click(function(event) { _this.close(); });
    // Show the invite
    this.show();
}

Invite.prototype.send = function() {
	inviteAjaxCall('/backend/invite/', 
		{'type': 'new_invite', 'recipient': this.otherId},
		'error on sending a new invite');
}

Invite.prototype.show = function() {
	$('#invite-window-' + this.windowId).fadeIn(500);
}

Invite.prototype.close = function() {
	if (this.type == "sent") {
		$('#invite-text-' + this.windowId).text(this.name + ' can not play a game now');
		$('#invite-text-' + this.windowId).css('color', 'red');
		$('#invite-window-' + this.windowId).fadeOut(3000);

		inviteAjaxCall('/backend/invite/', 
			{'type': 'delete_invite', 'recipient': this.otherId},
			'error on delete invite');
	}
	else {
		$('#invite-window-' + this.windowId).fadeOut(500);

		inviteAjaxCall('/backend/invite/', 
			{'type': 'cancel_invite', 'sender': this.otherId},
			'error on cancel invite');
	}
	invite_system[this.windowId] = null;
	invite_refresh();
}

Invite.prototype.accept = function() {
	if (this.type == "sent") {
		$('#invite-text-' + this.windowId).text(this.name + ' has accepted your invite');
		$('#invite-text-' + this.windowId).css('color', 'green');
		$('#invite-window-' + this.windowId).fadeOut(2000);
		setTimeout(startGame(curr_user['id'], this.otherId, 0, false), 2000);

		inviteAjaxCall('/backend/invite/', 
			{'type': 'delete_invite', 'recipient': this.otherId},
			'error on delete invite');
	}
	else {
		$('#invite-window-' + this.windowId).fadeOut(500);

		inviteAjaxCall('/backend/invite/', 
			{'type': 'accept_invite', 'sender': this.otherId},
			'error on accept invite');
		setTimeout(startGame(this.otherId, curr_user['id'], 0, true), 1000);
	}
	invite_system[this.windowId] = null;
	invite_refresh();
}

Invite.prototype.place = function() {
	$('#invite-window-' + this.windowId).css('top', (this.position * this.height + 55) + 'px');
}

Invite.prototype.setPosition = function(position) {
	this.position = position;
	this.place();
}

function invite_refresh() {
	invite_system_pos = 0;
	for (userId in invite_system) {
		var window = invite_system[userId];

		if(window != null) {
			window.setPosition(invite_system_pos);
			invite_system_pos = invite_system_pos + 1;
		}
	}
}

function sendInvite(toId) {
	if (invite_system[toId] != null)
		return 'You have already invited ' + users[toId][0];

	var inv = new Invite("sent", toId, invite_system_pos, null);
	inv.init();
	inv.send();
	invite_system_pos = invite_system_pos + 1;

	return 'Invite was sent';
};

function invite_getInvites(data) {
	for (ind in data) {
		invite = data[ind];

		if (invite[0] == curr_user['id']) {
			if (invite[2] != 'pending') {
				if (invite[2] == 'accept')
					invite_system[ invite[1] ].accept();
				else
					invite_system[ invite[1] ].close();
			}
			else if (invite_system[ invite[1] ] == null) {
				var inv = new Invite("sent", invite[1], invite_system_pos, null);
				inv.init();
				invite_system_pos = invite_system_pos + 1;
			}
		}
		if (invite[0] != curr_user['id'] && invite_system[ invite[0] ] == null && invite[2] == 'pending') {
			var inv = new Invite("received", invite[0], invite_system_pos, null);
			inv.init();
			invite_system_pos = invite_system_pos + 1;
		}

	}
}

function inviteAjaxCall(path, data, error) {
	$.ajax({
        url: path,
        type: 'post',
        data: data,
        error: function(html) {
            console.log(error);
        }
    });
}