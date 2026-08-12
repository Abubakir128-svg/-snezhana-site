let denialCount = 0;
let caseScore = 17;
let complimentIndex = -1;
let complimentClicks = 0;
let quizIndex = 0;
let quizScore = 0;
let snowGameRunning = false;
let snowScore = 0;
let snowInterval = null;
let timerInterval = null;

const reactions = [
  "Источник информации: Снежана. Доверие к источнику: 2%.",
  "Запрос отклонён.",
  "Хорошая попытка.",
  "Документы не принимаются.",
  "Система услышала: «я малолеток».",
  "Ошибка 017: взрослая Снежана не найдена.",
  "Ваше мнение очень важно для нас. Но нет.",
  "Комиссия посмеялась и продолжила расследование."
];

const compliments = [
  "Снежка, ты подозрительно классный человек.",
  "Ты умеешь быть красивой и при этом ещё умудряешься иметь характер. Нечестно.",
  "С тобой реально интересно разговаривать. Да, это официальный комплимент.",
  "У тебя есть редкий талант делать обычный разговор намного веселее.",
  "К сожалению, следствие подтвердило: ты очень красивая.",
  "Ты намного круче, чем сама иногда думаешь.",
  "Если бы харизма измерялась документами, вот тогда твои бумажки про возраст могли бы пригодиться.",
  "С тобой можно и нормально поговорить, и нести полный бред. И это очень ценится.",
  "Ты тот человек, которого хочется подкалывать исключительно потому, что реакция того стоит.",
  "Даже комиссия признала: Снежка получилась очень удачной.",
  "Ты реально запоминающийся человек. Не каждый таким бывает.",
  "Мне нравится, что у тебя есть своё мнение. Даже когда оно ошибочное. Например, про твой возраст.",
  "Если убрать все приколы — ты реально очень приятный человек.",
  "Ты умеешь поднимать настроение даже когда вообще этого не планируешь.",
  "Короче: Снежана хорошая. Очень. Но не зазнавайся."
];

const accusations = [
  "Подозреваемая слишком уверенно произнесла «я старше». Комиссия считает это попыткой давления.",
  "Обнаружена улыбка во время допроса. Вероятность малолетства увеличена на 14%.",
  "Гражданка Снежана снова использовала факты. Это уже выглядит как систематическое нарушение.",
  "Слишком много аргументов. Настоящим взрослым столько не требуется.",
  "Имя «Снежка» само по себе вызвало вопросы у комиссии. Расследование расширено.",
  "Попытка доказать взрослость засчитана как ещё одна попытка доказать взрослость. Замкнутый круг.",
  "Снежана на год старше. Комиссия провела совещание и решила, что всё равно я дядя.",
  "Подозреваемая оказалась слишком классной. Обвинение растерялось, но дело закрывать отказалось."
];

const quiz = [
  { q: "Ты снова говоришь: «Я старше тебя на год». Что делает комиссия?", a: ["Извиняется", "Проверяет паспорт", "Смеётся", "Признаёт поражение"], correct: 2 },
  { q: "Главный признак взрослого человека по версии этого сайта?", a: ["Документы", "Возраст", "Не спорить с комиссией", "Здравый смысл"], correct: 2 },
  { q: "Если Снежана реально старше, кто всё равно «дядя»?", a: ["Снежана", "Я", "Никто", "Судья"], correct: 1 },
  { q: "Можно ли обжаловать статус «малолеток»?", a: ["Да", "Через суд", "Через паспортный стол", "Нет 😭"], correct: 3 },
  { q: "Какой факт комиссия всё-таки признаёт?", a: ["Снежка классная", "Она скучная", "Она всегда неправа", "Никакой"], correct: 0 }
];

function goToScan() {
  document.getElementById("scan").scrollIntoView({ behavior: "smooth" });
}

function updateStats(extraDenial = 0, extraScore = 0) {
  denialCount += extraDenial;
  caseScore += extraScore;
  document.getElementById("denialCount").textContent = denialCount;
  document.getElementById("caseScore").textContent = caseScore;
  if (denialCount >= 7) {
    document.getElementById("mainStatus").textContent = "СТАТУС: ОТРИЦАНИЕ ДОСТИГЛО КРИТИЧЕСКОГО УРОВНЯ";
  }
}

function claimOlder(event) {
  updateStats(1, 3);
  const message = reactions[Math.floor(Math.random() * reactions.length)];
  floating(message, event.clientX || innerWidth / 2, event.clientY || innerHeight / 2);
}

function floating(message, x, y) {
  const el = document.createElement("div");
  el.className = "floating-word";
  el.textContent = message;
  el.style.left = Math.max(10, Math.min(x, innerWidth - 300)) + "px";
  el.style.top = Math.max(30, y) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
}

