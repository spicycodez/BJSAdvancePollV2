/*CMD
command: /npSponsor
help: Builder step 5 — sponsor channel 1 of 2
need_reply: true
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);
if (!np || !np.channel) { Bot.runCommand("/npMenu"); return; }

var txt = String(message == null ? "" : message).trim();

function ask() {
  Bot.runCommand("/render", {
    text: "🏗 <b>Poll Builder</b> — Step 5/5\n🔒 <b>Sponsor Gateway</b> (1 of 2)\n\n" +
      "Attach a <b>SPONSOR CHANNEL</b>: only members of it will be able to vote — perfect for cross-promotion.\n\n" +
      "Send a public channel as <code>@channelname</code>,\nor tap <b>Skip</b> to continue without sponsors.\n\n" +
      "⚠️ Add me as an <b>admin</b> of the sponsor channel (membership checks).",
    kb: [
      [{ title: "⏭ Skip", command: "/npSponsor skip" }],
      [{ title: "📣 Back", command: "/npChannel" }],
      [{ title: "✖ Cancel", command: "/npc" }]
    ]
  });
}

// First run or Skip button
if (txt.indexOf("/npSponsor") === 0 || txt === "") {
  if (txt.indexOf("skip") >= 0) {
    np.sponsors = [];
    np.step = "sponsor2";
    Bot.setProp({ name: key, value: np, type: "json" });
    Bot.runCommand("/npSponsor2");
    return;
  }
  ask();
  return;
}

if (txt === "/npc") { return; }

var sp = txt.replace("https://t.me/", "").replace("t.me/", "").replace(/^@/, "").trim();

if (!/^[A-Za-z0-9_]{4,64}$/.test(sp)) {
  Bot.runCommand("/render", {
    text: "⚠️ Sponsor channels must be public — send <code>@channelname</code>:",
    kb: [[{ title: "⏭ Skip", command: "/npSponsor skip" }], [{ title: "✖ Cancel", command: "/npc" }]]
  });
  return;
}

np.sponsors = [{ user: sp }];
np.step = "sponsor2";
Bot.setProp({ name: key, value: np, type: "json" });

Bot.runCommand("/npSponsor2");
