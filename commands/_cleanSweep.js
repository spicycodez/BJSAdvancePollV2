/*CMD
command: /cleanSweep
help: Watchdog — auto re-verify live polls, auto-stop old polls, auto-clean stopped data
need_reply: false
CMD*/

var CFG = Bot.getProp("cfg") || {};
var ids = Bot.getProp("polls_index") || [];
var now = Date.now();
var changed = false;
var kept = [];

for (var i = 0; i < ids.length; i++) {
  var id = ids[i];
  var poll = Bot.getProp("poll_" + id);
  if (!poll) { changed = true; continue; } // stale entry

  if (poll.status === "live") {
    // Auto-stop polls older than max_age_days
    if (now - poll.created > (CFG.max_age_days || 30) * 86400000) {
      poll.status = "stopped";
      poll.stopped_at = now;
      poll.sweeping = false;
      Bot.setProp({ name: "poll_" + id, value: poll, type: "json" });
      Bot.clearRunAfter({ label: "sweep_" + id });
      Bot.runCommand("/pollRender", { pollId: id });
      Api.sendMessage({
        chat_id: poll.owner_tgid,
        text: "⏹ <b>Auto-stopped:</b> your poll <b>" + esc(poll.title) + "</b> reached the maximum age of " + (CFG.max_age_days || 30) + " days.\nIts data will be cleaned automatically.",
        parse_mode: "HTML",
        on_error: "/ignoreErr"
      });
      continue;
    }

    // Scheduled re-verification sweep (Join-Left Protection)
    var every = (CFG.sweep_interval_min || 60) * 60000;
    if (!poll.sweeping && now - (poll.last_sweep || 0) > every) {
      poll.sweeping = true;
      poll.sweep_removed = 0;
      poll.last_sweep = now;
      Bot.setProp({ name: "poll_" + id, value: poll, type: "json" });
      Bot.clearRunAfter({ label: "sweep_" + id });
      Bot.run({ command: "/sweepPoll", run_after: 3, label: "sweep_" + id, options: { pollId: id, k: 0 } });
    }

    kept.push(id);

  } else if (poll.status === "stopped") {
    // Auto-clean stopped polls 48h after stop
    if (poll.stopped_at && now - poll.stopped_at > (CFG.stop_clean_hours || 48) * 3600000) {
      // remove from owner's dashboard
      var oKey = "u" + poll.owner_bbid + "_mypolls";
      var mine = Bot.getProp(oKey) || [];
      var out = [];
      for (var m = 0; m < mine.length; m++) {
        if (mine[m].id !== id) { out.push(mine[m]); }
      }
      Bot.setProp({ name: oKey, value: out, type: "json" });

      Bot.deleteProp("poll_" + id);
      Bot.clearRunAfter({ label: "sweep_" + id });
      changed = true;
      continue;
    }
    kept.push(id);

  } else {
    // drafts are ignored but kept
    kept.push(id);
  }
}

if (changed) {
  Bot.setProp({ name: "polls_index", value: kept, type: "json" });
}

// Keep the watchdog alive forever (single chain, no duplicates)
Bot.clearRunAfter({ label: "autoclean" });
Bot.run({ command: "/cleanSweep", run_after: 3600, label: "autoclean" });

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
