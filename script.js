const year = document.getElementById("year");
const equation = document.getElementById("equation");
const questionHint = document.getElementById("questionHint");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const answerFeedback = document.getElementById("answerFeedback");
const strikeButton = document.getElementById("strikeButton");
const beginButton = document.getElementById("beginButton");
const beginButtonText = document.getElementById("beginButtonText");
const gameStatus = document.getElementById("gameStatus");
const arenaMessage = document.getElementById("arenaMessage");
const arenaScene = document.getElementById("arenaScene");
const battleCard = document.getElementById("battleCard");
const dragonHealthText = document.getElementById("dragonHealthText");
const knightHealthText = document.getElementById("knightHealthText");
const dragonHealthFill = document.getElementById("dragonHealthFill");
const knightHealthFill = document.getElementById("knightHealthFill");
const dragonHealthTrack = document.getElementById("dragonHealthTrack");
const knightHealthTrack = document.getElementById("knightHealthTrack");
const attackCountdown = document.getElementById("attackCountdown");
const attackTimerFill = document.getElementById("attackTimerFill");
const streakCount = document.getElementById("streakCount");
const roundLabel = document.getElementById("roundLabel");
const difficultyDescriptor = document.getElementById("difficultyDescriptor");
const difficultyButtons = [...document.querySelectorAll(".difficulty-option")];
const paceDescriptor = document.getElementById("paceDescriptor");
const paceButtons = [...document.querySelectorAll(".pace-option")];
const knightNameInput = document.getElementById("knightName");
const knightFigure = document.getElementById("knightFigure");
const knightArtwork = document.getElementById("knightArtwork");
const leaderboardRows = document.getElementById("leaderboardRows");
const leaderboardStatus = document.getElementById("leaderboardStatus");
const leaderboardScope = document.getElementById("leaderboardScope");
const leaderboardPace = document.getElementById("leaderboardPace");
const leaderboardTrial = document.getElementById("leaderboardTrial");
const leaderboardRefresh = document.getElementById("leaderboardRefresh");
let leaderboardRequestController = null;

const paceSettings = {
  easy: { label: "Easy", attackEvery: 14, damage: 15 },
  medium: { label: "Medium", attackEvery: 9, damage: 25 },
  hard: { label: "Hard", attackEvery: 5, damage: 35 },
};

const supabaseConfig = window.DRAGON_TRIAL_SUPABASE_CONFIG;
const localScoresKey = "dragons-trial-scores-v1";

