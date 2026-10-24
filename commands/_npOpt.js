/*CMD
command: /npOpt
help: Builder step 3 — show the options cart (one option per message)
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }

if (!np.options) { np.options = []; }
np.step = "opt";
Bot.setProp({ name: key, value: np, type: "json" });

var CFG = Bot.getProp("cfg") || {};
var MAXO = CFG.max_options || 10;

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cartText(note) {
  var t = "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 3/5\n🛒 <b>ᴏᴘᴛɪᴏɴꜱ ᴄᴀʀᴛ</b>\n\n";
  if (note) { t += note + "\n"; }
  if (!np.options.length) {
    t += "ᴛʜᴇ ᴄᴀʀᴛ ɪꜱ ᴇᴍᴘᴛʏ.\nꜱᴇɴᴅ ʏᴏᴜʀ <b>ꜰɪʀꜱᴛ ᴏᴘᴛɪᴏɴ</b> ᴀꜱ ᴀ ᴍᴇꜱꜱᴀɢᴇ.\n\n" +
      "<i>ᴇxᴀᴍᴘʟᴇ: ᴘɪᴢᴢᴀ</i> — ᴛʜᴇɴ ᴊᴜꜱᴛ ᴋᴇᴇᴘ ꜱᴇɴᴅɪɴɢ ᴍᴏʀᴇ.";
  } else {
    t += "ᴄᴜʀʀᴇɴᴛ ᴏᴘᴛɪᴏɴꜱ:\n";
    for (var i = 0; i < np.options.length; i++) {
      t += "  " + (i + 1) + ". " + esc(np.options[i]) + "\n";
    }
    t += "\nꜱᴇɴᴅ ᴛʜᴇ <b>ɴᴇxᴛ ᴏᴘᴛɪᴏɴ</b> ᴀꜱ ᴀ ᴍᴇꜱꜱᴀɢᴇ, ᴏʀ ᴜꜱᴇ ᴛʜᴇ ʙᴜᴛᴛᴏɴꜱ ʙᴇʟᴏᴡ.\n" +
      "ᴍɪɴɪᴍᴜᴍ 2 ᴏᴘᴛɪᴏɴꜱ • ᴍᴀxɪᴍᴜᴍ " + MAXO + ".";
  }
  return t;
}

function cartKb() {
  var kb = [];
  var row = [];
  if (np.options.length) {
    row.push({ title: "🗑 ʀᴇᴍᴏᴠᴇ ʟᴀꜱᴛ", command: "/npOptRm" });
    if (np.options.length >= 2) {
      row.push({ title: "✅ ᴅᴏɴᴇ (" + np.options.length + ")", command: "/npOptDone" });
    }
  }
  if (row.length) { kb.push(row); }
  kb.push([{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]);
  return kb;
}

Bot.runCommand("/render", { text: cartText(""), kb: cartKb() });

// Arm the reply listener — its BJS runs after the user's next message
Bot.runCommand("/npOptWait");
