/**
 * @file listMob.js
 * @description Instancie les monstres de base disponibles pour le combat et les
 * exporte sous forme de dictionnaire structuré selon leur rareté (normal, élite, boss).
 */

// Importation de la classe générique Mob
import Mob from "./class/Mob.class.js";

/**
 * INSTANCIATION DES MONSTRES PAR RARETÉ
 */

// Abeille_White : Monstre de type Normal (Calibré pour les bas niveaux)
const AbeilleWhite2 = new Mob("Abeille_White", "abeille_white", "normal");

// Lapin_Elite : Monstre Élite (Statistiques intermédiaires)
const LapinElite = new Mob("Lapin_Elite", "lapin_elite", "elite");

// Cerf_Boss : Le grand patron de la forêt (Statistiques et récompenses maximales)
const CerfBoss = new Mob("Cerf_Boss", "cerf_boss", "boss");

/**
 * VÉRIFICATION DE LA GÉNÉRATION DYNAMIQUE
 * Affiche sous forme de tableau les statistiques calculées de l'abeille normale à des fins de debug.
 */
console.table({
  normal_LVL: AbeilleWhite2.level,
  normal_GOLD: AbeilleWhite2.gold,
  normal_EXPERIENCE: AbeilleWhite2.experience,
  normal_LIFE: AbeilleWhite2.life,
  normal_STRONG: AbeilleWhite2.strong,
  normal_ATK: AbeilleWhite2.attack(),
});

/**
 * LISTE GLOBALE DES MONSTRES DISPONIBLES
 * Regroupe et structure les créatures par catégorie de rareté.
 * @type {{normal: Mob[], elite: Mob[], boss: Mob[]}}
 */
const ListMob = {
  normal: [AbeilleWhite2],
  elite: [LapinElite],
  boss: [CerfBoss],
};

// Exportation de la liste des monstres pour injection dans la boucle de jeu principale
export default ListMob;
