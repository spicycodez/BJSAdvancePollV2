/*CMD
command: /pollAction
help: Poll control router (params: pollId action) — pause/resume/stop/hide/show/stats/sweep/repost/del
need_reply: false
CMD*/

if (!user) { return; }

var p = String(params == null ? "" : params).trim().split(/\s+/);
var pollId = p[0] || "";
var action = (p[1] || "").toLowerCase();

var poll = Bot.getProp("poll_" + pollId);

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

if (!poll) { pop("⚠️ ᴘᴏʟʟ ɴᴏᴛ ꜰᴏᴜɴᴅ.", true); Bot.runCommand("/myPolls"); return; }
if (poll.owner_bbid !== user.id) { pop("🚫 ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴅᴏ ᴛʜᴀᴛ.", true); return; }

// ─── Pause / Resume ───
if (action === "pause" && poll.status === "live") {
  poll.status = "paused";
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.runCommand("/pollRender", { pollId: pollId });
  pop("⏸ ᴘᴏʟʟ ᴘᴀᴜꜱᴇᴅ — ᴠᴏᴛɪɴɢ ᴅɪꜱᴀʙʟᴇᴅ.", false);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

if (action === "resume" && poll.status === "paused") {
  poll.status = "live";
  poll.last_sweep = 0; // let the watchdog re-verify soon
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.runCommand("/pollRender", { pollId: pollId });
  pop("▶️ ᴘᴏʟʟ ʀᴇꜱᴜᴍᴇᴅ!", false);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

// ─── Stop ───
if (action === "stop" && poll.status !== "stopped") {
  poll.status = "stopped";
  poll.stopped_at = Date.now();
  poll.sweeping = false;
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.clearRunAfter({ label: "sweep_" + pollId });
  Bot.runCommand("/pollRender", { pollId: pollId });
  pop("⏹ ᴘᴏʟʟ ꜱᴛᴏᴘᴘᴇᴅ. ᴅᴀᴛᴀ ᴀᴜᴛᴏ-ᴄʟᴇᴀɴꜱ ɪɴ 48ʜ.", true);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

// ─── Hide / Show vote counts ───
if (action === "hide" && !poll.hide) {
  poll.hide = true;
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.runCommand("/pollRender", { pollId: pollId }); // instant update across ALL channels
  pop("🙈 ᴠᴏᴛᴇ ᴄᴏᴜɴᴛꜱ ʜɪᴅᴅᴇɴ ᴇᴠᴇʀʏᴡʜᴇʀᴇ.", false);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

if (action === "show" && poll.hide) {
  poll.hide = false;
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.runCommand("/pollRender", { pollId: pollId });
  pop("👁 ᴠᴏᴛᴇ ᴄᴏᴜɴᴛꜱ ᴠɪꜱɪʙʟᴇ ᴀɢᴀɪɴ.", false);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

// ─── Stats ───
if (action === "stats") {
  var counts = [];
  var total = 0;
  for (var i = 0; i < poll.options.length; i++) { counts[i] = 0; }
  for (var tg in poll.votes) {
    var v = poll.votes[tg];
    if (counts[v] !== undefined) { counts[v]++; total++; }
  }
  var t = "📈 <b>ꜱᴛᴀᴛꜱ — " + esc(poll.title) + "</b>\n\n";
  var max = 0, lead = -1;
  for (var c = 0; c < counts.length; c++) { if (counts[c] > max) { max = counts[c]; lead = c; } }
  for (var o = 0; o < poll.options.length; o++) {
    var pct = total ? Math.round(counts[o] * 100 / total) : 0;
    var medal = (poll.status !== "live" && o === lead && max > 0) ? " 🏆" : "";
    t += (o + 1) + ". <b>" + esc(poll.options[o]) + "</b> — " + counts[o] + " 🗳 (" + pct + "%)" + medal + "\n";
  }
  t += "\n👥 ᴜɴɪǫᴜᴇ ᴠᴏᴛᴇʀꜱ: " + total;
  t += "\n🛡 ᴠᴏᴛᴇꜱ ʀᴇᴍᴏᴠᴇᴅ ʙʏ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ: " + (poll.stats.removed || 0);
  t += "\n📢 ᴘᴏꜱᴛᴇᴅ ᴄᴏᴘɪᴇꜱ: " + poll.msgs.length;
  if (poll.last_sweep) {
    var ago = Math.max(0, Math.round((Date.now() - poll.last_sweep) / 60000));
    t += "\n🛡 ʟᴀꜱᴛ ꜰᴜʟʟ ʀᴇ-ᴠᴇʀɪꜰʏ: " + ago + " ᴍɪɴ ᴀɢᴏ";
  }
  Bot.runCommand("/render", {
    text: t,
    kb: [
      [{ title: "⬅️ ᴘᴏʟʟ ᴄᴏɴᴛʀᴏʟ", command: "/pollAdmin " + pollId }],
      [{ title: "📊 ᴍʏ ᴘᴏʟʟꜱ", command: "/myPolls" }]
    ]
  });
  return;
}

// ─── Manual re-verification sweep ───
if (action === "sweep") {
  if (poll.status !== "live") { pop("⏹ ᴏɴʟʏ ʟɪᴠᴇ ᴘᴏʟʟꜱ ᴄᴀɴ ʙᴇ ʀᴇ-ᴠᴇʀɪꜰɪᴇᴅ.", true); Bot.runCommand("/pollAdmin", { pollId: pollId }); return; }
  if (!poll.sponsors.length) { pop("🔒 ᴛʜɪꜱ ᴘᴏʟʟ ʜᴀꜱ ɴᴏ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟꜱ ᴛᴏ ᴄʜᴇᴄᴋ.", true); Bot.runCommand("/pollAdmin", { pollId: pollId }); return; }
  poll.sweeping = true;
  poll.sweep_removed = 0;
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.clearRunAfter({ label: "sweep_" + pollId });
  Bot.run({ command: "/sweepPoll", run_after: 2, label: "sweep_" + pollId, options: { pollId: pollId, k: 0 } });
  Bot.runCommand("/render", {
    text: "🛡 <b>ʀᴇ-ᴠᴇʀɪꜰɪᴄᴀᴛɪᴏɴ ꜱᴛᴀʀᴛᴇᴅ</b>\n\nᴇᴠᴇʀʏ ᴠᴏᴛᴇʀ'ꜱ ᴍᴇᴍʙᴇʀꜱʜɪᴘ ɪɴ ᴛʜᴇ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ(ꜱ) ɪꜱ ʙᴇɪɴɢ ʀᴇ-ᴄʜᴇᴄᴋᴇᴅ.\nʟᴇᴀᴠᴇʀꜱ' ᴠᴏᴛᴇꜱ ᴡɪʟʟ ʙᴇ ʀᴇᴍᴏᴠᴇᴅ ᴀɴᴅ ᴛʜᴇ ᴘᴏʟʟ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ᴜᴘᴅᴀᴛᴇ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ.\n\nʏᴏᴜ'ʟʟ ɢᴇᴛ ᴀ ᴅᴍ ʀᴇᴘᴏʀᴛ ᴡʜᴇɴ ɪᴛ ꜰɪɴɪꜱʜᴇꜱ.",
    kb: [
      [{ title: "⬅️ ᴘᴏʟʟ ᴄᴏɴᴛʀᴏʟ", command: "/pollAdmin " + pollId }],
      [{ title: "📊 ᴍʏ ᴘᴏʟʟꜱ", command: "/myPolls" }]
    ]
  });
  return;
}

// ─── Re-post the poll message to the channel ───
if (action === "repost") {
  Bot.runCommand("/npPost", { pollId: pollId, repost: true });
  pop("📢 ᴘᴏꜱᴛɪɴɢ ᴀ ꜰʀᴇꜱʜ ᴄᴏᴘʏ ᴛᴏ ᴛʜᴇ ᴄʜᴀɴɴᴇʟ…", false);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

// ─── Delete ───
if (action === "del") {
  pop("🗑 ᴘᴏʟʟ ᴅᴇʟᴇᴛᴇᴅ (ɪɴᴄʟᴜᴅɪɴɢ ɪᴛꜱ ᴅᴀᴛᴀ).", true);
  Bot.runCommand("/doCleanup", { pollId: pollId, poll: poll });
  Bot.runCommand("/myPolls");
  return;
}

pop("⚠️ ᴜɴᴋɴᴏᴡɴ ᴀᴄᴛɪᴏɴ.", true);
Bot.runCommand("/pollAdmin", { pollId: pollId });
