/*CMD
command: /npPreview
help: Builder — preview and confirm
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title || !np.options || np.options.length < 2 || !np.channel) {
  Bot.runCommand("/npMenu");
  return;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

var t = "👀 <b>PREVIEW</b>\n━━━━━━━━━━━━━━\n\n";
t += "📊 <b>" + esc(np.title) + "</b>\n";
if (np.desc) { t += "<i>" + esc(np.desc) + "</i>\n"; }
t += "\n";
for (var i = 0; i < np.options.length; i++) {
  t += "▫▫▫▫▫▫▫▫▫▫ " + (i + 1) + ". <b>" + esc(np.options[i]) + "</b>\n";
}
t += "\n👥 Total votes: 0 • 🟢 LIVE\n";
t += "📣 Posted to: <b>" + esc(np.channel) + "</b>\n";
if (np.sponsors && np.sponsors.length) {
  t += "🔒 Sponsors: ";
  for (var j = 0; j < np.sponsors.length; j++) {
    t += "@" + esc(np.sponsors[j].user) + (j < np.sponsors.length - 1 ? ", " : "");
  }
  t += "\n";
} else {
  t += "🔒 Sponsors: none\n";
}
t += "\n━━━━━━━━━━━━━━\nPublish now?";

var kb = [
  [{ title: "🚀 Publish Poll", command: "/npPublish" }],
  [
    { title: "📣 Channel", command: "/npChannel" },
    { title: "🔒 Sponsors", command: "/npSponsor" }
  ],
  [{ title: "✖ Cancel", command: "/npc" }]
];

Bot.runCommand("/render", { text: t, kb: kb });
