/*CMD
command: /pollAdmin
help: Per-poll control panel (params: pollId)
need_reply: false
CMD*/

if (!user) { return; }

var pollId = (options && options.pollId) || String(params == null ? "" : params).trim().split(/\s+/)[0];
var poll = Bot.getProp("poll_" + pollId);

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

if (!poll) {
  Bot.runCommand("/render", {
    text: "⚠️ ᴘᴏʟʟ ɴᴏᴛ ꜰᴏᴜɴᴅ — ɪᴛ ᴍᴀʏ ʜᴀᴠᴇ ʙᴇᴇɴ ᴅᴇʟᴇᴛᴇᴅ.",
    kb: [[{ title: "⬅️ ᴍʏ ᴘᴏʟʟꜱ", command: "/myPolls" }]]
  });
  return;
}

if (poll.owner_bbid !== user.id) {
  Bot.runCommand("/render", {
    text: "🚫 <b>ᴀᴄᴄᴇꜱꜱ ᴅᴇɴɪᴇᴅ</b>\n\nᴏɴʟʏ ᴛʜᴇ ᴘᴏʟʟ ᴏᴡɴᴇʀ ᴄᴀɴ ᴍᴀɴᴀɢᴇ ᴛʜɪꜱ ᴘᴏʟʟ.",
    kb: [[{ title: "⬅️ ᴍʏ ᴘᴏʟʟꜱ", command: "/myPolls" }]]
  });
  return;
}

var votes = 0;
for (var tg in poll.votes) { votes++; }

var statusIcon = poll.status === "live" ? "🟢 ʟɪᴠᴇ" : (poll.status === "paused" ? "⏸ ᴘᴀᴜꜱᴇᴅ" : "⏹ ᴇɴᴅᴇᴅ");
var created = "";
try { created = new Date(poll.created).toISOString().slice(0, 16).replace("T", " ") + " ᴜᴛᴄ"; } catch (e) {}

var t = "⚙️ <b>ᴘᴏʟʟ ᴄᴏɴᴛʀᴏʟ</b>\n━━━━━━━━━━━━━━\n\n" +
  "📊 <b>" + esc(poll.title) + "</b>\n" +
  "ꜱᴛᴀᴛᴜꜱ: <b>" + statusIcon + "</b>\n" +
  "ᴠᴏᴛᴇꜱ: <b>" + votes + "</b>" + (poll.stats.removed ? " • 🛡 ʀᴇᴍᴏᴠᴇᴅ: " + poll.stats.removed : "") + "\n" +
  "ᴏᴘᴛɪᴏɴꜱ: <b>" + poll.options.length + "</b>\n" +
  "ᴘᴏꜱᴛᴇᴅ: <b>" + esc(poll.channel_title || poll.channel) + "</b> (" + poll.msgs.length + " ᴍꜱɢ)\n" +
  "ᴄᴏᴜɴᴛꜱ: <b>" + (poll.hide ? "🙈 ʜɪᴅᴅᴇɴ" : "👁 ᴠɪꜱɪʙʟᴇ") + "</b>\n" +
  "ᴄʀᴇᴀᴛᴇᴅ: " + created + "\n";

if (poll.sponsors && poll.sponsors.length) {
  t += "🔒 ꜱᴘᴏɴꜱᴏʀꜱ: ";
  for (var s = 0; s < poll.sponsors.length; s++) {
    t += "@" + esc(poll.sponsors[s].user || poll.sponsors[s].title || "?") + (s < poll.sponsors.length - 1 ? ", " : "");
  }
  t += "\n";
}
t += "\n👇 <b>ᴘɪᴄᴋ ᴀɴ ᴀᴄᴛɪᴏɴ:</b>";

var kb = [];

var toggleRow = [];
if (poll.status === "live") {
  toggleRow.push({ title: "⏸ ᴘᴀᴜꜱᴇ", command: "/pollAction " + pollId + " pause" });
} else if (poll.status === "paused") {
  toggleRow.push({ title: "▶️ ʀᴇꜱᴜᴍᴇ", command: "/pollAction " + pollId + " resume" });
}
toggleRow.push({ title: poll.hide ? "👁 ꜱʜᴏᴡ ᴠᴏᴛᴇꜱ" : "🙈 ʜɪᴅᴇ ᴠᴏᴛᴇꜱ", command: "/pollAction " + pollId + (poll.hide ? " show" : " hide") });
kb.push(toggleRow);

if (poll.status !== "stopped") {
  kb.push([{ title: "⏹ ꜱᴛᴏᴘ ᴘᴏʟʟ", command: "/pollAction " + pollId + " stop" }]);
}

kb.push([
  { title: "📈 ꜱᴛᴀᴛꜱ", command: "/pollAction " + pollId + " stats" },
  { title: "🛡 ʀᴇ-ᴠᴇʀɪꜰʏ", command: "/pollAction " + pollId + " sweep" }
]);

kb.push([
  { title: "📢 ʀᴇ-ᴘᴏꜱᴛ", command: "/pollAction " + pollId + " repost" },
  { title: "🗑 ᴅᴇʟᴇᴛᴇ", command: "/pollAction " + pollId + " del" }
]);

kb.push([{ title: "⬅️ ᴍʏ ᴘᴏʟʟꜱ", command: "/myPolls" }]);

Bot.runCommand("/render", { text: t, kb: kb });
