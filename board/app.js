const express = require('express');
let app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Express part :
// Configure the app (Express server)
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get('/:room/play', (req, res) => {
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
        res.redirect(`http://localhost:3000/${req.params.room}`);
    }
});

server.listen(5000);

io.on('connection', socket => {
    console.log(`Connection : ${socket.id}`);

    // Disconnection manager
    socket.on('disconnect', () => {
        // Test
        console.log(`Disconnection of : ${socket.id}`);
    })
});