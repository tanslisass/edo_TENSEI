const axios = require("axios");
const franc = require("franc");

module.exports = {
  config: {
    name: "ai",
    version: "1.1",
    author: "Karmageddon",
    role: 0,
    shortDescription: { fr: "Pose une question à l’Esprit éveillé" },
    longDescription: {
      fr: "Répond à toute question comme une entité éveillée multilingue, sans clé API."
    },
    category: "📖 Invocation",
    guide: {
      fr: "+ai <ta question>"
    },
  },

  onStart: async function ({ args, message, event, api }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply(
        `👁️ *Invocation du Codex…*\n` +
        `📘 Utilisation : \`+ai <ta question>\`\n` +
        `💬 Exemple : \`+ai Quelle est la source du mana ?\``
      );
    }

    // 🔍 Langue plus précise avec franc
    const codeLang = franc(prompt);
    const lang = {
      fra: "fr",
      eng: "en",
      spa: "es",
      por: "pt",
      ita: "it",
      rus: "ru",
      deu: "de"
    }[codeLang] || "en";

    const eyeURL = "https://i.imgur.com/pM8Dj6T.png";
    await api.sendMessage({ attachment: await global.utils.getStreamFromURL(eyeURL) }, event.threadID);

    try {
      const res = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=${lang}`);
      const reply = res?.data?.success || "⛔ Cette vérité m’échappe encore...";

      const title = lang === "fr"
        ? "📜 *Voix du Grimoire Éveillé* :"
        : "📖 *Whisper from the Awakened Tome* :";

      return message.reply(`${title}\n\n${reply}`);
    } catch (err) {
      console.error("Erreur SimSimi:", err);
      return message.reply(lang === "fr"
        ? "❌ *Le Grimoire s’est refermé… Essaie plus tard.*"
        : "❌ *The Tome closed abruptly... Try again later.*");
    }
  }
};
