import React from "react"; // Importer react pour utiliser les fonctionnalités de react
import axios from "axios"; // Importer axios pour utiliser les fonctionnalités de axios
import App from "../App";  // Importer le composant App pour utiliser les fonctionnalités de react
import Avatar from "../Avatar/Avatar"; // Importer le composant Avatar pour utiliser les fonctionnalités de react
import Comments from "../Comments/Comments"; // Importer le composant Comments pour utiliser les fonctionnalités de react
import Options from "../Options/Options"; // Importer le composant Options pour utiliser les fonctionnalités de react
import "./Article.css"; // Importer le fichier css Article.css


export default class Article extends React.Component { // Afficher/Cacher le formulaire d'édition.
  constructor(props) { // Constructeur de la classe Article.
    super(props); // Appel du constructeur de la classe parente.
    this.state = { // Définition des variables de la classe.
      // données de l'article
      article: props.dataArticle, // Article à afficher dans le composant.
      author: props.dataArticle.user, // Auteur de l'article à afficher dans le composant.
      userLogged: props.userLogged, // Utilisateur connecté dans le composant.
      valueArticle: props.dataArticle.article, // Contenu de l'article à afficher dans le composant.
      likes: props.dataArticle.likes, // Likes de l'article à afficher dans le composant.
      fileUpload: null, // Fichier à uploader dans le composant.
      // Commentaires de l'article.
      comments: props.dataArticle.comments,  // Commentaires de l'article.
      commentsLoaded: false, // Commentaires chargés.
      // Options de l'article.
      editArticle: false, // Formulaire d'édition d'article caché. (false = caché).
      isEdited: false,   // Article édité. (false = non édité).
      isClicked: false, // Options affichées. (false = caché).
      showComments: false // Commentaires affichés. (false = caché).
    };
    this.totalLike = props.dataArticle.likes.length; // Nombre de likes de l'article. (initialisé à 0).
    this.totalComments = props.dataArticle.comments.length; // Nombre de commentaires de l'article. (initialisé à 0).
    // Request Url de l'article.
    this.commentsUrl = 'http://localhost:8080/api/comments?article=' + this.state.article.id; // Url des commentaires de l'article (articleId).
    this.articleUrl = 'http://localhost:8080/api/articles/'; // Url de l'article (articleId).
    this.likeUrl = 'http://localhost:8080/api/likes'; // Url des likes de l'article (articleId).
    // Form control
    this.onCommentsClick = this.onCommentsClick.bind(this); // Afficher/Cacher les commentaires. (bind pour lier l'évènement à la classe).
    this.onLikesClick = this.onLikesClick.bind(this); // Like/Unlike l'article. (bind pour lier l'évènement à la classe).
    this.onOptionsClick = this.onOptionsClick.bind(this); // Afficher/Cacher le formulaire d'édition. (bind pour lier l'évènement à la classe).
    this.onEditClick = this.onEditClick.bind(this); // Editer l'article. (bind pour lier l'évènement à la classe).
    this.OnChange = this.OnChange.bind(this); // Changer le contenu de l'article. (bind pour lier l'évènement à la classe).
    this.onDeleteImage = this.onDeleteImage.bind(this); // Supprimer l'image de l'article. (bind pour lier l'évènement à la classe).
    this.onDeleteClick = this.onDeleteClick.bind(this); // Supprimer l'article. (bind pour lier l'évènement à la classe).
  }

  // Afficher/Cacher les commentaires de l'article.
  async onCommentsClick(event) {
    // Récupération des données de l'état. (showComments = afficher/cacher les commentaires).
    const { showComments, commentsLoaded } = this.state;
    // Switch pour afficher/cacher les commentaires de l'article.
    switch (showComments) {
      // Masquer les commentaires de l'article.
      default:
      case true:  // Masquer les commentaires de l'article (false = caché). (true = affiché).
        event.target.classList.remove('active'); // Supprimer la classe active du bouton pour afficher les commentaires.
        this.setState({ showComments: false }); // Mettre à jour l'état de l'article (showComments = false).
        break; // Sortie de la condition.
      // Afficher les commentaires de l'article.
      case false: // Afficher les commentaires de l'article (false = caché). (true = affiché).
        if (!commentsLoaded) { // Si les commentaires n'ont pas encore été chargés.
          let comments = await axios.get(this.commentsUrl, { // Récupération des commentaires de l'article (articleId).
            headers: { // En-tête de la requête.
              Authorization: "Bearer " + sessionStorage.getItem("token") // Jeton d'authentification.
            }
          })
            .then((res) => {
              // Si la réponse de la requête est correcte (200) ... (res = réponse de la requête).
              if (res.status === 204) return [];
              return res.data.comments; // Retourner les commentaires de l'article.
            });
          // Mettre à jour l'état de l'article (comments = commentaires de l'article).
          this.setState({ comments: comments });
          // Si les commentaires existent, mettre à jour l'état de l'article (commentsLoaded = true).
          if (comments) this.setState({ commentsLoaded: true });
        }
        // Ajouter la classe active du bouton pour cacher les commentaires (afficher les commentaires).
        event.target.classList.add('active');
        // Montrer les commentaires de l'article (showComments = true).
        this.setState({ showComments: true });
        break; // Sortie de la condition.
    }
  }