const knightLooks = [
  {
    name: "Emberforged",
    armorLight: "#f0d7b6", armorMid: "#a78360", armorDark: "#594047",
    helmet: "#c1976a", capeLight: "#dc6b40", capeDark: "#65323a",
    capeTrim: "#f0a35f", trim: "#e5c494", trimLight: "#ffe0a6",
    accent: "#ffd078", visor: "#303039", shield: "#855143",
    blade: "#eadfc9", boot: "#433039", aura: "rgba(224, 120, 63, 0.21)",
  },
  {
    name: "Frostguard",
    armorLight: "#e6f0ed", armorMid: "#92abb2", armorDark: "#435d70",
    helmet: "#c2d7d4", capeLight: "#527a91", capeDark: "#283b56",
    capeTrim: "#a7dae1", trim: "#c3d8d1", trimLight: "#f1f8e9",
    accent: "#9ce5df", visor: "#253542", shield: "#41677d",
    blade: "#e4f2ee", boot: "#273642", aura: "rgba(114, 191, 207, 0.2)",
  },
  {
    name: "Verdant",
    armorLight: "#e7e5c5", armorMid: "#98a174", armorDark: "#435444",
    helmet: "#c6c695", capeLight: "#68834e", capeDark: "#34473e",
    capeTrim: "#bac880", trim: "#d2c68d", trimLight: "#eee2ad",
    accent: "#d8d876", visor: "#30372d", shield: "#526447",
    blade: "#e4e6d3", boot: "#303d32", aura: "rgba(154, 183, 107, 0.2)",
  },
  {
    name: "Royal",
    armorLight: "#eddbef", armorMid: "#a490b0", armorDark: "#53435d",
    helmet: "#cfb8d5", capeLight: "#8d5d9c", capeDark: "#44354f",
    capeTrim: "#d6a5d9", trim: "#d6c1df", trimLight: "#f4e3f2",
    accent: "#e5b3e8", visor: "#342a3d", shield: "#704b7e",
    blade: "#eee5f0", boot: "#392f40", aura: "rgba(181, 126, 201, 0.19)",
  },
  {
    name: "Sunward",
    armorLight: "#f5e1b5", armorMid: "#b69560", armorDark: "#5b4938",
    helmet: "#d6b77a", capeLight: "#bd713d", capeDark: "#593a32",
    capeTrim: "#eab05b", trim: "#e4cb98", trimLight: "#fff0c1",
    accent: "#ffe293", visor: "#352f2b", shield: "#87613e",
    blade: "#f2ead5", boot: "#44362c", aura: "rgba(230, 171, 83, 0.2)",
  },
  {
    name: "Stormborn",
    armorLight: "#e1e4eb", armorMid: "#929bac", armorDark: "#414b5e",
    helmet: "#bac5cf", capeLight: "#586c85", capeDark: "#303848",
    capeTrim: "#abb9d4", trim: "#c3c6d3", trimLight: "#e8e4d7",
    accent: "#bfc9fa", visor: "#282e3a", shield: "#465976",
    blade: "#e9edf0", boot: "#2b303d", aura: "rgba(143, 164, 213, 0.2)",
  },
  {
    name: "Rosekeep",
    armorLight: "#f1d8d1", armorMid: "#ae858c", armorDark: "#59414c",
    helmet: "#d2a7a5", capeLight: "#a84f59", capeDark: "#50313e",
    capeTrim: "#e39c8b", trim: "#e1bdb0", trimLight: "#f7e3ce",
    accent: "#ffc49d", visor: "#382c37", shield: "#854553",
    blade: "#f1e4de", boot: "#43303c", aura: "rgba(213, 111, 116, 0.19)",
  },
  {
    name: "Dusksteel",
    armorLight: "#e5ded2", armorMid: "#988677", armorDark: "#48404a",
    helmet: "#c1ad94", capeLight: "#71607b", capeDark: "#3d3347",
    capeTrim: "#c19d9b", trim: "#d0b998", trimLight: "#ecdbba",
    accent: "#d7b69a", visor: "#2d2932", shield: "#615163",
    blade: "#e9e3da", boot: "#332e38", aura: "rgba(160, 126, 166, 0.2)",
  },
];

const knightStyleProperties = {
  armorLight: "--knight-armor-light",
  armorMid: "--knight-armor-mid",
  armorDark: "--knight-armor-dark",
  helmet: "--knight-helmet",
  capeLight: "--knight-cape-light",
  capeDark: "--knight-cape-dark",
  capeTrim: "--knight-cape-trim",
  trim: "--knight-trim",
  trimLight: "--knight-trim-light",
  accent: "--knight-accent",
  visor: "--knight-visor",
  shield: "--knight-shield",
  blade: "--knight-blade",
  boot: "--knight-boot",
  aura: "--knight-aura-color",
};

const difficulties = [
  { topic: "Addition" },
  { topic: "Subtraction" },
  { topic: "Multiplication" },
  { topic: "Division" },
  { topic: "Order of operations" },
  { topic: "Powers and roots" },
  { topic: "Fractions and percentages" },
  { topic: "Algebra" },
  { topic: "Trigonometry" },
  { topic: "Calculus and trigonometry" },
];

const game = {
  difficulty: 1,
  pace: "easy",
  knightName: "",
  running: false,
  health: 100,
  dragonHealth: 100,
  streak: 0,
  round: 1,
  correctAnswers: 0,
  hitsTaken: 0,
  answer: null,
  attackRemaining: 0,
  attackInterval: null,
  currentQuestion: null,
};

