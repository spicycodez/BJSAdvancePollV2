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
    text: "📊 <b>History Dashboard</b>\n\nYou have no polls yet.\nCreate your first one — it takes about a minute! 🚀",
    kb: [
      [{ title: "🆕 Create Poll", command: "/npMenu" }],
      [{ title: "🏠 Main Menu", command: "/start" }]
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

var t = "📊 <b>History Dashboard</b>\n\n" +
  "You have <b>" + live.length + "</b> poll(s) — page " + page + "/" + pages + "\n\n" +
  "Tap a poll to manage it: ⏸ pause • ▶️ resume • ⏹ stop • 🙈 hide votes • 🛡 re-verify • 🗑 delete.";

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
if (page > 1) { nav.push({ title: "⬅️ Prev", command: "/myPolls " + (page - 1) }); }
if (page < pages) { nav.push({ title: "Next ➡️", command: "/myPolls " + (page + 1) }); }
if (nav.length) { kb.push(nav); }

kb.push([
  { title: "🆕 Create Poll", command: "/npMenu" },
  { title: "🏠 Main Menu", command: "/start" }
]);

Bot.runCommand("/render", { text: t, kb: kb });