  // J'aime/n'aime pas l'article (like/unlike).
  async onLikesClick(event) { // Ajouter/Supprimer un like à l'article.
    // Récupération des données de l'état (article = article, userLogged = utilisateur connecté).
    const { article, userLogged } = this.state;
    const postLike = { // Données à poster pour le like de l'article.
      userId: userLogged.id, // Id de l'utilisateur connecté.
      articleId: article.id  // Id de l'article.
    }
    this.setState({ isLoading: true }); // Mettre à jour l'état de l'article (isLoading = true).
    await axios.post(this.likeUrl, postLike, { // Ajout d'un like à l'article (articleId) (postLike = données à poster) 
      headers: { // En-tête de la requête.
        Authorization: "Bearer " + sessionStorage.getItem("token") // Jeton d'authentification (token). (sessionStorage.getItem("token") = récupération du token).
      }
    }).then((res) => {

      // Mettre à jour la cible de la classe (target = cible de la classe).
      // Ajouter la classe active au bouton pour montrer que l'article a été liké (like = true).
      if (!res.data?.length) event.target.classList.add("active");
      // Supprimer la classe active du bouton pour montrer que l'article n'a pas été liké (like = false).
      else event.target.classList.remove("active");
      // Mettre à jour l'article.
      this.updateArticle();
    });
  }

  // Actualise les données de l'article pour les likes et les commentaires (afficher les commentaires).
  updateArticle() {
    const { article } = this.state;
    // Récupération des données de l'article.
    axios.get(this.articleUrl, {
      headers: { // En-tête de la requête.
        // Jeton d'authentification. (sessionStorage.getItem("token") = récupération du token).
        Authorization: "Bearer " + sessionStorage.getItem("token")
      }
    }).then((res) => {
      // Pour chaque article ... (result = article). (res.data.articles = articles).
      res.data.articles.forEach((result) => {
        // Si l'article est identique à l'article de l'état ... (result.id = id de l'article).
        if (result.id === article.id) {
          // Mettre à jour l'état de l'article (article = article). (result = article).
          this.setState({ article: result });
          // Mettre à jour le nombre de likes de l'article (totalLike = nombre de likes).
          this.totalLike = result.likes.length;
        }
      });
    })
  }

  // Mise en page des options de l'article.
  setOptions() {
    // Récupération des données de l'état. (article = article, userLogged = utilisateur connecté).
    // likes = likes de l'article. (userLogged = utilisateur connecté).
    const { likes, userLogged } = this.state;
    // Variable pour savoir si l'article a été liké ou non.
    let isActive = '';
    // Pour chaque like ... (like = like).
    likes.forEach(like => {
      // Si l'utilisateur connecté a liké l'article, mettre la classe active.
      if (like.userId === userLogged.id) isActive = "active";
    });

    // Mise en page des options de l'article (options = options de l'article).
    return (
      <ul className="options">
        <li className={"like " + isActive} onClick={this.onLikesClick} ><i className="fa-solid fa-heart"></i> J'aime</li>
        <li className="comments" onClick={this.onCommentsClick}><i className="fa-solid fa-comment"></i> Commentaires</li>
      </ul>
    );
  }

  // Afficher/Cacher les options de l'article.
  async onOptionsClick(event) {
    const { isClicked } = this.state; // Récupération de l'état (isClicked = est-il cliqué?).
    switch (isClicked) { // Selon le statut ... (isClicked = est-il cliqué?). 
      default: // Par défaut ... (isClicked = est-il cliqué?).
      case true: // Si est-il cliqué ... (isClicked = est-il cliqué?).
        this.setState({ isClicked: false }); // Mettre à jour l'état (isClicked = false). (isClicked = est-il cliqué?).
        break; // Sortie de la condition.

      case false: // Si n'est pas cliqué ... (isClicked = est-il cliqué?).
        this.setState({ isClicked: true }); // Mettre à jour l'état (isClicked = true). (isClicked = est-il cliqué?).
        break; // Sortie de la condition.
    }
  }

