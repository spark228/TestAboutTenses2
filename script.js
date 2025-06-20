const PrPr = "Present Perfect"
const FuS = "Future Simple"
const PaS = "Past Simple"
const PaPr = "Past Perfect"
const PaC = "Past Continuous"
const PrS = "Present Simple"
const PrCn = "Present Continuous"
const PrPerCn = "Present Perfect Continuous"
//const questions = [

  
//];
let questions = [
    {
    question: "soon",
    options: [FuS, PaC, PrPr, PrS],
    correct: [0]
  },
      {
    question: "in a while",
    options: [PaC, PrPr, PrS, PrCn, FuS],
    correct: [4]
  },
    {
    question: "for over 20 years",
    options: [PrCn, PaS, PrPerCn, PrS, PrPr],
    correct: [1, 2, 4]
  },
    {
    question: "... before " + PaS,
    options: [PaPr, FuS, PrPr, PrS, PaC],
    correct: [0]
  },
    {
    question: "... as soon as",
    options: [PaS, PrPr, FuS, PaC],
    correct: [0, 2]
  },
    {
    question: "up until then",
    options: [PrPr, PaPr, PaC, FuS],
    correct: [1, 3]
  },
    {
    question: "ever",
    options: [PrPr, PaS, PaPr, PaC, PrPerCn],
    correct: [0, 2, 4]
  },
    {
    question:PaS + " + after + ...",
    options: [PrPr, PrS, PaPr, PaC],
    correct: [2]
  },
    {
    question: "still",
    options: [PrPr, PrPerCn, PrCn, PaC],
    correct: [0, 2, 3]
  },
    {
    question: "a decade or so ago",
    options: [PrPerCn, PaS, PrS, PaPr, PrPr],
    correct: [1]
  },
    {
    question: "twice a week",
    options: [PrS, PrPr, PaC, FuS, PrCn],
    correct: [0, 3]
  },
    {
    question: "in advance",
    options: [PaC, PaPr, FuS, PrPr],
    correct: [1]
  },
    {
    question: "in two days",
    options: [PaS, FuS, PrS, PaC],
    correct: [1]
  },
    {
    question: "shortly",
    options: [PrS, FuS, PaC, PrPr, PaPr],
    correct: [1]
  },
    {
    question: "Since when ...?",
    options: [PrPerCn, PrPr, PaS, FuS],
    correct: [0, 1]
  },
    {
    question: "at that time",
    options: [FuS, PrPr, PaS, PrCn, PaC],
    correct: [0, 2, 4]
  },
    {
    question: "How long ago ...?",
    options: [PrPerCn, PrPr, PaPr, PaS],
    correct: [3]
  },
    {
    question: "How long ...?",
    options: [FuS, PaS, PrPr, PaC, PrPerCn],
    correct: [0, 2, 4]
  },
    {
    question: "in the last three days",
    options: [PrPerCn, PaS, PrPr, PaC],
    correct: [0, 2]
  },
    {
    question: "in recent years",
    options: [FuS, PaC, PrPr, PrPerCn],
    correct: [2, 3]
  },
    {
    question: PrPr + " + since + ...",
    options: [PaS, PrCn, PaC, PrPr, FuS],
    correct: [0]
  },
    {
    question: "will + before + ...",
    options: [PaS, FuS, PrS, PaPr],
    correct: [2]
  },
    {
    question: "the whole day",
    options: [PaC, PaPr, PaS, PrPr],
    correct: [0]
  },
    {
    question: "by that time",
    options: [PaPr, PrPr, FuS, PaC],
    correct: [0, 2]
  },
    {
    question: "twice this week",
    options: [PaC, PrS, PrCn, PrPr],
    correct: [3]
  },

]; // Загрузка внешнего массива вопросов здесь

// Сохраняем оригинальные вопросы для таблицы результатов
let originalQuestions = JSON.parse(JSON.stringify(questions));

// Перемешиваем вопросы один раз и добавляем originalIndex для отслеживания
questions = questions
  .map((q, i) => ({ ...q, originalIndex: i }))
  .sort(() => Math.random() - 0.5);

let current = 0;
let selectedAnswers = new Array(questions.length).fill(null).map(() => []);
let answeredQuestions = new Set();
let correctCount = 0;
let isAutoAdvancing = false;
let shuffledOptions = [];
let originalToShuffledMap = [];
let shuffledData = new Array(questions.length).fill(null);

