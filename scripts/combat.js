/**
 * @file combat.js
 * @description Moteur de combat principal de l'application (pages/fight/index.html).
 * Récupère le personnage du LocalStorage, instancie Player, génère procéduralement un ennemi,
 * gère la boucle de combat tour par tour, met à jour le DOM en temps réel, affiche des logs
 * dynamiques de combat, gère la victoire/défaite et persiste la progression.
 */

import Player from "./class/Player.class.js";
import ListMob from "./listMob.js";

// =========================================================================
// 1. CHARGEMENT ET SÉCURISATION DU HÉROS
// =========================================================================

const pseudo = localStorage.getItem("pseudo");
if (!pseudo) {
  // Pas de personnage créé -> redirection immédiate à l'accueil
  alert("Pas de héros détecté ! Redirection vers l'accueil.");
  location.href = "../../index.html";
}

// Reconstruction de l'instance de combat du joueur à partir du cache LocalStorage
const player = new Player(
  pseudo,
  localStorage.getItem("avatar"),
  localStorage.getItem("type")
);

// Restauration de l'état dynamique (vie courante, force augmentée, or, XP, série)
player.life = parseInt(localStorage.getItem("life")) || player.life;
player.strong = parseInt(localStorage.getItem("strong")) || player.strong;
player.gold = parseInt(localStorage.getItem("gold")) || 0;
player.experience = parseInt(localStorage.getItem("experience")) || 0;
player.series = parseInt(localStorage.getItem("series")) || 0;
player.level = parseInt(localStorage.getItem("level")) || 1;

player.lifeMax = parseInt(localStorage.getItem("lifeMax")) || player.lifeMax;
const lifeMax = player.lifeMax;

// =========================================================================
// 2. GÉNÉRATION DE L'IA (MONSTRE ADAPTÉ AU NIVEAU)
// =========================================================================

let mobPrototype;
let mobTypeSelected = "normal";
const randType = Math.random();

// Système d'équilibrage par probabilité dynamique de rareté selon le niveau
if (player.level <= 2) {
  mobTypeSelected = "normal";
} else if (player.level <= 4) {
  mobTypeSelected = randType < 0.3 ? "elite" : "normal";
} else if (player.level <= 7) {
  if (randType < 0.1) mobTypeSelected = "boss";
  else if (randType < 0.6) mobTypeSelected = "elite";
  else mobTypeSelected = "normal";
} else {
  if (randType < 0.3) mobTypeSelected = "boss";
  else if (randType < 0.8) mobTypeSelected = "elite";
  else mobTypeSelected = "normal";
}

// Sélection du prototype aléatoire dans la liste correspondante
const list = ListMob[mobTypeSelected];
mobPrototype = list[Math.floor(Math.random() * list.length)];

// Calcul dynamique du niveau du monstre indexé sur celui du joueur
let mobLevel = 1;
let levelModifier = 0;

if (mobPrototype.type === "normal") {
  // Niveau du joueur +/- 1 (min 1)
  levelModifier = Math.floor(Math.random() * 3) - 1; // -1, 0, ou 1
  mobLevel = Math.max(1, player.level + levelModifier);
} else if (mobPrototype.type === "elite") {
  // Niveau du joueur + 1 à 3
  levelModifier = Math.floor(Math.random() * 3) + 1; // 1, 2, ou 3
  mobLevel = player.level + levelModifier;
} else {
  // Boss: Niveau du joueur + 3 à 5
  levelModifier = Math.floor(Math.random() * 3) + 3; // 3, 4, ou 5
  mobLevel = player.level + levelModifier;
}

// Recalcul des stats dynamiques de combat pour le monstre cloné
const mob = {
  name: mobPrototype.name,
  avatar: mobPrototype.avatar,
  type: mobPrototype.type,
  level: mobLevel,
  life: 0,
  lifeMax: 0,
  strong: 0,
  gold: 0,
  experience: 0,
  attack: function() {
    const minDmg = Math.floor(this.strong / 2);
    const maxDmg = this.strong;
    return Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
  }
};

