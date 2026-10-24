/*CMD
command: /npOptWait
help: Internal — receives the next poll option (need_reply)
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { return; }
if (!np.options) { np.options = []; }

var CFG = Bot.getProp("cfg") || {};
var MAXO = CFG.max_options || 10;

var txt = String(message == null ? "" : message).trim();

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cartText(note) {
  var t = "🏗 <b>ᴘᴏʟʟ ʙᴜɪʟᴅᴇʀ</b> — ꜱᴛᴇᴘ 3/5\n🛒 <b>ᴏᴘᴛɪᴏɴꜱ ᴄᴀʀᴛ</b>\n\n";
  if (note) { t += note + "\n"; }
  t += "ᴄᴜʀʀᴇɴᴛ ᴏᴘᴛɪᴏɴꜱ:\n";
  for (var i = 0; i < np.options.length; i++) {
    t += "  " + (i + 1) + ". " + esc(np.options[i]) + "\n";
  }
  t += "\nꜱᴇɴᴅ ᴛʜᴇ <b>ɴᴇxᴛ ᴏᴘᴛɪᴏɴ</b> ᴀꜱ ᴀ ᴍᴇꜱꜱᴀɢᴇ, ᴏʀ ᴜꜱᴇ ᴛʜᴇ ʙᴜᴛᴛᴏɴꜱ ʙᴇʟᴏᴡ.\n" +
    "ᴍɪɴɪᴍᴜᴍ 2 ᴏᴘᴛɪᴏɴꜱ • ᴍᴀxɪᴍᴜᴍ " + MAXO + ".";
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

if (!txt || txt.charAt(0) === "/") { Bot.runCommand("/npOpt"); return; }

if (txt.length > 32) {
  Bot.runCommand("/render", { text: cartText("⚠️ ᴏᴘᴛɪᴏɴ ᴛᴏᴏ ʟᴏɴɢ (" + txt.length + "/32). ꜱᴇɴᴅ ᴀ ꜱʜᴏʀᴛᴇʀ ᴏɴᴇ:"), kb: cartKb() });
  Bot.runCommand("/npOptWait");
  return;
}

if (np.options.indexOf(txt) >= 0) {
  Bot.runCommand("/render", { text: cartText("⚠️ <b>" + esc(txt) + "</b> ɪꜱ ᴀʟʀᴇᴀᴅʏ ɪɴ ᴛʜᴇ ᴄᴀʀᴛ. ꜱᴇɴᴅ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴏɴᴇ:"), kb: cartKb() });
  Bot.runCommand("/npOptWait");
  return;
}

np.options.push(txt);
np.step = "opt";
Bot.setProp({ name: key, value: np, type: "json" });

if (np.options.length >= MAXO) {
  Bot.runCommand("/npOptDone");
  return;
}

Bot.runCommand("/render", { text: cartText("✅ ᴀᴅᴅᴇᴅ <b>" + esc(txt) + "</b> ᴛᴏ ᴛʜᴇ ᴄᴀʀᴛ!"), kb: cartKb() });
Bot.runCommand("/npOptWait");
