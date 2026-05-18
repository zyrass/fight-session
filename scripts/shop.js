/**
 * @file shop.js
 * @description Contrôleur de la boutique de potions.
 * Synchronise le solde et les PV du joueur avec le HUD persistant de la navbar,
 * gère l'achat de potions aux nouveaux tarifs ajustés, et gère l'utilisation en direct.
 */

// 1. Récupération et sécurisation de l'état du joueur
const pseudo = localStorage.getItem("pseudo");
if (!pseudo) {
  location.href = "../../index.html";
}

let gold = parseInt(localStorage.getItem("gold")) || 0;
let life = parseInt(localStorage.getItem("life")) || 0;
let lifeMax = parseInt(localStorage.getItem("lifeMax")) || 100;
let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

// Sélection des éléments clés du DOM
const shopLayout = document.querySelector(".shop-layout");
const inventoryTitle = document.querySelector(".inventory h3");
const inventoryList = document.querySelector("main .inventory ul");
const pnjQuote = document.querySelector("main .pnj blockquote p");

// =========================================================================
// 2. SYNCHRONISATION DU HUD GLOBAL PERSISTANT (NAVBAR)
// =========================================================================
function updateHeaderHud() {
  const hudLvl = document.querySelector("#hud-lvl-val");
  const hudXpBar = document.querySelector("#hud-xp-bar");
  const hudXpVal = document.querySelector("#hud-xp-val");
  const hudXpMax = document.querySelector("#hud-xp-max");
  const hudGold = document.querySelector("#hud-gold-val");
  
  const level = parseInt(localStorage.getItem("level")) || 1;
  const experience = parseInt(localStorage.getItem("experience")) || 0;
  
  if (hudLvl) hudLvl.textContent = level;
  if (hudXpBar) {
    hudXpBar.max = level * 50;
    hudXpBar.value = experience;
  }
  if (hudXpVal) hudXpVal.textContent = experience;
  if (hudXpMax) hudXpMax.textContent = level * 50;
  if (hudGold) hudGold.textContent = gold;
}

// Mise à jour de l'affichage de la santé dans l'inventaire
function updateHpDisplay() {
  if (inventoryTitle) {
    inventoryTitle.innerHTML = `🎒 Ton Sac à Dos <span class="hp-badge">❤️ ${life} / ${lifeMax} PV</span>`;
  }
}

// Initialisation globale
updateHeaderHud();
updateHpDisplay();

// =========================================================================
// 3. DIALOGUES DU MARCHAND (PNJ)
// =========================================================================
const pnjMessages = [
  "Achetez mes potions ! Elles ne sont presque pas périmées, c'est juré ! 🧪",
  "Pas de crédit ici, l'ami ! Pas de pièces d'or, pas de survie ! 💰",
  "Tu as l'air de t'être bien fait éclater la tronche... Prends une potion parfaite ! ❤️",
  "Nos potions sont faites avec amour... et beaucoup d'eau du robinet. 💧",
  "Reviens me voir quand tu auras vidé tes poches sur le champ de bataille ! ⚔️"
];

// Met à jour le message d'accueil du PNJ de manière aléatoire
pnjQuote.textContent = pnjMessages[Math.floor(Math.random() * pnjMessages.length)];

// =========================================================================
// 4. CONFIGURATION DES POTIONS ET ACHATS
// =========================================================================

// Nouvelle grille tarifaire avantageuse demandée pour le début du jeu
const potionsConfig = [
  { id: "potion_25", name: "Potion de vie presque vide", healPercent: 25, price: 25 },
  { id: "potion_50", name: "Potion de vie à moitié pleine", healPercent: 50, price: 50 },
  { id: "potion_75", name: "Potion de vie presque pleine", healPercent: 75, price: 100 },
  { id: "potion_100", name: "Potion de vie parfaite", healPercent: 100, price: 200 }
];

// Sélection de toutes les cartes de potions dans le magasin
const buyButtons = document.querySelectorAll(".card_container-shop button");

