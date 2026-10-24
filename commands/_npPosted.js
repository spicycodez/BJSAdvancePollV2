/*CMD
command: /npPosted
help: Internal — poll message posted: save msg id, finalize
need_reply: false
CMD*/

if (!options || !options.result) { return; }
var bb = options.bb_options || options;
var pollId = bb.pollId;

var poll = Bot.getProp("poll_" + pollId);
if (!poll) { return; }

poll.msgs.push({
  chat_id: options.result.chat.id,
  message_id: options.result.message_id
});
poll.status = "live";
poll.posted_at = Date.now();
Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });

// Register in owner's dashboard index
var oKey = "u" + poll.owner_bbid + "_mypolls";
var mine = Bot.getProp(oKey) || [];
var found = false;
for (var i = 0; i < mine.length; i++) {
  if (mine[i].id === pollId) { found = true; }
}
if (!found) {
  mine.unshift({ id: pollId, title: poll.title, created: poll.created });
  Bot.setProp({ name: oKey, value: mine, type: "json" });
}

// Register in global index for the watchdog
var gIndex = Bot.getProp("polls_index") || [];
if (gIndex.indexOf(pollId) < 0) {
  gIndex.unshift(pollId);
  Bot.setProp({ name: "polls_index", value: gIndex, type: "json" });
}

// Clear the builder state
Bot.deleteProp("u" + poll.owner_bbid + "_np");

Bot.runCommand("/render", {
  text: "🎉 <b>POLL IS LIVE!</b>\n\n📊 <b>" + esc(poll.title) + "</b>\n📣 Posted to <b>" + esc(poll.channel_title || poll.channel) + "</b>\n" +
    (poll.sponsors.length ? "🔒 Sponsor gateway: " + poll.sponsors.length + " channel(s)\n" : "") +
    "\nManage it from your dashboard 👇",
  kb: [
    [{ title: "📊 Open Dashboard", command: "/pollAdmin " + pollId }],
    [{ title: "🆕 Another Poll", command: "/npMenu" }],
    [{ title: "🏠 Main Menu", command: "/start" }]
  ]
});

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
