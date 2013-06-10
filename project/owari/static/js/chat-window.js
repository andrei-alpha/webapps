
function ChatWindow(name, windowId, userId, position, callback) {
    this.name = name;
    this.windowId = windowId;
    this.userId = userId;

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
    $('#chat-window-bar-name-' + this.windowId).text(this.name);

    // Bind all events
    var _this = this;
    $('#chat-form-' + this.windowId).keypress(function(event) { if(event.which == 13) _this.submit(); } );
    $('#chat-minimise-' + this.windowId).click(function(event) { _this.minimize(); });
    $('#chat-close-' + this.windowId).click(function(event) { _this.close(); });
}

ChatWindow.prototype.receive = function(id, message, read) {
    // We should mark the message as unread
    $('#chat-messages-' + this.windowId).append('<div class="chat-message">' + message + '</div>');
    $('#chat-messages-' + this.windowId).scrollTop($('#chat-messages-' + this.windowId)[0].scrollHeight);
    if (read == false)
        chat_markMessageRead(id);
}

ChatWindow.prototype.submit = function() {
    var message = $('#chat-input-' + this.windowId).val();
    message = curr_user['first_name'] + ": " + message;
    $('#chat-messages-' + this.windowId).append('<div class="chat-message">' + message + '</div>');
    $('#chat-messages-' + this.windowId).scrollTop($('#chat-messages-' + this.windowId)[0].scrollHeight);
    $('#chat-input-' + this.windowId).val('');

    var data = {}
    var userId = this.userId;
    data['csrfmiddlewaretoken'] = getCookie('csrftoken');
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
    $('#chat-content-' + this.windowId).toggleClass('chat-hidden');
    
    if(this.visible == true)
        $('#chat-minimise-' + this.windowId).attr('src', '/static/img/arrow_up.png');
    else
        $('#chat-minimise-' + this.windowId).attr('src', '/static/img/arrow_down.png');
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