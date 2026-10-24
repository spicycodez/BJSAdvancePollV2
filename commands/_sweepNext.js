/*CMD
command: /sweepNext
help: Internal — advance the sweep to the next voter (options: pollId, k)
need_reply: false
CMD*/

Bot.runCommand("/sweepPoll", {
  pollId: options && options.pollId,
  k: Number(options && options.k !== undefined ? options.k : 0) + 1
});
