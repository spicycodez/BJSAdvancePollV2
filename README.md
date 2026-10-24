# 🚀 Advance Poll Bot V2 — for Bots.Business (BJS)

A production-ready, **zero-spam Telegram poll bot** written entirely in **BJS** (Bots.Business Script) — ready to import straight into your Bots.Business account.

Built around the **V2 feature set**:

| # | Feature | What it does |
|---|---------|--------------|
| 1 | 🫧 **Zero-Spam Smart UI** | Every menu lives on **one dynamic "Smart Bubble" message** that edits itself in place as you navigate — the chat never fills with message spam. |
| 2 | 🛡 **Multi-Channel Sponsor Gateway** | Each poll can bind up to **2 sponsor channels**. Users must be members of them before a vote counts (verified live via `getChatMember`). |
| 3 | 🔒 **Join-Left Protection** | Vote → leave → lose the vote. Three protection layers: re-verify on interaction, an hourly chunked membership sweep, and a watchdog that re-checks every live poll. Removed votes instantly sync to all posted messages. |
| 4 | 🧱 **Step-by-Step Poll Builder** | Guided 5-step builder (title → description → options → posting channel → sponsor channels) with a **cart-style** options editor — no cryptic syntax, one option per message. |
| 5 | 📊 **Advanced History Dashboard** | Inline per-poll control panel: **pause / resume / stop**, **hide or show vote counts** (instantly synced to every channel post), live stats, forced re-sweep, re-post, delete. |
| 6 | 🧹 **Auto-Cleaning Database** | A self-rescheduling watchdog automatically re-verifies live polls, auto-stops polls at max age and deletes stopped poll data after a grace period — history stays clean and the dashboard stays fast. |

---

## 📁 Repository layout

```
BJSAdvancePollV2/
├── bot.json                  # Bots.Business Git-sync manifest (bb_sync_version 1.0)
├── commands/                 # 52 BJS commands (one file per command)
│   └── *.js                  # Each file starts with a /*CMD ... CMD*/ header
└── README.md
```

The repo uses the **Bots.Business Git repository format** (`bot.json` + `commands/*.js` with `/*CMD` headers), so it can be imported directly — see Quick Start.

---

## ⚡ Quick start

