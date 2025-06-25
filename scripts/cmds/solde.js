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
  category: "Banque", // ou "💰 Banque" si accepté
  guide: {
    fr: "{pn} — Affiche ton solde bancaire actuel"
  }
}
,

  onStart: async function ({ event, message, usersData }) {
  const userData = await usersData.get(event.senderID) || {};
  userData.banking ??= { balance: 0 };

  // Met à jour le profil si le coffre est nouveau
  await usersData.set(event.senderID, userData);

  const name = userData.name || "Éveillé inconnu";
  const fcfa = userData.banking.balance.toLocaleString("fr-FR");

  return message.reply(
    `💳 *Banque des Éveillés – Coffre de :* ${name}\n` +
    `━━━━━━━━━━━━━━━━━━\n` +
    `💰 *Solde actuel* : ${fcfa} FCFA\n` +
    `🔐 *Gardé dans l'Ombre du Donjon* 🩸`
  );
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
