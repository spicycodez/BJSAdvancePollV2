/*CMD
command: /myPolls
aliases: /mypolls
help: History dashboard — list of your polls (params: page)
need_reply: false
CMD*/

if (!user) { return; }

var key = "u" + user.id + "_mypolls";
var arr = Bot.getProp(key) || [];

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Drop entries whose poll data is gone
var live = [];
for (var i = 0; i < arr.length; i++) {
  if (Bot.getProp("poll_" + arr[i].id)) { live.push(arr[i]); }
}
if (live.length !== arr.length) {
  Bot.setProp({ name: key, value: live, type: "json" });
}

if (!live.length) {
  Bot.runCommand("/render", {
    text: "📊 <b>ʜɪꜱᴛᴏʀʏ ᴅᴀꜱʜʙᴏᴀʀᴅ</b>\n\nʏᴏᴜ ʜᴀᴠᴇ ɴᴏ ᴘᴏʟʟꜱ ʏᴇᴛ.\nᴄʀᴇᴀᴛᴇ ʏᴏᴜʀ ꜰɪʀꜱᴛ ᴏɴᴇ — ɪᴛ ᴛᴀᴋᴇꜱ ᴀʙᴏᴜᴛ ᴀ ᴍɪɴᴜᴛᴇ! 🚀",
    kb: [
      [{ title: "🆕 ᴄʀᴇᴀᴛᴇ ᴘᴏʟʟ", command: "/npMenu" }],
      [{ title: "🏠 ᴍᴀɪɴ ᴍᴇɴᴜ", command: "/start" }]
    ]
  });
  return;
}

var PER = 5;
var page = parseInt(String(params == null ? "" : params).trim(), 10);
if (isNaN(page) || page < 1) { page = 1; }
var pages = Math.ceil(live.length / PER);
if (page > pages) { page = pages; }

var start = (page - 1) * PER;
var slice = live.slice(start, start + PER);

var t = "📊 <b>ʜɪꜱᴛᴏʀʏ ᴅᴀꜱʜʙᴏᴀʀᴅ</b>\n\n" +
  "ʏᴏᴜ ʜᴀᴠᴇ <b>" + live.length + "</b> ᴘᴏʟʟ(ꜱ) — ᴘᴀɢᴇ " + page + "/" + pages + "\n\n" +
  "ᴛᴀᴘ ᴀ ᴘᴏʟʟ ᴛᴏ ᴍᴀɴᴀɢᴇ ɪᴛ: ⏸ ᴘᴀᴜꜱᴇ • ▶️ ʀᴇꜱᴜᴍᴇ • ⏹ ꜱᴛᴏᴘ • 🙈 ʜɪᴅᴇ ᴠᴏᴛᴇꜱ • 🛡 ʀᴇ-ᴠᴇʀɪꜰʏ • 🗑 ᴅᴇʟᴇᴛᴇ.";

var kb = [];
for (var j = 0; j < slice.length; j++) {
  var meta = slice[j];
  var p = Bot.getProp("poll_" + meta.id);
  if (!p) { continue; }
  var icon = p.status === "live" ? "🟢" : (p.status === "paused" ? "⏸" : "⏹");
  var votes = 0;
  for (var tg in p.votes) { votes++; }
  var label = icon + " " + String(meta.title).slice(0, 22) + " • " + votes + " 🗳";
  kb.push([{ title: label, command: "/pollAdmin " + meta.id }]);
}

var nav = [];
if (page > 1) { nav.push({ title: "⬅️ ᴘʀᴇᴠ", command: "/myPolls " + (page - 1) }); }
if (page < pages) { nav.push({ title: "ɴᴇxᴛ ➡️", command: "/myPolls " + (page + 1) }); }
if (nav.length) { kb.push(nav); }

kb.push([
  { title: "🆕 ᴄʀᴇᴀᴛᴇ ᴘᴏʟʟ", command: "/npMenu" },
  { title: "🏠 ᴍᴀɪɴ ᴍᴇɴᴜ", command: "/start" }
]);

Bot.runCommand("/render", { text: t, kb: kb });