// Formules de statistiques équilibrées de façon linéaire et stimulante
if (mob.type === "normal") {
  mob.lifeMax = mob.level * 15 + 30;
  mob.strong = mob.level * 3 + 5;
  mob.gold = Math.floor(mob.level * 4 + (Math.floor(Math.random() * 5) + 3));
  mob.experience = mob.level * 10 + 5;
} else if (mob.type === "elite") {
  mob.lifeMax = mob.level * 20 + 50;
  mob.strong = mob.level * 4 + 10;
  mob.gold = Math.floor(mob.level * 8 + (Math.floor(Math.random() * 10) + 5));
  mob.experience = mob.level * 15 + 10;
} else {
  mob.lifeMax = mob.level * 28 + 90;
  mob.strong = Math.floor(mob.level * 4.5 + 20);
  mob.gold = Math.floor(mob.level * 16 + (Math.floor(Math.random() * 20) + 10));
  mob.experience = mob.level * 25 + 20;
}

mob.life = mob.lifeMax;

// =========================================================================
// 3. RACCORDEMENT ET SÉLECTION DES ÉLÉMENTS DU DOM
// =========================================================================

// --- CÔTÉ JOUEUR (GAUCHE) ---
const playerTitle = document.querySelector("#combat .left .card h3");
const playerLifeBarVal = document.querySelector("#combat .left .card .stats .lifebar div span:first-of-type");
const playerLifeBarMax = document.querySelector("#combat .left .card .stats .lifebar div span:last-of-type");
const playerForce = document.querySelector("#combat .left .card .stats .force span:last-of-type");
const playerSeries = document.querySelector("#combat .left .card .stats .series span");
const playerCard = document.querySelector("#combat .left .card");

// --- CÔTÉ ENNEMI (DROITE) ---
const mobTitle = document.querySelector("#combat .right .card h3");
const mobLifeProgress = document.querySelector("#combat .right .card .stats .lifebar progress");
const mobLifeBarVal = document.querySelector("#combat .right .card .stats .lifebar .mob-hp-text span:first-of-type");
const mobLifeBarMax = document.querySelector("#combat .right .card .stats .lifebar .mob-hp-text span:last-of-type");
const mobForce = document.querySelector("#combat .right .card .stats .force span:first-of-type");
const mobCard = document.querySelector("#combat .right .card");

// --- INTERACTION ET DIALOGUES DE COMBAT ---
const btnFight = document.querySelector("#combat > button");
const btnReset = document.querySelector("#btn-reset-game");
const logPlayer = document.querySelector("#combat .status-fight .right ul"); // Dégâts infligés
const logMob = document.querySelector("#combat .status-fight .left ul");     // Dégâts subis

// --- OVERLAYS FIN DE COMBAT ---
const winOverlay = document.querySelector("#combat .win");
const looseOverlay = document.querySelector("#combat .loose");

// =========================================================================
// 4. SYNC INITIALE DU HÉROS ET DU MONSTRE DANS LE DOM
// =========================================================================

// Joueur
playerTitle.textContent = `${player.pseudo} (Lvl ${player.level})`;
playerLifeBarVal.textContent = player.life;
playerLifeBarMax.textContent = lifeMax;
playerForce.textContent = player.strong;
playerSeries.textContent = player.series;

// Application de l'avatar du joueur en arrière-plan de sa carte
playerCard.style.backgroundImage = `url(../../${player.avatar})`;
playerCard.style.backgroundSize = "cover";
playerCard.style.backgroundPosition = "center";

// Ennemi
mobTitle.textContent = `${mob.name.replace("_", " ")} (Lvl ${mob.level})`;
mobLifeProgress.setAttribute("max", mob.lifeMax);
mobLifeProgress.setAttribute("value", mob.life);
mobLifeBarVal.textContent = mob.life;
mobLifeBarMax.textContent = mob.lifeMax;
mobForce.textContent = mob.strong;

// Application de l'avatar du monstre en arrière-plan de sa carte
mobCard.style.backgroundImage = `url(../../assets/images/mobs/${mob.avatar}.jpg)`;
mobCard.style.backgroundSize = "cover";
mobCard.style.backgroundPosition = "center";