if (year) {
  year.textContent = new Date().getFullYear();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateKnightAppearance(name) {
  const normalizedName = name.trim().replace(/\s+/g, " ").toLocaleLowerCase();
  let hash = 0x811c9dc5;
  for (const character of normalizedName) {
    hash = Math.imul(hash ^ character.codePointAt(0), 0x01000193);
  }
  hash >>>= 0;

  const palette = knightLooks[hash % knightLooks.length];
  for (const [property, cssProperty] of Object.entries(knightStyleProperties)) {
    knightFigure.style.setProperty(cssProperty, palette[property]);
  }

  const crest = normalizedName ? (hash >>> 8) % 4 : 0;
  const weapon = normalizedName ? (hash >>> 16) % 4 : 0;
  const weapons = ["sword", "spear", "battle axe", "war hammer"];
  knightFigure.dataset.crest = String(crest);
  knightFigure.dataset.weapon = String(weapon);
  knightArtwork.setAttribute(
    "aria-label",
    normalizedName
      ? `${name.trim()}'s ${palette.name} armor, ${weapons[weapon]}, and ${["star", "moon", "diamond", "cross"][crest]} shield crest`
      : "Illustration of an armored knight holding a sword",
  );
}

function makeQuestion(level) {
  const choice = (items) => items[randomInt(0, items.length - 1)];
  const roundedQuestion = (display, answer, hint) => ({
    display,
    answer: Math.round(answer * 100) / 100,
    tolerance: 0.011,
    hint,
  });

  if (level === 1) {
    const first = randomInt(1, 20);
    const second = randomInt(1, 20);
    return { display: `${first} + ${second}`, answer: first + second };
  }
  if (level === 2) {
    const first = randomInt(15, 60);
    const second = randomInt(1, first);
    return { display: `${first} − ${second}`, answer: first - second };
  }
  if (level === 3) {
    const first = randomInt(2, 12);
    const second = randomInt(2, 12);
    return { display: `${first} × ${second}`, answer: first * second };
  }
  if (level === 4) {
    const divisor = randomInt(2, 15);
    const quotient = randomInt(2, 20);
    return { display: `${divisor * quotient} ÷ ${divisor}`, answer: quotient };
  }
  if (level === 5) {
    const first = randomInt(2, 12);
    const second = randomInt(2, 12);
    const third = randomInt(2, 12);
    if (Math.random() < 0.5) {
      return {
        display: `${first} + ${second} × ${third}`,
        answer: first + second * third,
      };
    }
    return {
      display: `(${first} + ${second}) × ${third}`,
      answer: (first + second) * third,
    };
  }
  if (level === 6) {
    const base = randomInt(2, 12);
    if (Math.random() < 0.5) {
      return { display: `${base}²`, answer: base ** 2 };
    }
    const root = randomInt(2, 15);
    return { display: `√${root ** 2}`, answer: root };
  }
  if (level === 7) {
    if (Math.random() < 0.5) {
      const firstDenominator = choice([2, 4, 5, 10]);
      const secondDenominator = choice([2, 4, 5, 10]);
      const firstNumerator = randomInt(1, firstDenominator - 1);
      const secondNumerator = randomInt(1, secondDenominator - 1);
      return roundedQuestion(
        `${firstNumerator}/${firstDenominator} + ${secondNumerator}/${secondDenominator}`,
        firstNumerator / firstDenominator + secondNumerator / secondDenominator,
        "Add the fractions · Round to 2 decimals",
      );
    }
    const percent = randomInt(5, 80);
    const value = randomInt(2, 20) * 10;
    return roundedQuestion(
      `${percent}% of ${value}`,
      (percent / 100) * value,
      "Find the percentage · Round to 2 decimals",
    );
  }
  if (level === 8) {
    const coefficient = randomInt(2, 12);
    const answer = randomInt(-8, 12);
    const constant = randomInt(-15, 20);
    const result = coefficient * answer + constant;
    const signedConstant = constant < 0 ? `− ${Math.abs(constant)}` : `+ ${constant}`;
    return {
      display: `${coefficient}x ${signedConstant} = ${result}`,
      answer,
      hint: "Solve for x",
      completeEquation: true,
    };
  }
  if (level === 9) {
    const angle = choice([0, 30, 45, 60, 90]);
    const functionName = choice(
      angle === 90 ? ["sin", "cos"] : ["sin", "cos", "tan"],
    );
    const radians = (angle * Math.PI) / 180;
    const exactAnswer =
      functionName === "sin"
        ? Math.sin(radians)
        : functionName === "cos"
          ? Math.cos(radians)
          : Math.tan(radians);
    return roundedQuestion(
      `${functionName}(${angle}°)`,
      exactAnswer,
      "Find the trig value · Round to 2 decimals",
    );
  }

  const problem = randomInt(0, 3);
  if (problem === 0) {
    const power = randomInt(2, 5);
    const at = randomInt(2, 5);
    return {
      display: `d/dx (x${["", "", "²", "³", "⁴", "⁵"][power]}), x = ${at}`,
      answer: power * at ** (power - 1),
      hint: "Use the power rule · Differentiate, then substitute x",
    };
  }
  if (problem === 1) {
    const at = choice([0, 1, 2, 3]);
    return roundedQuestion(
      `d/dx (sin x), x = ${at}`,
      Math.cos(at),
      "Differentiate sin x, then substitute · Round to 2 decimals",
    );
  }
  if (problem === 2) {
    const coefficient = randomInt(2, 5);
    const at = randomInt(2, 6);
    const linearTerm = randomInt(1, 9);
    return {
      display: `d/dx (${coefficient}x² + ${linearTerm}x), x = ${at}`,
      answer: 2 * coefficient * at + linearTerm,
      hint: "Differentiate each term, then substitute x",
    };
  }

  const power = randomInt(1, 3);
  const upperBound = randomInt(2, 4);
  return roundedQuestion(
    `∫₀${["", "", "²", "³", "⁴"][upperBound]} x${power === 1 ? "" : ["", "", "²", "³"][power]} dx`,
    upperBound ** (power + 1) / (power + 1),
    "Evaluate the definite integral · Round to 2 decimals",
  );
}

function showQuestion() {
  game.currentQuestion = makeQuestion(game.difficulty);
  game.answer = game.currentQuestion.answer;
  equation.classList.toggle("is-advanced", game.difficulty >= 8);
  const prompt = game.currentQuestion.completeEquation
    ? ' <span>→ x =</span> ?'
    : ' <span>=</span> ?';
  equation.innerHTML = `${game.currentQuestion.display}${prompt}`;
  equation.setAttribute(
    "aria-label",
    game.currentQuestion.completeEquation
      ? `${game.currentQuestion.display}; solve for x`
      : `${game.currentQuestion.display} equals what?`,
  );
  questionHint.textContent =
    game.currentQuestion.hint || "Solve it to land a blow";
}

function setHealthBar(health, text, fill, track) {
  text.innerHTML = `${health} <small>/ 100</small>`;
  fill.style.width = `${health}%`;
  track.setAttribute("aria-valuenow", String(health));
}

function updateAttackClock() {
  const total = paceSettings[game.pace].attackEvery;
  const remaining = Math.max(0, game.attackRemaining);
  attackCountdown.textContent = game.running ? `${remaining.toFixed(1)}s` : "—";
  attackTimerFill.style.width = game.running
    ? `${((total - remaining) / total) * 100}%`
    : "0%";
}

function setFeedback(message, kind = "") {
  answerFeedback.textContent = message;
  answerFeedback.classList.toggle("is-correct", kind === "correct");
  answerFeedback.classList.toggle("is-wrong", kind === "wrong");
}

function animateClass(element, className, duration = 650) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  window.setTimeout(() => element.classList.remove(className), duration);
}

