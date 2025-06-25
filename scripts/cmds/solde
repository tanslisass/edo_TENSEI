module.exports = {
  config: {
    name: "solde",
    version: "1.0",
    author: "Karma",
    role: 0,
    shortDescription: {
      fr: "Consulte ton solde bancaire virtuel"
    },
    longDescription: {
      fr: "Affiche ton solde personnel à la Banque des Éveillés (FCFA)"
    },
    category: "💰 Banque",
    guide: {
      fr: "{pn}"
    }
  },

  onStart: async function ({ event, message, usersData }) {
    const userData = await usersData.get(event.senderID);
    const name = userData.name || "Éveillé inconnu";

    // Initialiser un compte si inexistant
    if (!userData.banking) {
      userData.banking = { balance: 0 };
      await usersData.set(event.senderID, userData);
    }

    const balance = userData.banking.balance || 0;
    const fcfa = balance.toLocaleString("fr-FR");

    return message.reply(
      `💳 *Banque des Éveillés - Coffre de :* ${name}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Solde actuel* : ${fcfa} FCFA\n` +
      `🔐 *Gardé dans l'Ombre du Donjon* 🩸`
    );
  }
};
