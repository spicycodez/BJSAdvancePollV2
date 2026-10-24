/*CMD
command: /npResolveRes
help: Internal — store resolved channel, continue the chain
need_reply: false
CMD*/

if (!options || !options.result) { return; }
var bb = options.bb_options || options;
var pollId = bb.pollId;
var i = Number(bb.i || 0);

var poll = Bot.getProp("poll_" + pollId);
var np = Bot.getProp("u" + (user ? user.id : poll ? poll.owner_bbid : 0) + "_np");
if (!poll || !np) { return; }

var ch = options.result;

if (i === 0) {
  poll.channel_id = ch.id;
  poll.channel_title = ch.title || ch.username || np.channel;
} else {
  if (!poll.sponsors[i - 1]) { poll.sponsors[i - 1] = {}; }
  poll.sponsors[i - 1].id = ch.id;
  poll.sponsors[i - 1].title = ch.title || ch.username || ("@" + np.sponsors[i - 1].user);
  poll.sponsors[i - 1].user = ch.username || np.sponsors[i - 1].user;
}

Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });

var total = 1 + (np.sponsors ? np.sponsors.length : 0);
if (i + 1 < total) {
  Bot.runCommand("/npResolve", { pollId: pollId, i: i + 1 });
} else {
  Bot.runCommand("/npPost", { pollId: pollId });
}
