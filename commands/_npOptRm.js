/*CMD
command: /npOptRm
help: Builder — remove the last option from the cart
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }
if (!np.options) { np.options = []; }

if (np.options.length) {
  np.options.pop();
  Bot.setProp({ name: key, value: np, type: "json" });
}

// Back to the cart — it re-renders and re-arms the reply listener
Bot.runCommand("/npOpt");
