/*CMD
command: /npDesc
help: Builder step 2 — optional description
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }

var txt = String(message == null ? "" : message).trim();

function ask() {
  Bot.runCommand("/render", {
    text: "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 2/5\n\n" +
      "🗒 ꜱᴇɴᴅ ᴀɴ ᴏᴘᴛɪᴏɴᴀʟ <b>ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ</b> ꜰᴏʀ ʏᴏᴜʀ ᴘᴏʟʟ,\n" +
      "ᴏʀ ᴛᴀᴘ <b>ꜱᴋɪᴘ</b>.\n\n" +
      "ᴄᴜʀʀᴇɴᴛ ᴛɪᴛʟᴇ: <b>" + esc(np.title) + "</b>\n\n" +
      "ᴍᴀx ʟᴇɴɢᴛʜ: 200 ᴄʜᴀʀᴀᴄᴛᴇʀꜱ.",
    kb: [
      [{ title: "⏭ ꜱᴋɪᴘ", command: "/npDesc skip" }],
      [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
    ]
  });
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// First run or Skip button
if (txt.indexOf("/npDesc") === 0 || txt === "") {
  if (txt.indexOf("skip") >= 0) {
    np.desc = "";
    np.step = "opt";
    Bot.setProp({ name: key, value: np, type: "json" });
    Bot.runCommand("/npOpt");
    return;
  }
  ask();
  return;
}

if (txt === "/npc") { return; }

if (txt.length > 200) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ ᴛᴏᴏ ʟᴏɴɢ (" + txt.length + "/200). ꜱᴇɴᴅ ᴀ ꜱʜᴏʀᴛᴇʀ ᴏɴᴇ:",
    kb: [[{ title: "⏭ ꜱᴋɪᴘ", command: "/npDesc skip" }], [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
  });
  return;
}

np.desc = txt;
np.step = "opt";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npOpt");
