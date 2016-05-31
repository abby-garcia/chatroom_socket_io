$(document).ready(function() {
    // initialize variables
    var socket = io();
    var $window = $(window); // we're creating variables with "$" , tells you you're using a jquery object; also saves time and jquery loading it only saves it once
    var $inputMessage = $('.messageInput'); //input message box
    var $messages = $('#messages'); //messages area
    var $usernameInput = $('.usernameInput'); // input for username
    
    var $chatPage = $('.chatroom_page'); // chatroom page
    var $loginPage = $('.loginPage'); // login page 

    // prompts for setting a username
    var username; 
    var connected = false;
    var $currentInput = $usernameInput.focus(); // ".focus()" highlights the area

    
    // function log will 
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


    // addParticipantsMessage will put the message of how many people are logged in at a time. 
    function addParticipantsMessage (data) {
        var message = '';
        if (data.numUsers === 1){
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        log(message); // helpful function that ads thing to our screen
    }

    // setUsername will clean up the input. If it's true [ if(username) ] then it will do all 
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

    // sendMessage will take the input message, return the value

    function sendMessage(){
        var message = $inputMessage.val();

        message = cleanInput(message);

        if(message && connected){ // if this is true, then
            $inputMessage.val(''); // var $inputMessage = $('.messageInput'); //input message box TAKES THE VALUE
            addChatMessage({  // 
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

    $window.keydown(function(event){ // when they press enter, the function below will happen
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

    // Socket Events

    // Below are all event emitters, on a certain event, like login, it will execute the function
    // which you made up above.

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




