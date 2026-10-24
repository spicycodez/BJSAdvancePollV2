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
    text: "⚠️ Poll not found — it may have been deleted.",
    kb: [[{ title: "⬅️ My Polls", command: "/myPolls" }]]
  });
  return;
}

if (poll.owner_bbid !== user.id) {
  Bot.runCommand("/render", {
    text: "🚫 <b>Access denied</b>\n\nOnly the poll owner can manage this poll.",
    kb: [[{ title: "⬅️ My Polls", command: "/myPolls" }]]
  });
  return;
}

var votes = 0;
for (var tg in poll.votes) { votes++; }

var statusIcon = poll.status === "live" ? "🟢 LIVE" : (poll.status === "paused" ? "⏸ PAUSED" : "⏹ ENDED");
var created = "";
try { created = new Date(poll.created).toISOString().slice(0, 16).replace("T", " ") + " UTC"; } catch (e) {}

var t = "⚙️ <b>POLL CONTROL</b>\n━━━━━━━━━━━━━━\n\n" +
  "📊 <b>" + esc(poll.title) + "</b>\n" +
  "Status: <b>" + statusIcon + "</b>\n" +
  "Votes: <b>" + votes + "</b>" + (poll.stats.removed ? " • 🛡 removed: " + poll.stats.removed : "") + "\n" +
  "Options: <b>" + poll.options.length + "</b>\n" +
  "Posted: <b>" + esc(poll.channel_title || poll.channel) + "</b> (" + poll.msgs.length + " msg)\n" +
  "Counts: <b>" + (poll.hide ? "🙈 hidden" : "👁 visible") + "</b>\n" +
  "Created: " + created + "\n";

if (poll.sponsors && poll.sponsors.length) {
  t += "🔒 Sponsors: ";
  for (var s = 0; s < poll.sponsors.length; s++) {
    t += "@" + esc(poll.sponsors[s].user || poll.sponsors[s].title || "?") + (s < poll.sponsors.length - 1 ? ", " : "");
  }
  t += "\n";
}
t += "\n👇 <b>Pick an action:</b>";

var kb = [];

var toggleRow = [];
if (poll.status === "live") {
  toggleRow.push({ title: "⏸ Pause", command: "/pollAction " + pollId + " pause" });
} else if (poll.status === "paused") {
  toggleRow.push({ title: "▶️ Resume", command: "/pollAction " + pollId + " resume" });
}
toggleRow.push({ title: poll.hide ? "👁 Show votes" : "🙈 Hide votes", command: "/pollAction " + pollId + (poll.hide ? " show" : " hide") });
kb.push(toggleRow);

if (poll.status !== "stopped") {
  kb.push([{ title: "⏹ Stop Poll", command: "/pollAction " + pollId + " stop" }]);
}

kb.push([
  { title: "📈 Stats", command: "/pollAction " + pollId + " stats" },
  { title: "🛡 Re-verify", command: "/pollAction " + pollId + " sweep" }
]);

kb.push([
  { title: "📢 Re-post", command: "/pollAction " + pollId + " repost" },
  { title: "🗑 Delete", command: "/pollAction " + pollId + " del" }
]);

kb.push([{ title: "⬅️ My Polls", command: "/myPolls" }]);

Bot.runCommand("/render", { text: t, kb: kb });