const quizEl = document.getElementById("quiz");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressText = document.getElementById("progressText");
const chooseMsg = document.getElementById("chooseMsg");
const resultEl = document.getElementById("result");
const scoreText = document.getElementById("scoreText");
const showResultsBtn = document.getElementById("showResultsBtn");
const restartBtn = document.getElementById("restartBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function showQuestion(index) {
  const q = questions[index];
  questionEl.textContent = q.question;
  progressText.textContent = `Вопрос ${index + 1} / ${questions.length}`;
  chooseMsg.textContent = q.correct.length > 1 ? `Выберите ${q.correct.length} ответов` : "";

  // Перемешиваем варианты ответов только один раз
  if (!shuffledData[index]) {
    shuffledData[index] = q.options.map((opt, i) => ({ text: opt, originalIndex: i }))
      .sort(() => Math.random() - 0.5);
  }

  shuffledOptions = shuffledData[index];
  originalToShuffledMap = shuffledOptions.map(o => o.originalIndex);

  optionsEl.innerHTML = "";
  shuffledOptions.forEach((optObj, i) => {
    const opt = optObj.text;
    const originalIndex = optObj.originalIndex;

    const btn = document.createElement("div");
    btn.className = "option";
    btn.textContent = opt;
    btn.dataset.index = originalIndex;

    const answerSet = selectedAnswers[index];

    if (answeredQuestions.has(index)) {
      if (q.correct.includes(originalIndex)) {
        btn.classList.add("correct");
      } else if (answerSet.includes(originalIndex)) {
        btn.classList.add("wrong");
      }
      btn.style.pointerEvents = "none";
    } else if (answerSet.includes(originalIndex)) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => toggleAnswer(originalIndex));
    optionsEl.appendChild(btn);
  });

  if (q.options.length % 2 !== 0) {
    optionsEl.lastElementChild.classList.add("wide-option");
  }

  if (index === 0) {
    prevBtn.style.visibility = "hidden";
    nextBtn.style.order = "1";
  } else {
    prevBtn.style.visibility = "visible";
    nextBtn.style.order = "0";
  }

  prevBtn.disabled = isAutoAdvancing;
  nextBtn.disabled = isAutoAdvancing;

  current = index;
}

function toggleAnswer(i) {
  if (isAutoAdvancing) return;

  const q = questions[current];
  const sel = selectedAnswers[current];
  const maxSelect = q.correct.length;

  if (answeredQuestions.has(current)) return;

  const index = sel.indexOf(i);
  if (index > -1) {
    sel.splice(index, 1);
  } else {
    if (sel.length < maxSelect) sel.push(i);
  }

  showQuestion(current);

  if (sel.length === maxSelect) {
    const correctSet = new Set(q.correct);
    const isCorrect = sel.length === q.correct.length && sel.every(a => correctSet.has(a));

    if (isCorrect) {
      correctCount++;
      document.getElementById("correctSound").play();
    } else {
      document.getElementById("wrongSound").play();
    }

    answeredQuestions.add(current);
    showQuestion(current);

    if (navigator.vibrate) navigator.vibrate(200);

    isAutoAdvancing = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    setTimeout(() => {
      isAutoAdvancing = false;
      prevBtn.disabled = false;
      nextBtn.disabled = false;
      if (current < questions.length - 1) {
        showQuestion(current + 1);
      } else {
        quizEl.style.display = "none";
        resultEl.style.display = "block";
        scoreText.textContent = `Ваш результат: ${correctCount} / ${questions.length}`;
      }
    }, 4000);
  }
}

function nextQuestion() {
  if (isAutoAdvancing) return;
  if (current < questions.length - 1) {
    showQuestion(current + 1);
  }
}

function prevQuestion() {
  if (isAutoAdvancing) return;
  if (current > 0) {
    showQuestion(current - 1);
  }
}

function restartQuiz() {
  current = 0;
  selectedAnswers = new Array(questions.length).fill(null).map(() => []);
  answeredQuestions.clear();
  correctCount = 0;
  isAutoAdvancing = false;
  shuffledData = new Array(questions.length).fill(null);

  // Перемешиваем вопросы заново
  questions = originalQuestions
    .map((q, i) => ({ ...q, originalIndex: i }))
    .sort(() => Math.random() - 0.5);

  quizEl.style.display = "block";
  resultEl.style.display = "none";
  showQuestion(0);
}

function showFinalTable() {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup-content";

  const table = document.createElement("table");
  const header = document.createElement("tr");
  ["#", "Вопрос", "Ваш ответ", "Правильный ответ"].forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    header.appendChild(th);
  });
  table.appendChild(header);

  originalQuestions.forEach((q, i) => {
    const row = document.createElement("tr");

    const num = document.createElement("td");
    num.textContent = i + 1;

    const ques = document.createElement("td");
    ques.textContent = q.question;

    const userAns = document.createElement("td");
    const answerIndex = questions.findIndex(q2 => q2.originalIndex === i);
    userAns.textContent = selectedAnswers[answerIndex]?.map(idx => q.options[idx]).join(", ") || "";

    const correctAns = document.createElement("td");
    correctAns.textContent = q.correct.map(idx => q.options[idx]).join(", ");

    [num, ques, userAns, correctAns].forEach(td => row.appendChild(td));
    table.appendChild(row);
  });

  const closeBtn = document.createElement("button");
  closeBtn.className = "popup-close-btn";
  closeBtn.textContent = "Закрыть";
  closeBtn.onclick = () => document.body.removeChild(overlay);

  popup.appendChild(table);
  popup.appendChild(closeBtn);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

window.addEventListener("DOMContentLoaded", () => {
  showQuestion(0);
  nextBtn.addEventListener("click", nextQuestion);
  prevBtn.addEventListener("click", prevQuestion);
  restartBtn.addEventListener("click", restartQuiz);
  showResultsBtn.addEventListener("click", showFinalTable);
});
