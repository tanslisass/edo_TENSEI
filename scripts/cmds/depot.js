module.exports = {
  config: {
    name: "dépôt",
    version: "1.0",
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

    if (isNaN(montant) || montant <= 0) {
      return message.reply("📌 Montant invalide.\n💡 Utilisation : .dépôt <montant>");
      userData.banking.balance += montant;
await usersData.set(event.senderID, userData);

    }

    const userData = await usersData.get(event.senderID);
    if (!userData.banking) {
      userData.banking = { balance: 0 };
    }

    userData.banking.balance += montant;
    await usersData.set(event.senderID, userData);

    const fcfa = userData.banking.balance.toLocaleString("fr-FR");
    return message.reply(
      `📥 *Versement confirmé !*\n` +
      `💸 Montant déposé : ${montant.toLocaleString("fr-FR")} FCFA\n` +
      `💳 Nouveau solde : ${fcfa} FCFA\n` +
      `🔐 Ton coffre se renforce dans l’ombre du Donjon...`
    );
  }
};
