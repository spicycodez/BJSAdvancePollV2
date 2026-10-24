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

var t = "👀 <b>ᴘʀᴇᴠɪᴇᴡ</b>\n━━━━━━━━━━━━━━\n\n";
t += "📊 <b>" + esc(np.title) + "</b>\n";
if (np.desc) { t += "<i>" + esc(np.desc) + "</i>\n"; }
t += "\n";
for (var i = 0; i < np.options.length; i++) {
  t += "▫▫▫▫▫▫▫▫▫▫ " + (i + 1) + ". <b>" + esc(np.options[i]) + "</b>\n";
}
t += "\n👥 ᴛᴏᴛᴀʟ ᴠᴏᴛᴇꜱ: 0 • 🟢 ʟɪᴠᴇ\n";
t += "📣 ᴘᴏꜱᴛᴇᴅ ᴛᴏ: <b>" + esc(np.channel) + "</b>\n";
if (np.sponsors && np.sponsors.length) {
  t += "🔒 ꜱᴘᴏɴꜱᴏʀꜱ: ";
  for (var j = 0; j < np.sponsors.length; j++) {
    t += "@" + esc(np.sponsors[j].user) + (j < np.sponsors.length - 1 ? ", " : "");
  }
  t += "\n";
} else {
  t += "🔒 ꜱᴘᴏɴꜱᴏʀꜱ: ɴᴏɴᴇ\n";
}
t += "\n━━━━━━━━━━━━━━\nᴘᴜʙʟɪꜱʜ ɴᴏᴡ?";

var kb = [
  [{ title: "🚀 ᴘᴜʙʟɪꜱʜ ᴘᴏʟʟ", command: "/npPublish" }],
  [
    { title: "📣 ᴄʜᴀɴɴᴇʟ", command: "/npChannel" },
    { title: "🔒 ꜱᴘᴏɴꜱᴏʀꜱ", command: "/npSponsor" }
  ],
  [{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]
];

Bot.runCommand("/render", { text: t, kb: kb });
