/*CMD
command: /refresh
help: Poll footer button — refresh results + re-verify the voter
need_reply: false
CMD*/

if (!user) { return; }

var pollId = String(params == null ? "" : params).trim().split(/\s+/)[0];
var poll = Bot.getProp("poll_" + pollId);
if (!poll) {
  try {
    if (request && request.id) {
      Api.call("answerCallbackQuery", {
        callback_query_id: request.id,
        text: "⚠️ ᴘᴏʟʟ ɴᴏᴛ ꜰᴏᴜɴᴅ.",
        show_alert: true,
        on_error: "/ignoreErr"
      });
    }
  } catch (e) {}
  return;
}

// Refresh the visible results everywhere
Bot.runCommand("/pollRender", { pollId: pollId });

// Join-Left Protection on interaction: re-verify this user's own vote
var tgid = String(user.telegramid);
if (poll.status === "live" && poll.sponsors.length && poll.votes[tgid] !== undefined) {
  Bot.runCommand("/voteCheck", {
    pollId: pollId,
    optIdx: poll.votes[tgid],
    tgid: tgid,
    i: 0,
    mode: "refresh",
    name: ""
  });
} else {
  try {
    if (request && request.id) {
      Api.call("answerCallbackQuery", {
        callback_query_id: request.id,
        text: "🔄 ʀᴇꜱᴜʟᴛꜱ ᴜᴘᴅᴀᴛᴇᴅ!",
        show_alert: false,
        on_error: "/ignoreErr"
      });
    }
  } catch (e) {}
}
