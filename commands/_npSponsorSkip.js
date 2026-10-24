/*CMD
command: /npSponsorSkip
help: Builder — skip sponsor channel 1, continue without sponsors
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.channel) { Bot.runCommand("/npMenu"); return; }

np.sponsors = [];
np.step = "sponsor2";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npSponsor2");
