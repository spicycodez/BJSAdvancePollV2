/*CMD
command: /voteCheckRes
help: Internal — getChatMember result: pass / gateway / remove vote
need_reply: false
CMD*/

if (!options) { return; }
var bb = options.bb_options || options;
var res = options.result || {};
var st = res.status;

var isMember =
  st === "creator" ||
  st === "administrator" ||
  st === "member" ||
  (st === "restricted" && res.is_member === true);

var poll = Bot.getProp("poll_" + bb.pollId);

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

// ─── MEMBER of this sponsor: continue to the next one ───
if (isMember) {
  Bot.runCommand("/voteCheck", {
    pollId: bb.pollId,
    optIdx: bb.optIdx,
    tgid: bb.tgid,
    i: Number(bb.i) + 1,
    mode: bb.mode,
    name: bb.name || ""
  });
  return;
}

// ─── NOT a member ───

if (!poll) { return; }

if (bb.mode === "sweep") {
  // Join-Left Protection: remove the vote of the leaver
  if (poll.votes[bb.tgid] !== undefined) {
    delete poll.votes[bb.tgid];
    poll.stats.removed = (poll.stats.removed || 0) + 1;
    poll.sweep_removed = (poll.sweep_removed || 0) + 1;
    Bot.setProp({ name: "poll_" + bb.pollId, value: poll, type: "json" });
  }
  Bot.runCommand("/sweepNext", { pollId: bb.pollId, k: bb.k });
  return;
}

if (bb.mode === "refresh") {
  if (poll.votes[bb.tgid] !== undefined) {
    delete poll.votes[bb.tgid];
    poll.stats.removed = (poll.stats.removed || 0) + 1;
    Bot.setProp({ name: "poll_" + bb.pollId, value: poll, type: "json" });
    Bot.runCommand("/pollRender", { pollId: bb.pollId });
    pop("🚪 Your vote was removed — you left the sponsor channel(s).", true);
  } else {
    pop("🔒 Join the sponsor channel(s) to vote!", true);
  }
  return;
}

// ─── mode "vote": Sponsor Gateway — popup + private DM with join buttons ───
pop("🔒 Join the sponsor channel(s) first!", true);

var rows = [];
for (var s = 0; s < poll.sponsors.length; s++) {
  var sp = poll.sponsors[s];
  if (sp.user) {
    rows.push([{ text: "📢 Join " + (sp.title || sp.user), url: "https://t.me/" + sp.user }]);
  }
}
rows.push([{ text: "✅ I Joined — Check Again", callback_data: "/vote " + bb.pollId + " " + bb.optIdx }]);

var optName = poll.options[bb.optIdx] ? poll.options[bb.optIdx] : "your choice";

Api.sendMessage({
  chat_id: bb.tgid,
  text: "🔒 <b>Vote locked!</b>\n\n" +
    "Your vote for <b>" + esc(optName) + "</b> in <b>" + esc(poll.title) + "</b> will be counted after you join our sponsor channel(s).\n\n" +
    "1️⃣ Join via the button(s) below\n" +
    "2️⃣ Tap <b>“I Joined — Check Again”</b>\n\n" +
    "<i>Your vote is safe — it will count the moment you pass the gateway.</i>",
  parse_mode: "HTML",
  reply_markup: { inline_keyboard: rows },
  link_preview_options: { is_disabled: true },
  on_error: "/ignoreErr"
});

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
