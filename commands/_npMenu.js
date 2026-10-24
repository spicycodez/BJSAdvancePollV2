/*CMD
command: /npMenu
aliases: /newpoll
help: Start (or resume) the step-by-step poll builder
need_reply: false
CMD*/

if (!user) { return; }
var key = "u" + user.id + "_np";
var np = Bot.getProp(key);

if (!np || !np.step || np.step === "done") {
  np = { step: "title", title: "", desc: "", options: [], channel: "", sponsors: [] };
  Bot.setProp({ name: key, value: np, type: "json" });
}

// Route to the step the user is actually on (resume-safe)
var route = {
  title: "/npTitle",
  desc: "/npDesc",
  opt: "/npOpt",
  channel: "/npChannel",
  sponsor1: "/npSponsor",
  sponsor2: "/npSponsor2",
  preview: "/npPreview",
  publishing: "/npPreview"
};

Bot.runCommand(route[np.step] || "/npTitle");
