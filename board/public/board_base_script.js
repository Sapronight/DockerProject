const socket = io('http://localhost:3000');
// Ejs DATA loading
const player_Data = JSON.parse(decodeHTML(playerData));
const rooms_Data = decodeHTML(roomsData);

// Ejs Containers
const playerNameRoleContainer = document.getElementById('player-name-role-container');


let config = {
    type: Phaser.AUTO,
    width: 1520,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update : update
    }
};

//Gestion actions
let actionsAdmin = 0;
let actionAdminText;
let actionsHacker = 0;
let actionHackerText;

//Board
let poste1;
let poste2;
let poste3;
let poste4;
let poste5;
let poste6;
let poste7;
let poste8;
let poste9;
let poste10;
let poste11;
let poste;

let line;
let line2;

let coude;
let coude2;
let coude3;
let coude4;

//Joueurs
let admin_power;
let hacker_power;

//Cartes
let admin_carte;
let hacker_carte;

let game = new Phaser.Game(config);

function preload () {
    //this.load.setBaseURL('http://labs.phaser.io');

    //Board
    this.load.image('bckgnd', '../images/fonds/test1.png');
    this.load.image('pc', '../images/postes/computer_board.png');
    this.load.image('line', '../images/postes/line.png');
    this.load.image('line2', '../images/postes/line2.png');
    this.load.image('coude', '../images/postes/coude2.png');
    this.load.image('coude2', '../images/postes/coude3.png');
    this.load.image('coude3', '../images/postes/coude4.png');
    this.load.image('coude4', '../images/postes/coude5.png');

    //Joueurs
    this.load.image('admin_icon', '../images/joueur/admin_icon.png');
    this.load.image('hacker_icon', '../images/joueur/hacker_icon.png');
    this.load.image('admin_power', '../images/joueur/admin_power.png');
    this.load.image('hacker_power', '../images/joueur/hacker_power.png');

    //Cartes
    this.load.image('admin_carte', '../images/cartes/carte_admin.png');

    //this.load.image('red', 'assets/particles/red.png');
}

