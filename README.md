# Projet 7 - Groupomania
Projet Groupomania - OpenClassrooms.
> Réseau social d'entreprise conçu pour la formation des développeurs Web OpenClassrooms.
## Installation
Créez votre base de données MySQL
Pensez à configurer le fichier .env:
```
MY_PORT = 8080          = Port used for back server.
// Toutes les informations pour se connecter à la base de données.
DB_DIAL = mysql         = Composer pour la base de données.
DB_NAME = groupomania   = Nom de la base de données.
DB_USER = root          = Nom d'utilisateur de la base de données.
DB_PASS = admin         = Mot de passe de la base de données.
DB_HOST = localhost     = Hôte de la base de données.
DB_PORT = 3306          = Port de la base de données.
```

Installer toutes les dépendances avec npm.\
Dans le répertoire `front` :
```bash
npm install
npm start
```

Dans le répertoire "back" :
```bash
npm install
npm start
```
## Spécificités
1. Le premier utilisateur enregistré obtiendra les droits d'administrateur.
>  Il n'est pas possible de supprimer les droits d'administrateur du premier utilisateur.
2. Seul l'administrateur peut supprimer définitivement un compte. Pour les autres, le compte est désactivé et conserve les articles, les commentaires et l'adresse e-mail de l'utilisateur.

##Caractéristiques
* S'inscrire Se connecter.
* Publier un article avec/sans image.
* Modifier l'article/l'image.
* Supprimer l'article/l'image.
* J'aime/n'aime pas l'article.
* Publier un commentaire dans l'article.
* Modifier le commentaire
* Supprimer le commentaire.
* Editer le profil. [Nom, Prénom, Email, Mot de passe, Avatar]
* Changer de profil [Nom, Prénom, Email, Mot de passe, Avatar]
* Supprimer le compte.
* Se déconnecter.

## Groupomania Front-End
JAVASCRIPT, REACT
### Dependencies Dépendances
* Axios (utilisé pour envoyer la requête `GET`,`POST`,`PUT`,`DELETE`)
* jwt-decode (utilisé pour décoder le jeton devant)
### Scénarios disponibles
Dans le répertoire `front`, vous pouvez exécuter :

`npm start`\
Exécute l'application en mode développement.\
Ouvrez [http://localhost:3000](http://localhost:3000) pour l'afficher dans votre navigateur.

`npm run build`\
Construit l'application pour la production dans le dossier "build".

## Groupomania Back-End
NODEJS, mysql, sequelize, bcrypt, jwt-decode
### Dépendances
* bcrypt (utilisé pour chiffrer le mot de passe de l'utilisateur)
* dotenv (utilisateur pour la gestion des variables d'environnement)
* express (cadre de type MVC)
* jsonwebtoken (utilisé pour sécuriser les connexions avec un jeton)
* multer (utilisé pour télécharger l'image/avatar)
* mysql/mysql2 (utilisé pour la base de données mysql)
* sequelize (utilisé pour gérer la base de données)
### Scénarios disponibles
Dans le répertoire `back`, vous pouvez exécuter :

`npm start`\
Runs the app server.

`npm run dev`\
Exécute le serveur d'applications en mode développement. (nodémon)