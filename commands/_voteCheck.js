/*CMD
command: /voteCheck
help: Internal — sponsor membership gate walker (options: pollId, optIdx, tgid, i, mode, name)
need_reply: false
CMD*/

var poll = Bot.getProp("poll_" + (options && options.pollId));
if (!poll) { return; }

var i = Number(options.i || 0);
var sp = poll.sponsors[i];

if (!sp || !sp.id) {
  // All sponsors passed (or none configured) — complete
  if (options.mode === "vote") {
    Bot.runCommand("/voteCount", {
      pollId: options.pollId,
      optIdx: options.optIdx,
      tgid: options.tgid,
      name: options.name || ""
    });
    return;
  }
  if (options.mode === "sweep") {
    // Voter passed re-verification — advance to the next voter
    Bot.runCommand("/sweepNext", { pollId: options.pollId, k: options.k });
    return;
  }
  // mode "refresh": all good, nothing else to do
  return;
}

Api.getChatMember( {
  chat_id: sp.id,
  user_id: options.tgid,
  on_result: "/voteCheckRes",
  on_error: "/voteGate",
  bb_options: {
    pollId: options.pollId,
    optIdx: options.optIdx,
    tgid: options.tgid,
    i: i,
    k: options.k,
    mode: options.mode,
    name: options.name || ""
  }
});