function create () {
    // Client Part
    // Reload function :
    socket.emit('phaser-reload', roomName, player_Data, rooms_Data);
    const current_role = player_Data.role;
    const current_user_name = rooms_Data;

    // Update the name/role container
    updateNameRoleContainer(current_user_name, current_role);

    // Base for all of the users
    //Background
    this.add.image(760, 350, 'bckgnd');

    // POSTES
    poste1 = this.physics.add.staticGroup();
    poste2 = this.physics.add.staticGroup();
    poste3 = this.physics.add.staticGroup();
    poste4 = this.physics.add.staticGroup();
    poste5 = this.physics.add.staticGroup();
    poste6 = this.physics.add.staticGroup();
    poste7 = this.physics.add.staticGroup();
    poste8 = this.physics.add.staticGroup();
    poste9 = this.physics.add.staticGroup();
    poste10 = this.physics.add.staticGroup();
    poste11 = this.physics.add.staticGroup();


    //Postes joueur
    poste1.create(480, 550, 'pc').setScale(0.2).refreshBody();
    poste2.create(760, 550, 'pc').setScale(0.2).refreshBody();
    poste3.create(1040, 550, 'pc').setScale(0.2).refreshBody();

    //Postes milieu
    poste4.create(200, 350, 'pc').setScale(0.2).refreshBody();
    poste5.create(480, 350, 'pc').setScale(0.2).refreshBody();
    poste6.create(760, 350, 'pc').setScale(0.2).refreshBody();
    poste7.create(1040, 350, 'pc').setScale(0.2).refreshBody();
    poste8.create(1320, 350, 'pc').setScale(0.2).refreshBody();

    //Postes adversaire
    poste9.create(480, 150, 'pc').setScale(0.2).refreshBody();
    poste10.create(760, 150, 'pc').setScale(0.2).refreshBody();
    poste11.create(1040, 150, 'pc').setScale(0.2).refreshBody();

    //Liens postes
    line = this.physics.add.staticGroup();
    line2 = this.physics.add.staticGroup();
    coude = this.physics.add.staticGroup();
    coude2 = this.physics.add.staticGroup();
    coude3 = this.physics.add.staticGroup();
    coude4 = this.physics.add.staticGroup();
    line.create(622,550, 'line').setScale(1.2).refreshBody();
    line.create(902,550, 'line').setScale(1.2).refreshBody();
    line2.create(1028,250, 'line2').setScale(0.8).refreshBody();
    line2.create(468,250, 'line2').setScale(0.8).refreshBody();
    coude2.create(1200,230, 'coude2').setScale(1).refreshBody();
    coude4.create(315,230, 'coude4').setScale(1).refreshBody();

    line.create(622,350, 'line').setScale(1.2).refreshBody();
    line.create(902,350, 'line').setScale(1.2).refreshBody();
    line.create(342,350, 'line').setScale(1.2).refreshBody();
    line.create(1182,350, 'line').setScale(1.2).refreshBody();

    line.create(622,150, 'line').setScale(1.2).refreshBody();
    line.create(902,150, 'line').setScale(1.2).refreshBody();
    line2.create(1028,450, 'line2').setScale(0.8).refreshBody();
    line2.create(468,450, 'line2').setScale(0.8).refreshBody();
    coude.create(312,473, 'coude').setScale(1.01).refreshBody();
    coude3.create(1200,473, 'coude3').setScale(1).refreshBody();

    // If the role of the current user is admin :
    if (current_role === 'admin'){
        //Joueur Admin
        this.add.image(100, 630, 'admin_icon').setScale(0.5);
        admin_power = this.add.sprite(210, 650, 'admin_power').setInteractive().setScale(0.4);
        admin_power.on('pointerdown', use_AdminPower);
        admin_power.on('pointerover', zoomInPower);
        admin_power.on('pointerout', zoomOutPower);
        actionAdminText = this.add.text(1300, 650, 'Actions: 0', { fontSize: '28px', fill: '#000' });


        //Cartes admin
        admin_carte = this.add.sprite(760, 680, 'admin_carte').setInteractive().setScale(0.5);
        admin_carte.on('pointerover', cardZoomIn);
        admin_carte.on('pointerout', cardZoomOut);
        this.input.setDraggable(admin_carte);
        this.input.on('dragstart', startDrag); //Je ne comprends pas cette ligne: quand je remplace this par admin_carte, ça casse tout
        this.input.on('drag', onDrag);          //Et du coup, je ne sais pas ce qu'il se passera si on met plusieurs draggable items
        this.input.on('dragend', endDrag);
    }

    // If the role of the current user is hacker :
    if (current_role === 'hacker'){
        //Joueur Hacker
        this.add.image(100, 630, 'hacker_icon').setScale(0.5);
        admin_power = this.add.sprite(210, 650, 'hacker_power').setInteractive().setScale(0.4);
        admin_power.on('pointerdown', use_HackerPower);
        admin_power.on('pointerover', zoomInPower);
        admin_power.on('pointerout', zoomOutPower);
        actionAdminText = this.add.text(1300, 650, 'Actions: 0', { fontSize: '28px', fill: '#000' });
    }

    /* Si on besoin de faire des particules à un moment -\_(ツ)_/-
    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
    */
}

//Ca c'est comme en Unity
function update() {

}

//FONCTIONS
//Fonctions qui regardent si une action a été faite et si oui màj le compteur d'actions
function actions_admin () {
    return null;
}

function actions_hacker() {
    return null;
}

//Fonctions d'utilisation des pouvoirs joueur
function use_AdminPower() {
    alert("Coder utilisation pouvoir admin");
}

function use_HackerPower() {
    alert("Coder utilisation pouvoir hacker");
}

function zoomInPower() {
    this.setScale(0.6);
}

function zoomOutPower() {
    this.setScale(0.4);
}


//Drag and drop des cartes
function cardZoomIn() {
    this.setScale(0.8);
}

function cardZoomOut() {
    this.setScale(0.5);
}

function startDrag(pointer, gameObject) {
    gameObject.setScale(0.8);
}

function onDrag(pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
}

function endDrag(pointer, gameObject) {
    gameObject.setScale(0.5);
}


// Core Function
function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function updateNameRoleContainer(name, role) {
    playerNameRoleContainer.innerText = `Welcome : ${name} you are the : ${role}`
}