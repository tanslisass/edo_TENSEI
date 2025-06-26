const Jimp = require("jimp");
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
    config: {
        name: "kiss",
        aliases: ["kiss"],
        version: "1.0",
        author: "♡︎ 𝐻𝐴𝑆𝐴𝑁 ♡︎",
        countDown: 5,
        role: 0,
        shortDescription: "KISS",
        longDescription: "Send a kiss image with 2 people.",
        category: "fun",
        guide: "{pn} tag or reply"
    },

    onStart: async function ({ api, message, event, usersData }) {
        const uid = event.senderID;
        const mention = Object.keys(event.mentions);
        const uid1 = Object.keys(event.mentions)[0];
        const uid2 = event.messageReply ? event.messageReply.senderID : null;
        const uids = uid1 || uid2;
           if (!uids) return message.reply("😘 | Tag or reply to someone you want to kiss.");
             let two = uid, one = uids;
      
              if (mention.length === 2) {
                     one = mention[1];
                     two = mention[0];
              }

 

        try {
            const avatarURL1 = await usersData.getAvatarUrl(one);
            const avatarURL2 = await usersData.getAvatarUrl(two);

            if (!avatarURL1 || !avatarURL2) {
                return message.reply("Couldn't fetch user avatars.");
            }

            // ছবি ডাউনলোড করা
            const avatar1 = await Jimp.read((await axios({ url: avatarURL1, responseType: "arraybuffer" })).data);
            const avatar2 = await Jimp.read((await axios({ url: avatarURL2, responseType: "arraybuffer" })).data);
            
            // ব্যাকগ্রাউন্ড সেট করা (কাস্টম ব্যাকগ্রাউন্ড ইউআরএল)
            const background = await Jimp.read("https://i.imgur.com/pLubFCh.jpeg");

            // ব্যাকগ্রাউন্ড রিসাইজ
            background.resize(495, 619);
            
            // অ্যাভাটার রাউন্ড করা এবং যোগ করা
            avatar1.resize(110, 110).circle();
            avatar2.resize(110, 110).circle();
            
            background.composite(avatar1, 100, 130);  // প্রথম ইউজারের ইমেজ বসানো
            background.composite(avatar2, 250, 100);  // দ্বিতীয় ইউজারের ইমেজ বসানো
            
            // ফাইল সেভ করা
            const imagePath = path.join(__dirname, "tmp", `${one}_${two}_kiss.png`);
            await background.writeAsync(imagePath);

            // পাঠানো
            message.reply({
                body: "Ummmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmaaaaaaaaaaaaaaaaaaahhhhhhhhh bbz 😘😽🥵",
                attachment: fs.createReadStream(imagePath)
            }, () => fs.unlinkSync(imagePath));
            
        } catch (error) {
            console.error(error);
            message.reply("Something went wrong while generating the image.");
        }
    }
};
