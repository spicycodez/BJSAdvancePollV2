/*CMD
command: /npResolve
help: Internal — resolve target/sponsor channels (options: pollId, i)
need_reply: false
CMD*/

if (!user || !options || !options.pollId) { return; }

var np = Bot.getProp("u" + user.id + "_np");
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

Api.call("getChat", {
  chat_id: target,
  on_result: "/npResolveRes",
  on_error: "/npFail",
  bb_options: { pollId: options.pollId, i: i }
});
