/*CMD
command: /npTitle
help: Builder step 1 — ask for the poll title (renders the prompt)
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np) { Bot.runCommand("/npMenu"); return; }

np.step = "title";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/render", {
  text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 1/5\n\n" +
    "📝 ꜱᴇɴᴅ ᴍᴇ ᴛʜᴇ <b>ᴛɪᴛʟᴇ</b> ᴏꜰ ʏᴏᴜʀ ᴘᴏʟʟ ᴀꜱ ᴀ ᴍᴇꜱꜱᴀɢᴇ.\n\n" +
    "<i>ᴇxᴀᴍᴘʟᴇ: ᴡᴇᴇᴋʟʏ ᴄᴏᴍᴍᴜɴɪᴛʏ ᴄʜᴏɪᴄᴇ ᴀᴡᴀʀᴅꜱ</i>\n\n" +
    "ᴄʜᴀʀᴀᴄᴛᴇʀꜱ: 3–100.",
  kb: [[{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
});

// Arm the reply listener — its BJS runs after the user's next message
Bot.runCommand("/npTitleWait");
