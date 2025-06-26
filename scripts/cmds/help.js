module.exports = {
  config: {
    name: "help",
    version: "1.0",
    author: "Karma",
    role: 0,
    shortDescription: {
      fr: "Révèle les arts secrets du système"
    },
    longDescription: {
      fr: "Affiche les commandes disponibles à l’Éveillé selon son niveau d’autorité"
    },
    category: "🧾 Système",
    guide: {
      fr: "{pn} [nom_de_commande]"
    }
  },

  onStart: async function ({ message, commandName, event, commands, args, role }) {
    const prefix = global.GoatBot.config?.prefix || ".";
    const nomUtilisateur = (await global.controllers.usersData.get(event.senderID))?.name || "Éveillé inconnu";

    if (!args[0]) {
      const parCatégorie = {};

      for (const [, command] of commands) {
        const { category, name } = command.config;
        if (!category) continue;

        if (!parCatégorie[category]) parCatégorie[category] = [];
        parCatégorie[category].push(name);
      }

      let réponse = `🌑 *Système d’Invocation | Grimoire du Chasseur*\n`;
      réponse += `━━━━━━━━━━━━━━━━━\n`;
      for (const [catégorie, noms] of Object.entries(parCatégorie)) {
        réponse += `📚 ${catégorie} :\n` +
                   noms.map(cmd => `➤ ${prefix}${cmd}`).join("  |  ") +
                   "\n\n";
      }

      réponse += `━━━━━━━━━━━━━━━━━\n`;
      réponse += `💡 Utilise \`${prefix}help <commande>\` pour en savoir plus\n`;
      réponse += `📛 Tu es connecté en tant que : ${nomUtilisateur}\n`;
      réponse += `\n༒ Créateur du Grimoire : ʚɸɞ Tānslīsãss Kãrmä ʚɸɞ`;

      return message.reply(réponse);
    }

    const info = commands.get(args[0]?.toLowerCase());
    if (!info) {
      return message.reply(`⚠️ Aucune compétence trouvée portant le nom "${args[0]}".`);
    }

    const cmd = info.config;
    return message.reply(
      `📖 *Détail de l’aptitude : ${cmd.name}*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `🔎 Description : ${cmd.longDescription?.fr || cmd.shortDescription?.fr}\n` +
      `📂 Catégorie : ${cmd.category}\n` +
      `📜 Utilisation : ${cmd.guide?.fr || "Non défini"}\n` +
      `\n༒ Conçue par : ʚɸɞ Tānslīsãss Kãrmä ʚɸɞ`
    );
  }
};
