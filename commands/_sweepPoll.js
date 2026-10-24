/*CMD
command: /sweepPoll
help: Join-Left Protection — chunked membership re-verification (options/params: pollId k)
need_reply: false
CMD*/

var pollId = (options && options.pollId) || String(params == null ? "" : params).trim().split(/\s+/)[0];
var k = Number(options && options.k !== undefined ? options.k : String(params == null ? "" : params).trim().split(/\s+/)[1]);

var poll = Bot.getProp("poll_" + pollId);
if (!poll) { return; }

var CFG = Bot.getProp("cfg") || {};
var CHUNK = CFG.sweep_chunk || 5;

// Finish conditions
if (poll.status !== "live" || !poll.sponsors || !poll.sponsors.length) {
  poll.sweeping = false;
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });
  return;
}

var voters = [];
for (var tg in poll.votes) { voters.push(tg); }

if (isNaN(k) || k < 0) { k = 0; }

// Done?
if (k >= voters.length) {
  var removed = poll.sweep_removed || 0;
  poll.sweeping = false;
  poll.last_sweep = Date.now();
  delete poll.sweep_removed;
  Bot.setProp({ name: "poll_" + pollId, value: poll, type: "json" });

  Bot.runCommand("/pollRender", { pollId: pollId });

  if (removed > 0) {
    Api.sendMessage({
      chat_id: poll.owner_tgid,
      text: "🛡 <b>ᴊᴏɪɴ-ʟᴇꜰᴛ ᴘʀᴏᴛᴇᴄᴛɪᴏɴ ʀᴇᴘᴏʀᴛ</b>\n\n" +
        "📊 <b>" + esc(poll.title) + "</b>\n" +
        "ʀᴇᴍᴏᴠᴇᴅ <b>" + removed + "</b> ᴠᴏᴛᴇ(ꜱ) — ᴛʜᴏꜱᴇ ᴜꜱᴇʀꜱ ʟᴇꜰᴛ ᴛʜᴇ ꜱᴘᴏɴꜱᴏʀ ᴄʜᴀɴɴᴇʟ(ꜱ) ᴀꜰᴛᴇʀ ᴠᴏᴛɪɴɢ.\n\n" +
        "ᴛʜᴇ ᴘᴏʟʟ ᴍᴇꜱꜱᴀɢᴇ ʜᴀꜱ ʙᴇᴇɴ ᴜᴘᴅᴀᴛᴇᴅ ᴇᴠᴇʀʏᴡʜᴇʀᴇ.",
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
      on_error: "/ignoreErr"
    });
  }
  return;
}

// Pace: every CHUNK voters, yield for 2 seconds to stay light
if (k > 0 && k % CHUNK === 0) {
  Bot.run({
    command: "/sweepPoll",
    run_after: 2,
    label: "sweep_" + pollId,
    options: { pollId: pollId, k: k }
  });
  return;
}

// Verify voter k against all sponsor channels
Bot.runCommand("/voteCheck", {
  pollId: pollId,
  optIdx: poll.votes[voters[k]],
  tgid: voters[k],
  i: 0,
  mode: "sweep",
  k: k,
  name: ""
});

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