// --- MISE À JOUR DU HUD PERSISTANT DE LA NAVBAR ---
function updateHeaderHud() {
  const hudLvl = document.querySelector("#hud-lvl-val");
  const hudXpBar = document.querySelector("#hud-xp-bar");
  const hudXpVal = document.querySelector("#hud-xp-val");
  const hudXpMax = document.querySelector("#hud-xp-max");
  const hudGold = document.querySelector("#hud-gold-val");
  
  if (hudLvl) hudLvl.textContent = player.level;
  if (hudXpBar) {
    hudXpBar.max = player.level * 50;
    hudXpBar.value = player.experience;
  }
  if (hudXpVal) hudXpVal.textContent = player.experience;
  if (hudXpMax) hudXpMax.textContent = player.level * 50;
  if (hudGold) hudGold.textContent = player.gold;
}

// Initialisation globale
updateHeaderHud();

// Historique des tours de jeu
let turnCount = 1;
const historyPlayer = [];
const historyMob = [];

// =========================================================================
// 5. FONCTIONS COMPLÉMENTAIRES (LOGS, VICTOIRE, DÉFAITE)
// =========================================================================

/**
 * Met à jour le journal de combat dans le DOM.
 * @param {HTMLElement} logElement Conteneur UL.
 * @param {Array} historyArray Tableau contenant l'historique des actions.
 */
