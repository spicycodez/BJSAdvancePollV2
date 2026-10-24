/*CMD
command: /vote
help: Vote router (params: pollId optionIndex) — gateway gate before counting
need_reply: false
CMD*/

if (!user) { return; }

var p = String(params == null ? "" : params).trim().split(/\s+/);
var pollId = p[0] || "";
var optIdx = parseInt(p[1], 10);

var poll = Bot.getProp("poll_" + pollId);

function pop(text, alert) {
  try {
    if (request && request.id) {
      Api.call("answerCallbackQuery", {
        callback_query_id: request.id,
        text: String(text).slice(0, 190),
        show_alert: !!alert,
        on_error: "/ignoreErr"
      });
    }
  } catch (e) {}
}

if (!poll) { pop("⚠️ ᴘᴏʟʟ ɴᴏᴛ ꜰᴏᴜɴᴅ.", true); return; }
if (isNaN(optIdx) || optIdx < 0 || optIdx >= poll.options.length) { pop("⚠️ ɪɴᴠᴀʟɪᴅ ᴏᴘᴛɪᴏɴ.", true); return; }

if (poll.status === "paused") { pop("⏸ ᴠᴏᴛɪɴɢ ɪꜱ ᴘᴀᴜꜱᴇᴅ ʀɪɢʜᴛ ɴᴏᴡ.", true); return; }
if (poll.status !== "live") { pop("⏹ ᴛʜɪꜱ ᴘᴏʟʟ ʜᴀꜱ ᴇɴᴅᴇᴅ.", true); return; }

var tgid = String(user.telegramid);
var name = "";
try {
  if (request && request.from) {
    name = request.from.first_name || request.from.username || "";
  }
} catch (e) {}

// Membership gate: walk through all sponsor channels (0..n), then count
Bot.runCommand("/voteCheck", {
  pollId: pollId,
  optIdx: optIdx,
  tgid: tgid,
  i: 0,
  mode: "vote",
  name: name
});