function setControlsDisabled(disabled) {
  [...difficultyButtons, ...paceButtons].forEach((button) => {
    button.disabled = disabled;
  });
}

function calculateScore(won) {
  return Math.max(
    0,
    game.correctAnswers * 100 - game.hitsTaken * 25 + (won ? 500 : 0),
  );
}

function startBattle() {
  const knightName = knightNameInput.value.trim().replace(/\s+/g, " ").slice(0, 24);
  if (!knightName) {
    gameStatus.className = "challenge-status";
    gameStatus.textContent = "Enter your knight's name before beginning the battle.";
    knightNameInput.focus();
    return;
  }

  window.clearInterval(game.attackInterval);
  updateKnightAppearance(knightName);
  game.knightName = knightName;
  game.running = true;
  game.health = 100;
  game.dragonHealth = 100;
  game.streak = 0;
  game.round = 1;
  game.correctAnswers = 0;
  game.hitsTaken = 0;
  game.attackRemaining = paceSettings[game.pace].attackEvery;
  arenaScene.classList.remove("is-victory", "is-defeat");
  beginButtonText.textContent = "RESTART THE BATTLE";
  setControlsDisabled(true);
  knightNameInput.disabled = true;
  setHealthBar(game.dragonHealth, dragonHealthText, dragonHealthFill, dragonHealthTrack);
  setHealthBar(game.health, knightHealthText, knightHealthFill, knightHealthTrack);
  streakCount.textContent = "0";
  roundLabel.textContent = "ROUND 01";
  gameStatus.className = "challenge-status";
  gameStatus.textContent = `${knightName}, level ${game.difficulty}: ${difficulties[game.difficulty - 1].topic}. Make every answer count.`;
  arenaMessage.lastElementChild.textContent = `${knightName} faces the dragon. Solve quickly and strike.`;
  setFeedback("A right answer lands a blow. Stay sharp.");
  answerInput.disabled = false;
  strikeButton.disabled = false;
  answerInput.value = "";
  showQuestion();
  updateAttackClock();
  game.attackInterval = window.setInterval(tick, 100);
  answerInput.focus();
}

