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
      Api.call("answerCallbackQuery", {
        callback_query_id: request.id,
        text: String(text).slice(0, 190),
        show_alert: !!alert,
        on_error: "/ignoreErr"
      });
    }
  } catch (e) {}
}

if (!poll) { pop("⚠️ Poll not found.", true); Bot.runCommand("/myPolls"); return; }
if (poll.owner_bbid !== user.id) { pop("🚫 Only the owner can do that.", true); return; }

// ─── Pause / Resume ───
if (action === "pause" && poll.status === "live") {
  poll.status = "paused";
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.runCommand("/pollRender", { pollId: pollId });
  pop("⏸ Poll paused — voting disabled.", false);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

if (action === "resume" && poll.status === "paused") {
  poll.status = "live";
  poll.last_sweep = 0; // let the watchdog re-verify soon
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.runCommand("/pollRender", { pollId: pollId });
  pop("▶️ Poll resumed!", false);
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
  pop("⏹ Poll stopped. Data auto-cleans in 48h.", true);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

// ─── Hide / Show vote counts ───
if (action === "hide" && !poll.hide) {
  poll.hide = true;
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.runCommand("/pollRender", { pollId: pollId }); // instant update across ALL channels
  pop("🙈 Vote counts hidden everywhere.", false);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

if (action === "show" && poll.hide) {
  poll.hide = false;
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.runCommand("/pollRender", { pollId: pollId });
  pop("👁 Vote counts visible again.", false);
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
  var t = "📈 <b>STATS — " + esc(poll.title) + "</b>\n\n";
  var max = 0, lead = -1;
  for (var c = 0; c < counts.length; c++) { if (counts[c] > max) { max = counts[c]; lead = c; } }
  for (var o = 0; o < poll.options.length; o++) {
    var pct = total ? Math.round(counts[o] * 100 / total) : 0;
    var medal = (poll.status !== "live" && o === lead && max > 0) ? " 🏆" : "";
    t += (o + 1) + ". <b>" + esc(poll.options[o]) + "</b> — " + counts[o] + " 🗳 (" + pct + "%)" + medal + "\n";
  }
  t += "\n👥 Unique voters: " + total;
  t += "\n🛡 Votes removed by protection: " + (poll.stats.removed || 0);
  t += "\n📢 Posted copies: " + poll.msgs.length;
  if (poll.last_sweep) {
    var ago = Math.max(0, Math.round((Date.now() - poll.last_sweep) / 60000));
    t += "\n🛡 Last full re-verify: " + ago + " min ago";
  }
  Bot.runCommand("/render", {
    text: t,
    kb: [
      [{ title: "⬅️ Poll Control", command: "/pollAdmin " + pollId }],
      [{ title: "📊 My Polls", command: "/myPolls" }]
    ]
  });
  return;
}

// ─── Manual re-verification sweep ───
if (action === "sweep") {
  if (poll.status !== "live") { pop("⏹ Only live polls can be re-verified.", true); Bot.runCommand("/pollAdmin", { pollId: pollId }); return; }
  if (!poll.sponsors.length) { pop("🔒 This poll has no sponsor channels to check.", true); Bot.runCommand("/pollAdmin", { pollId: pollId }); return; }
  poll.sweeping = true;
  poll.sweep_removed = 0;
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  Bot.clearRunAfter({ label: "sweep_" + pollId });
  Bot.run({ command: "/sweepPoll", run_after: 2, label: "sweep_" + pollId, options: { pollId: pollId, k: 0 } });
  Bot.runCommand("/render", {
    text: "🛡 <b>Re-verification started</b>\n\nEvery voter's membership in the sponsor channel(s) is being re-checked.\nLeavers' votes will be removed and the poll message will update automatically.\n\nYou'll get a DM report when it finishes.",
    kb: [
      [{ title: "⬅️ Poll Control", command: "/pollAdmin " + pollId }],
      [{ title: "📊 My Polls", command: "/myPolls" }]
    ]
  });
  return;
}

// ─── Re-post the poll message to the channel ───
if (action === "repost") {
  Bot.runCommand("/npPost", { pollId: pollId, repost: true });
  pop("📢 Posting a fresh copy to the channel…", false);
  Bot.runCommand("/pollAdmin", { pollId: pollId });
  return;
}

// ─── Delete ───
if (action === "del") {
  pop("🗑 Poll deleted (including its data).", true);
  Bot.runCommand("/doCleanup", { pollId: pollId, poll: poll });
  Bot.runCommand("/myPolls");
  return;
}

pop("⚠️ Unknown action.", true);
Bot.runCommand("/pollAdmin", { pollId: pollId });
