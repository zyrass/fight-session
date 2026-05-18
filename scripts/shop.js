/**
 * @file shop.js
 * @description Contrôleur de la boutique de potions (pages/shop/shopping.html).
 * Permet au joueur de visualiser sa bourse et ses PV, d'acheter des potions à prix variables,
 * de consulter son inventaire, d'utiliser (boire) des potions pour regagner de la vie,
 * et de retourner au combat.
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
const shopTitle = document.querySelector("main h1");
const inventorySection = document.querySelector("main .inventory");
const inventoryList = document.querySelector("main .inventory ul");
const pnjQuote = document.querySelector("main .pnj blockquote p");

// =========================================================================
// 2. STYLISATION & AFFICHAGE DES INFOS DU JOUEUR (OR ET VIE)
// =========================================================================

// Création d'une bannière de statistiques pour le joueur au-dessus des potions
const playerBanner = document.createElement("div");
playerBanner.className = "player-stats-banner";
playerBanner.style.background = "var(--bg-color-dark)";
playerBanner.style.color = "var(--white)";
playerBanner.style.padding = "12px 24px";
playerBanner.style.borderRadius = "8px";
playerBanner.style.margin = "20px 0";
playerBanner.style.display = "flex";
playerBanner.style.justifyContent = "space-between";
playerBanner.style.alignItems = "center";
playerBanner.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
playerBanner.style.fontSize = "18px";
playerBanner.style.fontWeight = "bold";

function updatePlayerBanner() {
  playerBanner.innerHTML = `
    <span>💰 Bourse : <strong style="color: var(--gold);">${gold} 💵</strong></span>
    <span>❤️ Santé : <strong style="color: var(--success);">${life} / ${lifeMax} PV</strong></span>
  `;
}
updatePlayerBanner();
shopTitle.after(playerBanner);

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

const potionsConfig = [
  { id: "potion_25", name: "Potion de vie presque vide", healPercent: 25, price: 125 },
  { id: "potion_50", name: "Potion de vie à moitié pleine", healPercent: 50, price: 240 },
  { id: "potion_75", name: "Potion de vie presque pleine", healPercent: 75, price: 360 },
  { id: "potion_100", name: "Potion de vie parfaite", healPercent: 100, price: 490 }
];

// Sélection de toutes les cartes de potions dans le magasin
const buyButtons = document.querySelectorAll(".card_container-shop button");

buyButtons.forEach((btn, index) => {
  const potion = potionsConfig[index];
  
  // UX : Curseur pointer
  btn.style.cursor = "pointer";

  btn.addEventListener("click", () => {
    // Vérification de la bourse du joueur
    if (gold >= potion.price) {
      gold -= potion.price;
      inventory[potion.id] = (inventory[potion.id] || 0) + 1;

      // Sauvegarde de l'état
      localStorage.setItem("gold", gold);
      localStorage.setItem("inventory", JSON.stringify(inventory));

      // Notification visuelle et mise à jour
      updatePlayerBanner();
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
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.padding = "10px 16px";
      li.style.borderBottom = "1px solid var(--primary)";
      li.style.background = "rgba(255, 255, 255, 0.05)";
      li.style.margin = "6px 0";
      li.style.borderRadius = "4px";

      li.innerHTML = `
        <span style="color: var(--white); font-weight: bold;">🧪 ${potion.name} (x${quantity})</span>
        <button class="use-potion-btn" data-id="${potionId}" style="
          background: var(--success);
          color: var(--white);
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-weight: bold;
          cursor: pointer;
        ">Boire 🧪</button>
      `;

      inventoryList.appendChild(li);
    }
  }

  if (isEmpty) {
    inventoryList.innerHTML = `
      <li style="color: var(--muted); text-align: center; font-style: italic; padding: 10px;">
        Votre inventaire est désespérément vide... Achetez des potions ci-dessus ! 🎒
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
      updatePlayerBanner();
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
combatLink.style.display = "block";
combatLink.style.width = "fit-content";
combatLink.style.margin = "30px auto";
combatLink.style.padding = "12px 24px";
combatLink.style.background = "var(--danger)";
combatLink.style.color = "var(--white)";
combatLink.style.border = "2px solid var(--black-intense)";
combatLink.style.borderRadius = "4px";
combatLink.style.fontSize = "16px";
combatLink.style.fontWeight = "bold";
combatLink.style.cursor = "pointer";
combatLink.style.textShadow = "1px 1px 2px var(--black-intense)";

combatLink.addEventListener("click", () => {
  location.href = "../fight/index.html";
});

inventorySection.after(combatLink);
