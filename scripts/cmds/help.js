const { commands } = global.GoatBot;
const { getPrefix } = global.utils;

module.exports = {
  config: {
    name: "help",
    version: "1.2",
    author: "Karma",
    role: 0,
    shortDescription: { fr: "Grimoire des Commandes disponibles" },
    longDescription: { fr: "Affiche les aptitudes classées par catégorie pour tous les Éveillés" },
    category: "🧾 Système",
    guide: { fr: "{pn}" }
  },

  onStart: async function ({ message, event }) {
    const prefix = getPrefix(event.threadID);
    const allCommands = Array.from(commands.values());
    const byCategory = {};

    for (const cmd of allCommands) {
      const category = cmd.config.category || "Divers";
      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(cmd.config.name);
    }

    let response = `🌑 *Grimoire des Aptitudes – Éveil des Commandes*\n`;
    response += `━━━━━━━━━━━━━━━━━━━━━━\n`;

    for (const cat of Object.keys(byCategory).sort()) {
      const cmds = byCategory[cat].sort((a, b) => a.localeCompare(b));
      response += `📚 *${cat.toUpperCase()}*\n`;
      response += cmds.map(name => `🔹 \`${prefix}${name}\``).join("\n") + "\n\n";
    }

    response += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    response += `📜 Utilise \`${prefix}help <nom>\` pour les détails d’une aptitude\n`;
    response += `༒ Grimoire forgé par : ʚɸɞ Tānslīsãss Kãrmä ʚɸɞ`;

    message.reply(response);
  }
};
