# 🗡️ FIGHT : RPG en Vanilla JS

![Fight Session Banner](assets/images/banner.png)

---

## 🎭 Présentation du Projet

Bienvenue dans **Fight**, un mini-RPG en Vanilla JS conçu à l'ancienne. C'est un projet personnel d'abord pensé comme un délire drôle, punitif et immersif.

Le concept est simple : tu crées ton héros parmi plusieurs classes légendaires et tu te lances dans une arène de combat sans fin. Ton but ? Enchaîner le plus de combats victorieux consécutifs pour hisser ton nom dans le prestigieux **Top 10** des scores de la série en cours. 

Mais attention ! Si tu manques de courage et décides de fuir en refusant le défi sur l'écran d'accueil, le jeu se chargera de te rappeler ta lâcheté à l'aide d'une collection d'insultes légères générées aléatoirement (ex : *« Espèce de moldue »*, *« Oh peuchère t'es dégun !! »*, *« Le cercueil de tous tes morts, arrache-toi vite !! »*).

---

## 🏷️ Les Badges du Projet

Dans le cadre de l'audit complet mené sur l'application, plusieurs certifications et indicateurs ont été attribués au projet :

![Vanilla JS](https://img.shields.io/badge/Language-Vanilla%20JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Humour Insultes](https://img.shields.io/badge/Humour-Insultes%20Actives%20%F0%9F%A5%AC-red?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-D%C3%A9lire%20non%20termin%C3%A9-orange?style=for-the-badge)
![Label Qualité](https://img.shields.io/badge/Label-Baltringue%20Glorieuse%20%F0%9F%8D%87-red?style=for-the-badge&labelColor=2f3542&borderColor=eccc68)
![Audit Score](https://img.shields.io/badge/Audit-12%2F20-blue?style=for-the-badge)

---

## 🏛️ Rapports & Certifications (Dossier `/docs`)

Un audit complet ainsi qu'un label de qualité ont été créés pour valoriser le projet et lister ses axes d'amélioration techniques :

1. 🛡️ **[Rapport d'Audit Technique](file:///g:/www/projects/js/fight-session/docs/audit_technique.md)** : Analyse de l'architecture POO, diagnostic rigoureux des bugs débusqués (les getters dupliqués, le setter de force défaillant, le crash de redirection d'accueil) et notation globale.
2. 🏅 **[Label de Qualité "Baltringue Glorieuse"](file:///g:/www/projects/js/fight-session/docs/label_qualite.md)** : Une certification ludique et officielle récompensant l'humour unique et le charme rétro-gaming du projet.

---

## 🎮 Mécaniques de Jeu

### 1. Les Classes de Héros Disponibles
Chaque classe possède son propre équilibrage de points de vie (PV), sa force physique (💪) et son arme fétiche :

| Classe | Points de Vie (PV) | Force de base (💪) | Arme Équipée | Style de Combat |
| :--- | :---: | :---: | :--- | :--- |
| **Archère** | 100 PV | 25 | Arc | Attaque à distance précise |
| **Assassin** | 80 PV | 26 | Dagues | Rapide mais fragile |
| **Astrologue** | 120 PV | 24 | Cartes | Magie cosmique équilibrée |
| **Barde** | 125 PV | 26 | Harpe | Combat musical rythmé |
| **Guerrier** | 90 PV | 25 | Hache | Puissant et équilibré |
| **Invocateur** | 150 PV | 25 | Livre ancien | Résistant avec invocations |
| **Mage** | 80 PV | 27 | Bâton | Force magique brute maximale |
| **Ninja** | 90 PV | 26 | Shuriken | Vif et furtif |
| **Soigneur** | 180 PV | 25 | Sceptre | Endurance exceptionnelle (sac à PV) |

---

### 2. Le Bestiaire procédural (Les Monstres)
Les monstres que tu affrontes escaladent en niveau, en vie et en force selon leur **rareté** :
- **Normal** (Niveau 1 à 25) — Exemple : *Abeille_White* 🐝
- **Élite** (Niveau 26 à 50) — Exemple : *Lapin_Elite* 🐰
- **Boss** (Niveau 51 à 75) — Exemple : *Cerf_Boss* 🦌

*Terrasser un monstre te rapporte des Pièces d'or (💵) et de l'Expérience (XP) proportionnellement à son niveau.*

---

### 3. La Boutique & les Potions de Vie
Pour survivre à tes combats consécutifs, un marchand te propose plusieurs potions pour récupérer tes PV :
- **Potion presque vide (25% PV)** — 125 💵 *(« Ce ne sont que les restes pour éviter le gaspillage... »)*
- **Potion à moitié pleine (50% PV)** — 240 💶 *(« C'est la crise, je te la fais à moitié prix. »)*
- **Potion presque pleine (75% PV)** — 360 💷 *(« Récupérée sur un aventurier décédé, petite ristourne... »)*
- **Potion parfaite (100% PV)** — 490 💴 *(« Là, tu payes le prix fort... j'ai risqué ma vie pour toi. »)*

---

## 📁 Architecture des Fichiers

```bash
├── assets/
│   ├── images/               # Portraits de héros, monstres et items
│   │   ├── banner.png        # Superbe illustration pixel-art du jeu
│   └── styles/
│       ├── base.css          # Styles généraux et variables CSS
│       ├── style_fight.css   # Styles de l'arène de combat
│       ├── style_form.css    # Styles du formulaire de création
│       └── style_shop.css    # Styles du magasin
├── docs/
│   ├── audit_technique.md    # Rapport d'audit complet (Note : 12/20)
│   └── label_qualite.md      # Certificat officiel humoristique
├── scripts/
│   ├── base/
│   │   └── hour.js           # Gestion de l'horloge du footer
│   ├── class/
│   │   ├── Player.class.js   # Modèle de données et méthodes du Joueur (JSDoc)
│   │   └── Mob.class.js      # Modèle de données et méthodes des Monstres (JSDoc)
│   └── listMob.js            # Base de données des monstres de base
├── index.html                # Écran d'accueil avec redirection ou catalogue d'insultes
├── program.js                # Code de liaison (localStorage et IHM en attente)
└── looser.js                 # Monument aux morts/Placeholder humoristique
```

---

## 🚀 Installation & Lancement

1. Cloner ou télécharger le dépôt du projet.
2. Ouvrir le fichier d'accueil [index.html](file:///g:/www/projects/js/fight-session/index.html) dans ton navigateur préféré.
3. Clique sur **« J'accepte le défi »** pour entamer la création de ton personnage, ou ose cliquer sur **« Je refuse »** si tu l'assumes...

> [!TIP]
> Pour exécuter le jeu localement, aucun serveur ni dépendance (comme npm) n'est requis. C'est du **pure Vanilla JS** s'exécutant directement côté client !