function burst(text) {
  for (let i = 0; i < 12; i++) {
    const item = document.createElement("div");
    item.className = "floating-word";
    item.innerText = text;
    item.style.left = Math.random() * 88 + "%";
    item.style.top = 50 + Math.random() * 30 + "%";
    item.style.fontSize = 12 + Math.random() * 20 + "px";
    document.body.appendChild(item);
    setTimeout(() => item.remove(), 1000);
  }
}

function startScan() {
  const bar = document.getElementById("bar");
  const percentage = document.getElementById("percentage");
  const result = document.getElementById("scanResult");
  const button = document.getElementById("scanButton");
  const log = document.getElementById("scanLog");
  button.disabled = true;
  button.textContent = "АНАЛИЗИРУЕМ...";
  result.style.display = "none";
  bar.style.width = "99.97%";
  log.innerHTML = "";

  const lines = [
    "проверяем документы...",
    "считаем фразы «я старше»...",
    "анализируем уровень отрицания...",
    "сверяем с базой малолеток...",
    "обнаружена Снежка...",
    "готовим абсолютно объективный вердикт..."
  ];

  let value = 0;
  let logIndex = 0;
  const interval = setInterval(() => {
    value += Math.floor(Math.random() * 6) + 2;
    if (value >= 99) value = 99;
    percentage.textContent = value + "%";
    if (logIndex < lines.length && Math.random() > .45) {
      const div = document.createElement("div");
      div.className = "ok";
      div.textContent = "> " + lines[logIndex++];
      log.appendChild(div);
    }
    if (value >= 99) clearInterval(interval);
  }, 90);

  setTimeout(() => {
    while (logIndex < lines.length) {
      const div = document.createElement("div");
      div.className = "ok";
      div.textContent = "> " + lines[logIndex++];
      log.appendChild(div);
    }
    percentage.textContent = "99.97%";
    result.style.display = "block";
    button.textContent = "РЕЗУЛЬТАТ ПОЛУЧЕН";
    updateStats(0, 17);
    burst("МАЛОЛЕТОК");
  }, 2900);
}

function checkPassport() {
  const name = document.getElementById("passportName").value.trim() || "неизвестная гражданка";
  const arg = document.getElementById("passportArgument").value.trim() || "Я старше!";
  const box = document.getElementById("passportResult");
  updateStats(1, 6);
  box.style.display = "block";
  box.innerHTML = `
    <b>Документы получены.</b><br>
    Имя: ${escapeHtml(name)}<br>
    Аргумент: «${escapeHtml(arg)}»<br><br>
    Комиссия изучила материалы целых 0.4 секунды и постановила:
    аргумент слишком удобный для защиты, поэтому в доказательства не принимается.
    <div class="stamp-big">ОТКЛОНЕНО</div>
  `;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

function toggleEvidence(card) {
  card.classList.toggle("revealed");
  if (card.classList.contains("revealed")) updateStats(0, 2);
}

const adultButton = document.getElementById("adultButton");
const escapeZone = document.getElementById("escapeZone");

function escapeAdultButton(event) {
  if (event) event.preventDefault();
  const maxX = Math.max(0, escapeZone.clientWidth - adultButton.offsetWidth - 20);
  const maxY = Math.max(0, escapeZone.clientHeight - adultButton.offsetHeight - 20);
  const x = 10 + Math.random() * Math.max(0, maxX - 10);
  const y = 10 + Math.random() * Math.max(0, maxY - 10);
  adultButton.style.left = x + "px";
  adultButton.style.top = y + "px";
  updateStats(1, 2);
  const messages = ["Нет.", "Кнопка не согласна.", "Попытка защиты отклонена.", "Почти получилось.", "Ага. Размечталась.", "Система защищена от ложных показаний.", "Снежана, перестань ловить кнопку 😭"];
  document.getElementById("systemMessage").innerText = messages[Math.floor(Math.random() * messages.length)];
}

adultButton.addEventListener("mouseenter", escapeAdultButton);
adultButton.addEventListener("pointerdown", escapeAdultButton);
adultButton.addEventListener("click", escapeAdultButton);

function acceptTruth() {
  document.getElementById("systemMessage").innerText = "Показания приняты. Наконец-то честный гражданин.";
  burst("УРА");
  showToast("Признание добавлено к материалам дела.");
}

function renderQuiz() {
  if (quizIndex >= quiz.length) {
    const result = document.getElementById("quizResult");
    document.getElementById("quizQuestion").textContent = "Экзамен завершён.";
    document.getElementById("quizAnswers").innerHTML = "";
    document.getElementById("quizProgress").textContent = "Результат";
    result.style.display = "block";
    let verdict;
    if (quizScore === 5) verdict = "Ты подозрительно хорошо поняла правила этой абсурдной комиссии.";
    else if (quizScore >= 3) verdict = "Неплохо. Но статус «малолеток» всё равно остаётся.";
    else verdict = "Комиссия благодарит за блестящее подтверждение обвинения.";
    result.innerHTML = `<b>${quizScore}/5</b><br>${verdict}<br><br>Апелляция недоступна.`;
    return;
  }
  const q = quiz[quizIndex];
  document.getElementById("quizProgress").textContent = `Вопрос ${quizIndex + 1} из ${quiz.length}`;
  document.getElementById("quizQuestion").textContent = q.q;
  const answers = document.getElementById("quizAnswers");
  answers.innerHTML = "";
  q.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-answer";
    btn.textContent = text;
    btn.onclick = () => {
      if (i === q.correct) {
        quizScore++;
        showToast("Комиссия недовольно признаёт: ответ правильный.");
      } else {
        updateStats(0, 3);
        showToast("Неверно. Комиссия почему-то очень довольна.");
      }
      quizIndex++;
      renderQuiz();
    };
    answers.appendChild(btn);
  });
}
renderQuiz();

