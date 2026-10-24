/*CMD
command: /npChannel
help: Builder step 4 — target posting channel
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.title || !np.options || np.options.length < 2) { Bot.runCommand("/npMenu"); return; }

var txt = String(message == null ? "" : message).trim();

function ask() {
  Bot.runCommand("/render", {
    text: "🏗 <b>Poll Builder</b> — Step 4/5\n\n" +
      "📣 Send the <b>CHANNEL</b> where the poll should be posted.\n\n" +
      "Accepts:\n" +
      "• Public: <code>@yourchannel</code>\n" +
      "• Private ID: <code>-1001234567890</code>\n\n" +
      "⚠️ <b>Important:</b> add me as an <b>admin</b> of that channel with the <b>Post Messages</b> permission, or publishing will fail.",
    kb: [
      [{ title: "🛒 Back to Cart", command: "/npOpt" }],
      [{ title: "✖ Cancel", command: "/npc" }]
    ]
  });
}

// First run
if (txt.indexOf("/npChannel") === 0 || txt === "") {
  ask();
  return;
}

if (txt === "/npc") { return; }

// Normalize input: strip https://t.me/, @
var ch = txt.replace("https://t.me/", "").replace("t.me/", "").replace(/^@/, "").trim();

var okPublic = /^[A-Za-z0-9_]{4,64}$/.test(ch);
var okId = /^-100\d{6,}$/.test(ch);

if (!okPublic && !okId) {
  Bot.runCommand("/render", {
    text: "⚠️ That doesn't look like a channel.\n\nSend <code>@channelname</code> or a private channel ID (<code>-100...</code>):",
    kb: [[{ title: "✖ Cancel", command: "/npc" }]]
  });
  return;
}

np.channel = okId ? ch : ("@" + ch);
np.step = "sponsor1";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npSponsor");
