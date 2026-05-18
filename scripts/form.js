/**
 * @file form.js
 * @description Gère l'interface de création de personnage (createHeroe.html).
 * Permet au joueur de saisir son pseudo, de sélectionner un avatar (avec mise en
 * surbrillance visuelle), d'instancier la classe Player et de persister ses données
 * dans le LocalStorage avant de le rediriger vers l'arène.
 */

import Player from "./class/Player.class.js";

// Sélection des éléments interactifs du DOM
const inputPseudo = document.getElementById("pseudo");
const btnSubmit = document.getElementById("buttonNewPseudo");
const avatars = document.querySelectorAll(".avatars figure img");

let selectedAvatar = null;
let selectedType = null;

// Écoute des clics sur chaque image d'avatar
avatars.forEach((avatarImg) => {
  // Styles initiaux pour le curseur
  avatarImg.style.cursor = "pointer";
  avatarImg.style.transition = "transform 0.2s ease, border 0.2s ease";

  avatarImg.addEventListener("click", (e) => {
    // Réinitialise la bordure de toutes les vignettes
    avatars.forEach((img) => {
      img.style.border = "none";
      img.style.transform = "scale(1)";
    });

    // Applique un effet de sélection sur l'avatar cliqué
    e.target.style.border = "4px solid var(--gold)";
    e.target.style.borderRadius = "8px";
    e.target.style.transform = "scale(1.05)";
    
    // Récupère l'URL relative de l'image (ex: "../../assets/images/avatars/guerrier.jpeg")
    // et l'ID de l'élément représentant la classe de héros (ex: "guerrier")
    selectedAvatar = e.target.getAttribute("src");
    selectedType = e.target.id;
  });

  // Petits effets de survol pour une UX premium
  avatarImg.addEventListener("mouseenter", (e) => {
    if (selectedType !== e.target.id) {
      e.target.style.transform = "scale(1.03)";
    }
  });
  avatarImg.addEventListener("mouseleave", (e) => {
    if (selectedType !== e.target.id) {
      e.target.style.transform = "scale(1)";
    }
  });
});

// Écoute de la soumission du formulaire au clic sur le bouton de démarrage
btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  
  const pseudo = inputPseudo.value.trim();

  // 1. Validation de la longueur du pseudo
  if (pseudo.length < 3 || pseudo.length > 11) {
    alert("Votre pseudo de combattant doit comporter entre 3 et 11 caractères !");
    return;
  }

  // 2. Validation de la sélection de classe/avatar
  if (!selectedAvatar || !selectedType) {
    alert("Choisissez votre destin ! Veuillez sélectionner un avatar.");
    return;
  }

  // 3. Instanciation de l'objet Player
  // Note : les chemins d'images d'avatars dans createHeroe.html sont relatifs à pages/form/ ("../../assets/images/avatars/...").
  // Pour le reste du jeu, nous convertissons ce chemin pour qu'il soit relatif à la racine du projet ("assets/images/avatars/...").
  const cleanAvatarPath = selectedAvatar.replace("../../", "");
  
  const player = new Player(pseudo, cleanAvatarPath, selectedType);

  // 4. Persistance des statistiques de base dans le LocalStorage
  localStorage.setItem("pseudo", player.pseudo);
  localStorage.setItem("avatar", player.avatar);
  localStorage.setItem("type", player.type);
  localStorage.setItem("life", player.life);
  localStorage.setItem("lifeMax", player.life); // Garde trace de la vie maximale
  localStorage.setItem("strong", player.strong);
  localStorage.setItem("gold", "0");
  localStorage.setItem("experience", "0");
  localStorage.setItem("series", "0");
  localStorage.setItem("weapon", player.weapon);
  localStorage.setItem("inventory", JSON.stringify({})); // Inventaire vide au départ

  console.log("Héros créé avec succès :", player);

  // 5. Redirection immédiate vers l'arène de combat
  location.href = "../fight/index.html";
});
