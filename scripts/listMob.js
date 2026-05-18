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

// --- MONSTRES NORMAUX (Version White) ---
const AbeilleWhite = new Mob("Abeille_White", "abeille_white", "normal");
const ChatWhite = new Mob("Chat_White", "chat_white", "normal");
const ChienWhite = new Mob("Chien_White", "chien_white", "normal");
const CorbacWhite = new Mob("Corbac_White", "corbac_white", "normal");
const FauconWhite = new Mob("Faucon_White", "faucon_white", "normal");
const GuepesWhite = new Mob("Guepes_White", "guepes_white", "normal");
const LezardWhite = new Mob("Lezard_White", "lezard_white", "normal");
const LoupWhite = new Mob("Loup_White", "loup_white", "normal");
const PandaWhite = new Mob("Panda_White", "panda_white", "normal");
const PhoqueWhite = new Mob("Phoque_White", "phoque_white", "normal");
const RequinWhite = new Mob("Requin_White", "requin_white", "normal");
const RatWhite = new Mob("Rat_White", "rat_white", "normal");

// --- MONSTRES ÉLITES (Version Elite) ---
const ChienElite = new Mob("Chien_Elite", "chien_elite", "elite");
const LapinElite = new Mob("Lapin_Elite", "lapin_elite", "elite");
const LezardElite = new Mob("Lezard_Elite", "lezard_elite", "elite");
const PanthereElite = new Mob("Panthere_Elite", "panthere_elite", "elite");
const RatElite = new Mob("Rat_Elite", "rat_elite", "elite");

// --- MONSTRES BOSS (Version Boss) ---
const CerfBoss = new Mob("Cerf_Boss", "cerf_boss", "boss");
const ChienBoss = new Mob("Chien_Boss", "chien_boss", "boss");
const CorbacBoss = new Mob("Corbac_Boss", "corbac_boss", "boss");
const GuepesBoss = new Mob("Guepes_Boss", "guepes_boss", "boss");
const LapinBoss = new Mob("Lapin_Boss", "lapin_boss", "boss");
const PandaBoss = new Mob("Panda_Boss", "panda_boss", "boss");
const PieuvreBoss = new Mob("Pieuvre_Boss", "pieuvre_boss", "boss");
const RenardBoss = new Mob("Renard_Boss", "renard_boss", "boss");
const RhinoBoss = new Mob("Rhino_Boss", "rhino_boss", "boss");

/**
 * VÉRIFICATION DE LA GÉNÉRATION DYNAMIQUE
 */
console.table({
  normal_LVL: AbeilleWhite.level,
  normal_GOLD: AbeilleWhite.gold,
  normal_EXPERIENCE: AbeilleWhite.experience,
  normal_LIFE: AbeilleWhite.life,
  normal_STRONG: AbeilleWhite.strong,
  normal_ATK: AbeilleWhite.attack(),
});

/**
 * LISTE GLOBALE DES MONSTRES DISPONIBLES
 */
const ListMob = {
  normal: [
    AbeilleWhite, ChatWhite, ChienWhite, CorbacWhite, FauconWhite,
    GuepesWhite, LezardWhite, LoupWhite, PandaWhite, PhoqueWhite,
    RequinWhite, RatWhite
  ],
  elite: [
    ChienElite, LapinElite, LezardElite, PanthereElite, RatElite
  ],
  boss: [
    CerfBoss, ChienBoss, CorbacBoss, GuepesBoss, LapinBoss,
    PandaBoss, PieuvreBoss, RenardBoss, RhinoBoss
  ],
};

// Exportation de la liste des monstres pour injection dans la boucle de jeu principale
export default ListMob;
