/*CMD
command: /npOptDone
help: Builder — finish the options cart, go to channel step
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }

if (!np.options || np.options.length < 2) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴀ ᴘᴏʟʟ ɴᴇᴇᴅꜱ ᴀᴛ ʟᴇᴀꜱᴛ <b>2 ᴏᴘᴛɪᴏɴꜱ</b>. ᴄᴜʀʀᴇɴᴛ: " + (np.options ? np.options.length : 0) + ".\nᴀᴅᴅ ᴍᴏʀᴇ ᴏᴘᴛɪᴏɴꜱ ꜰɪʀꜱᴛ.",
    kb: [[{ title: "🛒 ʙᴀᴄᴋ ᴛᴏ ᴄᴀʀᴛ", command: "/npOpt" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  return;
}

np.step = "channel";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npChannel");
