
function ChatWindow(name, windowId, userId, position, callback) {
    this.name = name;
    this.windowId = windowId;
    this.userId = userId;

    this.width = 260 + 4;
    this.position = position;
    this.visible = true;
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
    $('#chat-minimise-' + this.windowId).click(function(event) { _this.show(); });
    $('#chat-close-' + this.windowId).click(function(event) { _this.close(); });
}

ChatWindow.prototype.submit = function() {
    var message = $('#chat-input-' + this.windowId).val();
    message = "Andrei: " + message;
    $('#chat-messages-' + this.windowId).append('<div class="chat-message">' + message + '</div>')
    $('#chat-input-' + this.windowId).val('');
}

ChatWindow.prototype.show = function() {
    $('#chat-content-' + this.windowId).toggleClass('chat-hidden');
    
    if(this.visible == true)
        $('#chat-minimise-' + this.windowId).attr('src', '/static/img/arrow_up.png');
    else
        $('#chat-minimise-' + this.windowId).attr('src', '/static/img/arrow_down.png');
    this.visible = !this.visible;
}

ChatWindow.prototype.close = function() {
    $('#chat-window-' + this.windowId).fadeOut(500);
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