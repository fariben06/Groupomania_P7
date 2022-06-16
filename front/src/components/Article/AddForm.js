import React from "react"; // Importer react pour utiliser les fonctionnalités de react
import axios from "axios"; // Importer axios pour utiliser les fonctionnalités de axios
import App from "../App";  // Importer le composant App pour utiliser les fonctionnalités de react
import Avatar from "../Avatar/Avatar"; // Importer le composant Avatar pour utiliser les fonctionnalités de react


// Initialisation du composant AddForm (Envoi d'un article).
export default class AddForm extends React.Component {
    constructor(props) { // Constructeur du composant AddForm (Envoi d'un article).
        super(props); // Appel du constructeur de la classe parente (React.Component).
        this.state = { // Initialisation des variables de l'état du composant.
            // données utilisateur
            userLogged: props.userLogged, // Utilisateur connecté
            valueArticle: '', // Valeur du champ article 
            fileUpload: null, // Fichier uploadé (image) 
            // Options
            isValid: true,  // Validation du formulaire (true = pas de validation, false = validation)
            isLoading: false,  // Chargement du formulaire (true = chargement, false = pas de chargement)
        }
        // Url de l'API pour l'envoi d'un article.
        this.articleUrl = 'http://localhost:8080/api/articles';
        // OnClick du bouton d'envoi d'article.
        this.OnSubmitArticle = this.OnSubmitArticle.bind(this);
        // OnChange du champ article (changement de la valeur).
        this.OnChange = this.OnChange.bind(this);
    }

    // Gestion de l'envoi d'un article (OnSubmitArticle).
    OnSubmitArticle(event) {
        // Récupération des données de l'état du composant (userLogged, valueArticle, fileUpload) 
        const { userLogged, valueArticle, fileUpload } = this.state;
        // L'objet contient des formes de valeur
        const formData = new FormData();
        formData.append("userId", userLogged.id); // Ajout de l'id de l'utilisateur connecté dans l'objet
        formData.append("article", valueArticle); // Ajout du texte de l'article dans l'objet
        formData.append("image", fileUpload); // Ajout de l'image dans l'objet

        // Annulation de l'envoi du formulaire (par défaut) et chargement du formulaire (true)
        event.preventDefault();
        // Envoi de l'article via l'API (axios)  
        axios.post(this.articleUrl, formData, {
            // Ajout des headers pour l'envoi de l'article via l'API (axios)
            headers: {
                // Ajout du token dans les headers de l'API (axios)
                Authorization: "Bearer " + sessionStorage.getItem("token")
            }
        }).then(() => { App.ReloadApp(); }) // Rafraichissement de la page (App)
            .catch(error => {
                console.error('Erreur lors de l\'ajout d\'un article!');
                console.warn(error); // Affiche l'erreur dans la console
            });
    }

    // Gestion des events (OnChange)
    OnChange(event) {
        const myState = event.target.name; // Récupération du nom du champ (article ou image)
        switch (myState) { // Switch sur le nom du champ (article ou image)
            case 'article': // Si le champ est article (champ texte)
                if (event.target.value.length) {  // Si la valeur du champ est non vide (article)
                    // Ajout de la class "valid" au champ article (champ valide) et suppression de la class "invalid" (champ invalide)
                    event.target.className = "valid";
                    // Modification de l'état du composant (isValid) (false = validation, true = pas de validation)
                    this.setState({ isValid: false });
                }
                else {
                    event.target.className = ""; // Suppression de la class "valid" au champ article (champ invalide)
                    // Modification de l'état du composant (isValid) (true = pas de validation, false = validation)
                    this.setState({ isValid: true });
                }
                // Modification de l'état du composant (valueArticle) (valeur du champ article)
                this.setState({ valueArticle: event.target.value });
                break; // Fin de la condition du champ article
            case 'image':
                // Si la valeur du champ est non vide (image) (champ file)
                if (event.target.value)
                    // Modification de l'état du composant (isValid) (false = validation, true = pas de validation)
                    this.setState({ isValid: false });
                else
                    // Modification de l'état du composant (isValid) (true = pas de validation, false = validation)
                    this.setState({ isValid: true });
                // Modification de l'état du composant (fileUpload) (fichier uploadé) (image)
                this.setState({ fileUpload: event.target.files[0] });
                break; // Fin de la condition du champ image
            default: // Par défaut (champ inconnu) (champ texte)
                console.error('Rien ici!');
                break;
        }
    }

    // Le formulaire est chargé (render), on affiche le formulaire (render), on affiche le bouton d'envoi d'article (render)
    render() {
        const { userLogged } = this.state;
        const { isValid, valueArticle } = this.state;
        return (<>
            <form className="addArticle" onSubmit={this.OnSubmitArticle} disabled={isValid}>
                <Avatar key={'avatar-' + userLogged.id} dataUser={{ ...userLogged, isProfile: false }} />
                <label htmlFor="article">article</label>
                <input id="article" type='text' name="article" placeholder={'Quoi de neuf, ' + userLogged.firstname + ' ?'}
                    value={valueArticle} onChange={this.OnChange} />
                <label htmlFor="image" className="file-upload"><span className="hidden">upload</span><i className="fa-solid fa-image"></i></label>
                <input id="image" name="image" onChange={this.OnChange} type="file" label="UploadImage" accept=".jpg,.jpeg,.png,.gif"></input>
                <button aria-label="sendarticle" disabled={isValid}>
                    <i className="fa-solid fa-paper-plane" alt="sendarticle"></i>
                </button>
                <input type='hidden' name="userId" value={userLogged.id} />
            </form>
        </>)
    }
}