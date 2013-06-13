
function ChatWindow(user, windowId, userId, position, callback) {
    this.user = user;
    this.windowId = windowId;
    this.userId = userId;
    this.mesId = 0;
    this.lastFromId = -1;
    this.lastLineNo = 0;

    this.width = 260 + 4;
    this.position = position;
    this.visible = false;
    this.minimized = false;
    this.callback = callback;
}

ChatWindow.prototype.init = function() {
    // Add the html code from a chat window template
    var windowTemplate = $('#chatWindowTemplate').html();   
    var template = windowTemplate.format(this.windowId);
    $('#chat').append(template);

    // Place the window and set the name
    this.place();
    $('#chat-window-bar-name-' + this.windowId).text(this.user[0]);

    // Bind all events
    var _this = this;
    $('#chat-form-' + this.windowId).keypress(function(event) { if(event.which == 13) _this.submit(); } );
    $('#chat-minimise-' + this.windowId).click(function(event) { _this.minimize(); });
    $('#chat-close-' + this.windowId).click(function(event) { _this.close(); });
}

ChatWindow.prototype.change = function(user, userId) {
    this.user = user;
    this.userId = userId;

    $('#chat-window-bar-name-' + this.windowId).text(this.user[0]);
}

ChatWindow.prototype.receive = function(id, message, read, fromId, time) {
    // We should mark the message as unread
    if (this.lastFromId == fromId) {
        itemId = this.windowId + '-' + this.mesId;
        lastMessage = $('#chat-message-content-' + itemId).html();

        this.lastLineNo = this.lastLineNo + 1;
        $('#chat-message-content-' + itemId).html(lastMessage + '<br>' + message);
        $('#chat-message-' + itemId).css('height', Math.max(65, 23 + this.lastLineNo * 23) );
    }
    else {
        this.lastLineNo = 0;
        this.mesId = this.mesId + 1;
        var messageTemplate = $('#chatMessageTemplate').html();   
        var template = messageTemplate.format(this.windowId, this.mesId, time, message);
        var image = (fromId == curr_user['id'] ? curr_user['image'] : users[fromId][2]);

        this.lastFromId = fromId;
        $('#chat-messages-' + this.windowId).append(template);
        $('#chat-message-pic-' + this.windowId + '-' + this.mesId).css('background-image', 
            'url(' + image + ')');
    }
    $('#chat-messages-' + this.windowId).scrollTop($('#chat-messages-' + 
        this.windowId)[0].scrollHeight);
    $('#chat-input-' + this.windowId).val('');

    if (read == false)
        chat_markMessageRead(id);
}

ChatWindow.prototype.submit = function() {
    // Send a new message
    var message = $('#chat-input-' + this.windowId).val();

    if (this.lastFromId == curr_user['id']) {
        itemId = this.windowId + '-' + this.mesId;
        lastMessage = $('#chat-message-content-' + itemId).html();

        this.lastLineNo = this.lastLineNo + 1;
        $('#chat-message-content-' + itemId).html(lastMessage + '<br>' + message);
        $('#chat-message-' + itemId).css('height', Math.max(65, 23 + this.lastLineNo * 23));
    }
    else {
        this.lastLineNo = 0;
        this.mesId = this.mesId + 1;
        var time = formatAMPM( new Date() );
        var messageTemplate = $('#chatMessageTemplate').html();   
        var template = messageTemplate.format(this.windowId, this.mesId, '10:32', message);

        this.lastFromId = curr_user['id'];
        $('#chat-messages-' + this.windowId).append(template);
        $('#chat-message-pic-' + this.windowId + '-' + this.mesId).css('background-image', 
            'url(' + curr_user['image'] + ')');
    }
    $('#chat-messages-' + this.windowId).scrollTop($('#chat-messages-' + 
        this.windowId)[0].scrollHeight);
    $('#chat-input-' + this.windowId).val('');

    var data = {}
    var userId = this.userId;
    data['type'] = 'new_message';
    data['recipient'] = this.userId;
    data['text'] = message;

    $.ajax({
        url: '/backend/messages/',
        type: 'post',
        data: data,
        success: function(id) {
            chat_system_last[userId] = id;
        },
        error: function(html) {
            console.log('error on sending a new message');
        }
    });
}

ChatWindow.prototype.minimize = function() {
    if(this.minimized == false) {
        $('#chat-content-' + this.windowId).animate({'height': '0px'}, 1000);
        $('#chat-input-' + this.windowId).fadeOut(0);
        $('#chat-minimise-' + this.windowId).attr('src', '/static/img/arrow_up.png');
    }
    else {
        $('#chat-content-' + this.windowId).animate({'height': '300px'}, 1000);
        $('#chat-input-' + this.windowId).fadeIn(0);
        $('#chat-minimise-' + this.windowId).attr('src', '/static/img/arrow_down.png');
    }
    this.minimized = !this.minimized;
}

ChatWindow.prototype.show = function () {
    this.position = chat_system_pos;
    chat_system_pos = chat_system_pos + 1;
    this.place();

    $('#chat-window-' + this.windowId).fadeIn(500);
    $('#chat-messages-' + this.windowId).scrollTop($('#chat-messages-' + this.windowId)[0].scrollHeight);
    this.visible = true;
}

ChatWindow.prototype.close = function() {
    $('#chat-window-' + this.windowId).fadeOut(500);
    this.visible = false;
    this.callback();
}

ChatWindow.prototype.setPosition = function(position) {
    this.position = position;
    this.place();
}

ChatWindow.prototype.place = function() {
    $('#chat-window-' + this.windowId).css('right', (this.position * this.width + 5) + 'px');
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