function generateAccusation() {
  const out = document.getElementById("generatorOutput");
  out.style.opacity = "0";
  setTimeout(() => {
    out.textContent = accusations[Math.floor(Math.random() * accusations.length)];
    out.style.transition = ".2s";
    out.style.opacity = "1";
  }, 120);
  updateStats(0, 1);
}

function startSnowGame() {
  if (snowGameRunning) return;
  snowGameRunning = true;
  snowScore = 0;
  document.getElementById("snowScore").textContent = "0";
  document.getElementById("gameButton").disabled = true;
  document.getElementById("gameButton").textContent = "ИДЁТ ИГРА";
  document.getElementById("gameCenter").innerHTML = "Лови ❄️";
  let time = 15;
  document.getElementById("snowTimer").textContent = time + " сек.";
  snowInterval = setInterval(spawnSnowflake, 420);
  timerInterval = setInterval(() => {
    time--;
    document.getElementById("snowTimer").textContent = time + " сек.";
    if (time <= 0) endSnowGame();
  }, 1000);
}

function spawnSnowflake() {
  if (!snowGameRunning) return;
  const arena = document.getElementById("snowArena");
  const flake = document.createElement("button");
  flake.className = "snowflake";
  flake.textContent = "❄️";
  flake.style.left = Math.random() * Math.max(10, arena.clientWidth - 55) + "px";
  flake.style.animationDuration = (1.9 + Math.random() * 1.7) + "s";
  flake.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    if (!snowGameRunning) return;
    snowScore++;
    document.getElementById("snowScore").textContent = snowScore;
    flake.remove();
  });
  arena.appendChild(flake);
  setTimeout(() => flake.remove(), 3800);
}

function endSnowGame() {
  snowGameRunning = false;
  clearInterval(snowInterval);
  clearInterval(timerInterval);
  document.querySelectorAll(".snowflake").forEach(f => f.remove());
  const btn = document.getElementById("gameButton");
  btn.disabled = false;
  btn.textContent = "СЫГРАТЬ ЕЩЁ";
  document.getElementById("snowTimer").textContent = "готово";
  let text;
  if (snowScore >= 20) text = `Ты поймала ${snowScore}. Слишком хороша. Комиссия подозревает использование взрослости.`;
  else if (snowScore >= 10) text = `Ты поймала ${snowScore}. Неплохо, Снежка.`;
  else text = `Всего ${snowScore}? Комиссия записывает это как новое доказательство 😭`;
  document.getElementById("gameCenter").innerHTML = `<b style="color:#f3f3f3;font-size:24px">${text}</b>`;
}

function newCompliment() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * compliments.length);
  } while (newIndex === complimentIndex && compliments.length > 1);
  complimentIndex = newIndex;
  complimentClicks++;
  const el = document.getElementById("compliment");
  el.style.opacity = "0";
  el.style.transform = "translateY(8px)";
  setTimeout(() => {
    el.innerText = compliments[complimentIndex];
    el.style.transition = ".25s";
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }, 150);
  renderHearts();
  if (complimentClicks === 5) showToast("Внимание: уровень комплиментов становится подозрительно высоким.");
  if (complimentClicks === 10) showToast("Комиссия просит не зазнаваться. Но продолжать можно.");
}

function renderHearts() {
  const meter = document.getElementById("complimentMeter");
  meter.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span");
    s.className = "heart" + (i < Math.min(10, complimentClicks) ? " on" : "");
    s.textContent = "❄️";
    meter.appendChild(s);
  }
}
renderHearts();

function openSecret() {
  document.getElementById("secretModal").classList.add("active");
}

function closeSecret() {
  document.getElementById("secretModal").classList.remove("active");
}

document.getElementById("secretModal").addEventListener("click", function(event) {
  if (event.target === this) closeSecret();
});