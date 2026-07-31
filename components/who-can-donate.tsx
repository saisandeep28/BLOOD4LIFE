'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  question: string;
  description: string;
  eligibleAnswer: 'yes' | 'no';
}

const ELIGIBILITY_QUESTIONS: Question[] = [
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

export default function WhoCanDonate() {
  const [step, setStep] = useState<'intro' | 'confirm' | 'quiz' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, 'yes' | 'no'>>({});

  // Calculate health percentage based on correct answers
  const correctCount = Object.entries(userAnswers).filter(([qId, ans]) => {
    const q = ELIGIBILITY_QUESTIONS.find(q => q.id === Number(qId));
    return q && q.eligibleAnswer === ans;
  }).length;

  const totalQuestions = ELIGIBILITY_QUESTIONS.length;
  // Calculate percentage to 1 decimal place (11.1%, 22.2%, 33.3%, ... 100.0%)
  const healthPercentage = parseFloat(((correctCount / totalQuestions) * 100).toFixed(1));
  const currentQ = ELIGIBILITY_QUESTIONS[currentQuestionIndex];

  const handleAnswer = (answer: 'yes' | 'no') => {
    const nextAnswers = { ...userAnswers, [currentQ.id]: answer };
    setUserAnswers(nextAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStep('results');
    }
  };

  const handleRestart = () => {
    setStep('intro');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  return (
    <section className="bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 py-12 md:py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* STEP 1: INTRO SECTION */}
        {step === 'intro' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#8b0000] dark:text-red-500 tracking-tight">
                Who Can Donate Blood?
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
                Donating blood is a simple, safe and life-saving act. But not everyone may be eligible to donate.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base">
                Down below is a Questionnaire provided to assess the Health percentage based on general norms.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setStep('confirm')}
                  className="bg-[#8b0000] hover:bg-[#6b0000] text-white font-bold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-sm md:text-base cursor-pointer"
                >
                  Check Eligibility
                </button>
              </div>

              <p className="text-xs text-neutral-500 italic pt-4">
                The answers to these questions are for general guidance only. Please consult a doctor before donating blood.
              </p>
            </div>

            {/* Right Graphic - Increased Height, Transparent Background */}
            <div className="lg:col-span-4 flex justify-center items-center">
              <HumanDiagramPublicMaskGraphic percentage={0} />
            </div>
          </div>
        )}

        {/* STEP 2: CONFIRMATION PROMPT */}
        {step === 'confirm' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#8b0000] dark:text-red-500 tracking-tight">
                Check Your Eligibility
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 text-base md:text-lg leading-relaxed">
                Your donation changes lives. But not everyone can donate blood for a few reasons. Check your eligibility to donate today.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setStep('quiz')}
                  className="bg-[#8b0000] hover:bg-[#6b0000] text-white font-bold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-sm md:text-base cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => setStep('intro')}
                  className="border-2 border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000]/10 font-bold px-8 py-3 rounded-lg transition-all text-sm md:text-base cursor-pointer"
                >
                  Back
                </button>
              </div>

              <p className="text-xs text-neutral-500 italic pt-4">
                The answers to these questions are for general guidance only. Please consult a doctor before donating blood.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-center items-center">
              <HumanDiagramPublicMaskGraphic percentage={0} />
            </div>
          </div>
        )}

        {/* STEP 3: QUESTIONNAIRE (1 OF 9) */}
        {step === 'quiz' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#8b0000] dark:text-red-500 tracking-tight">
                  Check Your Eligibility
                </h2>
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1 block">
                  Question {currentQ.id} of {totalQuestions}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-[#8b0000] dark:text-red-400 leading-snug">
                  {currentQ.question}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base leading-relaxed">
                  {currentQ.description}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => handleAnswer('yes')}
                  className="bg-[#8b0000] hover:bg-[#6b0000] text-white font-bold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-sm md:text-base cursor-pointer min-w-[90px]"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAnswer('no')}
                  className="border-2 border-[#8b0000] text-[#8b0000] hover:bg-[#8b0000]/10 font-bold px-8 py-3 rounded-lg transition-all text-sm md:text-base cursor-pointer min-w-[90px]"
                >
                  No
                </button>
              </div>

              <p className="text-xs text-neutral-500 italic pt-4">
                The answers to these questions are for general guidance only. Please consult a doctor before donating blood.
              </p>
            </div>

            {/* Right Column: Increased Height Image & Health Percentage */}
            <div className="lg:col-span-5 flex items-center justify-center gap-8 py-4">
              <HumanDiagramPublicMaskGraphic percentage={healthPercentage} />

              <div className="text-center space-y-1">
                <span className="text-4xl md:text-5xl font-extrabold text-[#3b82f6] tracking-tight">
                  {healthPercentage.toFixed(1)}%
                </span>
                <p className="text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  Health Percentage
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: FINAL ANALYSIS RESULTS */}
        {step === 'results' && (
          <div className="py-12 md:py-16 text-center max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#8b0000] dark:text-red-500">
              Your donation analysis has been done.
            </h2>
            <div className="space-y-2 text-neutral-800 dark:text-neutral-200">
              <p className="text-base md:text-lg font-medium">
                According to our analysis your eligibility of donating blood is <span className="font-bold text-neutral-900 dark:text-white">{healthPercentage.toFixed(1)}%</span>.
              </p>
              <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
                A doctor will re-verify donor eligibility before actual blood donation.
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={handleRestart}
                className="bg-[#8b0000] hover:bg-[#6b0000] text-white font-bold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-sm md:text-base cursor-pointer"
              >
                Start Over
              </button>
            </div>

            <p className="text-xs text-neutral-500 italic pt-8 text-left">
              The answers to these questions are for general guidance only. Please consult a doctor before donating blood.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

// Renders public/human diagram.png PNG photo directly with fluid water wave liquid percentage fill
function HumanDiagramPublicMaskGraphic({ percentage }: { percentage: number }) {
  const imgSrc = "/human%20diagram.png";
  const fillY = 400 - (400 * (percentage / 100));

  return (
    <div className="relative w-52 h-[420px] flex items-center justify-center">
      <svg viewBox="0 0 200 400" className="w-full h-full filter drop-shadow-md" preserveAspectRatio="xMidYMid meet">
        <defs>
          <style>{`
            @keyframes naturalWaterFront {
              0% { transform: translate3d(-180px, 0, 0); }
              100% { transform: translate3d(0px, 0, 0); }
            }
            @keyframes naturalWaterMid {
              0% { transform: translate3d(0px, 0, 0); }
              100% { transform: translate3d(-180px, 0, 0); }
            }
            @keyframes naturalWaterBack {
              0% { transform: translate3d(-90px, 0, 0); }
              50% { transform: translate3d(0px, 3px, 0); }
              100% { transform: translate3d(-90px, 0, 0); }
            }
            .wave-front {
              animation: naturalWaterFront 4.2s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
            }
            .wave-mid {
              animation: naturalWaterMid 3.1s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
            }
            .wave-back {
              animation: naturalWaterBack 5.5s ease-in-out infinite;
            }
          `}</style>

          {/* SVG Matricial Filter: Inverts PNG White BG -> Pure Black (0% mask), Black Body -> Pure White (100% mask) */}
          <filter id="pngInvertFilter">
            <feColorMatrix type="matrix" values="-1 0 0 0 1   0 -1 0 0 1   0 0 -1 0 1   0 0 0 1 0" />
          </filter>

          {/* SVG Mask using actual public/human diagram.png image */}
          <mask id="exactHumanPngMask" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="400">
            <image
              href={imgSrc}
              x="0"
              y="0"
              width="200"
              height="400"
              preserveAspectRatio="xMidYMid meet"
              filter="url(#pngInvertFilter)"
            />
          </mask>

          {/* Premium 3D Liquid Water Gradient */}
          <linearGradient id="naturalWaterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* 1. Base Unfilled Light Grey Silhouette Body matching public/human diagram.png */}
        <rect
          x="0"
          y="0"
          width="200"
          height="400"
          fill="#e5e7eb"
          className="dark:fill-neutral-700"
          mask="url(#exactHumanPngMask)"
        />

        {/* 2. Natural Water Flow Liquid Fill rising from feet to head */}
        {percentage > 0 && (
          <g mask="url(#exactHumanPngMask)">
            {/* Main Liquid Column */}
            <rect
              x="0"
              y={fillY}
              width="200"
              height={400 - fillY + 10}
              fill="url(#naturalWaterGradient)"
              className="transition-all duration-700 ease-in-out"
            />

            {/* Continuous Water Wave Layers */}
            <g style={{ transform: `translateY(${fillY}px)` }} className="transition-all duration-700 ease-in-out">
              {/* Back Deep Wave */}
              <path
                d="M -180 0 Q -135 -7, -90 0 T 0 0 T 90 0 T 180 0 T 270 0 T 360 0 L 360 30 L -180 30 Z"
                fill="#1d4ed8"
                opacity="0.4"
                className="wave-back"
              />

              {/* Mid Water Wave */}
              <path
                d="M -180 0 Q -135 6, -90 0 T 0 0 T 90 0 T 180 0 T 270 0 T 360 0 L 360 30 L -180 30 Z"
                fill="#93c5fd"
                opacity="0.55"
                className="wave-mid"
              />

              {/* Surface Front Wave */}
              <path
                d="M -180 0 Q -135 -5, -90 0 T 0 0 T 90 0 T 180 0 T 270 0 T 360 0 L 360 30 L -180 30 Z"
                fill="#3b82f6"
                opacity="0.9"
                className="wave-front"
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
