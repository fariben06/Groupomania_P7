import React from "react";
import App from "../App";
import "./Options.css";

export default class Options extends React.Component {
  constructor(props) { // Constructeur pour les options 
    super(props); // Appel du constructeur de la classe parente (React.Component)
    this.state = { // Définition du state de la classe Options 
      userLogged: props.userLogged, // Utilisateur connecté (props)  à partir de la classe App 
      optionsFor: props.for, // Options pour quelle partie de l'application (props) à partir de la classe App  (Avatar, Article, Commentaire)
      commentId: props.commentId, // Id du commentaire (props) à partir de la classe App  (Commentaire)
      isLoading: false  // Active pour toutes les requêtes (props) à partir de la classe (App)
    }
    this.logout = this.logout.bind(this); // Définition de la fonction logout (this) à partir de la classe Options  (this.logout)
  }

  logout() { // Déconnexion de l'utilisateur
    if (window.confirm('Vous allez être déconnecté...\nÊtes vous sûre ?')) { // Confirmation de la déconnexion de l'utilisateur
      sessionStorage.clear(); // Suppression de la session de l'utilisateur (sessionStorage)
      App.ReloadApp(); // Rechargement de la page (App)
    }
  }

  setOptions() { // Définition des options à afficher (Avatar, Article, Commentaire) (this.setOptions)
    const { optionsFor, commentId, userLogged } = this.state; // Récupération des données du state (this.state)
    switch (optionsFor) { // Switch pour les options (Avatar, Article, Commentaire) (this.state.optionsFor) (Avatar, Article, Commentaire)
      case 'Avatar': // Options pour l'avatar (Avatar)
        return (<>
          <ul className="options article">
            <li className="edit" id={"Profile"} onClick={this.props.navigateTo}> {/* Options pour le profil (Profile) */}
              <i className="fa-solid fa-user-clock"></i> Mon Compte
            </li>
            {userLogged.isAdmin ? (<>       {/* Options pour l'administrateur (Admin) */}
              <li className="edit middle" id={"Admin"} onClick={this.props.navigateTo}>
                <i className="fa-solid fa-gear"></i> Administration
              </li>
            </>) : null}
            {/* Options pour la déconnexion (this.logout) */}
            <li className="delete" onClick={this.props.logout}>
              <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
            </li>
          </ul>
        </>);
      default: // Options pour les articles (Article)
        return (<>
          <ul className="options article">
            {/* Options pour la modification (this.props.onEditClick) */}
            <li className="edit" onClick={this.props.onEditClick}>
              <i className="fa-solid fa-pencil"></i> Modifier
            </li>
            {commentId ? (<>
              {/* Options pour la suppression des commentaires (this.props.onDeleteClick) */}
              <li className="delete" value={commentId} onClick={this.props.onDeleteClick}>
                <i className="fa-solid fa-trash"></i> Supprimer
              </li>
            </>) : (<>
              {/* Options pour la suppression des articles (this.props.onDeleteClick) */}
              <li className="delete" onClick={this.props.onDeleteClick}>
                <i className="fa-solid fa-trash"></i> Supprimer
              </li>
            </>)}
          </ul>
        </>);
    }
  }

  render() { // Rendu des options (this.render)
    const { isLoading } = this.state; // Récupération des données du state (this.state)
    return (<>
      {/* Affichage des options (this.setOptions) */}
      {!isLoading ? this.setOptions() : (<ul className="options article"></ul>)}
    </>)
  }
}
