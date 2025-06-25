module.exports = {
  config: {
    name: "banque",
    version: "1.0",
    author: "Karma",
    role: 0,
    shortDescription: {
      fr: "Affiche le classement des Éveillés les plus riches"
    },
    longDescription: {
      fr: "Montre le top des utilisateurs ayant les soldes bancaires les plus élevés"
    },
    category: "💰 Banque",
    guide: {
      fr: "{pn} top"
    }
  },

  onStart: async function ({ message, args, usersData }) {
    const type = args[0]?.toLowerCase();

    if (type !== "top") {
      return message.reply("📌 Utilisation : .banque top");
    }

    const allUsers = await usersData.getAll();
    const classement = [];

    for (const user of allUsers) {
      const banking = user.banking || { balance: 0 };
      if (banking.balance > 0) {
        classement.push({
          id: user.userID,
          name: user.name || "Éveillé inconnu",
          solde: banking.balance
        });
      }
    }

    classement.sort((a, b) => b.solde - a.solde);
    const topList = classement.slice(0, 10);

    if (topList.length === 0) {
      return message.reply("🪙 Aucun compte actif n’a encore été détecté dans le Donjon.");
    }

    const tableau = topList
      .map((u, i) => `🏅 ${i + 1}. ${u.name} — ${u.solde.toLocaleString("fr-FR")} FCFA`)
      .join("\n");

    return message.reply(
      "🏆 *Classement des Éveillés les plus riches*\n━━━━━━━━━━━━━━━━━━\n" +
      tableau +
      "\n━━━━━━━━━━━━━━━━━━\n" +
      "💼 Ouvre ton coffre avec `.solde`"
    );
  }
};
