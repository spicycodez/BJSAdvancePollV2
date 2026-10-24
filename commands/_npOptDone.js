/*CMD
command: /npOptDone
help: Builder — finish the options cart, go to channel step
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }

if (!np.options || np.options.length < 2) {
  Bot.runCommand("/render", {
    text: "⚠️ A poll needs at least <b>2 options</b>. Current: " + (np.options ? np.options.length : 0) + ".\nAdd more options first.",
    kb: [[{ title: "🛒 Back to Cart", command: "/npOpt" }], [{ title: "✖ Cancel", command: "/npc" }]]
  });
  return;
}

np.step = "channel";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npChannel");
