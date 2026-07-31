/**
 * BLOOD4LIFE - Vanilla JavaScript Application Engine
 * Handles State, Eligibility Questionnaire, SVG Water Fill, and Oracle REST API Calls
 */

const ELIGIBILITY_QUESTIONS = [
  {
    id: 1,
    question: "Are you currently taking any medication (e.g., antibiotics, blood thinners)?",
    description: "Certain medications, such as antibiotics or blood thinners, can affect the quality and safety of donated blood.",
    eligibleAnswer: "no",
  },
  {
    id: 2,
    question: "Are you between 18 to 65 years of age?",
    description: "For your safety, there are minimum and maximum ages for blood donation. The minimum age is 18 and the maximum age is 65 for first-time donors.",
    eligibleAnswer: "yes",
  },
  {
    id: 3,
    question: "Is your body weight at least 45 kg?",
    description: "For safe blood donation, your body must have enough blood volume to recover quickly after donating. A minimum weight of 45 kg ensures that you can donate without putting yourself at risk of weakness or complications.",
    eligibleAnswer: "yes",
  },
  {
    id: 4,
    question: "Have you had any infection, fever, cold, cough, weakness, dizziness, or fatigue today?",
    description: "If you're feeling unwell, your body needs its resources to recover, and donating blood may worsen your condition.",
    eligibleAnswer: "no",
  },
  {
    id: 5,
    question: "Have you undergone any surgery or major dental procedure recently (last 6–12 months)?",
    description: "Recent surgeries or major dental work may involve infections, healing wounds, or medication use that make donation unsafe.",
    eligibleAnswer: "no",
  },
  {
    id: 6,
    question: "Did you have at least 6 hours of sleep last night?",
    description: "Adequate rest before donation ensures your body is in a stable condition, helping you avoid dizziness or fatigue afterward.",
    eligibleAnswer: "yes",
  },
  {
    id: 7,
    question: "Did you eat a light (non-oily) meal 2–3 hours before donating?",
    description: "Eating a light, non-oily meal before donating helps maintain stable blood sugar and reduces the risk of dizziness during or after donation.",
    eligibleAnswer: "yes",
  },
  {
    id: 8,
    question: "Have you had any tattoos, piercings, or acupuncture in the last 6 months?",
    description: "These procedures may carry a risk of infections like hepatitis or HIV if done with unsterile equipment.",
    eligibleAnswer: "no",
  },
  {
    id: 9,
    question: "Have you consumed alcohol in the last 24 hours?",
    description: "Alcohol affects hydration levels, blood composition, and judgment, making blood donation unsafe. It can also impair the quality of the donated blood.",
    eligibleAnswer: "no",
  },
];

// App State
let currentStep = 'intro';
let currentQuestionIndex = 0;
let userAnswers = {};

// DOM Elements
const stepIntro = document.getElementById('step-intro');
const stepConfirm = document.getElementById('step-confirm');
const stepQuiz = document.getElementById('step-quiz');
const stepResults = document.getElementById('step-results');

const graphicIntro = document.getElementById('graphic-intro');
const graphicConfirm = document.getElementById('graphic-confirm');
const graphicQuiz = document.getElementById('graphic-quiz');

const quizCounter = document.getElementById('quiz-question-counter');
const quizText = document.getElementById('quiz-question-text');
const quizDesc = document.getElementById('quiz-question-desc');
const healthPercentageNum = document.getElementById('health-percentage-num');
const finalPercentageNum = document.getElementById('final-percentage-num');

// Render Human Body Graphic using human diagram.png PNG Image with Fluid Water Fill
function generateHumanSVG(percentage) {
  const imgSrc = "human%20diagram.png";
  const fillY = 400 - (400 * (percentage / 100));

  return `
    <svg viewBox="0 0 200 400" preserveAspectRatio="xMidYMid meet" style="width:100%; height:100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));">
      <defs>
        <filter id="pngInvertFilter">
          <feColorMatrix type="matrix" values="-1 0 0 0 1   0 -1 0 0 1   0 0 -1 0 1   0 0 0 1 0" />
        </filter>

        <mask id="exactHumanPngMask" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="400">
          <image
            href="${imgSrc}"
            x="0"
            y="0"
            width="200"
            height="400"
            preserveAspectRatio="xMidYMid meet"
            filter="url(#pngInvertFilter)"
          />
        </mask>

        <linearGradient id="naturalWaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.9" />
          <stop offset="25%" stop-color="#3b82f6" stop-opacity="0.98" />
          <stop offset="100%" stop-color="#1d4ed8" stop-opacity="1" />
        </linearGradient>
      </defs>

      <!-- 1. Base Unfilled Light Grey Silhouette Body -->
      <rect
        x="0"
        y="0"
        width="200"
        height="400"
        fill="#e5e7eb"
        mask="url(#exactHumanPngMask)"
      />

      <!-- 2. Natural Water Flow Liquid Fill -->
      ${percentage > 0 ? `
        <g mask="url(#exactHumanPngMask)">
          <rect
            x="0"
            y="${fillY}"
            width="200"
            height="${400 - fillY + 10}"
            fill="url(#naturalWaterGradient)"
            style="transition: all 0.7s ease-in-out;"
          />

          <g style="transform: translateY(${fillY}px); transition: all 0.7s ease-in-out;">
            <path
              d="M -180 0 Q -135 -7, -90 0 T 0 0 T 90 0 T 180 0 T 270 0 T 360 0 L 360 30 L -180 30 Z"
              fill="#1d4ed8"
              opacity="0.4"
              class="wave-back"
            />
            <path
              d="M -180 0 Q -135 6, -90 0 T 0 0 T 90 0 T 180 0 T 270 0 T 360 0 L 360 30 L -180 30 Z"
              fill="#93c5fd"
              opacity="0.55"
              class="wave-mid"
            />
            <path
              d="M -180 0 Q -135 -5, -90 0 T 0 0 T 90 0 T 180 0 T 270 0 T 360 0 L 360 30 L -180 30 Z"
              fill="#3b82f6"
              opacity="0.9"
              class="wave-front"
            />
          </g>
        </g>
      ` : ''}
    </svg>
  `;
}