### 1. Create the bot on Telegram
1. Open [@BotFather](https://t.me/BotFather) → `/newbot` → choose a name and username.
2. Copy the **bot token**.

### 2. Connect it to Bots.Business
1. Open the Bots.Business app or web panel.
2. **Bots → ➕ Add Bot** → paste the token.

### 3. Install the commands

**Option A — Git import (recommended, 1 minute):**
> Open your bot in Bots.Business → bot menu → **Git repository / Import** → paste:
> `https://github.com/spicycodez/BJSAdvancePollV2`
> (See *help.bots.business → Git repository* for the exact menu on your platform version.)

**Option B — Manual paste:**
Create each command in the BB command editor and paste the matching file from `commands/`. The command name is inside each file's `/*CMD` header (e.g. `command: /start`). For the aliases (`/menu`, `/newpoll`, `/mypolls`, `/help`), add them in the command's alias field.

### 4. Telegram-side requirements (important!)
- ➕ Add the bot as an **ADMIN** in:
  - your **target posting channel** (where poll messages are published), and
  - every **sponsor channel** (needed for membership verification).
- Sponsor and posting channels must be **public** (`@channelname`) — V2 verifies membership and posts by public username.
- Voters must have **pressed Start** on your bot at least once (Telegram does not deliver bot messages to users who never started it — the gateway uses this for join instructions).
- After setup, run `/setcmds` once inside the bot to register the command menu with Telegram.

### 5. Test drive
```
/start            → Smart Bubble main menu
/newpoll          → step-by-step builder
publish → share → vote from the channel post 🎉
```

---

## 🧭 Command reference (53 commands)

### 👤 User-facing
| Command | Aliases | Purpose |
|---------|---------|---------|
| `/start` | `/menu` | Smart Bubble main menu |
| `/newpoll` | `/npMenu` | Start the step-by-step poll builder |
| `/myPolls` | `/mypolls` | History dashboard (paginated list of your polls) |
| `/help` | `/helpPage` | How to use the bot |
| `/aboutPage` | | About this bot |
| `/npc` | | Cancel the poll builder |
| `/refresh` | | Poll footer button — refresh results + re-verify the voter |
| `/setcmds` | | Register the command list with Telegram (run once after setup) |

### 🧱 Poll builder flow
Every builder step uses a **renderer + waiter** pair: the renderer (`need_reply: false`) shows the prompt on the Smart Bubble and arms the waiter (`need_reply: true`), whose BJS runs only after the user's reply. All buttons point to `need_reply: false` commands so every tap executes instantly.

| Step | Renderer | Waiter (input) | Buttons |
|------|----------|----------------|---------|
| 1 | `/npTitle` | `/npTitleWait` — poll title | ✖ cancel |
| 2 | `/npDesc` | `/npDescWait` — optional description | ⏭ skip (`/npDescSkip`) • ✖ cancel |
| 3 | `/npOpt` | `/npOptWait` — options **cart**, one per message | 🗑 remove last (`/npOptRm`) • ✅ done (`/npOptDone`) • ✖ cancel |
| 4 | `/npChannel` | `/npChannelWait` — target posting channel | 🛒 back to cart • ✖ cancel |
| 5 | `/npSponsor`, `/npSponsor2` | `/npSponsorWait`, `/npSponsor2Wait` — sponsor channels 1–2 (skippable) | ⏭ skip (`/npSponsorSkip`, `/npSponsor2Skip`) • 🔙 back • ✖ cancel |
| ✓ | `/npPreview` | — | 🚀 publish (`/npPublish`) • 📣 channel • 🔒 sponsors • ✖ cancel |

### 📊 Dashboard & poll control
| Command | Purpose |
|---------|---------|
| `/pollAdmin` | Per-poll control panel (params: `pollId`) |
| `/pollAction` | Router — `pause` / `resume` / `stop` / `hide` / `show` / `stats` / `sweep` / `repost` / `del` |

### 🗳 Voting engine
| Command | Purpose |
|---------|---------|
| `/vote` | Vote router — runs the sponsor gateway gate **before** counting |
| `/voteGate` | Gateway error path (bot lacks admin rights / API hiccup) with fix instructions |
| `/voteCheck` → `/voteCheckRes` | `getChatMember` gate walker across sponsor channels |
| `/voteCount` | Records the vote and refreshes every posted poll message |

### 🔒 Join-Left Protection & auto-clean
| Command | Purpose |
|---------|---------|
| `/sweepPoll` → `/sweepNext` | Chunked membership re-verification (5 voters per pass, yields between chunks) |
| `/cleanSweep` | **Watchdog** — hourly self-rescheduling loop: re-verifies live polls, auto-stops expired polls, cleans stopped data |
| `/doCleanup` | Deletes a poll and all of its data, including dashboard references |

### ⚙️ Internal (called by buttons & chains — no need to touch)
| Command | Purpose |
|---------|---------|
| `/render`, `/renderNew`, `/bubbleSave`, `/bubbleKeep` | Smart Bubble renderer (edit-in-place with automatic fallback) |
| `/pollRender` | Rebuilds and updates **all** posted poll messages |
| `/npPost` → `/npPosted` | Publishes the poll message to the target channel and stores its message id |
| `/npResolve` → `/npResolveRes` | Resolves target/sponsor channels during publish |
| `/repostRes` | Registers a re-posted copy of a poll message |
| `/npFail` | Publish/post failure handler with actionable fix instructions (re-arms the builder for Retry) |
| `/ignoreErr` | Swallows expected Telegram API errors (deleted messages, etc.) |
| `/noop` | Do-nothing button target |
| `!` | Friendly error fallback shown by BBS when a command errors in private chat |
| `/setcmdsDone` | Confirmation for `/setcmds` |

---

## 🏗 How it works

- **Smart Bubble** — every menu render goes through `/render`: it tries `editMessageText` on the user's stored bubble message id; if the edit fails (message deleted, too old) it falls back to `/renderNew` (fresh send) and re-registers the new id. One message, forever.
- **Renderer/waiter builder** — Bots.Business runs a `need_reply` command's BJS **after** the user's reply, never when the prompt is first sent. So each builder step is a pair: a renderer that paints the prompt instantly, and a waiter that processes the typed answer. Buttons always target instant (`need_reply: false`) commands.
- **Chain breakers** — Bots.Business silently kills nested command/callback chains that get too long ("Too many sub commands"). Multi-step async flows (publish → resolve → post → finalize, sponsor gate walks, membership sweeps) therefore hop to their next stage with `Bot.run({ run_after: 1 })`, which starts a **fresh dispatcher chain** and carries the payload in `options`. No chain in this bot exceeds ~4 commands.
- **Small-caps typography** — all user-facing text (menus, buttons, notices, channel posts) is stylized in **Unicode small caps** (ʟɪᴋᴇ ᴛʜɪꜱ) for a clean, premium look. Command names, storage keys and routing strings stay plain ASCII so nothing breaks.
- **Sponsor Gateway** — `/vote` walks each bound sponsor channel via `Api.getChatMember`; non-members get join buttons instead of a counted vote. Each gate step is its own command so long chains never hit BJS step limits.
- **Join-Left Protection (3 layers)** — ① every poll footer has a *Refresh* button that re-verifies the voter on the spot; ② the hourly watchdog schedules a chunked `/sweepPoll` per live poll (5 voters per pass, yielding between chunks to stay light); ③ removed votes decrement counters and all posted messages are re-rendered instantly.
- **Hide votes** — `hide` toggles per poll; when on, every posted message shows options without counts. Toggling re-renders every channel post at once.
- **Storage** — BB built-in properties: `poll_<id>` (poll record incl. voters map), `polls_index` (all poll ids), `u<bbid>_np` (builder state), `u<bbid>_mypolls` (owner's dashboard index), plus per-user bubble/state keys.
- **Watchdog** — `/cleanSweep` re-schedules itself hourly (`Bot.run` label `autoclean`): sweeps live polls that are due, auto-stops polls older than `max_age_days`, and deletes stopped polls `stop_clean_hours` after they were stopped (including dashboard cleanup).

### ⚙️ Tunables (defaults in code)
| Config key | Default | Meaning |
|------------|---------|---------|
| `sweep_interval_min` | `60` | Minutes between membership sweeps per live poll |
| `sweep_chunk` | `5` | Voters verified per sweep pass before yielding |
| `stop_clean_hours` | `48` | Hours a stopped poll's data survives before auto-delete |
| `max_age_days` | `30` | Poll lifetime before the watchdog auto-stops it |

---

## ⚠️ Requirements & limits

- Works on the **free Bots.Business tier** (10M iterations/month) — the chunked sweep keeps per-hour usage tiny even with many live polls.
- Sponsor/posting channels must be **public** (`@name`).
- Bot needs **admin rights** in the channels it verifies or posts to.
- Polls scale comfortably to **~2,000 voters** per poll (BB property size reality); beyond that, consider migrating the voters map to BB's Data database.
- Voters must have **started** the bot once, or Telegram won't let the bot DM them join instructions.

## 🩺 Troubleshooting

| Symptom | Fix |
|---------|-----|
| "Join not detected" for a real member | Bot must be **admin** in that sponsor channel; channel must be public `@name` |
| Poll message in channel doesn't update | The original post was deleted or the bot lost admin — use **Repost** from the poll panel |
| User got no join instructions | User never pressed **Start** on the bot — ask them to `/start` first |
| Dashboard shows a dead poll entry | It will vanish on the next cleanup pass, or press **Delete** in the poll panel |
| Buttons do nothing after re-install | Re-import commands, then `/start` again to rebuild the Smart Bubble |

## 🔐 Security notes

- **Never commit your bot token** — it lives only in your Bots.Business account.
- If you used a personal access token (PAT) to clone/push this repo, **revoke and rotate it** after use — PATs pasted into chats are considered exposed.

---

Made with ❤️ for the Bots.Business platform · All BJS, no external servers.
