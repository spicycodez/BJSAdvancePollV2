/*CMD
command: /voteCheckRes
help: Internal — getChatMember result: pass / gateway / remove vote
need_reply: false
CMD*/

if (!options) { return; }
var bb = options.bb_options || options;
var res = options.result || {};
var st = res.status;

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function pop(text, alert) {
  try {
    if (request && request.id) {
      Api.answerCallbackQuery( {
        callback_query_id: request.id,
        text: String(text).slice(0, 190),
        show_alert: !!alert,
        on_error: "/ignoreErr"
      });
    }
  } catch (e) {}
}

var isMember =
  st === "creator" ||
  st === "administrator" ||
  st === "member" ||
  (st === "restricted" && res.is_member === true);

var poll = Bot.getProp("poll_" + bb.pollId);

// ─── MEMBER of this sponsor: continue to the next one ───
if (isMember) {
  // CHAIN BREAKER — sponsor hops chain Api callbacks; long walks hit the
  // "Too many sub commands" limit. Fresh chain per hop.
  Bot.run({
    command: "/voteCheck",
    run_after: 1,
    options: {
      pollId: bb.pollId,
      optIdx: bb.optIdx,
      tgid: bb.tgid,
      i: Number(bb.i) + 1,
      mode: bb.mode,
      k: bb.k,
      name: bb.name || ""
    }
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
    pop("🚪 ʏᴏᴜʀ ᴠᴏᴛᴇ ᴡᴀꜱ ʀᴇᴍᴏᴠᴇᴅ — ʏᴏᴜ ʟᴇꜰᴛ ᴛʜᴇ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ(ꜱ).", true);
  } else {
    pop("🔒 ᴊᴏɪɴ ᴛʜᴇ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ(ꜱ) ᴛᴏ ᴠᴏᴛᴇ!", true);
  }
  return;
}

// ─── mode "vote": Sponsor Gateway — popup + private DM with join buttons ───
pop("🔒 ᴊᴏɪɴ ᴛʜᴇ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ(ꜱ) ꜰɪʀꜱᴛ!", true);

var rows = [];
for (var s = 0; s < poll.sponsors.length; s++) {
  var sp = poll.sponsors[s];
  if (sp.user) {
    rows.push([{ text: "📢 ᴊᴏɪɴ " + (sp.title || sp.user), url: "https://t.me/" + sp.user }]);
  }
}
rows.push([{ text: "✅ ɪ ᴊᴏɪɴᴇᴅ — ᴄʜᴇᴄᴋ ᴀɢᴀɪɴ", callback_data: "/vote " + bb.pollId + " " + bb.optIdx }]);

var optName = poll.options[bb.optIdx] ? poll.options[bb.optIdx] : "ʏᴏᴜʀ ᴄʜᴏɪᴄᴇ";

Api.sendMessage({
  chat_id: bb.tgid,
  text: "🔒 <b>ᴠᴏᴛᴇ ʟᴏᴄᴋᴇᴅ!</b>\n\n" +
    "ʏᴏᴜʀ ᴠᴏᴛᴇ ꜰᴏʀ <b>" + esc(optName) + "</b> ɪɴ <b>" + esc(poll.title) + "</b> ᴡɪʟʟ ʙᴇ ᴄᴏᴜɴᴛᴇᴅ ᴀꜰᴛᴇʀ ʏᴏᴜ ᴊᴏɪɴ ᴏᴜʀ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ(ꜱ).\n\n" +
    "1️⃣ ᴊᴏɪɴ ᴠɪᴀ ᴛʜᴇ ʙᴜᴛᴛᴏɴ(ꜱ) ʙᴇʟᴏᴡ\n" +
    "2️⃣ ᴛᴀᴘ <b>“ɪ ᴊᴏɪɴᴇᴅ — ᴄʜᴇᴄᴋ ᴀɢᴀɪɴ”</b>\n\n" +
    "<i>ʏᴏᴜʀ ᴠᴏᴛᴇ ɪꜱ ꜱᴀꜰᴇ — ɪᴛ ᴡɪʟʟ ᴄᴏᴜɴᴛ ᴛʜᴇ ᴍᴏᴍᴇɴᴛ ʏᴏᴜ ᴘᴀꜱꜱ ᴛʜᴇ ɢᴀᴛᴇᴡᴀʏ.</i>",
  parse_mode: "HTML",
  reply_markup: { inline_keyboard: rows },
  link_preview_options: { is_disabled: true },
  on_error: "/ignoreErr"
});