function finishBattle(won) {
  game.running = false;
  window.clearInterval(game.attackInterval);
  setControlsDisabled(false);
  knightNameInput.disabled = false;
  answerInput.disabled = true;
  strikeButton.disabled = true;
  beginButtonText.textContent = "FIGHT AGAIN";
  arenaScene.classList.add(won ? "is-victory" : "is-defeat");
  gameStatus.className = `challenge-status ${won ? "is-victory" : "is-defeat"}`;
  const score = calculateScore(won);
  if (won) {
    gameStatus.textContent = `Victory, ${game.knightName}! Dragon defeated in ${game.round} strikes · ${score.toLocaleString()} points.`;
    arenaMessage.lastElementChild.textContent = "The wyrm is vanquished. The kingdom is yours again.";
    questionHint.textContent = "A legend is born";
    equation.textContent = "VICTORY";
    equation.classList.remove("is-advanced");
    equation.setAttribute("aria-label", "Victory. You defeated the dragon.");
    setFeedback("The dragon has fallen. A glorious victory!", "correct");
  } else {
    gameStatus.textContent = `${game.knightName} fell in battle · ${score.toLocaleString()} points. Take a breath and try again.`;
    arenaMessage.lastElementChild.textContent = "The flames have won this round. A knight may rise again.";
    questionHint.textContent = "The trial is not over";
    equation.textContent = "DEFEAT";
    equation.classList.remove("is-advanced");
    equation.setAttribute("aria-label", "Defeat. Your knight was defeated.");
    setFeedback("The knight needs a rematch. You'll get it next time.", "wrong");
  }
  updateAttackClock();
  void saveRun(won);
}

function dragonAttacks() {
  const damage = paceSettings[game.pace].damage;
  game.hitsTaken += 1;
  game.health = Math.max(0, game.health - damage);
  game.streak = 0;
  streakCount.textContent = "0";
  setHealthBar(game.health, knightHealthText, knightHealthFill, knightHealthTrack);
  setFeedback(`The dragon deals ${damage} damage! Answer faster to strike back.`, "wrong");
  arenaMessage.lastElementChild.textContent = `The dragon breathes fire! Your knight loses ${damage} health.`;
  animateClass(battleCard, "is-under-fire");

  if (game.health === 0) {
    finishBattle(false);
    return;
  }

  game.attackRemaining = paceSettings[game.pace].attackEvery;
}

function tick() {
  if (!game.running) return;
  game.attackRemaining = Math.max(0, game.attackRemaining - 0.1);
  updateAttackClock();
  if (game.attackRemaining <= 0) dragonAttacks();
}

