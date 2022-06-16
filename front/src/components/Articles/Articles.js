import React from "react"; // Importer react pour utiliser les fonctionnalités de react
import Article from "../Article/Article"; // Importer le composant Article pour utiliser les fonctionnalités de react
import AddForm from "../Article/AddForm"; // Importer le composant AddForm pour utiliser les fonctionnalités de react


// Page Articles qui va afficher les articles et le formulaire d'ajout d'article dans la page articles.
export default class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // DONNÉES DE L'API 
      articles: props.articles, // Articles de l'API 
      userLogged: props.userLogged, // Utilisateur connecté 
      // OPTIONS DE L'API
      isLoading: false // Chargement des articles false = non chargé
    }
  }


  // Fonction qui s'exécute lorsque le composant est monté dans le DOM de la page web
  render() {  // Affichage des articles 
    // Récupération des données de l'API, des options de l'API et de l'utilisateur connecté de la page web
    const { isLoading, articles, userLogged } = this.state;
    return (<>

      {!isLoading ? (<>                       {/* Si les articles n'ont pas été chargés */}

        <AddForm userLogged={userLogged} />   {/* Ajout d'un article */}

        {/* Boucle sur tous les articles */}
        {articles ? articles.map((article) => (   // Affichage des articles, si ils existent
          <Article key={`${article.id}`} dataArticle={article} userLogged={userLogged} />
        )) : (<p className="error">Pas d'article actuellement!</p>)}  {/* Affichage d'un message si il n'y a pas d'articles */}

      </>) : (<></>)}

    </>)
  }
}
