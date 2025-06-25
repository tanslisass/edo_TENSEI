module.exports = {
  config: {
    name: "antiout",
    version: "1.2",
    author: "Karma",
    countDown: 5,
    role: 0,
    shortDescription: {
      fr: "Empêche les membres de fuir le Donjon"
    },
    longDescription: {
      fr: "Rappelle automatiquement tout membre qui quitte le groupe, tel un rituel d'ancrage dimensionnel."
    },
    category: "🛡️ Défense du groupe",
    guide: {
      fr: "{pn} on | off"
    },
    envConfig: {
      deltaNext: 5
    }
  },

  onStart: async function ({ message, event, threadsData, args }) {
    const current = await threadsData.get(event.threadID, "settings.antiout");

    if (!["on", "off"].includes(args[0])) {
      return message.reply("📜 Utilisation correcte : `.antiout on` ou `.antiout off`");
    }

    const enable = args[0] === "on";
    await threadsData.set(event.threadID, enable, "settings.antiout");

    return message.reply(
      enable
        ? "🩸 *Sceau de Rappel activé* : aucun Éveillé ne quittera ce Donjon sans être invoqué à nouveau."
        : "🚪 *Sceau de Rappel désactivé* : les portails de sortie sont désormais ouverts..."
    );
  },

  onEvent: async function ({ api, event, threadsData }) {
    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    const userId = event.logMessageData?.leftParticipantFbId;

    if (!antiout || !userId) return;

    try {
      const info = await api.getThreadInfo(event.threadID);
      const encoreLà = info.participantIDs.includes(userId);

      if (!encoreLà) {
        await api.addUserToGroup(userId, event.threadID);
        await api.sendMessage(
          `⚔️ Un Éveillé a tenté de fuir la mission...\n🔁 *Rappel dimensionnel activé.*\n✨ Invocation de retour effectuée.`,
          event.threadID
        );
        console.log(`🌀 Rappel effectué pour l'utilisateur ${userId}`);
      }
    } catch (err) {
      console.log(`❌ Échec du rappel pour ${userId}`);
      await api.sendMessage(
        `❌ *Le rituel de rappel a échoué.*\n⛔ Impossible de ramener l’Éveillé.\n🔍 Vérifie les permissions ou l’état du portail.`,
        event.threadID
      );
    }
  }
};
