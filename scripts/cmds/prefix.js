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

 onChat: async function ({ event, message }) {
  if (event.body?.toLowerCase() === "prefix") {
    const globalPrefix = global.GoatBot.config.prefix;
    const localPrefix = utils.getPrefix(event.threadID);

    const reply = 
      `🔮 *Sceau d’Invocation détecté...*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🌐 Préfixe global : \`${globalPrefix}\`\n` +
      `🏰 Préfixe de ce Donjon : \`${localPrefix}\`\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⚙️ Utilise le préfixe pour déclencher tes rituels :\n` +
      `   \`${localPrefix}help\`, \`${localPrefix}banque\`, \`${localPrefix}quête\`, ...\n\n` +
      `༒ Gardien du Sceau : ʚɸɞ Tānslīsãss Kãrmä ʚɸɞ`;

    return message.reply(reply);
  }
}

};

















/*
const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: "Thay đổi dấu lệnh của bot trong box chat của bạn hoặc cả hệ thống bot (chỉ admin bot)",
		category: "config",
		guide: {
			vi: "   {pn} <new prefix>: thay đổi prefix mới trong box chat của bạn"
				+ "\n   Ví dụ:"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <new prefix> -g: thay đổi prefix mới trong hệ thống bot (chỉ admin bot)"
				+ "\n   Ví dụ:"
				+ "\n    {pn} # -g"
				+ "\n\n   {pn} reset: thay đổi prefix trong box chat của bạn về mặc định",
			en: "   {pn} <new prefix>: change new prefix in your box chat"
				+ "\n   Example:"
				+ "\n    {pn} #"
				+ "\n\n   {pn} <new prefix> -g: change new prefix in system bot (only admin bot)"
				+ "\n   Example:"
				+ "\n    {pn} # -g"
				+ "\n\n   {pn} reset: change prefix in your box chat to default"
		}
	},

	langs: {
		vi: {
			reset: "Đã reset prefix của bạn về mặc định: %1",
			onlyAdmin: "Chỉ admin mới có thể thay đổi prefix hệ thống bot",
			confirmGlobal: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix của toàn bộ hệ thống bot",
			confirmThisThread: "Vui lòng thả cảm xúc bất kỳ vào tin nhắn này để xác nhận thay đổi prefix trong nhóm chat của bạn",
			successGlobal: "Đã thay đổi prefix hệ thống bot thành: %1",
			successThisThread: "Đã thay đổi prefix trong nhóm chat của bạn thành: %1",
			myPrefix: "🌐 Prefix của hệ thống: %1\n🛸 Prefix của nhóm bạn: %2"
		},
		en: {
			reset: "Your prefix has been reset to default: %1",
			onlyAdmin: "Only admin can change prefix of system bot",
			confirmGlobal: "Please react to this message to confirm change prefix of system bot",
			confirmThisThread: "Please react to this message to confirm change prefix in your box chat",
			successGlobal: "Changed prefix of system bot to: %1",
			successThisThread: "Changed prefix in your box chat to: %1",
			myPrefix: "🌐 System prefix: %1\n🛸 Your box chat prefix: %2"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0])
			return message.SyntaxError();

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g")
			if (role < 2)
				return message.reply(getLang("onlyAdmin"));
			else
				formSet.setGlobal = true;
		else
			formSet.setGlobal = false;

		return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author)
			return;
		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix")
			return () => {
				return message.reply(getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID)));
			};
	}
};

*/
