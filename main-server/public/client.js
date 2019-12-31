const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const roomContainer = document.getElementById('room-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const adminStatusContainer = document.getElementById('admin-status');
const hackerStatusContainer = document.getElementById('hacker-status');
const playerContainer = document.getElementById('play-container');
const swapRoleContainer = document.getElementById('swap-role-container');

// Popup add Name to the room
if(messageForm != null) {
    const name = prompt('What is your name ?');
    appendMessage('You joined');
    //socket.emit('debug-log', `New User : ${name}`);
    socket.emit('new-user', roomName, name);

    messageForm.addEventListener('submit', e => {
        const message = messageInput.value;
        e.preventDefault();
        appendMessage(`You : ${message}`);
        socket.emit('send-chat-message', roomName, message);
        messageInput.value = ''
    });
}

// Manage Listener
// Play button :
if (playerContainer != null) {
    playerContainer.addEventListener('submit', e => {
        e.preventDefault();
        socket.emit('game-launch', roomName)
    });
}
// Swap role button :
if (swapRoleContainer != null) {
    swapRoleContainer.addEventListener('submit', e => {
        e.preventDefault();
        socket.emit('swap-role', roomName)
    })
}

// Manage of all message
socket.on('chat-message', data => {
    appendMessage(`${data.name} : ${data.message}`)
});

socket.on('user-connected', (name) => {
    appendMessage(`${name} connected`);
});

socket.on('change-active-role', (roles) => {
    const rolesKeys = Object.keys(roles);

    if (rolesKeys.includes('admin')) {
        adminStatusContainer.innerText = `Admin is ${roles['admin']}`
    }
    else {
        adminStatusContainer.innerText = `Admin is not connected`
    }

    if (rolesKeys.includes('hacker')) {
        hackerStatusContainer.innerText = `Hacker is ${roles['hacker']}`
    }
    else {
        hackerStatusContainer.innerText = `Hacker is not connected`
    }

});

socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`)
});

socket.on('room-created', room => {
    const roomElement = document.createElement('div');
    roomElement.innerText = room;
    const roomLink = document.createElement('a');
    roomLink.href = `/${room}`;
    roomLink.innerText = 'Join';
    roomContainer.append(roomElement);
    roomContainer.append(roomLink);
});

// Manage Game Start

socket.on('start-game', (players_room, rooms_room) => {
    const room = roomName;
    const playerData = JSON.stringify(players_room.users[socket.id]);
    const roomsData = rooms_room.users[socket.id];

    window.location.href = `/${room}/play?playerData=${playerData}&roomsData=${roomsData}`
});

function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement)
}