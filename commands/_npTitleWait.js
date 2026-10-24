/*CMD
command: /npTitleWait
help: Internal — receives the poll title reply (need_reply)
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np) { return; }

var txt = String(message == null ? "" : message).trim();

// Commands are never data (Bots.Business cancels the pending wait for known commands anyway)
if (!txt || txt.charAt(0) === "/") { Bot.runCommand("/npTitle"); return; }

if (txt.length < 3 || txt.length > 100) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴛʜᴇ ᴛɪᴛʟᴇ ᴍᴜꜱᴛ ʙᴇ <b>3–100</b> ᴄʜᴀʀᴀᴄᴛᴇʀꜱ. ʏᴏᴜ ꜱᴇɴᴛ " + txt.length + ".\n\n📝 ꜱᴇɴᴅ ᴛʜᴇ <b>ᴛɪᴛʟᴇ</b> ᴀɢᴀɪɴ:",
    kb: [[{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  Bot.runCommand("/npTitleWait");
  return;
}

np.title = txt;
np.step = "desc";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npDesc");
