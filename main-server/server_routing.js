exports.apply_routing = (app, io, rooms, players) => {
    //
    app.get('/', (req, res) => {
        res.render('index', {rooms: rooms})
    });

    app.post('/room', (req, res) => {
        if (rooms[req.body.room] != null){
            return res.redirect('/')
        }
        rooms[req.body.room] = {users: {}};
        players[req.body.room] = {users: {}};

        // Redirection to the good room :
        res.redirect(req.body.room);

        // Send message that new room was created
        io.emit('room-created', req.body.room)
    });

    app.get('/:room', (req, res) => {
        // Test if there is a channel room that already exist
        if (rooms[req.params.room] == null) {
            return res.redirect('/')
        }

        // Check the number of Users :
        const number_of_Users = this.getNumberUserInRoom(req.params.room);
        if (number_of_Users + 1 > 2){
            console.log(`Serveur : ${req.params.room} is full !`);
            return res.redirect('/')
        }

        // Display the good windows to the user
        res.render('room', {roomName: req.params.room});

    });

    app.get('/:room/launch', (req, res) => {
        // Check if a user can launch the game session
        const number_of_Users = this.getNumberUserInRoom(req.params.room) + 1;
        if (number_of_Users === 2){
            io.to(req.params.room).emit('launch-game', req.params.room);
        }
        else {
            console.log('2 Players needed');
            return null;
        }
    });

    app.get('/:room/play', (req, res) => {
        //res.render('board_test', {roomName: req.params.room})
        const room = req.params.room;
        const playerData = req.query.playerData;
        const roomsData = req.query.roomsData;

        if(room != null && playerData != null && roomsData != null){
            console.log('Player Data :', playerData);
            res.render('board_base', {
                roomName: room,
                playerData: playerData,
                roomsData: roomsData
            })
        }
        // If a user reload the page
        else {
            // TODO: redirect all the users in he current room to the room section
            res.redirect(`/${req.params.room}`);
        }
    });

    exports.getUserRooms = (socket) => {
        return Object.entries(rooms).reduce((names, [name, room]) => {
            if (room.users[socket.id] != null) names.push(name);
            return names
        }, [])
    };

    exports.getNumberUserInRoom = (roomName) => {
        const room = rooms[roomName].users;
        return Object.keys(room).length
    };

    exports.getNumberPlayersInRoom = (roomName) => {
        return Object.keys(players[roomName].users).length
    };

    exports.getPlayersRooms = (socket) => {
        return Object.entries(players).reduce((names, [name, room]) => {
            if (room.users[socket.id] != null) names.push(name);
            return names
        }, [])
    };

    exports.getPlayersRole = (roomName) => {
        const roomKey = Object.keys(players[roomName].users);
        const roles = {};
        for (const index in roomKey) {
            const id = roomKey[index];
            const role = players[roomName].users[id].role;
            roles[role] = rooms[roomName].users[id];
        }
        return roles;
    };

};

