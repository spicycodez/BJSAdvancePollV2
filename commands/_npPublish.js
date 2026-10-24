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

var id = new Date().getTime().toString(36);

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
  text: "⏳ <b>Publishing…</b>\n\nResolving channels and checking access. This takes a few seconds.",
  kb: [[{ title: "✖ Cancel", command: "/npc" }]]
});

Bot.runCommand("/npResolve", { pollId: id, i: 0 });
