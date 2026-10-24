/*CMD
command: /npSponsor2Skip
help: Builder — skip sponsor channel 2, go to the preview
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.channel) { Bot.runCommand("/npMenu"); return; }

np.step = "preview";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npPreview");
