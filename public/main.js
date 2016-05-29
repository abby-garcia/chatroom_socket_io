$(document).ready(function() {
    var socket = io();

    var $window = $(window); // we're creating variables with "$" , tells you you're using a jquery object; also saves time and jquery loading it only saves it once
    var $inputMessage = $('.messageInput');
    var $messages = $('#messages');
    var $usernameInput = $('.usernameInput');
    
    var $chatPage = $('.chatroom_page');
    var $loginPage = $('.loginPage');

    var username; 
    var connected = false;
    var $currentInput = $usernameInput.focus();

    function log (message, options){
        var $el = $('<li>').addClass('log').text(message); // "$el" - when creating a new element that doesn't exisit on the page
        addMessageElement($el, options);
    }

    function addMessageElement(el, options){
        var $el = $(el);

        if (!options){
            options = {};
        }
        if (typeof options.fade === 'undefined') {
          options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
          options.prepend = false;
        }

        if(options.fade){
            $el.hide().fadeIn();
        }
        if(options.prepend){
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight; // this makes the sentence appear at the bottom & looks like it pops out at the end
    }

    function addParticipantsMessage (data) {
        var message = '';
        if (data.numUsers === 1){
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        log(message); // helpful function that ads thing to our screen
    }

    function setUsername() {
        username = cleanInput($usernameInput.val().trim()); //trim is used to take away any spaces

        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();

            socket.emit('add user', username);
        }
    }

    function sendMessage(){
        var message = $inputMessage.val();

        message = cleanInput(message);

        if(message && connected){
            $inputMessage.val('');
            addChatMessage({
                username: username,
                message: message
            });

            socket.emit('new message', message);
        }
    }

    function addChatMessage(data,options){
        options = options || {};

        var $usernameDiv = $('<span class="username"/>')
            .text(data.username);

        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    function cleanInput (input) {
        return $('<div/>').text(input).text();
    }

    $window.keydown(function(event){
        if(event.which === 13){
            if(username){
                sendMessage();
            } else {
                setUsername();
            }
        }
    });

    // Focus input when clicking anywhere on login page
      $loginPage.click(function () {
        $currentInput.focus();
      });

      // Focus input when clicking on the message input's border
      $inputMessage.click(function () {
        $inputMessage.focus();
      });

    socket.on('login', function(data){
        connected = true;

        var message = "Welcome to Socket.IO Chat - ";
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
    });

    socket.on('new message', function(data){
        addChatMessage(data);
    });

    socket.on('user joined', function(data){
        log(data.username + ' joined');
        addParticipantsMessage(data);
    });

    socket.on('user left', function(data){
        log(data.username + ' left');
        addParticipantsMessage(data);
    });

});