  // Modification d'un article (modifier l'article).
  async onEditClick(event) {
    event.preventDefault(); // Empêcher le comportement par défaut du navigateur 
    // Récupération des données de l'état (valueArticle = contenu de l'article, fileUpload = fichier uploadé).
    const { valueArticle, fileUpload } = this.state;
    // Récupération des données de l'état (article = article, editArticle = article à modifier, isEdited = est-il modifié?).
    const { article, editArticle, isEdited } = this.state;

    // Si l'article à modifier existe ... (editArticle = article à modifier).
    if (editArticle) {
      if (isEdited) { // Si est-il modifié ... (isEdited = est-il modifié?).
        const formData = new FormData(); // Création d'un nouveau formulaire (formData = formulaire).
        formData.set("message", valueArticle); // Ajout du contenu de l'article (valueArticle = contenu de l'article).
        // Si un fichier a été uploadé ... (fileUpload = fichier uploadé).
        if (fileUpload != null) formData.append("image", fileUpload);
        await axios.put(this.articleUrl + article.id, formData, { // Modification de l'article (article.id = id de l'article). (formData = formulaire).
          headers: { // En-tête de la requête.
            // Jeton d'authentification (token). (sessionStorage.getItem("token") = récupération du token).
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        }).then(() => { // Si la modification a réussi ... 
          this.setState({ editArticle: false }); // Mettre à jour l'état (editArticle = false). (editArticle = article à modifier).
          App.ReloadApp(); // Rafraichir la page (App = application).
        });
      }
      else this.setState({ editArticle: false });
    }
    else {
      this.setState({ editArticle: true });
    }
  }

  // Gestion des events
  OnChange(event) {
    const { article } = this.state; // Récupération des données de l'état (article = article).
    const myCase = event.target.name; // Récupération du nom de l'input (myCase = nom de l'input).
    switch (myCase) { // Selon le nom de l'input ... (myCase = nom de l'input).
      case 'message': // Si le nom de l'input est message ... (myCase = nom de l'input).
        // Mettre à jour l'état (isEdited = true). (article.article = contenu de l'article). (event.target.value = contenu de l'input).
        if (article.article !== event.target.value) this.setState({ isEdited: true });
        // Mettre à jour l'état (isEdited = false). (article.article = contenu de l'article). (event.target.value = contenu de l'input).
        else this.setState({ isEdited: false });
        // Mettre à jour l'état (valueArticle = contenu de l'input). (event.target.value = contenu de l'input).
        this.setState({ valueArticle: event.target.value });
        break; // Sortie de la condition.

      case 'picture': // Si le nom de l'input est picture ... (myCase = nom de l'input).
        // console.log(event.target.files[0]); // Afficher le fichier uploadé  
        console.log(event.target.files[0]);
        // Mettre à jour l'état (isEdited = true). (fileUpload = fichier uploadé). (event.target.files[0] = fichier uploadé).
        this.setState({ isEdited: true, fileUpload: event.target.files[0] });
        break;
      default:
        console.error('Nothing here!');
        break;
    }
  }

  // Suppression d'une image (supprimer l'image).
  async onDeleteImage() {
    const { article } = this.state; // Récupération des données de l'état (article = article).
    if (window.confirm('Vous êtes sur le point de supprimer votre image...\nEtes vous sure ?')) {
      // Suppression de l'image (article.id = id de l'article). (1 = id de l'image).
      await axios.delete(this.articleUrl + article.id + '/' + 1, {
        headers: {
          // Jeton d'authentification (token). (sessionStorage.getItem("token") = récupération du token).
          Authorization: "Bearer " + sessionStorage.getItem("token")
        }
      })
        .then(() => App.ReloadApp()); // Rafraichir la page (App = application).
    }
  }

  // Suppression d'un article et redirection vers la page d'accueil.
  async onDeleteClick() {
    const { article } = this.state; // Article à supprimer.
    if (window.confirm('Vous êtes sur le point de supprimer cet article...\nÊtes vous sûre ?')) {
      // Suppression de l'article dans la base de données.
      await axios.delete(this.articleUrl + article.id + '/' + 0, { // 0 = supprimer l'article et ses commentaires.
        headers: { // Ajout du token dans les headers.
          Authorization: "Bearer " + sessionStorage.getItem("token") // Ajout du token dans les headers de la requête.
        }
      })
        .then(() => App.ReloadApp()); // Rafraichissement de la page.
    }
  }

  // Convertisseur de date en string pour l'affichage de la date de publication de l'article dans le composant.
  convertDate() {
    const { article } = this.state; // Récupération de l'article.
    const start = new Date(article.postDate).getTime(); // Récupération de la date de publication de l'article.
    const current = Date.now(); // Récupération de la date actuelle du système.
    const result = new Date(current - start); // Calcul de la différence entre la date de publication de l'article et la date actuelle.
    let since = new Date(result); // Conversion de la différence en date pour l'affichage dans le composant.
    if (since.getFullYear() <= 1970) // Si l'année de la différence est inférieure à 1970, on affiche "Il y a moins de 1 an" (1 an = 365 jours).
      if (since.getMonth() + 1 <= 1) // Si le mois de la différence est inférieur à 1, on affiche "Il y a moins de 1 mois" (1 mois = 30 jours).
        if (since.getDate() <= 1) // Si le jour de la différence est inférieur à 1, on affiche "Il y a moins de 1 jour" (1 jour = 24 heures).
          if (since.getHours() <= 1) // Si l'heure de la différence est inférieur à 1, on affiche "Il y a moins de 1 heure" (1 heure = 60 minutes).
            if (since.getMinutes() < 1) // Si les minutes de la différence sont inférieures à 1, on affiche "Il y a moins de 1 minute" (1 minute = 60 secondes).
              since = new Date(result).getSeconds() + 'sec.'; // Si les secondes de la différence sont inférieures à 1, on affiche "Il y a moins de 1 seconde" (1 seconde = 1000 millisecondes).
            else since = since.getMinutes() + 'min.'; // Sinon, on affiche le nombre de minutes de la différence entre la date de publication de l'article et la date actuelle.
          else since = since.getHours() + 'h.'; // Sinon, on affiche le nombre d'heures de la différence entre la date de publication de l'article et la date actuelle.
        else since = since.getDate() + 'j.'; // Sinon, on affiche le nombre de jours de la différence entre la date de publication de l'article et la date actuelle.
      else since = since.getMonth() + 1 + 'm.'; // Sinon, on affiche le nombre de mois de la différence entre la date de publication de l'article et la date actuelle.
    else since = since.getFullYear() + 'y.'; // Sinon, on affiche le nombre d'années de la différence entre la date de publication de l'article et la date actuelle.

    return `${since}`; // Retourne la date de publication de l'article.
  }


  render() {   // Rendu du composant.
    // Récupération des données de l'état (editArticle = édition de l'article, article = article,
    // likes = likes de l'article, author = auteur de l'article, userLogged = utilisateur connecté).
    const { editArticle, article, likes, author, userLogged } = this.state;
    // Récupération de l'état (isClicked = clique sur le bouton de like).
    const { isClicked } = this.state;
    // Récupération de l'état (showComments = affichage des commentaires, comments = commentaires, 
    // commentsLoaded = chargement des commentaires).
    const { showComments, comments, commentsLoaded } = this.state;
    // Récupération des données de l'état (valueArticle = contenu de l'article, fileUpload = image de l'article).
    const { valueArticle, fileUpload } = this.state;
    return (<>

      {!editArticle ? (<>             {/* Si l'article n'est pas en édition, on affiche le composant. */}
        {article ? (<>                {/* Si l'article existe, on affiche le composant. */}
          <article key={article.id + '-article'}>
            <div className="article-author">                              {/* Div contenant l'auteur de l'article. */}
              <Avatar dataUser={{ ...author, isProfile: false }} />       {/* Avatar de l'auteur de l'article. */}
              <div className="author-infos">                              {/* Informations de l'auteur de l'article. */}
                <h3>{author.firstname} {author.lastname}</h3>             {/* Nom et prénom de l'auteur de l'article. */}

                {/* Tâche de l'auteur de l'article et date de publication de l'article. */}
                <h4>{author.task.tasks} | <i className="fa-solid fa-clock"></i> {this.convertDate()}</h4>
              </div>

              {/* Si l'auteur de l'article est l'utilisateur connecté ou si l'utilisateur connecté est un administrateur, on affiche le bouton de suppression de l'article. */}
              {article.authorId === userLogged.id || userLogged.isAdmin ? (<>
                <div className="article-options" onClick={this.onOptionsClick}>
                  <i className="fa-solid fa-ellipsis"></i>
                  {isClicked ? (<>     {/* Si le bouton de suppression est cliqué, on affiche le menu de suppression. */}

                    {/* Menu de suppression de l'article. */}
                    <Options onEditClick={this.onEditClick} onDeleteClick={this.onDeleteClick} dataArticle={article} for={'Article'} />
                  </>) : null}
                </div>
              </>) : (<>
                <div className="article-no-options"></div>  {/* Sinon, on affiche un div vide. */}
              </>)}
            </div>

            <p>{article.article}</p>                                {/* Contenu de l'article. */}
            {/* Si l'article contient une image, on affiche l'image, sinon on affiche un div vide. */}
            {article.image === 'none' ? null : <img src={article.image} alt='postedImage' />}

            {/* Div contenant les informations de l'article, le nombre de likes et le nombre de commentaires. */}
            <div className="infos-total">
              {/* Si le nombre de likes est supérieur à 1, on affiche le nombre de likes. */}
              {likes && this.totalLike >= 1 ? (<>
                {/* Nombre de likes, nombre de commentaires et bouton de like. */}
                <p className="like"><i className="fa-solid fa-heart"></i> {this.totalLike} J'aime</p>
                {/* Sinon, on affiche un div vide. */}
              </>) : null}
              {/* Si le nombre de commentaires est supérieur à 1, on affiche le nombre de commentaires. */}
              {comments.length ? (<>
                {/* Nombre de commentaires, bouton de commentaire. */}
                <p className="comment">{comments.length} commentaire(s) <i className="fa-solid fa-comment"></i></p>
                {/* Sinon, on affiche un div vide. */}
              </>) : null}
            </div>

            {this.setOptions()}        {/* Div contenant les options de l'article. */}

            {showComments ? (<>        {/* Si l'affichage des commentaires est activé, on affiche le composant. */}

              {commentsLoaded ? (<>    {/* Si les commentaires sont chargés, on affiche le composant. */}
                {/* Commentaires de l'article de l'utilisateur connecté. */}
                <Comments userLogged={userLogged} articleId={article.id} comments={comments} />
              </>) : (<></>)}

            </>) : null}      {/* Sinon, on affiche un div vide. */}
          </article>
        </>) : (<></>)}

      </>) : (<>
        {/* Si l'article est en édition, on affiche le composant. */}
        <article key={'edit-article-' + article.id}>
          <div className="article-author">                             {/* Div contenant l'auteur de l'article. */}
            <Avatar dataUser={{ ...author, isProfile: false }} />      {/* Avatar de l'auteur de l'article. */}
            <div className="author-infos">                             {/* Informations de l'auteur de l'article. */}
              <h3>{author.firstname} {author.lastname}</h3>            {/* Nom et prénom de l'auteur de l'article. */}

              {/* Tâche de l'auteur de l'article et date de publication de l'article. */}
              <h4>{author.task.tasks} | <i className="fa-solid fa-clock"></i> {this.convertDate()}</h4>
            </div>
            <div className="article-no-options">                       {/* Div vide. */}
              {/* Bouton de confirmation de l'édition de l'article. */}
              <button onClick={this.onEditClick}><span className="hidden">confirm edit article</span><i className="fa-solid fa-check"></i></button>
            </div>
          </div>

          <form onSubmit={this.onEditClick}>                         {/* Formulaire de modification de l'article. */}
            <label htmlFor="message">message</label>                 {/* Label du champ de texte. */}

            {/*Placeholder du champ de texte pour la publication de l'article. */}
            <input id="message" type='text' name="message" placeholder='Un petit mot ?'
              // value={article.article},  {/* Valeur du champ de texte. */}
              defaultValue={valueArticle} onChange={this.OnChange} />

            {/* Div contenant l'avatar de l'utilisateur connecté. */}
            <div className='article-edit-avatar'>
              {/* Label du champ de fichier. */}
              <label htmlFor="picture" className="file-upload" onChange={this.OnChange}>
                <span className="hidden">picture</span>                   {/* Span invisible. */}
                {/* Si le champ de fichier est vide, on affiche un X. Sinon on affiche une image. */}
                {fileUpload ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-image"></i>}
              </label>
              {/* Champ de fichier. */}
              <input id="picture" name='picture' type='file' label='UploadImage'
                // Accepte les images jpg, jpeg, png, gif.
                accept=".jpg,.jpeg,.png,.gif" onChange={this.OnChange} />

              {/* Si l'article contient une image, on affiche l'image. */}
              {article.image !== 'none' ? (<>
                {/* Bouton de suppression de l'image. */}
                <button label='delAvatar' onClick={this.onDeleteImage}>
                  <span className="hidden">delete Avatar</span>          {/* Span invisible. */}
                  <i className="fa-solid fa-trash"></i>                  {/* Icone de suppression. */}
                </button>
                <img src={article.image} alt='postedImage' />            {/* Image de l'article. */}
              </>) : null}                                               {/* Sinon, on affiche un div vide. */}
            </div>
          </form>
        </article>
      </>)}
    </>
    )
  }
}