function updateLogs(logElement, historyArray) {
  logElement.innerHTML = "";
  // Récupère les 5 dernières actions pour un affichage dynamique non-saturé
  const recentActions = historyArray.slice(-5).reverse();
  
  recentActions.forEach((action) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>Tour n°${action.turn}</span> <span>${action.desc}</span>`;
    logElement.appendChild(li);
  });
}

/**
 * Déclenche les animations et la persistance lors d'une victoire du joueur.
 */
function handleVictory() {
  player.win(); // Augmente la série de victoires de 1
  player.gold += mob.gold;
  player.experience += mob.experience;

  // Calcul du seuil d'expérience nécessaire pour passer au niveau supérieur (50 XP par niveau)
  const experienceRequired = player.level * 50;
  let leveledUp = false;
  let oldLifeMax = player.lifeMax;
  let oldStrong = player.strong;

  if (player.experience >= experienceRequired) {
    player.levelUp(); // Déclenche les gains de vie et de force linéaires
    leveledUp = true;
    player.experience = player.experience - experienceRequired; // Garde le surplus d'XP
  }

  // Sauvegarde globale de l'état
  localStorage.setItem("gold", player.gold);
  localStorage.setItem("experience", player.experience);
  localStorage.setItem("series", player.series);
  localStorage.setItem("level", player.level);

  if (leveledUp) {
    localStorage.setItem("life", player.life);        // Soigné au max après un levelUp
    localStorage.setItem("lifeMax", player.lifeMax);  // Nouvelle vie max linéaire
    localStorage.setItem("strong", player.strong);    // Nouvelle force
  } else {
    // Si pas de montée de niveau, sa vie courante reste blessée suite aux combats
    localStorage.setItem("life", player.life);
  }

  // Actualiser le HUD dynamique du header immédiatement
  updateHeaderHud();

  // Configuration de l'overlay de victoire
  winOverlay.querySelector("h3").textContent = "VICTOIRE GLORIEUSE ! 🎉";
  
  let victoryText = `
    Excellent, tu as écrasé <strong>${mob.name.replace("_", " ")}</strong> !<br/><br/>
    💰 Or récolté : +${mob.gold} 💵<br/>
    🌟 EXP gagnée : +${mob.experience} points<br/>
    🔥 Série de victoires actuelle : <strong>${player.series}</strong> combat(s)<br/>
  `;

  if (leveledUp) {
    victoryText += `
      <br/>⭐ <strong>NIVEAU SUPÉRIEUR ! (Lvl ${player.level})</strong> ⭐<br/>
      💖 Vie max augmentée : ${oldLifeMax} ❤️ -> ${player.life} ❤️<br/>
      💪 Force accrue : ${oldStrong} 💪 -> ${player.strong} 💪
    `;
  }

  winOverlay.querySelector("p").innerHTML = victoryText;
  winOverlay.style.display = "flex";

  // Configuration des boutons de redirection
  const btnGoShop = winOverlay.querySelector(".actions button:first-child");
  const btnNextFight = winOverlay.querySelector(".actions button:last-child");

  btnGoShop.textContent = "Visiter le Magasin 🛒";
  btnGoShop.onclick = () => {
    location.href = "../shop/shopping.html";
  };

  btnNextFight.textContent = "Prochain Combat ⚔️";
  btnNextFight.onclick = () => {
    location.reload();
  };
}

/**
 * Gère l'overlay et la réinitialisation lors de la défaite du joueur.
 */
function handleDefeat() {
  looseOverlay.querySelector("h3").textContent = "TU T'ES FAIT DÉFONCER ! 💀";
  
  looseOverlay.querySelector("p").innerHTML = `
    Ah ouais... Tu t'es fait éclater comme un gros nul par <strong>${mob.name.replace("_", " ")}</strong>...<br/>
    Ta série s'arrête brutalement à <strong>${player.series}</strong> victoires consécutives.<br/><br/>
    <em>Retourne t'entraîner, baltringue !</em>
  `;

  // Nettoyage de la partie en cours dans le LocalStorage
  localStorage.clear();

  looseOverlay.style.display = "flex";

  const btnScores = looseOverlay.querySelector(".actions button:first-child");
  const btnRestart = looseOverlay.querySelector(".actions button:last-child");

  btnScores.textContent = "Menu Principal 🏠";
  btnScores.onclick = () => {
    location.href = "../../index.html";
  };

  btnRestart.textContent = "Recréer un Héros 🛡️";
  btnRestart.onclick = () => {
    location.href = "../form/createHeroe.html";
  };
}

// =========================================================================
// 6. BOUCLE DE COMBAT (ÉCOUTEUR D'ÉVÉNEMENT)
// =========================================================================

btnFight.addEventListener("click", () => {
  // Empêcher d'attaquer si l'un des deux combattants est déjà mort
  if (player.life <= 0 || mob.life <= 0) return;

  // --- TOUR DU JOUEUR ---
  const playerDamage = player.attack();
  mob.life = Math.max(0, mob.life - playerDamage);
  
  // Met à jour la barre de vie du monstre
  mobLifeProgress.setAttribute("value", mob.life);
  mobLifeBarVal.textContent = mob.life;
  
  // Log de l'attaque du joueur
  historyPlayer.push({
    turn: turnCount,
    desc: `Tu infliges <strong>${playerDamage}</strong> dégâts à ${mob.name.replace("_", " ")} !`
  });
  updateLogs(logPlayer, historyPlayer);

  // Vérification de la mort du monstre
  if (mob.life <= 0) {
    handleVictory();
    return;
  }

  // --- TOUR DU MONSTRE (RÉPLIQUE) ---
  const mobDamage = mob.attack();
  player.life = Math.max(0, player.life - mobDamage);
  
  // Met à jour l'affichage de vie du joueur
  playerLifeBarVal.textContent = player.life;
  
  // Log de l'attaque du monstre
  historyMob.push({
    turn: turnCount,
    desc: `<strong>${mob.name.replace("_", " ")}</strong> te cause <strong>${mobDamage}</strong> dommages !`
  });
  updateLogs(logMob, historyMob);

  // Vérification de la mort du joueur
  if (player.life <= 0) {
    handleDefeat();
    return;
  }

  // Passage au tour suivant
  turnCount++;
});

// =========================================================================
// 7. BOUTON DE RÉINITIALISATION DE LA PARTIE
// =========================================================================
if (btnReset) {
  btnReset.addEventListener("click", () => {
    const confirmReset = confirm(
      "⚠️ Êtes-vous sûr de vouloir réinitialiser tout votre progrès ?\n\nCela effacera définitivement votre héros, votre or, votre équipement et votre série de victoires de façon IRREVOCABLE."
    );
    if (confirmReset) {
      localStorage.clear();
      // Redirection immédiate vers la page de création/accueil
      location.href = "../../index.html";
    }
  });
}
