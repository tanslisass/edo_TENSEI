module.exports = {
  config: {
    name: "retrait",
    version: "1.0",
    author: "Karma",
    role: 0,
    shortDescription: {
      fr: "Retirer de l'argent de ton compte bancaire"
    },
    longDescription: {
      fr: "Diminue ton solde bancaire virtuel en FCFA"
    },
    category: "💰 Banque",
    guide: {
      fr: "{pn} <montant>"
    }
  },

  onStart: async function ({ event, message, args, usersData }) {
    const montant = parseInt(args[0]);
    if (isNaN(montant) || montant <= 0) {
      return message.reply("📌 Montant invalide. Exemple : .retrait 2000");
    }

    const userData = await usersData.get(event.senderID);
    if (!userData.banking) {
      userData.banking = { balance: 0 };
    }

    if (userData.banking.balance < montant) {
      return message.reply("⛔ Ton coffre ne contient pas assez de Franc CFA pour ce retrait.");
    }

    userData.banking.balance -= montant;
    await usersData.set(event.senderID, userData);

    const fcfa = userData.banking.balance.toLocaleString("fr-FR");
    return message.reply(
      `📤 *Retrait effectué !*\n` +
      `💸 Montant retiré : ${montant.toLocaleString("fr-FR")} FCFA\n` +
      `📉 Solde restant : ${fcfa} FCFA\n` +
      `⚠️ Ton énergie magique faiblit légèrement...`
    );
  }
};
