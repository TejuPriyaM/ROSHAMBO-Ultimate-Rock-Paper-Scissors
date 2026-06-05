# 🪨 ROSHAMBO — Ultimate Rock Paper Scissors

<p align="center">
  <a href="https://rpsrush.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/🎮%20Live%20Demo-rpsrush.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" />
</p>

<p align="center">
  A premium, neon-styled Rock Paper Scissors game with animated battles, a Web Audio synth engine, win-streak tracking, and Netlify Forms match-history logging — all in one HTML/CSS/JS file bundle.
</p>

<p align="center">
  🔗 <strong>Live Site:</strong> <a href="https://rpsrush.netlify.app/">https://rpsrush.netlify.app/</a>
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Premium Dark UI** | Glassmorphism cards, neon gradients & animated cosmic background |
| 🔊 **Web Audio Synth** | No audio files needed — sound effects generated via Web Audio API |
| ⚡ **Hologram Effect** | CPU "scanning" animation before revealing its choice |
| 🏆 **Win Streak Tracker** | Live dashboard showing player score, CPU score & current streak |
| 📜 **Match History** | Last 5 rounds shown in real-time with win/lose/draw badges |
| 📋 **Netlify Forms** | Every match is silently submitted to Netlify Forms for persistent history |
| 💾 **LocalStorage** | Scores and history are preserved across page refreshes |
| 📱 **Fully Responsive** | Optimised for mobile, tablet and desktop |

---

## 🎮 How to Play

1. Open the game in your browser.
2. Click **Rock**, **Paper**, or **Scissors** to make your move.
3. Watch the CPU "think" with a holographic scanning animation.
4. The result is revealed — win, lose, or draw — with a matching sound effect.
5. The match is logged to **Match History** and submitted silently to Netlify Forms.
6. Click **NEXT ROUND** (or wait 5 seconds) to play again.

---

## 🗂 Project Structure

```
WebDev-Game1-main/
├── index.html          ← Game layout + global SVG gradients + hidden Netlify Form
├── style.css           ← Full design system (variables, animations, responsive)
├── script.js           ← Game logic, audio engine, Netlify Forms integration
├── netlify-deploy/     ← Production-ready folder for Netlify drag-and-drop deploy
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

---

## 🚀 Deploying to Netlify

### Option 1 — Drag & Drop (Easiest)

1. Go to [https://app.netlify.com](https://app.netlify.com) and log in.
2. Navigate to **Sites → Add new site → Deploy manually**.
3. Drag and drop the **`netlify-deploy/`** folder into the upload zone.
4. Netlify will detect the hidden `<form data-netlify="true">` tag automatically and register the **`roshambo-match-history`** form.

### Option 2 — GitHub + Netlify CI/CD

1. Push this repository to GitHub (see **GitHub Setup** below).
2. In Netlify → **Add new site → Import an existing project**.
3. Connect your GitHub repo.
4. Set **Publish directory** to `netlify-deploy`.
5. Click **Deploy site**.

---

## 📋 Netlify Forms — Match History

The game silently POSTs every completed round to Netlify Forms with the following fields:

| Field | Value |
|---|---|
| `player-score` | Player's current total score |
| `cpu-score` | CPU's current total score |
| `win-streak` | Current win streak |
| `player-choice` | rock / paper / scissors |
| `cpu-choice` | rock / paper / scissors |
| `result` | WIN / LOSE / DRAW |
| `timestamp` | Time of the round (HH:MM:SS) |

To view submissions:
1. Open your Netlify site dashboard.
2. Go to **Forms** in the top navigation.
3. Click on **roshambo-match-history** to see all logged matches.

---

## 🖥 Running Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/roshambo.git
cd roshambo

# Start a local server (Python 3)
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

> ⚠️ **Note:** Netlify Forms submissions only work when deployed on Netlify. Local form posts will silently fail (this is expected behaviour).

---

## 🛠 Tech Stack

- **HTML5** — Semantic structure, global SVG `<defs>` for gradient reuse
- **CSS3** — Custom properties, glassmorphism, keyframe animations, responsive grid
- **Vanilla JavaScript** — Game logic, Web Audio API synth, localStorage, Netlify Forms fetch
- **Netlify** — Hosting + serverless form handling

---

## 📄 License

MIT — free to use, modify and distribute.

---

<p align="center">Built with 💙 by <strong>Tejupriya</strong></p>
