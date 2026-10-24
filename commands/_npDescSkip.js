/*CMD
command: /npDescSkip
help: Builder — skip the description, go to the options cart
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }

np.desc = "";
np.step = "opt";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npOpt");
