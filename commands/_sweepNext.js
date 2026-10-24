/*CMD
command: /sweepNext
help: Internal — advance the sweep to the next voter (options: pollId, k)
need_reply: false
CMD*/

// CHAIN BREAKER — each voter starts a fresh dispatcher chain, so sweeps of
// any length stay under the "Too many sub commands" limit.
Bot.run({
  command: "/sweepPoll",
  run_after: 1,
  label: "sweep_" + (options && options.pollId),
  options: {
    pollId: options && options.pollId,
    k: Number(options && options.k !== undefined ? options.k : 0) + 1
  }
});
