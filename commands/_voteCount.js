/*CMD
command: /voteCount
help: Internal — record the vote and refresh the poll message
need_reply: false
CMD*/

var poll = Bot.getProp("poll_" + (options && options.pollId));
if (!poll) { return; }

// Re-check live status (may have changed during the gateway walk)
if (poll.status === "paused") {
  try {
    if (request && request.id) {
      Api.answerCallbackQuery( {
        callback_query_id: request.id,
        text: "⏸ ᴠᴏᴛɪɴɢ ɪꜱ ᴘᴀᴜꜱᴇᴅ ʀɪɢʜᴛ ɴᴏᴡ.",
        show_alert: true,
        on_error: "/ignoreErr"
      });
    }
  } catch (e) {}
  return;
}
if (poll.status !== "live") { return; }

var tgid = String(options.tgid);
var optIdx = Number(options.optIdx);
var prev = poll.votes[tgid];

poll.votes[tgid] = optIdx;
if (prev === undefined) {
  poll.stats.total = (poll.stats.total || 0) + 1;
}
Bot.setProp({ name: "poll_" + options.pollId, value: poll, type: "json" });

// Update every posted poll message (all channels, zero spam)
Bot.runCommand("/pollRender", { pollId: options.pollId });

try {
  if (request && request.id) {
    Api.answerCallbackQuery( {
      callback_query_id: request.id,
      text: prev === undefined
        ? "✅ ᴠᴏᴛᴇ ᴄᴏᴜɴᴛᴇᴅ: " + String(poll.options[optIdx]).slice(0, 60)
        : "🔄 Vote updated: " + String(poll.options[optIdx]).slice(0, 60),
      show_alert: false,
      on_error: "/ignoreErr"
    });
  }
} catch (e) {}
