import React from "react"; // Importer React pour utiliser les fonctionnalités de React
import axios from "axios"; // Importer axios pour utiliser les fonctions de axios pour les requêtes HTTP
import jwt_decode from "jwt-decode"; // Importer jwt_decode pour utiliser les fonctions de jwt_decode pour décodé les tokens
import Header from "./Header/Header"; // Importer Header pour utiliser les fonctions de Header pour le header de la page web
import Log from "./Log/Log"; // Importer Log pour utiliser les fonctions de Log pour le formulaire de connexion de la page web
import Home from "./Home/Home"; // Importer Home pour utiliser les fonctions de Home pour la page d'accueil de la page web


// Créer une classe pour la page web 
export default class App extends React.Component {
  constructor(props) { // Constructeur de la classe App
    super(props); // Appel du constructeur de la classe parente (React.Component)
    this.state = { // Définition du state de la classe App
      isLoading: false, // Définition de la variable isLoading pour le loader de la page web
      articles: null, // Définition de la variable articles pour les articles de la page web
      isLogged: false, // Définition de la variable isLogged pour la connexion de l'utilisateur de la page web
      userLogged: props.dataUser, // Définition de la variable userLogged pour les informations de l'utilisateur connecté
      curPage: props.curPage, // Définition de la variable curPage pour la page courante de la page web
      error: '' // Définition de la variable error pour les erreurs de la page web (si il y en a)
    }

    this.userUrl = 'http://localhost:8080/api/user'; // Définition de l'url de l'API pour les utilisateurs
    this.articlesUrl = 'http://localhost:8080/api/articles'; // Définition de l'url de l'API pour les articles

    this.token = sessionStorage.getItem('token'); // Récupération du jeton dans le sessionStorage de la page web 

    console.warn('Enter App!'); // Affichage dans la console du navigateur d'un succès lors de la connexion de l'utilisateur
  }

  // Fonction qui s'exécute lorsque le composant est monté dans le DOM de la page web 
  componentDidMount() {
    // Récupération des articles lorsque le composant est monté dans le DOM de la page web
    const { articles, curPage } = this.state;
    // Si la page courante est Home ou Login, on charge les articles  sinon on ne charge pas les articles
    if (!articles || curPage === 'Home') this.getArticles();
  }

  // Récupération des articles 
  getArticles() {
    this.setState({ isLoading: false }); // Définition de la variable isLoading pour le loader de la page web 
    // Récupération des informations de l'utilisateur connecté et de la connexion de l'utilisateur de la page web
    const { isLogged, userLogged } = this.state;
    console.log('[INFO] Chargement des articles...'); // Affichage dans la console du navigateur
    // Récupération des informations des articles de l'API  et définition de la variable res pour les informations des articles
    axios.get(this.articlesUrl).then((res) => {
      // Si la reponse de l'API est 204, on définit articles à 0 (aucun article)
      if (res.status === 204) this.setState({ articles: 0 });
      else this.setState({ articles: res.data.articles }); // Définition de la variable articles pour les informations des articles
      console.warn('[SUCCESS] Articles chargés !'); // Affichage dans la console du navigateur d'un succès lors de la récupération des articles
      // Si l'utilisateur n'est pas connecté, on vérifie la connexion de l'utilisateur de la page web
      if (!isLogged || !userLogged) this.checkLog();
    })
      .catch((err) => {
        console.error('[ERROR] Erreur de chargement des articles!');
        console.log(err);
        this.setState({ isLoading: false, error: 'Une erreur est survenue! Réessayer plus tard.' });
      });
  }

  // Fonction pour vérifier la connexion de l'utilisateur de la page web
  // Vérification de jeton et décodage du jeton pour récupérer les informations de l'utilisateur
  checkLog() {
    const { userLogged } = this.state; // Récupération des informations de l'utilisateur connecté de la page web
    console.log('[INFO] Vérification du jeton...');
    if (this.token) { // Si le jeton existe
      console.warn('[SUCCESS] Jeton trouvé !');
      console.log('[INFO] Vérification des informations utilisateur...');
      if (!userLogged) { // Si l'utilisateur n'est pas connecté
        console.warn('[ERROR] Infos utilisateur introuvables !');

        // Vérification ici du jeton avec jwt 
        const decodedToken = jwt_decode(this.token, 'RANDOM_TOKEN_SECRET');
        if (decodedToken && decodedToken.userId) {
          console.log('[INFO] Obtenir des informations sur l\'utilisateur avec un jeton...');
          const getUserUrl = this.userUrl + '?id=' + decodedToken.userId;
          axios.get(getUserUrl).then((user) => { // Récupération des informations de l'utilisateur avec un jeton
            console.warn('[SUCCESS] Infos utilisateur avec jeton trouvé !');
            this.setState({ curPage: 'Home', userLogged: user.data.user, isLogged: true, isLoading: false });
          })
            .catch((error) => {
              console.warn('[ERROR] Infos utilisateur avec jeton introuvables !');
              // Si l'utilisateur n'est pas connecté, on définit userLogged à null pour ne pas afficher les informations de l'utilisateur connecté, 
              // on définit isLogged à false pour ne pas afficher le formulaire de connexion, on définit isLoading à false pour ne pas afficher le loader de la page web
              this.setState({ curPage: 'Login', userLogged: null, isLogged: false, isLoading: false });
            });
        }
        else // 
          this.setState({ curPage: 'Login', isLogged: false, isLoading: false });
      }
      else {
        console.warn('[SUCCESS] Infos utilisateur trouvées !');
        this.setState({ curPage: 'Home', isLogged: true, isLoading: false });
      }
    }
    else {
      console.warn('[INFO] Jeton introuvable !');
      this.setState({ curPage: 'Login', userLogged: null, isLogged: false, isLoading: false });
    }
  }

  // Mise en page des composants de la page web
  setComponent() {
    // Récupération des informations de l'utilisateur connecté et des articles de la page web
    const { curPage, articles, userLogged } = this.state;
    switch (curPage) { // Switch pour la page courante de la page web
      case 'Login': // Si la page courante est Login 
        return (<><Log /></>); // On affiche le composant Log
      case 'Home': // Si la page courante est Home, on affiche le composant Home
        // Si les articles sont chargés, on affiche le composant Home, sinon on affiche le loader de la page web
        return (<><Home articles={articles} userLogged={userLogged} /></>);
      default: // Si la page courante n'est pas Home ou Login, on affiche le composant Login
        break;  // On ne fait rien
    }
  }

  // Rechargement de l'API.
  static ReloadApp() {
    console.log('Reloading App!');
    window.location.reload(false);
  }

  // Rendu du composant App.
  render() {
    const { error, isLoading } = this.state; // Récupération des informations de la variable error et isLoading de la page web
    return (<>
      {!isLoading ? (<>           {/* Si isLoading est à false, on affiche le composant App */}
        <Header />
        <main>
          {error || error !== '' ? <p className="error">{error}</p> : null}    {/* Si error est différent de '', on affiche un message d'erreur */}
          {this.setComponent()}
        </main>
      </>) : <></>}
    </>)
  }
}
