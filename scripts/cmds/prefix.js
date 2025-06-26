const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "prefix",
    version: "2.0",
    author: "Karma",
    countDown: 5,
    role: 0,
    shortDescription: "Active un nouveau sceau d'invocation",
    longDescription: "Change le préfixe d’invocation mystique pour ton groupe ou le système",
    category: "🔧 Configuration",
    guide: {
      fr: `{pn} <nouveau préfixe> : Modifie ton préfixe actuel
Exemple : {pn} #

{pn} <nouveau> -g : Change le préfixe système global (admin seulement)
Exemple : {pn} # -g

{pn} reset : Réinitialise ton préfixe aux runes d’origine`
    }
  },

  langs: {
    fr: {
      reset: "🔄 Ton sceau d'invocation a été réinitialisé au symbole originel : %1",
      onlyAdmin: "🛡️ Seul un Monarque peut modifier le sceau du système entier.",
      confirmGlobal: "🌀 *Confirmation requise* : Réagis à ce message pour graver ce sceau globalement sur l’ensemble du royaume.",
      confirmThisThread: "🌀 *Confirmation requise* : Réagis pour activer ce nouveau sceau dans ce groupe.",
      successGlobal: "✅ Préfixe global inscrit avec succès : %1",
      successThisThread: "✅ Sceau de ce Donjon activé : %1",
      myPrefix:
        `📜 *Invocation du Sceau mystique* :
        🌐 Sceau global : %1
        🏰 Sceau de ton Donjon : %2`
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) return message.SyntaxError();

    // 🔄 Réinitialisation
    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    // 🎯 Nouvelle proposition de préfixe
    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
      setGlobal: args[1] === "-g"
    };

    // 🛡️ Vérifie droit d’administration
    if (formSet.setGlobal && role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    const confirmation = formSet.setGlobal
      ? getLang("confirmGlobal")
      : getLang("confirmThisThread");

    return message.reply(confirmation, (err, info) => {
      if (!err && info?.messageID) {
        formSet.messageID = info.messageID;
        global.GoatBot.onReaction.set(info.messageID, formSet);
      }
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
      return message.reply(getLang("successThisThread", newPrefix));
    }
  },

  onChat: async function ({ event, message, getLang }) {
    if (event.body?.toLowerCase() === "prefix") {
      return message.reply(getLang(
        "myPrefix",
        global.GoatBot.config.prefix,
        utils.getPrefix(event.threadID)
      ));
    }
  }
};
