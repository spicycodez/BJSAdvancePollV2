/*CMD
command: /npResolveRes
help: Internal — store resolved channel, continue the chain
need_reply: false
CMD*/

if (!options || !options.result) { return; }
var bb = options.bb_options || options;
var pollId = bb.pollId;
var ownerId = bb.ownerId;
var i = Number(bb.i || 0);
if (!pollId) { return; }

var poll = Bot.getProp("poll_" + pollId);
var np = Bot.getProp("u" + (ownerId || "") + "_np");
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
  // CHAIN BREAKER — next resolution runs in a fresh dispatcher chain
  Bot.run({
    command: "/npResolve",
    run_after: 1,
    label: "pub_" + pollId,
    options: { pollId: pollId, i: i + 1, ownerId: ownerId }
  });
} else {
  // CHAIN BREAKER — posting starts a fresh chain too
  Bot.run({
    command: "/npPost",
    run_after: 1,
    label: "pub_" + pollId,
    options: { pollId: pollId }
  });
}
