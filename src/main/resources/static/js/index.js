assignEnterListener('room-input', 'join-room-button')
assignEnterListener('chat-input', 'chat-input-button')

let stompClient = null;
let username = null;
let roomName = null;

function joinRoomHandler() {
    const joinRoomInput = document.getElementById('room-input');
    roomName = joinRoomInput.value;
    const usernameInput = document.getElementById('username');
    username = usernameInput.value;

    if (roomName && username) {
        joinRoomInput.value = '';
        usernameInput.value = '';

        let socket = new SockJS('/chit-chat-websocket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            joinRoom(roomName);
            console.log('Connected: ' + frame);
            stompClient.subscribe('/chat/' + roomName, function (message) {
                addChatInstance(JSON.parse(message.body));
                });
            }
        )
    }
}

function joinRoom() {
    document.getElementById('welcome-page').style.display = 'none';
    document.getElementById('room-page').style.display = 'block';
    document.getElementById('room-name').innerHTML = roomName;
    document.getElementById('username-greeting').innerHTML = username;
}

function chitChat() {
    const chatInput = document.getElementById('chat-input');
    let userChat = chatInput.value;
    chatInput.value = '';

    stompClient.send("/app/" + roomName, {}, JSON.stringify({'sender': username, 'message': userChat}))
}

function addChatInstance(message) {
    document.getElementById('chatter').innerHTML += '<div class="chat-instance">' +
                '<div class="chit-chatter">' + message.sender + '</div>' +
                '<div class="chit-message">' + message.message + '</div>' +
            '</div>'
}


function assignEnterListener(inputId, inputButtonId) {
    const roomInput = document.getElementById(inputId);

    roomInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById(inputButtonId).click();
        }
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    leaveRoom();
    console.log("Disconnected")
}

function leaveRoom() {
    document.getElementById('welcome-page').style.display = 'block';
    document.getElementById('room-page').style.display = 'none';
}

