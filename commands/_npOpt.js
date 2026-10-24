/*CMD
command: /npOpt
help: Builder step 3 — options cart (one option per message)
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }

var CFG = Bot.getProp("cfg") || {};
var MAXO = CFG.max_options || 10;

var txt = String(message == null ? "" : message).trim();

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
    row.push({ title: "🗑 ʀᴇᴍᴏᴠᴇ ʟᴀꜱᴛ", command: "/npOpt rm" });
    if (np.options.length >= 2) {
      row.push({ title: "✅ ᴅᴏɴᴇ (" + np.options.length + ")", command: "/npOpt done" });
    }
  }
  if (row.length) { kb.push(row); }
  kb.push([{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]);
  return kb;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// First run / button actions
if (txt.indexOf("/npOpt") === 0 || txt === "") {
  var sub = txt.slice(6).trim(); // "rm", "done" or ""

  if (sub === "done") { Bot.runCommand("/npOptDone"); return; }

  if (sub === "rm") {
    if (np.options.length) {
      var gone = np.options.pop();
      Bot.setProp({ name: key, value: np, type: "json" });
      Bot.runCommand("/render", { text: cartText("🗑 ʀᴇᴍᴏᴠᴇᴅ: <s>" + esc(gone) + "</s>"), kb: cartKb() });
    } else {
      Bot.runCommand("/render", { text: cartText("⚠️ ᴛʜᴇ ᴄᴀʀᴛ ɪꜱ ᴀʟʀᴇᴀᴅʏ ᴇᴍᴘᴛʏ."), kb: cartKb() });
    }
    return;
  }

  Bot.runCommand("/render", { text: cartText(""), kb: cartKb() });
  return;
}

if (txt === "/npc") { return; }

// Answer run: a new option was typed
if (txt.length > 32) {
  Bot.runCommand("/render", { text: cartText("⚠️ ᴏᴘᴛɪᴏɴ ᴛᴏᴏ ʟᴏɴɢ (" + txt.length + "/32). ꜱᴇɴᴅ ᴀ ꜱʜᴏʀᴛᴇʀ ᴏɴᴇ:"), kb: cartKb() });
  return;
}

if (np.options.indexOf(txt) >= 0) {
  Bot.runCommand("/render", { text: cartText("⚠️ <b>" + esc(txt) + "</b> ɪꜱ ᴀʟʀᴇᴀᴅʏ ɪɴ ᴛʜᴇ ᴄᴀʀᴛ. ꜱᴇɴᴅ ᴀ ᴅɪꜰꜰᴇʀᴇɴᴛ ᴏᴘᴛɪᴏɴ:"), kb: cartKb() });
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
