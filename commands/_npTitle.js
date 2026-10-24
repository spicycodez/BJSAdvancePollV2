/*CMD
command: /npTitle
help: Builder step 1 — poll title
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np) { Bot.runCommand("/npMenu"); return; }

var txt = String(message == null ? "" : message).trim();

// First run (invoked, not an answer): ask the question
if (txt.indexOf("/npTitle") === 0 || txt === "") {
  Bot.runCommand("/render", {
    text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 1/5\n\n" +
      "📝 ꜱᴇɴᴅ ᴍᴇ ᴛʜᴇ <b>ᴛɪᴛʟᴇ</b> ᴏꜰ ʏᴏᴜʀ ᴘᴏʟʟ ᴀꜱ ᴀ ᴍᴇꜱꜱᴀɢᴇ.\n\n" +
      "<i>ᴇxᴀᴍᴘʟᴇ: ᴡᴇᴇᴋʟʏ ᴄᴏᴍᴍᴜɴɪᴛʏ ᴄʜᴏɪᴄᴇ ᴀᴡᴀʀᴅꜱ</i>\n\n" +
      "ᴄʜᴀʀᴀᴄᴛᴇʀꜱ: 3–100.",
    kb: [[{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  return;
}

if (txt === "/npc") { return; }

// Answer run: validate and store
if (txt.length < 3 || txt.length > 100) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴛʜᴇ ᴛɪᴛʟᴇ ᴍᴜꜱᴛ ʙᴇ <b>3–100</b> ᴄʜᴀʀᴀᴄᴛᴇʀꜱ. ʏᴏᴜ ꜱᴇɴᴛ " + txt.length + ".\n\n📝 ꜱᴇɴᴅ ᴛʜᴇ <b>ᴛɪᴛʟᴇ</b> ᴀɢᴀɪɴ:",
    kb: [[{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  return;
}

np.title = txt;
np.step = "desc";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npDesc");
