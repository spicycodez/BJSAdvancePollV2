/*CMD
command: /npMenu
aliases: /newpoll
help: Start the step-by-step poll builder
need_reply: false
CMD*/

var key = "u" + user.id + "_np";
var np = Bot.getProp(key);

if (!np || !np.step) {
  np = { step: "title", title: "", desc: "", options: [], channel: "", sponsors: [] };
  Bot.setProp({ name: key, value: np, type: "json" });
}

Bot.runCommand("/npTitle");
