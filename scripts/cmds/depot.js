module.exports = {
  config: {
    name: "dépôt",
    version: "1.1",
    author: "Karma",
    role: 0,
    shortDescription: {
      fr: "Déposer de l'argent dans ton compte bancaire"
    },
    longDescription: {
      fr: "Ajoute une somme de FCFA dans ton coffre bancaire virtuel"
    },
    category: "💰 Banque",
    guide: {
      fr: "{pn} <montant>"
    }
  },

  onStart: async function ({ event, message, args, usersData }) {
    const montant = parseInt(args[0]);

    // ⚠️ Vérifie la validité du montant
    if (isNaN(montant) || montant <= 0) {
      return message.reply("📌 Montant invalide.\n💡 Utilisation : .dépôt <montant>");
    }

    // 🔎 Récupération ou création du profil utilisateur
    const userData = await usersData.get(event.senderID) || {};
    userData.banking ??= { balance: 0 };

    // ➕ Ajout du montant
    userData.banking.balance += montant;

    // 💾 Sauvegarde dans la base
    await usersData.set(event.senderID, userData);

    const fcfa = userData.banking.balance.toLocaleString("fr-FR");

    // ✉️ Réponse stylisée
    return message.reply(
      `📥 *Versement confirmé !*\n` +
      `💸 Montant déposé : ${montant.toLocaleString("fr-FR")} FCFA\n` +
      `💳 Nouveau solde : ${fcfa} FCFA\n` +
      `🔐 Ton coffre se renforce dans l’ombre du Donjon...`
    );
  }
};
