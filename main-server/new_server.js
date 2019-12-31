const express = require('express');
let app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Import intern functions / modules :
const server_routing = require('./server_routing');

// Express part :
// Configure the app (Express server)
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// Data of the Server :
const rooms = {};
const players = {};
// Routing Part
server_routing.apply_routing(app, io, rooms, players);

// Start the server on the port 3000
server.listen(3000);

// Socket IO part :
io.on('connection', socket => {
    console.log(`Connection : ${socket.id}`);
    // Debug listener
    socket.on('debug-log', data => {
        console.log(data)
    });

    // Room management
    socket.on('new-user', (room, name) =>{
        // Join the socket to a room for the function 'to'
        socket.join(room);

        // Add the users in the room
        rooms[room].users[socket.id] = name;

        //Check the number of players in the room to apply a default role
        if (server_routing.getNumberPlayersInRoom(room) <= 0) {
            players[room].users[socket.id] = {
                role:'admin'
            };
        }
        else {
            let new_role;

            const roles = Object.keys(server_routing.getPlayersRole(room));
            if(roles.includes('admin')){
                new_role = 'hacker';
            }
            else{
                new_role = 'admin';
            }

            players[room].users[socket.id] = {
                role: new_role
            };
        }

        socket.to(room).broadcast.emit('user-connected', name);
        io.to(room).emit('change-active-role', server_routing.getPlayersRole(room));
    });

    socket.on('send-chat-message', (room, message)=> {
        socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id]})
    });

    socket.on('swap-role', (room) => {
        // TODO: Ask the other user with a Pop Up if he want to change

        const rolesKeys = Object.keys(server_routing.getPlayersRole(room));
        if (rolesKeys.length === 1) {
            if(rolesKeys.includes('admin')){
                players[room].users[socket.id].role = 'hacker'
            }
            else {
                players[room].users[socket.id].role = 'admin'
            }
        }
        else {
            let new_role;
            const actual_role = [];
            actual_role.push(players[room].users[socket.id].role);
            if (actual_role.includes('admin')){
                players[room].users[socket.id].role = 'hacker';
                new_role = 'admin';
            }
            else {
                players[room].users[socket.id].role = 'admin';
                new_role = 'hacker';
            }
            const id_Keys = Object.keys(players[room].users);
            const id_Index = (id_Keys.indexOf(socket.id) % 2 === 0) ? 1 : 0;
            players[room].users[id_Keys[id_Index]].role = new_role;
            console.log(players[room].users)
        }

        io.to(room).emit('change-active-role', server_routing.getPlayersRole(room));
    });

    // Game Management
    socket.on('game-launch', (room) => {
        const number_of_Users = server_routing.getNumberUserInRoom(room);
        if (number_of_Users === 2){
            io.to(room).emit('start-game', players[room], rooms[room]);
        }
        else {
            // TODO: Pop Up to the current socket.id users
            console.log('2 Players needed');
            return null;
        }
    });

    // Phaser Management
    socket.on('phaser-reload', (room, player_data, rooms_data) => {
        // Join the socket to a room for the function 'to'
        socket.join(room);


        players[room].users[socket.id] = player_data;
        rooms[room].users[socket.id] = rooms_data;
    });

    // Disconnection manager
    socket.on('disconnect', () => {
        // Test
        console.log(`Disconnection of : ${socket.id}`);

        // Delete all trace of the socket in the rooms object
        server_routing.getUserRooms(socket).forEach(room => {
            socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id]);
            delete rooms[room].users[socket.id]
        });
        // Delete all trace of the socket in the players object
        server_routing.getPlayersRooms(socket).forEach(room => {
            delete  players[room].users[socket.id];
            socket.to(room).broadcast.emit('change-active-role', server_routing.getPlayersRole(room));
        })

    })
});



