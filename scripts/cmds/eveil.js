module.exports = {
  config: {
    name: "éveil",
    version: "2.1",
    author: "Crepin & Copilot",
    countDown: 5,
    role: 0,
    shortDescription: {
      fr: "Déclenche ton éveil (version animée)"
    },
    longDescription: {
      fr: "Affiche progressivement un profil d’Éveillé dramatique comme dans Solo Leveling."
    },
    category: "🌌 Système",
    guide: {
      fr: "{pn}"
    }
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const user = await usersData.get(event.senderID);
      const userName = user?.name || "Utilisateur inconnu";

      const classes = ["Maître des Ombres", "Épéiste spectral", "Mage du Néant", "Roi du Chaos", "Sentinelle Astrale"];
      const titres = ["Le Monarque Silencieux", "L’Éveillé du Néant", "Briseur de Portails", "L’Ascension Perdue", "Dompteur d’Obscurité"];
      const pouvoirs = ["Éclipse Totale", "Lame Astrale", "Lien Sanguin", "Distorsion Temporelle", "Hurlement d’Outre-Monde"];
      const rangs = ["C", "B", "A", "S", "S+", "SSS"];

      const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

      const lines = [
        "🔓 *Connexion au système d'Éveil...*",
        `👤 Utilisateur : ${userName}`,
        "⚡ Synchronisation du flux magique...",
        `🏅 Rang détecté : ${random(rangs)}`,
        `⚔️ Classe assignée : ${random(classes)}`,
        `🧬 Compétence unique : ${random(pouvoirs)}`,
        `👑 Titre éveillé : ${random(titres)}`,
        "🩸 *\"Le système vous reconnaît comme une menace potentielle...\"*"
      ];

      for (let i = 0; i < lines.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        await api.sendMessage(lines[i], event.threadID);
      }
    } catch (err) {
      console.error("Erreur dans la commande éveil :", err);
      api.sendMessage("❌ Une anomalie a perturbé le Rituel d'Éveil...", event.threadID);
    }
  }
};
