/*CMD
command: /npPublish
help: Builder — validate, create the poll record, resolve channels
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);

if (!np || !np.title || !np.options || np.options.length < 2 || !np.channel) {
  Bot.runCommand("/npMenu");
  return;
}

// Double-tap protection: one publish at a time
if (np.step === "publishing") { return; }
np.step = "publishing";
Bot.setProp({ name: key, value: np, type: "json" });

var id = new Date().getTime().toString(36) + Math.floor(Math.random() * 1296).toString(36);

var poll = {
  id: id,
  owner_bbid: user.id,
  owner_tgid: user.telegramid,
  title: np.title,
  desc: np.desc || "",
  options: np.options,
  channel: np.channel,
  sponsors: np.sponsors || [],
  status: "draft",
  hide: false,
  created: Date.now(),
  votes: {},
  stats: { total: 0, removed: 0 },
  msgs: [],
  sweeping: false,
  last_sweep: 0
};

Bot.setProp({ name: "poll_" + id, value: poll, type: "json" });

Bot.runCommand("/render", {
  text: "⏳ <b>ᴘᴜʙʟɪꜱʜɪɴɢ…</b>\n\nʀᴇꜱᴏʟᴠɪɴɢ ᴄʜᴀɴɴᴇʟꜱ ᴀɴᴅ ᴄʜᴇᴄᴋɪɴɢ ᴀᴄᴄᴇꜱꜱ. ᴛʜɪꜱ ᴛᴀᴋᴇꜱ ᴀ ꜰᴇᴡ ꜱᴇᴄᴏɴᴅꜱ.",
  kb: [[{ title: "✖ ᴄᴀɴᴄᴇʟ", command: "/npc" }]]
});

// CHAIN BREAKER — Bots.Business limits nested command/callback chains
// ("Too many sub commands"). The old flow chained resolve → post → finalize
// in ONE dispatcher chain and died silently right after this screen.
// Scheduling the next step starts a FRESH chain; the payload travels in options.
Bot.run({
  command: "/npResolve",
  run_after: 1,
  label: "pub_" + id,
  options: { pollId: id, i: 0, ownerId: user.id }
});