// Calculate Health Percentage
function getHealthPercentage() {
  const correctCount = Object.entries(userAnswers).filter(([qId, ans]) => {
    const q = ELIGIBILITY_QUESTIONS.find(item => item.id === Number(qId));
    return q && q.eligibleAnswer === ans;
  }).length;

  return parseFloat(((correctCount / ELIGIBILITY_QUESTIONS.length) * 100).toFixed(1));
}

// Update UI Views
function renderStep() {
  stepIntro.classList.add('hidden');
  stepConfirm.classList.add('hidden');
  stepQuiz.classList.add('hidden');
  stepResults.classList.add('hidden');

  const pct = getHealthPercentage();

  if (currentStep === 'intro') {
    stepIntro.classList.remove('hidden');
    graphicIntro.innerHTML = generateHumanSVG(0);
  } else if (currentStep === 'confirm') {
    stepConfirm.classList.remove('hidden');
    graphicConfirm.innerHTML = generateHumanSVG(0);
  } else if (currentStep === 'quiz') {
    stepQuiz.classList.remove('hidden');
    
    const q = ELIGIBILITY_QUESTIONS[currentQuestionIndex];
    quizCounter.textContent = `Question ${q.id} of ${ELIGIBILITY_QUESTIONS.length}`;
    quizText.textContent = q.question;
    quizDesc.textContent = q.description;

    graphicQuiz.innerHTML = generateHumanSVG(pct);
    healthPercentageNum.textContent = `${pct.toFixed(1)}%`;
  } else if (currentStep === 'results') {
    stepResults.classList.remove('hidden');
    finalPercentageNum.textContent = `${pct.toFixed(1)}%`;
  }
}

// Answer Handler
function handleAnswer(answer) {
  const currentQ = ELIGIBILITY_QUESTIONS[currentQuestionIndex];
  userAnswers[currentQ.id] = answer;

  if (currentQuestionIndex < ELIGIBILITY_QUESTIONS.length - 1) {
    currentQuestionIndex++;
    renderStep();
  } else {
    currentStep = 'results';
    renderStep();
    submitEligibilityToOracle(userAnswers, getHealthPercentage());
  }
}

// Oracle DB Backend Integration Call
async function submitEligibilityToOracle(answers, score) {
  try {
    const response = await fetch('/api/eligibility/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, score })
    });
    const data = await response.json();
    console.log('Logged into Oracle DB PL/SQL:', data);
  } catch (err) {
    console.log('Local standalone mode - Oracle backend pending connection:', err);
  }
}

// Event Listeners
document.getElementById('btn-start-check').addEventListener('click', () => {
  currentStep = 'confirm';
  renderStep();
});

document.getElementById('btn-confirm-yes').addEventListener('click', () => {
  currentStep = 'quiz';
  currentQuestionIndex = 0;
  userAnswers = {};
  renderStep();
});

document.getElementById('btn-confirm-back').addEventListener('click', () => {
  currentStep = 'intro';
  renderStep();
});

document.getElementById('btn-quiz-yes').addEventListener('click', () => handleAnswer('yes'));
document.getElementById('btn-quiz-no').addEventListener('click', () => handleAnswer('no'));

document.getElementById('btn-quiz-restart').addEventListener('click', () => {
  currentStep = 'intro';
  currentQuestionIndex = 0;
  userAnswers = {};
  renderStep();
});

// Theme Toggle Handler
const themeToggleBtn = document.getElementById('theme-toggle-btn');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
}

// Initialize First Render
document.addEventListener('DOMContentLoaded', () => {
  renderStep();
});
