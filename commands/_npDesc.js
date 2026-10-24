/*CMD
command: /npDesc
help: Builder step 2 — optional description
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title) { Bot.runCommand("/npMenu"); return; }

var txt = String(message == null ? "" : message).trim();

function ask() {
  Bot.runCommand("/render", {
    text: "🏗 <b>Poll Builder</b> — Step 2/5\n\n" +
      "🗒 Send an optional <b>DESCRIPTION</b> for your poll,\n" +
      "or tap <b>Skip</b>.\n\n" +
      "Current title: <b>" + esc(np.title) + "</b>\n\n" +
      "Max length: 200 characters.",
    kb: [
      [{ title: "⏭ Skip", command: "/npDesc skip" }],
      [{ title: "✖ Cancel", command: "/npc" }]
    ]
  });
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// First run or Skip button
if (txt.indexOf("/npDesc") === 0 || txt === "") {
  if (txt.indexOf("skip") >= 0) {
    np.desc = "";
    np.step = "opt";
    Bot.setProp({ name: key, value: np, type: "json" });
    Bot.runCommand("/npOpt");
    return;
  }
  ask();
  return;
}

if (txt === "/npc") { return; }

if (txt.length > 200) {
  Bot.runCommand("/render", {
    text: "⚠️ Description too long (" + txt.length + "/200). Send a shorter one:",
    kb: [[{ title: "⏭ Skip", command: "/npDesc skip" }], [{ title: "✖ Cancel", command: "/npc" }]]
  });
  return;
}

np.desc = txt;
np.step = "opt";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npOpt");