buyButtons.forEach((btn, index) => {
  const potion = potionsConfig[index];
  
  btn.addEventListener("click", () => {
    // Vérification de la bourse du joueur
    if (gold >= potion.price) {
      gold -= potion.price;
      inventory[potion.id] = (inventory[potion.id] || 0) + 1;

      // Sauvegarde de l'état
      localStorage.setItem("gold", gold);
      localStorage.setItem("inventory", JSON.stringify(inventory));

      // Notification visuelle et mise à jour
      updateHeaderHud();
      renderInventory();

      pnjQuote.textContent = `Excellent choix ! Une ${potion.name} ajoutée à ton inventaire ! 🎒`;
    } else {
      pnjQuote.textContent = "Hé ! Tu es fauché comme les blés ! Reviens quand tu auras de l'or, baltringue ! 💢";
      alert("Or insuffisant pour acheter cette potion !");
    }
  });
});

// =========================================================================
// 5. AFFICHAGE ET LOGIQUE DE L'INVENTAIRE (CONSOMMATION)
// =========================================================================

function renderInventory() {
  inventoryList.innerHTML = "";
  let isEmpty = true;

  // Parcourir l'inventaire en cache
  for (const potionId in inventory) {
    const quantity = inventory[potionId];
    
    if (quantity > 0) {
      isEmpty = false;
      const potion = potionsConfig.find(p => p.id === potionId);
      
      const li = document.createElement("li");
      li.innerHTML = `
        <span>🧪 ${potion.name} (x${quantity})</span>
        <button class="use-potion-btn" data-id="${potionId}">Boire 🧪</button>
      `;

      inventoryList.appendChild(li);
    }
  }

  if (isEmpty) {
    inventoryList.innerHTML = `
      <li class="empty-inventory">
        Votre inventaire est vide... Achetez des potions à gauche ! 🎒
      </li>
    `;
  }

  // Liaison des clics sur "Boire 🧪"
  const useButtons = document.querySelectorAll(".use-potion-btn");
  useButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const potionId = e.target.getAttribute("data-id");
      const potion = potionsConfig.find(p => p.id === potionId);

      // Si le joueur a déjà sa vie maximum
      if (life >= lifeMax) {
        pnjQuote.textContent = "Tu as déjà toute ta vie ! Ne gaspille pas tes potions, idiot ! 💢";
        alert("Vie déjà au maximum !");
        return;
      }

      // Calcul des soins (pourcentage basé sur la vie maximale)
      const healAmount = Math.floor(lifeMax * (potion.healPercent / 100));
      life = Math.min(lifeMax, life + healAmount);
      inventory[potionId]--;

      // Sauvegarde
      localStorage.setItem("life", life);
      localStorage.setItem("inventory", JSON.stringify(inventory));

      // Actualisation IHM
      updateHpDisplay();
      updateHeaderHud();
      renderInventory();

      pnjQuote.textContent = `Glou glou... Ah, ça fait du bien ! Tu as récupéré de précieux points de vie ! ❤️`;
    });
  });
}

// Lancement de l'affichage initial de l'inventaire
renderInventory();

// =========================================================================
// 6. BOUTON DE RETOUR AU COMBAT (VERS L'ARÈNE)
// =========================================================================
const combatLink = document.createElement("button");
combatLink.textContent = "⚔️ Retourner dans l'Arène ⚔️";
combatLink.className = "btn-return-arena";

combatLink.addEventListener("click", () => {
  location.href = "../fight/index.html";
});

if (shopLayout) {
  shopLayout.after(combatLink);
}

// =========================================================================
// 7. BOUTON DE RÉINITIALISATION DE LA PARTIE
// =========================================================================
const btnReset = document.querySelector("#btn-reset-game");
if (btnReset) {
  btnReset.addEventListener("click", () => {
    const confirmReset = confirm(
      "⚠️ Êtes-vous sûr de vouloir réinitialiser tout votre progrès ?\n\nCela effacera définitivement votre héros, votre or, votre équipement et votre série de victoires de façon IRREVOCABLE."
    );
    if (confirmReset) {
      localStorage.clear();
      location.href = "../../index.html";
    }
  });
}
