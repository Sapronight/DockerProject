# Microservices - Docker par Mathilde AMAR et Adrien TRAN, ESME Sudria majeure IA 2019/2020

Dans le cadre du cours de Technologies Client-Serveur en Nodejs, nous devions aboutir à une plateforme de microservices gérée par Docker.
Pour cela, nous l'avons appliqué à notre projet de fin d'études : un Serious Game de Sensibilisation à la Cybersécurité pour SOLUTEC.

## Getting Started

Pour run le projet, exécuter la commande suivante:

```
sudo docker-compose up --build
```

Pour arrêter le projet, exécuter la commande suivante:

```
sudo docker-compose down
```
 Le projet est alors accessible sur le port 3000.
 [http://localhost:3000/](http://localhost:3000/).
 
## Présentation du projet

Le but de notre Serious Game est de former les collaborateurs SOLUTEC aux gestes essentiels de cybersécurité. Pour cela, le jeu se présente sous la forme d'un jeu de plateau
où chaque joueur doit posséder le plus d'ordinateurs grâce à leurs cartes. Les joueurs peuvent soit jouer un hacker, soit jouer un administrateur réseau.
Avant de lancer le jeu, deux joueurs doivent rejoindre une salle préalablement créée par l'un deux afin de créer une instance de jeu.

### Fonctionnement de l'architecture

Depuis la base de notre projet déjà réalisé, il a fallu décider quelles parties étaient les plus pertinentes à scinder afin d'obtenir plusieurs microservices.
On a donc décidé de séparer le côté création d'une nouvelle instance et le chat du côté plateau de jeu en deux services distincts. 
Nous avons fait ce choix afin de faciliter l'adaptation du code de base à une séparation en différents conteneurs mais aussi pour une question de clareté du code.
On obtient donc les services suivants :

### main-server

Il permet de faire la séparation des joueurs en amont et ainsi faciliter la mise en place d'une partie. Il fournit également un chat dédié et la possibilité de changer le rôle d'un joueur pour l'autre. On notera que les joueurs peuvent lancer une partie quand il le souhaite et ce dès que les deux joueurs sont connectés.

### board

Le plateau de jeu réalisé avec le framework __Phaser__ représente la partie plateau qui va contenir les informations des utilisateurs  et échanger les informations nécessaires durant la partie, sachant que chaque joueur partage des objets communs avec l'adversaire tels que la représentation de la carte et des postes ainsi que le nombre d'actions restantes et le nombre de point de vie.

## Améliorations à apporter

Du point de vue microservices, on aurait pu séparer d'autres fonctions présentes dans __main-serveur__ et __board__ afin de faciliter la compréhension du code car certaines de leurs fonctions peuvent être des sous-services.

D'autre part, on pourrait passer main-server/server_routing.js en proxy afin de gérer l'ensemble des flux de l'utilisateur qui ne communique qu'avec un seul service.
