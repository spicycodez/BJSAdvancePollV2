/*CMD
command: /npTitle
help: Builder step 1 — poll title
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np) { Bot.runCommand("/npMenu"); return; }

var txt = String(message == null ? "" : message).trim();

// First run (invoked, not an answer): ask the question
if (txt.indexOf("/npTitle") === 0 || txt === "") {
  Bot.runCommand("/render", {
    text: "🏗 <b>Poll Builder</b> — Step 1/5\n\n" +
      "📝 Send me the <b>TITLE</b> of your poll as a message.\n\n" +
      "<i>Example: Weekly Community Choice Awards</i>\n\n" +
      "Characters: 3–100.",
    kb: [[{ title: "✖ Cancel", command: "/npc" }]]
  });
  return;
}

if (txt === "/npc") { return; }

// Answer run: validate and store
if (txt.length < 3 || txt.length > 100) {
  Bot.runCommand("/render", {
    text: "⚠️ The title must be <b>3–100</b> characters. You sent " + txt.length + ".\n\n📝 Send the <b>TITLE</b> again:",
    kb: [[{ title: "✖ Cancel", command: "/npc" }]]
  });
  return;
}

np.title = txt;
np.step = "desc";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npDesc");
