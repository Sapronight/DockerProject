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

Avec la base de notre projet déjà réaliser il a fallu déduier qu'elle serait les parties à scinder pour obtenir différent micro service.
On a donc décidé de séparé le côté channel et le plateau de jeu en deux services distincts. On obtient donc les services suivants :

### main-server

Il permet de faire la séparation des joueurs en amont et ainsi faciliter la mise en place d'une partie. Il fourni également d'un chat dédier et la possibilité de changer le rôle d'un joeur comme l'autre. On notera que les joueurs peuvent lancer une partie quand il le souhaite et ceux dès que les deux joueurs sont connectés.

### board

Le plateau de jeu réaliser avec le framework "Phaser" représente la partie plateau qui va contenir les informations des utilisateurs durant une partie et échanger les informations nécessaires durant la partie sachant qu'il partage des objets commun tel que la représentation de la carte et des postes ainsi que le nombre d'action restante et leur point de vie.

## Améliorations à apporter

Le code aurait pu être encore plus morceler en séparant plus en profondeur toutes les fonctions qui permettent aux deux services actuelle de marcher. En effet, le "main-serveur" et le "board" comportent des potentielles services.
