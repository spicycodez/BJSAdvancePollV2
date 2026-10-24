/*CMD
command: /npOpt
help: Builder step 3 — options cart (one option per message)
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }

var CFG = Bot.getProp("cfg") || {};
var MAXO = CFG.max_options || 10;

var txt = String(message == null ? "" : message).trim();

function cartText(note) {
  var t = "🏗 <b>Poll Builder</b> — Step 3/5\n🛒 <b>Options Cart</b>\n\n";
  if (note) { t += note + "\n"; }
  if (!np.options.length) {
    t += "The cart is empty.\nSend your <b>first option</b> as a message.\n\n" +
      "<i>Example: Pizza</i> — then just keep sending more.";
  } else {
    t += "Current options:\n";
    for (var i = 0; i < np.options.length; i++) {
      t += "  " + (i + 1) + ". " + esc(np.options[i]) + "\n";
    }
    t += "\nSend the <b>next option</b> as a message, or use the buttons below.\n" +
      "Minimum 2 options • Maximum " + MAXO + ".";
  }
  return t;
}

function cartKb() {
  var kb = [];
  var row = [];
  if (np.options.length) {
    row.push({ title: "🗑 Remove last", command: "/npOpt rm" });
    if (np.options.length >= 2) {
      row.push({ title: "✅ Done (" + np.options.length + ")", command: "/npOpt done" });
    }
  }
  if (row.length) { kb.push(row); }
  kb.push([{ title: "✖ Cancel", command: "/npc" }]);
  return kb;
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// First run / button actions
if (txt.indexOf("/npOpt") === 0 || txt === "") {
  var sub = txt.slice(6).trim(); // "rm", "done" or ""

  if (sub === "done") { Bot.runCommand("/npOptDone"); return; }

  if (sub === "rm") {
    if (np.options.length) {
      var gone = np.options.pop();
      Bot.setProp({ name: key, value: np, type: "json" });
      Bot.runCommand("/render", { text: cartText("🗑 Removed: <s>" + esc(gone) + "</s>"), kb: cartKb() });
    } else {
      Bot.runCommand("/render", { text: cartText("⚠️ The cart is already empty."), kb: cartKb() });
    }
    return;
  }

  Bot.runCommand("/render", { text: cartText(""), kb: cartKb() });
  return;
}

if (txt === "/npc") { return; }

// Answer run: a new option was typed
if (txt.length > 32) {
  Bot.runCommand("/render", { text: cartText("⚠️ Option too long (" + txt.length + "/32). Send a shorter one:"), kb: cartKb() });
  return;
}

if (np.options.indexOf(txt) >= 0) {
  Bot.runCommand("/render", { text: cartText("⚠️ <b>" + esc(txt) + "</b> is already in the cart. Send a different option:"), kb: cartKb() });
  return;
}

np.options.push(txt);
np.step = "opt";
Bot.setProp({ name: key, value: np, type: "json" });

if (np.options.length >= MAXO) {
  Bot.runCommand("/npOptDone");
  return;
}

Bot.runCommand("/render", { text: cartText("✅ Added <b>" + esc(txt) + "</b> to the cart!"), kb: cartKb() });
