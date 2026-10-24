/*CMD
command: /npDescWait
help: Internal — receives the description reply (need_reply)
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { return; }

var txt = String(message == null ? "" : message).trim();

if (!txt || txt.charAt(0) === "/") { Bot.runCommand("/npDesc"); return; }

if (txt.length > 200) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ ᴛᴏᴏ ʟᴏɴɢ (" + txt.length + "/200). ꜱᴇɴᴅ ᴀ ꜱʜᴏʀᴛᴇʀ ᴏɴᴇ:",
    kb: [[{ title: "⏭ ꜱᴋɪᴘ", command: "/npDescSkip" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  Bot.runCommand("/npDescWait");
  return;
}

np.desc = txt;
np.step = "opt";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npOpt");
