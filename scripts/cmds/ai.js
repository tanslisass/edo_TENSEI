const { post, get } = require("axios");
const utils = require("../../utils"); // adapte ce chemin si nécessaire

module.exports = {
  config: {
    name: "ai",
    category: "ai"
  },
  onStart() {},

  onChat: async ({
    message: { reply: r },
    args: a,
    event: { senderID: s, threadID: t, messageReply: msg },
    commandName,
    usersData,
    globalData,
    role
  }) => {
    const cmd = `${module.exports.config.name}`;
    const pref = `${utils.getPrefix(t)}`;
    const pr = [`${pref}${cmd}`, `${cmd}`];
    const _m = "gpt";

    const { name, settings = {}, gender } = await usersData.get(s) || {};
    const ownSettings = settings.own || {};
    const ownKeys = Object.keys(ownSettings);
    const gen = gender === 2 ? 'male' : 'female';
    const sys = settings.system || "helpful";
    const csy = ownKeys.map(key => ({ [key]: ownSettings[key] }));
    let customSystem = [{ default: "tu es un assistant utile" }];
    if (csy.length > 0) customSystem = customSystem.concat(csy);

    let Gpt = await globalData.get(_m);

    if (a[0] && pr.some(x => a[0].toLowerCase() === x)) {
      const p = a.slice(1);
      let assistant = ["lover", "helpful", "friendly", "toxic", "godmode", "horny"];
      const userAssistant = ownKeys.filter(key => ownSettings[key]);
      const ass = assistant.filter(key => !userAssistant.includes(key));
      assistant.push(...userAssistant);

      const models = { 1: "llama", 2: "gemini" };
      let ads = "";

      if (role === 2) {
        ads = `For admin only:\nTo change model use:\n${cmd} model <num>\nTo allow NSFW use:\n${cmd} nsfw on/off`;
      }

      let url;
      if (msg && ["photo", "audio", "sticker"].includes(msg.attachments[0]?.type)) {
        const type = msg.attachments[0].type;
        url = {
          link: msg.attachments[0].url,
          type: (type === "photo" || type === "sticker") ? "image" : "mp3"
        };
      }

      let output = ass.map((key, i) => `${i + 1}. ${key.charAt(0).toUpperCase() + key.slice(1)}`).join("\n");
      if (userAssistant.length > 0) {
        output += `\n\nYour own assistant:\n` +
          userAssistant.map((key, i) => `${i + 1}. ${key.charAt(0).toUpperCase() + key.slice(1)}`).join("\n");
      }

      if (!p.length) return r(
        `Hello ${name}, choose your assistant:\n${output}\nexample: ${cmd} set friendly\n\n${cmd} system <add/delete/update> <system name> <your instructions>\n\nexample:\n${cmd} system add cat You are a cat assistant\n${cmd} delete cat\n\n${ads}`
      );

      const mods = await globalData.get(_m) || { data: {} };
      const [__, _, sy, key, ...rest] = a;
      const value = rest.join(" ");

      if (p[0].toLowerCase() === "system") {
        if (p.length < 2) {
          return r(`Usage:\n${cmd} system <add/delete/update> <system name> <your instructions>\n\nexample:\n${cmd} system add cat You are a cat assistant\n${cmd} system delete cat`);
        }
        if (sy === "add" || sy === "update") {
          if (!key || !value) return r(`Please add system name and system prompt.\nExample: system ${sy} cat "You are a cat assistant"`);
          if (sy === "add" && (assistant.includes(key) || ownKeys.length >= 7 && !ownKeys.includes(key))) return r("You cannot add more systems.");
          settings.own = { ...settings.own, [key]: value };
          await usersData.set(s, { settings: { ...settings, own: settings.own } });
          return r(`System "${key}" ${sy === "add" ? "added" : "updated"} successfully.`);
        }
        if (sy === "delete" && ownKeys.includes(key)) {
          delete settings.own[key];
          await usersData.set(s, { settings: { ...settings, own: settings.own } });
          return r(`System "${key}" deleted successfully.`);
        }
      }

      if (p[0].toLowerCase() === "set" && p[1]?.toLowerCase()) {
        const choice = p[1].toLowerCase();
        if (assistant.includes(choice)) {
          await usersData.set(s, { settings: { ...settings, system: choice } });
          return r(`Assistant changed to ${choice}`);
        }
        return r(`Invalid choice.\n${output}\nExample: ${cmd} set friendly`);
      }

      if (p[0] === 'nsfw') {
        if (role < 2) return r("You don't have permission to use this.");
        const toggle = p[1]?.toLowerCase();
        if (toggle === 'on') {
          mods.data.nsfw = true;
          await globalData.set(_m, mods);
          return r("Successfully turned on NSFW.");
        } else if (toggle === 'off') {
          mods.data.nsfw = false;
          await globalData.set(_m, mods);
          return r("Successfully turned off NSFW.");
        } else {
          return r("Invalid usage: use 'nsfw on' or 'nsfw off'.");
        }
      }

      if (p[0].toLowerCase() === "model") {
        if (role < 2) return r("You don't have permission to use this.");
        const _model = models[p[1]];
        if (_model) {
          try {
            mods.data.model = _model;
            await globalData.set(_m, mods);
            return r(`Successfully changed model to ${_model}`);
          } catch (error) {
            return r(`Error setting model: ${error}`);
          }
        } else {
          return r(`Please choose only number\nAvailable models:\n${Object.entries(models).map(([id, name]) => `${id}: ${name}`).join("\n")}\n\nExample: ${pref}${cmd} model 1`);
        }
      }

      if (!Gpt || Gpt === "undefined") {
        await globalData.create(_m, { data: { model: "llama", nsfw: false } });
        Gpt = await globalData.get(_m);
      }

      const { data: { nsfw, model } } = Gpt;
      const { result, media } = await ai(p.join(" "),
