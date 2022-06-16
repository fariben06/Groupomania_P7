import React from "react"; // Importer react pour utiliser les fonctionnalités de react 
import Options from "../Options/Options"; // Importer le composant Options pour utiliser les fonctionnalités de react
import "./Avatar.css"; // Importer le fichier css du composant Avatar


// Page Avatar qui va afficher l'avatar de l'utilisateur connecté dans la page avatar.
export default class Avatar extends React.Component {
  constructor(props) { // Constructeur du composant Avatar qui va afficher l'avatar de l'utilisateur connecté dans la page avatar.
    super(props); // Appel du constructeur de la classe parente (React.Component)
    this.state = { // Données du composant Avatar 
      // DONNÉES
      dataUser: props.dataUser, // Utilisateur connecté 
      // Options 
      isLoading: false, // Chargement des données false = non chargé
      isClickable: props.isClickable, // Option pour le clique sur l'avatar
      isClicked: false, // Option pour le clique sur l'avatar
      isProfile: props.dataUser.isProfile // Option pour le profil de l'utilisateur
    }
    this.OnClick = this.OnClick.bind(this); // Permet de lier la fonction OnClick au composant Avatar
  }

  componentDidMount() { // Fonction qui va être appelée après le rendu du composant
    const { dataUser } = this.state; // Récupération des données de l'utilisateur connecté
    // Si l'utilisateur n'est pas connecté, on ne peut pas cliquer sur l'avatar
    if (!dataUser) this.setState({ isClickable: false });
  }

  // Fonction qui va être appelée lors du clique sur l'avatar de l'utilisateur
  OnClick() {
    const { isClicked } = this.state; // Récupération de l'option pour le clique sur l'avatar
    if (isClicked) this.setState({ isClicked: false }); // Si l'option est à true, on change l'option à false
    else this.setState({ isClicked: true }); // Si l'option est à false, on change l'option à true
  }

  // Fonction qui va permettre de définir l'avatar de l'utilisateur connecté
  setAvatar() {
    const { dataUser } = this.state; // Récupération des données de l'utilisateur connecté
    // Si l'utilisateur connecté a un avatar défini et qu'il n'est pas le profil de l'utilisateur connecté on affiche l'avatar.
    if (dataUser && dataUser.avatar !== 'none')
      return (<><img src={dataUser.avatar} alt="Avatar" /></>);
    else return (<><i className="fa-solid fa-skull"></i></>); // Sinon on affiche un avatar vide.
  }

  // Fonction qui va permettre de définir l'avatar de l'utilisateur connecté en fonction de l'option de clique sur l'avatar
  render() {
    const { isLoading, isClickable, isClicked, isProfile } = this.state; // Récupération des options du composant Avatar
    const { dataUser } = this.state; // Récupération des données de l'utilisateur connecté
    return (<>
      {!isLoading ? (<>  {/* Si l'option isLoading est à false, on affiche le composant Avatar */}
        {isClickable ? (<>  {/* Si l'option isClickable est à true, on affiche le composant Avatar */}

          <div className="avatar clickable" onClick={this.OnClick}>
            {this.setAvatar()}
            {isClicked ? (<>
              <Options for='Avatar' userLogged={dataUser} navigateTo={this.props.navigateTo} logout={this.props.logout} />
            </>) : null}
          </div>

        </>) : (<>
          {isProfile ? (<>
            {/* Si l'utilisateur connecté est le profil de l'utilisateur connecté on affiche l'avatar */}
            <div className="avatar-profile">
              {this.setAvatar()}
              <div className="avatar-options">  {/* On affiche les options de l'avatar */}
                <label htmlFor="avatar" onChange={this.props.OnChange}>
                  <span className="hidden">avatar</span>
                  {this.props.fileAvatar ? <i className="fa-solid fa-xmark"></i> : (<>
                    <i className="fa-solid fa-upload"></i>
                  </>)}
                </label>
                <input id="avatar" name='avatar' type='file' accept=".jpg,.jpeg,.png,.gif" onChange={this.props.OnChange} />

                {dataUser.avatar !== 'none' ? (
                  // Si l'utilisateur connecté a un avatar défini, on affiche un bouton pour le supprimer
                  <div className="delete" onClick={this.props.deleteAvatar}>
                    {/* On affiche un bouton pour le supprimer */}
                    <i className="fa-solid fa-trash" alt="deleteAvatar"></i>
                  </div>) : null}  {/* Sinon on affiche un bouton pour le définir */}

              </div>
            </div>
          </>) : (<>
            <div className="avatar">{this.setAvatar()}</div>     {/*Sinon on affiche l'avatar */}
          </>)}
        </>)}
      </>) : (<div className="avatar"></div>)}                   {/* Sinon on affiche un avatar vide */}
    </>)
  }
}
