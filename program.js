/**
 * @file program.js
 * @description Chef d'orchestre de la liaison IHM <-> Classes (Code de travail en jachère).
 * 
 * Ce script contient la logique de liaison événementielle pour :
 * 1. Capturer le pseudo, l'avatar et la classe du héros saisis dans le formulaire.
 * 2. Instancier l'objet Player avec ces données.
 * 3. Enregistrer l'état du joueur dans le localStorage du navigateur pour persistance.
 * 4. Gérer l'affichage conditionnel des écrans (formulaire vs arène de combat).
 * 
 * Note : Ce fichier est actuellement mis en pause (commenté) car les scripts
 * ne sont pas encore branchés de manière modulaire sur les différents écrans HTML.
 */

// Importation des ressources et modèles nécessaires
import ListMob from "./scripts/listMob.js";
import Player from "./scripts/class/Player.class.js";

/*
// =========================================================================
// ÉLÉMENTS DU DOM (SÉLECTEURS)
// =========================================================================

// Conteneurs principaux de sections
// const sectionFormulaire = document.getElementById("formulaire");
// const sectionCombat = document.getElementById("combat");

// Formulaire de saisie
// const inputPseudo = document.getElementById("pseudo");
// const btnNewPseudo = document.getElementById("buttonNewPseudo");
// const avatars = document.querySelectorAll(".avatars figure img");

// Écran de combat - Profil Joueur
// const playerh3 = document.querySelector("#combat .left .card h3");
// const playerLifeBar = document.querySelector("#combat .left .card .stats .lifebar progress");
// const playerAvatar = document.querySelector("#combat .left .card");
*/


/*
// =========================================================================
// ÉTAPE 1 : LOGIQUE DE CRÉATION DU HÉROS (FORMULAIRE)
// =========================================================================

// Variables temporaires pour stocker les choix du joueur
// let pseudo;
// let avatar;
// let type;

// btnNewPseudo.addEventListener("click", (e) => {
//   e.preventDefault();

//   // Limitation de la taille du pseudo à 11 caractères max
//   if (inputPseudo.value.length <= 11) {
//     pseudo = inputPseudo.value;
//   }

//   // Sélection de l'avatar et de la classe associée au clic sur les vignettes images
//   avatars.forEach((currentAvatar) => {
//     currentAvatar.addEventListener("click", (e) => {
//       avatar = e.target.attributes[0].nodeValue; // URL de l'image
//       type = e.target.id;                        // Nom de la classe de héros (ex: "guerrier")
//     });
//   });

//   // Si toutes les informations requises sont fournies et valides
//   if (
//     pseudo.length > 3 &&
//     pseudo.length <= 11 &&
//     avatar !== undefined &&
//     type !== undefined
//   ) {
//     // Instanciation de l'objet Player à partir de nos modèles
//     const newPlayer = new Player(pseudo, avatar, type);
//     console.log(newPlayer);

//     // Redirection visuelle immédiate (simulation de Single Page Application)
//     sectionFormulaire.style.display = "none";
//     sectionCombat.style.display = "block";

//     // Sauvegarde complète dans le LocalStorage pour pouvoir recharger le jeu
//     localStorage.setItem("pseudo", newPlayer.pseudo);
//     localStorage.setItem("avatar", newPlayer.avatar);
//     localStorage.setItem("type", newPlayer.type);
//     localStorage.setItem("lifeMax", newPlayer.life);
//     localStorage.setItem("strong", newPlayer.strong);
//     localStorage.setItem("gold", newPlayer.gold);
//     localStorage.setItem("experience", newPlayer.experience);
//     localStorage.setItem("inventory", newPlayer.inventory);
//     localStorage.setItem("weapon", newPlayer.weapon);
//   }
// });
*/


/*
// =========================================================================
// ÉTAPE 2 : CHARGEMENT ET CHARGEMENT DU COMBAT (RÉCUPÉRATION LOCALSTORAGE)
// =========================================================================

// Si un héros existe déjà en mémoire cache
// if (localStorage.getItem("pseudo")) {
//   sectionFormulaire.style.display = "none";
//   sectionCombat.style.display = "block";

//   // Injection des données dans les conteneurs d'affichage du combat
//   playerh3.textContent = localStorage.getItem("pseudo");
//   playerLifeBar.setAttribute("max", localStorage.getItem("lifeMax"));
//   playerAvatar.style.backgroundImage = `url(${localStorage.getItem("avatar")})`;
  
//   console.log("Héros chargé :", localStorage.getItem("pseudo"));
// } else if (!localStorage.getItem("pseudo")) {
//   // Si pas de héros en mémoire, forcer le passage par la case création
//   sectionFormulaire.style.display = "block";
//   sectionCombat.style.display = "none";
// }
*/