function handleAnswer(event) {
  event.preventDefault();
  if (!game.running) return;

  const enteredAnswer = answerInput.value.trim();
  if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(enteredAnswer)) {
    setFeedback("Enter a number to strike.", "wrong");
    answerInput.focus();
    return;
  }

  const tolerance = game.currentQuestion.tolerance || 0;
  if (Math.abs(Number(enteredAnswer) - game.answer) > tolerance) {
    game.streak = 0;
    streakCount.textContent = "0";
    setFeedback("Not quite. Try again before the flames arrive.", "wrong");
    animateClass(answerForm, "is-shaking", 380);
    answerInput.select();
    return;
  }

  game.dragonHealth = Math.max(0, game.dragonHealth - 20);
  game.streak += 1;
  game.correctAnswers += 1;
  streakCount.textContent = String(game.streak);
  setHealthBar(game.dragonHealth, dragonHealthText, dragonHealthFill, dragonHealthTrack);
  animateClass(battleCard, "is-striking", 420);
  setFeedback("A direct hit! Keep up the pressure.", "correct");
  arenaMessage.lastElementChild.textContent = "Your blade finds its mark. The dragon staggers.";

  if (game.dragonHealth === 0) {
    finishBattle(true);
    return;
  }

  game.round += 1;
  roundLabel.textContent = `ROUND ${String(game.round).padStart(2, "0")}`;
  answerInput.value = "";
  showQuestion();
  answerInput.focus();
}

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (game.running) return;
    game.difficulty = Number(button.dataset.difficulty);
    difficultyButtons.forEach((option) => {
      const selected = option === button;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    difficultyDescriptor.textContent = `Level ${game.difficulty} · ${difficulties[game.difficulty - 1].topic}`;
  });
});

paceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (game.running) return;
    game.pace = button.dataset.pace;
    paceButtons.forEach((option) => {
      const selected = option === button;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    paceDescriptor.textContent = `${paceSettings[game.pace].label} · ${paceSettings[game.pace].attackEvery} seconds`;
    updateAttackClock();
  });
});

knightNameInput.addEventListener("input", () => {
  updateKnightAppearance(knightNameInput.value);
});

function isSupabaseConfigured() {
  return Boolean(supabaseConfig?.url?.trim() && supabaseConfig?.anonKey?.trim());
}

function renderLeaderboardMessage(message) {
  leaderboardRows.replaceChildren();
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.className = "leaderboard-message";
  cell.colSpan = 6;
  cell.textContent = message;
  row.append(cell);
  leaderboardRows.append(row);
}

function getLocalScores() {
  const savedScores = localStorage.getItem(localScoresKey);
  if (!savedScores) return [];

  const scores = JSON.parse(savedScores);
  if (!Array.isArray(scores)) {
    throw new Error("Saved leaderboard data has an unexpected format.");
  }
  return scores.filter(
    (score) =>
      typeof score.knight_name === "string" &&
      Number.isFinite(score.score) &&
      Number.isInteger(score.math_level) &&
      paceSettings[score.attack_difficulty] &&
      ["victory", "defeat"].includes(score.result),
  );
}

function renderScores(scores) {
  leaderboardRows.replaceChildren();
  if (scores.length === 0) {
    renderLeaderboardMessage("No scores yet for these filters. Be the first to enter the hall!");
    return;
  }

  scores
    .sort((first, second) => second.score - first.score)
    .slice(0, 100)
    .forEach((score, index) => {
      const row = document.createElement("tr");
      const values = [
        String(index + 1).padStart(2, "0"),
        score.knight_name,
        Number(score.score).toLocaleString(),
        `Level ${score.math_level} · ${difficulties[score.math_level - 1].topic}`,
        paceSettings[score.attack_difficulty].label,
        score.result === "victory" ? "VICTORY" : "DEFEAT",
      ];
      values.forEach((value, cellIndex) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        if (cellIndex === 0) cell.className = "leaderboard-rank";
        if (cellIndex === 2) cell.className = "leaderboard-score";
        if (cellIndex === 5) {
          cell.className = `leaderboard-result ${score.result === "victory" ? "is-victory" : "is-defeat"}`;
        }
        row.append(cell);
      });
      leaderboardRows.append(row);
    });
}

function showLocalLeaderboard(statusMessage) {
  leaderboardScope.textContent = "Local leaderboard · This browser only";
  try {
    const scores = getLocalScores().filter(
      (score) =>
        (!leaderboardPace.value || score.attack_difficulty === leaderboardPace.value) &&
        (!leaderboardTrial.value || score.math_level === Number(leaderboardTrial.value)),
    );
    renderScores(scores);
    leaderboardStatus.textContent =
      statusMessage || `Saved on this device · ${scores.length} matching ${scores.length === 1 ? "score" : "scores"}.`;
  } catch (error) {
    console.error("Could not read locally saved trial scores:", error);
    renderLeaderboardMessage("Local scores couldn't be read from this browser.");
    leaderboardStatus.textContent = error.message;
  }
}

