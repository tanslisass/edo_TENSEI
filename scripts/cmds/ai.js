const { get } = require("axios");
const languageDetect = require("langdetect");

module.exports = {
  config: {
    name: "ai",
    version: "1.0",
    author: "Karma",
    role: 0,
    shortDescription: {
      fr: "Entité éveillée qui répond à toutes les questions"
    },
    longDescription: {
      fr: "Invoque une IA mystique qui répond dans la langue détectée, comme ChatGPT"
    },
    category: "📖 Invocation",
    guide: {
      fr: "{pn} <ta question>"
    }
  },

  onStart: async function ({ args, message, event }) {
    if (!args[0]) {
      return message.reply(
        `🔮 *Invocation de l’IA éveillée en cours...*\n` +
        `📝 Pose-moi une question sur n’importe quel sujet.\n` +
        `🌐 Je répondrai en français ou en anglais selon ta question.\n\n` +
        `💡 Exemples :\n` +
        `   .ai Quel est le sens de la vie ?\n` +
        `   .ai What is quantum entanglement?`
      );
    }

    const prompt = args.join(" ");
    const lang = languageDetect.detectOne(prompt);
    const targetLang = lang === "fr" ? "fr" : "en";

    message.reply(`⏳ *Analyse de ta requête...* (langue détectée : ${targetLang.toUpperCase()})`);

    try {
      const response = await get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=${targetLang}`);
      const answer = response.data.success || "Je n’ai pas trouvé de réponse, mais je continue d’apprendre...";

      const aura = targetLang === "fr"
        ? `📜 *Réponse depuis le Grimoire des Ombres* :`
        : `📖 *Whispers from the Shadow Codex* :`;

      return message.reply(`${aura}\n\n${answer}`);
    } catch (err) {
      console.error("Erreur AI:", err);
      return message.reply("❌ Une erreur est survenue dans l'invocation.");
    }
  }
};
