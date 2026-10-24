/*CMD
command: /doCleanup
help: Internal — delete a poll and all its data (options: pollId, poll?)
need_reply: false
CMD*/

var pollId = options && options.pollId;
if (!pollId) { return; }

var poll = (options && options.poll) || Bot.getProp("poll_" + pollId);

if (poll) {
  var oKey = "u" + poll.owner_bbid + "_mypolls";
  var mine = Bot.getProp(oKey) || [];
  var out = [];
  for (var i = 0; i < mine.length; i++) {
    if (mine[i].id !== pollId) { out.push(mine[i]); }
  }
  Bot.setProp({ name: oKey, value: out, type: "json" });
}

Bot.deleteProp("poll_" + pollId);

var g = Bot.getProp("polls_index") || [];
var g2 = [];
for (var j = 0; j < g.length; j++) {
  if (g[j] !== pollId) { g2.push(g[j]); }
}
Bot.setProp({ name: "polls_index", value: g2, type: "json" });

Bot.clearRunAfter({ label: "sweep_" + pollId });
