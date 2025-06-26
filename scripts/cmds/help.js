module.exports = {
  config: {
    name: "help",
    version: "5.0",
    author: "Karmageddon - Codex du Néant",
    role: 0,
    shortDescription: {
      fr: "Grimoire mystique des Invocations"
    },
    longDescription: {
      fr: "Affiche la liste des commandes comme des artefacts runiques classés par rareté et élément magique."
    },
    category: "📖 Codex",
    guide: {
      fr: "{pn} ou {pn} <commande>"
    }

  },

  onStart: async function ({ args, commands, message }) {
    if (args.length === 0) {
      let codex = `👁️ *Codex des Reliques de l’Ombre – Grimoire de Karmageddon*\n━━━━━━━━━━━━━━━━━━━━━━\n`;

      const auraTiers = {
        "Éveillé": { emoji: "💠", sort: 0, list: [] },
        "Légendaire": { emoji: "🟪", sort: 1, list: [] },
        "Rare": { emoji: "🔵", sort: 2, list: [] },
        "Commune": { emoji: "🟡", sort: 3, list: [] }
      };

      const elementEmoji = {
        "Ombre": "🌑",
        "Feu": "🔥",
        "Glace": "❄️",
        "Mana": "💧",
        "Foudre": "⚡",
        "Nature": "🌿",
        "Âme": "🧿",
        "Lumière": "🌕",
        "Inconnu": "🌀"
      };

      for (const [name, cmd] of commands) {
        const aura = cmd.config?.aura || "Commune";
        const elem = cmd.config?.element || "Inconnu";
        const icon = elementEmoji[elem] || "🌀";
        auraTiers[aura]?.list.push({
          name,
          desc: cmd.config?.shortDescription?.fr || "Aucune description",
          emoji: icon,
          elem
        });
      }

      const sortedTiers = Object.entries(auraTiers).sort((a, b) => a[1].sort - b[1].sort);
      for (const [tierName, tier] of sortedTiers) {
        if (tier.list.length === 0) continue;
        codex += `\n${tier.emoji} *Artefacts ${tierName}*\n`;
        for (const cmd of tier.list.sort((a, b) => a.name.localeCompare(b.name))) {
          codex += `${cmd.emoji} \`${cmd.name}\` — ${cmd.desc} *(élément : ${cmd.elem})*\n`;
        }
      }

      codex += `\n📜 Tape \`help <commande>\` pour révéler un fragment détaillé du Codex.`;
      return message.reply(codex);
    }

    // Aide ciblée pour une commande
    const name = args[0].toLowerCase();
    const command = commands.get(name);
    if (!command) return message.reply(`❌ *Aucune trace d’un artefact nommé :* \`${name}\``);

    const data = command.config;
    const aura = data.aura || "Commune";
    const elem = data.element || "Inconnu";

    const auraEmoji = {
      "Éveillé": "💠",
      "Légendaire": "🟪",
      "Rare": "🔵",
      "Commune": "🟡"
    }[aura] || "🌀";

    const elemEmoji = {
      "Ombre": "🌑",
      "Feu": "🔥",
      "Glace": "❄️",
      "Mana": "💧",
      "Foudre": "⚡",
      "Nature": "🌿",
      "Âme": "🧿",
      "Lumière": "🌕",
      "Inconnu": "🌀"
    }[elem] || "🌀";

    return message.reply(
      `📖 *Fragment Runique :* \`${data.name}\`\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔮 *Aura :* ${auraEmoji} ${aura}\n` +
      `🌌 *Élément :* ${elemEmoji} ${elem}\n` +
      `💬 *Description :* ${data.longDescription?.fr || data.shortDescription?.fr || "Non documentée"}\n` +
      `🧾 *Usage :* ${data.guide?.fr || "Incantation inconnue"}`
    );
  }
};
