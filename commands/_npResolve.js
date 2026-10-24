/*CMD
command: /npResolve
help: Internal — resolve target/sponsor channels (options: pollId, i, ownerId)
need_reply: false
CMD*/

// Runs in its own (scheduled) chain — no user/chat context guaranteed.
if (!options || !options.pollId) { return; }

var np = Bot.getProp("u" + (options.ownerId || "") + "_np");
var poll = Bot.getProp("poll_" + options.pollId);
if (!np || !poll) { return; }

var i = Number(options.i || 0);
var target = null;

if (i === 0) {
  target = np.channel; // "@name" or "-100..."
} else {
  var sp = np.sponsors[i - 1];
  if (!sp) { return; }
  target = "@" + sp.user;
}

try {
  Api.getChat( {
    chat_id: target,
    on_result: "/npResolveRes",
    on_error: "/npFail",
    bb_options: { pollId: options.pollId, i: i, ownerId: options.ownerId }
  });
} catch (e) {
  // Unsupported method / sandbox error — surface it instead of hanging forever
  Bot.runCommand("/npFail", {
    error: "channel check failed: " + String(e && e.message ? e.message : e),
    bb_options: { pollId: options.pollId, i: i, ownerId: options.ownerId }
  });
}
