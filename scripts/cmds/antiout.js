module.exports = {
  config: {
    name: "antiout",
    version: "1.1",
    author: "Karma",
    countDown: 5,
    role: 0,
    shortDescription: "Active ou désactive le rappel des membres fuyards",
    longDescription: "Empêche quiconque de quitter le groupe sans en être marqué par le système.",
    category: "🛡️ Défense du groupe",
    guide: "{pn} [on | off]",
    envConfig: {
      deltaNext: 5
    }
  },

  onStart: async function ({ message, event, threadsData, args }) {
    let antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }

    if (!["on", "off"].includes(args[0])) {
      return message.reply("📜 Utilisation correcte : .antiout on ou .antiout off");
    }

    await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");

    return message.reply(
      args[0] === "on"
        ? "🩸 *Anti-Fuite activé* : Aucun Éveillé ne quittera le Donjon sans y être rappelé."
        : "🚪 *Anti-Fuite désactivé* : Les portails de sortie sont désormais ouverts..."
    );
  },

  onEvent: async function ({ api, event, threadsData }) {
    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    const userId = event.logMessageData?.leftParticipantFbId;

    if (antiout && userId) {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const stillHere = threadInfo.participantIDs.includes(userId);

      if (!stillHere) {
        try {
          await api.addUserToGroup(userId, event.threadID);
          console.log(`⚔️ Invocation inversée : L'Éveillé ${userId} a été rappelé sur