function saveLocalScore(record) {
  try {
    const scores = getLocalScores();
    scores.push({ ...record, created_at: new Date().toISOString() });
    scores.sort((first, second) => second.score - first.score);
    localStorage.setItem(localScoresKey, JSON.stringify(scores.slice(0, 100)));
    return null;
  } catch (error) {
    console.error("Could not save the trial score in this browser:", error);
    return error;
  }
}

async function loadLeaderboard() {
  leaderboardRequestController?.abort();
  leaderboardRequestController = null;
  if (!isSupabaseConfigured()) {
    showLocalLeaderboard("Local scores only · Connect Supabase to share scores publicly.");
    return;
  }

  leaderboardScope.textContent = "Public leaderboard · Shared scores";
  renderLeaderboardMessage("Loading the hall of legends…");
  leaderboardStatus.textContent = "Fetching public scores…";
  const controller = new AbortController();
  leaderboardRequestController = controller;
  const query = new URLSearchParams({
    select: "knight_name,score,math_level,attack_difficulty,result,created_at",
    order: "score.desc,created_at.asc",
    limit: "100",
  });
  if (leaderboardPace.value) {
    query.set("attack_difficulty", `eq.${leaderboardPace.value}`);
  }
  if (leaderboardTrial.value) {
    query.set("math_level", `eq.${leaderboardTrial.value}`);
  }

  try {
    const response = await fetch(
      `${supabaseConfig.url.replace(/\/+$/, "")}/rest/v1/trial_scores?${query}`,
      {
        signal: controller.signal,
        headers: {
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${supabaseConfig.anonKey}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Supabase returned HTTP ${response.status}.`);
    }

    const scores = await response.json();
    renderScores(scores);
    leaderboardStatus.textContent = `Showing ${scores.length} top ${scores.length === 1 ? "score" : "scores"}${scores.length === 100 ? " · top 100" : ""}.`;
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error("Could not load the public leaderboard:", error);
    showLocalLeaderboard(`Public leaderboard unavailable · Showing local scores. ${error.message}`);
  }
}

async function saveRun(won) {
  const record = {
    score: calculateScore(won),
    knight_name: game.knightName,
    correct_answers: game.correctAnswers,
    hits_taken: game.hitsTaken,
    result: won ? "victory" : "defeat",
    math_level: game.difficulty,
    attack_difficulty: game.pace,
  };
  const localSaveError = saveLocalScore(record);

  if (!isSupabaseConfigured()) {
    showLocalLeaderboard(
      localSaveError
        ? `Score could not be saved locally: ${localSaveError.message}`
        : `${game.knightName}'s score was saved on this browser. Connect Supabase to share it publicly.`,
    );
    return;
  }

  leaderboardStatus.textContent = "Posting your score to the public leaderboard…";

  try {
    const response = await fetch(
      `${supabaseConfig.url.replace(/\/+$/, "")}/rest/v1/trial_scores`,
      {
        method: "POST",
        headers: {
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${supabaseConfig.anonKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(record),
      },
    );
    if (!response.ok) {
      throw new Error(`Supabase returned HTTP ${response.status}.`);
    }
    leaderboardStatus.textContent = `${game.knightName}'s score was posted.`;
    await loadLeaderboard();
  } catch (error) {
    console.error("Could not post the trial score:", error);
    showLocalLeaderboard(
      `Score saved on this browser, but could not be posted publicly: ${error.message}`,
    );
  }
}

leaderboardPace.addEventListener("change", loadLeaderboard);
leaderboardTrial.addEventListener("change", loadLeaderboard);
leaderboardRefresh.addEventListener("click", loadLeaderboard);
answerForm.addEventListener("submit", handleAnswer);
beginButton.addEventListener("click", startBattle);
updateKnightAppearance(knightNameInput.value);
void loadLeaderboard();
