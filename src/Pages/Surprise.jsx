/**
 * 🎂 HAPPY BIRTHDAY PIKU 🎂
 * A magical, romantic, interactive birthday surprise experience
 * Built with React + Tailwind CSS + Framer Motion
 *
 * STAGES:
 * 0 - Welcome Screen
 * 1 - Relationship Quiz
 * 2 - Memory Meter (loading)
 * 3 - Mini Challenges
 * 4 - Secret Messages
 * 5 - Love Meter
 * 6 - Countdown
 * 7 - THE BIG SURPRISE
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import confetti from "canvas-confetti";
import Zara from "../assets/music.webm";

// ─── TAILWIND PALETTE TOKENS ─────────────────────────────────────────────────
// Primary: rose-300 / rose-400 / rose-500
// Accent: violet-300 / violet-400
// Gold: yellow-300 / amber-300
// Base: white / pink-50 / fuchsia-50
// Glass: white/20 backdrop-blur

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: "Whose birthday is it today? 🎂",
    options: [
      { label: "Piku 👑", correct: true },
      { label: "Some random person 😜", correct: false },
    ],
    tease: "Excuse me?! Today belongs entirely to Queen Piku 👑✨",
  },
  {
    q: "Who is the cutest person in the world? 🥰",
    options: [
      { label: "Piku 💕", correct: true },
      { label: "Not Piku 🙈", correct: false },
    ],
    tease:
      "Wrong answer detected 🚨 The correct answer is Piku. Always Piku. 😌💖",
  },
  {
    q: "Who makes Divju smile the most? 😊",
    options: [
      { label: "Piku ❤️", correct: true },
      { label: "Nobody 😏", correct: false },
    ],
    tease: "Nope! Piku is the reason behind so many of Divju's smiles 💕",
  },
  {
    q: "Who deserves unlimited hugs, gifts, and cake today? 🎁🍰",
    options: [
      { label: "Piku 🥳", correct: true },
      { label: "Divju 😂", correct: false },
    ],
    tease: "Nice try 😆 Today is ALL about Piku! 🎂✨",
  },
  {
    q: "Who is the most precious person in Divju's life? 💎",
    options: [
      { label: "Piku ❤️", correct: true },
      { label: "Someone else 😶", correct: false },
    ],
    tease: "Impossible answer 😱 Everyone knows it's Piku! 💖",
  },
  {
    q: "Who does Divju love the most? 💕",
    options: [
      { label: "Piku ❤️", correct: true },
      { label: "Chocolate 🍫", correct: false },
    ],
    tease: "Chocolate is great, but Piku wins every single time 😘",
  },
  {
    q: "Who is the star of today's celebration? 🌟",
    options: [
      { label: "Piku 👑", correct: true },
      { label: "Divju 🤭", correct: false },
    ],
    tease: "Nope! Today's spotlight belongs to the birthday girl ✨🎂",
  },
  {
    q: "What should Piku do after finishing this quiz? 😏",
    options: [
      { label: "Smile and enjoy her birthday 🥰", correct: true },
      { label: "Get angry at Divju 😂", correct: false },
    ],
    tease: "Awww, birthday smiles only today! 💕🎂",
  },
];

const LOADING_STEPS = [
  "Scanning all memories... 🧠",
  "Loading infinite love... 💖",
  "Counting every hug... 🤗",
  "Collecting cute moments... 📸",
  "Calculating happiness levels... 📊",
  "Almost ready... ✨",
];

const SECRET_MESSAGES = [
  { text: "Every day with you is my favourite day ❤️", icon: "❤️" },
  { text: "You make ordinary moments feel magical ✨", icon: "✨" },
  { text: "I smile because of you 😊", icon: "😊" },
  { text: "You are my safe place 🤍", icon: "🤍" },
  { text: "I am the luckiest person to have you 💕", icon: "💕" },
];

const LOVE_METER_STEPS = [
  { val: 10, label: "10%" },
  { val: 40, label: "40%" },
  { val: 80, label: "80%" },
  { val: 100, label: "100%" },
  { val: 200, label: "500%+" },
  { val: 300, label: "1000%+" },
  { val: 400, label: "∞ ❤️" },
];

const COMPLIMENTS = [
  "Piku is sunshine ☀️",
  "Best laugh in the world 😄",
  "Queen vibes only 👑",
  "Pure magic 🌟",
  "Prettiest smile 💕",
];

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

// ─── CONFETTI HELPERS ─────────────────────────────────────────────────────────
function fireConfetti(intense = false) {
  const count = intense ? 400 : 150;
  const colors = [
    "#f9a8d4",
    "#c084fc",
    "#fbbf24",
    "#fb7185",
    "#a78bfa",
    "#ffffff",
  ];
  confetti({ particleCount: count, spread: 120, origin: { y: 0.5 }, colors });
  if (intense) {
    setTimeout(
      () =>
        confetti({
          particleCount: 200,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.6 },
          colors,
        }),
      300,
    );
    setTimeout(
      () =>
        confetti({
          particleCount: 200,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.6 },
          colors,
        }),
      600,
    );
  }
}

// ─── FLOATING PARTICLE ────────────────────────────────────────────────────────
function FloatingParticle({
  emoji,
  x,
  y,
  duration,
  delay,
  size = 24,
  compliment,
}) {
  const [showTip, setShowTip] = useState(false);
  return (
    <motion.div
      className="absolute select-none cursor-pointer z-10"
      style={{ left: `${x}%`, top: `${y}%`, fontSize: size }}
      animate={{
        y: [0, -30, 0],
        x: [0, 10, -10, 0],
        rotate: [0, 15, -15, 0],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      onHoverStart={() => compliment && setShowTip(true)}
      onHoverEnd={() => setShowTip(false)}
    >
      {emoji}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.8 }}
            animate={{ opacity: 1, y: -36, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 bg-white/90 text-rose-500 text-xs font-semibold px-2 py-1 rounded-full shadow-lg whitespace-nowrap"
          >
            {compliment}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── SPARKLE RING ─────────────────────────────────────────────────────────────
function SparkleRing() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-300"
          style={{
            left: `${50 + 44 * Math.cos((i / 18) * 2 * Math.PI)}%`,
            top: `${50 + 44 * Math.sin((i / 18) * 2 * Math.PI)}%`,
            fontSize: 10 + Math.random() * 10,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
          transition={{
            duration: 1.4 + Math.random(),
            delay: i * 0.08,
            repeat: Infinity,
          }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
}

// ─── GLASSY CARD ──────────────────────────────────────────────────────────────
function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`backdrop-blur-xl bg-white/20 border border-white/40 shadow-2xl rounded-3xl ${className}`}
    >
      {children}
    </div>
  );
}

// ─── CUSTOM CURSOR (Desktop) ──────────────────────────────────────────────────
function HeartCursor() {
  const cursorRef = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed z-[9999] hidden md:block -translate-x-1/2 -translate-y-1/2 text-rose-400 text-xl"
      style={{ transition: "left 0.05s, top 0.05s" }}
    >
      💗
    </div>
  );
}

// ─── BACKGROUND GRADIENT ──────────────────────────────────────────────────────
function Background({ queenMode }) {
  return (
    <div
      className={`fixed inset-0 -z-10 transition-all duration-1000 ${
        queenMode
          ? "bg-gradient-to-br from-purple-900 via-fuchsia-800 to-yellow-600"
          : "bg-gradient-to-br from-pink-200 via-rose-100 to-violet-200"
      }`}
    >
      {/* Soft blobs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-violet-300/30 rounded-full blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-200/20 rounded-full blur-2xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 0: WELCOME
// ═════════════════════════════════════════════════════════════════════════════
function StageWelcome({ onNext, titleClicks, onTitleClick }) {
  const particles = [
    { emoji: "💖", x: 5, y: 10, duration: 4, delay: 0 },
    { emoji: "✨", x: 88, y: 8, duration: 5, delay: 0.5 },
    { emoji: "🌸", x: 12, y: 80, duration: 3.5, delay: 1 },
    { emoji: "💕", x: 90, y: 75, duration: 4.5, delay: 0.3 },
    { emoji: "⭐", x: 50, y: 5, duration: 6, delay: 0.8 },
    { emoji: "🌟", x: 3, y: 45, duration: 5, delay: 1.2 },
    { emoji: "💫", x: 93, y: 40, duration: 4, delay: 0.6 },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {particles.map((p, i) => (
        <FloatingParticle
          key={i}
          {...p}
          compliment={COMPLIMENTS[i % COMPLIMENTS.length]}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, type: "spring", bounce: 0.4 }}
        className="text-center z-20"
      >
        {/* Main title — click 5× for easter egg */}
        <motion.h1
          className="text-4xl md:text-6xl font-black text-rose-500 drop-shadow-xl cursor-pointer select-none"
          whileTap={{ scale: 0.92 }}
          onClick={onTitleClick}
          animate={{
            textShadow: [
              "0 0 20px #f9a8d4",
              "0 0 40px #fb7185",
              "0 0 20px #f9a8d4",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎂 Happy Birthday PIKU 🎂
        </motion.h1>

        {titleClicks > 0 && titleClicks < 5 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-rose-400 text-sm mt-1"
          >
            {5 - titleClicks} more taps for a secret... 🤫
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-xl md:text-2xl text-violet-600 font-semibold"
        >
          I have something special for you...
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10"
        >
          <GlassCard className="inline-block p-1">
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-rose-400 to-fuchsia-500 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                ❤️
              </motion.span>
              Start the Journey
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
              >
                ❤️
              </motion.span>
            </motion.button>
          </GlassCard>
        </motion.div>

        {/* Floating hearts below button */}
        <motion.div className="mt-8 flex gap-3 justify-center text-2xl">
          {["💖", "💗", "💓", "💘", "💝"].map((h, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
            >
              {h}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 1: QUIZ
// ═════════════════════════════════════════════════════════════════════════════
function StageQuiz({ onNext }) {
  const [current, setCurrent] = useState(0);
  const [tease, setTease] = useState(null);
  const [score, setScore] = useState(0);

  const handleAnswer = (correct, teaseMsg) => {
    if (correct) {
      setScore((s) => s + 1);
      if (current < QUIZ_QUESTIONS.length - 1) {
        setTimeout(() => {
          setTease(null);
          setCurrent((c) => c + 1);
        }, 500);
      } else {
        setTimeout(() => onNext(), 800);
      }
    } else {
      setTease(teaseMsg);
    }
  };

  const q = QUIZ_QUESTIONS[current];
  const progress = (current / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -60 }}
        className="w-full max-w-md"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-rose-400 font-semibold mb-1">
            <span>
              Question {current + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <span>Score: {score} ❤️</span>
          </div>
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-400 to-fuchsia-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <GlassCard className="p-8 text-center">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-rose-600 mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            {q.q}
          </motion.h2>

          <div className="flex flex-col gap-4">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.04, x: 4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleAnswer(opt.correct, q.tease)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-white/50 to-white/30 border border-white/60 text-rose-700 font-semibold text-lg shadow hover:from-rose-200/60 hover:to-fuchsia-100/60 transition-all"
              >
                {opt.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {tease && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-4 bg-rose-100/60 rounded-2xl text-rose-600 font-medium text-sm"
              >
                {tease}
                <br />
                <button
                  className="mt-2 text-xs underline text-fuchsia-600"
                  onClick={() => {
                    setTease(null);
                  }}
                >
                  Okay okay, let me try again 😅
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 2: MEMORY METER (Loading)
// ═════════════════════════════════════════════════════════════════════════════
function StageMemory({ onNext }) {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onNext, 800);
          return 100;
        }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onNext]);

  useEffect(() => {
    setStep(
      Math.min(
        Math.floor(pct / (100 / LOADING_STEPS.length)),
        LOADING_STEPS.length - 1,
      ),
    );
  }, [pct]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <GlassCard className="w-full max-w-sm p-10 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl mx-auto mb-6"
        >
          💫
        </motion.div>
        <h2 className="text-2xl font-bold text-rose-600 mb-6">
          Loading your surprise...
        </h2>

        {/* Steps */}
        <div className="space-y-2 mb-8">
          {LOADING_STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: i <= step ? 1 : 0.2, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`text-sm font-medium flex items-center gap-2 ${i <= step ? "text-rose-500" : "text-rose-300"}`}
            >
              <span>{i < step ? "✅" : i === step ? "⏳" : "⬜"}</span>
              {s}
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-500"
            style={{ width: `${pct}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <p className="mt-2 text-rose-500 font-bold text-lg">{pct}%</p>
      </GlassCard>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 3: MINI CHALLENGES
// ═════════════════════════════════════════════════════════════════════════════
function StageChallenges({ onNext }) {
  const [challenge, setChallenge] = useState(0);

  return (
    <AnimatePresence mode="wait">
      {challenge === 0 && (
        <ChallengeHearts key="c0" onDone={() => setChallenge(1)} />
      )}
      {challenge === 1 && (
        <ChallengeHidden key="c1" onDone={() => setChallenge(2)} />
      )}
      {challenge === 2 && <ChallengeCake key="c2" onDone={onNext} />}
    </AnimatePresence>
  );
}

function ChallengeHearts({ onDone }) {
  const [collected, setCollected] = useState(0);
  const TARGET = 10;
  const [hearts, setHearts] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 85,
      y: 10 + Math.random() * 75,
      alive: true,
    })),
  );

  const tap = (id) => {
    setHearts((h) =>
      h.map((hh) => (hh.id === id ? { ...hh, alive: false } : hh)),
    );
    setCollected((c) => {
      const next = c + 1;
      if (next >= TARGET) setTimeout(onDone, 600);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
    >
      <GlassCard className="p-6 text-center mb-6 z-10">
        <h2 className="text-2xl font-bold text-rose-600">
          Tap the hearts to collect love! 💖
        </h2>
        <p className="text-rose-400 mt-1">
          {collected} / {TARGET} collected
        </p>
        <div className="h-2 bg-white/30 rounded-full mt-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-400 to-fuchsia-500"
            style={{ width: `${(collected / TARGET) * 100}%` }}
          />
        </div>
      </GlassCard>

      {hearts.map((h) =>
        h.alive ? (
          <motion.button
            key={h.id}
            style={{ position: "absolute", left: `${h.x}%`, top: `${h.y}%` }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.5 }}
            onClick={() => tap(h.id)}
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: Math.random(),
            }}
            className="text-3xl cursor-pointer"
          >
            💖
          </motion.button>
        ) : null,
      )}
    </motion.div>
  );
}

function ChallengeHidden({ onDone }) {
  const [items] = useState(() => {
    const hiddenIdx = Math.floor(Math.random() * 12);
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji:
        i === hiddenIdx
          ? "💖"
          : ["🌸", "⭐", "🌟", "💫", "🎈", "🎀", "🌺", "🍀"][i % 8],
      isHeart: i === hiddenIdx,
      x: 8 + (i % 4) * 23,
      y: 15 + Math.floor(i / 4) * 28,
    }));
  });
  const [found, setFound] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
    >
      <GlassCard className="p-6 text-center mb-6 z-10 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-rose-600">
          Find the hidden heart! 🔍
        </h2>
        <p className="text-rose-400 mt-1">
          One special heart is hiding among the items...
        </p>
      </GlassCard>

      <div className="relative w-80 h-72">
        {items.map((item) => (
          <motion.button
            key={item.id}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
            }}
            whileHover={{ scale: 1.3, rotate: 15 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              if (item.isHeart && !found) {
                setFound(true);
                fireConfetti();
                setTimeout(onDone, 1200);
              }
            }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            className="text-3xl"
          >
            {item.emoji}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {found && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="mt-4 text-2xl font-bold text-rose-500"
          >
            You found it! 💖✨
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ChallengeCake({ onDone }) {
  const [cakeX, setCakeX] = useState(50);
  const [score, setScore] = useState(0);
  const TARGET = 5;
  const dirRef = useRef(1);

  useEffect(() => {
    const iv = setInterval(() => {
      setCakeX((x) => {
        const nx = x + dirRef.current * 2.5;
        if (nx > 85 || nx < 10) dirRef.current *= -1;
        return nx;
      });
    }, 50);
    return () => clearInterval(iv);
  }, []);

  const catchCake = () => {
    setScore((s) => {
      const ns = s + 1;
      if (ns >= TARGET) {
        fireConfetti();
        setTimeout(onDone, 800);
      }
      return ns;
    });
    setCakeX(10 + Math.random() * 75);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      <GlassCard className="p-6 text-center mb-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-rose-600">
          Catch the birthday cake! 🎂
        </h2>
        <p className="text-rose-400 mt-1">
          {score} / {TARGET} caught
        </p>
        <div className="h-2 bg-white/30 rounded-full mt-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-rose-400"
            style={{ width: `${(score / TARGET) * 100}%` }}
          />
        </div>
      </GlassCard>

      <div className="relative w-full max-w-sm h-32 bg-white/10 rounded-3xl overflow-hidden border border-white/30">
        <motion.button
          style={{
            position: "absolute",
            left: `${cakeX}%`,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          onClick={catchCake}
          whileTap={{ scale: 0.7 }}
          className="text-4xl cursor-pointer"
        >
          🎂
        </motion.button>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 4: SECRET MESSAGES
// ═════════════════════════════════════════════════════════════════════════════
function StageMessages({ onNext }) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setShown((s) => [...s, idx]);
      if (idx < SECRET_MESSAGES.length - 1) {
        setTimeout(() => setIdx((i) => i + 1), 1800);
      } else {
        setTimeout(onNext, 2200);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [idx, onNext]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-bold text-rose-600 mb-10 text-center">
        A few things I want you to know... 💌
      </h2>
      <div className="w-full max-w-md space-y-4">
        {SECRET_MESSAGES.map((msg, i) => (
          <AnimatePresence key={i}>
            {shown.includes(i) && (
              <motion.div
                initial={{ opacity: 0, x: -40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <GlassCard className="p-5 flex items-center gap-4">
                  <span className="text-3xl">{msg.icon}</span>
                  <p className="text-rose-700 font-semibold text-base">
                    {msg.text}
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 5: LOVE METER
// ═════════════════════════════════════════════════════════════════════════════
function StageLoveMeter({ onNext }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setStepIdx((s) => {
        if (s >= LOVE_METER_STEPS.length - 1) {
          clearInterval(t);
          setOverflow(true);
          setTimeout(onNext, 2000);
          return s;
        }
        return s + 1;
      });
    }, 700);
    return () => clearInterval(t);
  }, [onNext]);

  const current = LOVE_METER_STEPS[stepIdx];
  const pct = Math.min((current.val / 400) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <GlassCard className="w-full max-w-sm p-10 text-center">
        <motion.div
          className="text-5xl mb-4"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          ❤️
        </motion.div>
        <h2 className="text-2xl font-bold text-rose-600 mb-2">Love Meter</h2>
        <p className="text-rose-400 text-sm mb-6">
          Measuring how much I love Piku...
        </p>

        <div className="relative h-5 bg-white/30 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-violet-500"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, type: "spring" }}
          />
          {overflow && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-rose-400"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
        </div>

        <motion.p
          key={current.label}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          className="text-3xl font-black text-rose-500"
        >
          {current.label}
        </motion.p>

        <AnimatePresence>
          {overflow && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-100/50 border border-rose-300 rounded-2xl text-rose-600 font-bold text-sm"
            >
              🚨 ERROR: Love exceeds all measurable limits.
              <br />
              System has crashed due to too much Piku. 💕
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 6: COUNTDOWN
// ═════════════════════════════════════════════════════════════════════════════
function StageCountdown({ onNext }) {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count === 0) {
      setTimeout(onNext, 600);
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, onNext]);

  return (
    <motion.div
      initial={{ backgroundColor: "transparent" }}
      animate={{
        backgroundColor: count === 0 ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.4)",
      }}
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
    >
      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="text-9xl font-black text-white drop-shadow-2xl"
          >
            {count}
          </motion.div>
        ) : (
          <motion.div
            key="go"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-black text-yellow-300"
          >
            🎉 SURPRISE! 🎉
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-white/60 mt-6 text-lg">Get ready...</p>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STAGE 7: THE BIG SURPRISE
// ═════════════════════════════════════════════════════════════════════════════
function StageFinal() {
  const [giftOpen, setGiftOpen] = useState(false);
  const [showInner, setShowInner] = useState(false);

  useEffect(() => {
    fireConfetti(true);
    const t1 = setTimeout(() => fireConfetti(true), 1500);
    const t2 = setTimeout(() => fireConfetti(true), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const openGift = () => {
    setGiftOpen(true);
    fireConfetti(true);
    setTimeout(() => setShowInner(true), 700);
  };

  const balloons = ["🎈", "🎀", "🎊", "🎁", "🌟", "💖", "🎂", "✨", "🥳", "👑"];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Floating balloons */}
      {balloons.map((b, i) => (
        <FloatingParticle
          key={i}
          emoji={b}
          x={5 + i * 9}
          y={2 + (i % 3) * 8}
          duration={3 + i * 0.3}
          delay={i * 0.15}
          size={28 + (i % 3) * 6}
        />
      ))}

      <SparkleRing />

      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 60 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, type: "spring", bounce: 0.3 }}
        className="w-full max-w-lg text-center z-20"
      >
        {/* Main title */}
        <motion.h1
          className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-violet-600 mb-2"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ backgroundSize: "200%" }}
        >
          🎉 HAPPY BIRTHDAY PIKU 🎉
        </motion.h1>

        <GlassCard className="p-8 md:p-12 mt-6">
          {/* Message */}
          <TypewriterText
            text="Among all the beautiful things in my life, you are my favourite."
            className="text-lg md:text-xl text-rose-700 font-semibold leading-relaxed"
          />
          <p className="mt-4 text-base md:text-lg text-violet-700 font-medium">
            You make every day brighter, every smile bigger, and every moment
            more special.
          </p>
          <p className="mt-3 text-base text-rose-600 font-medium">
            Thank you for being you.
          </p>
          <motion.p
            className="mt-4 text-2xl font-black text-rose-500"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            I love you ❤️
          </motion.p>
        </GlassCard>

        {/* Gift box */}
        <motion.div
          className="mt-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring", bounce: 0.5 }}
        >
          {!giftOpen ? (
            <div className="text-center">
              <p className="text-rose-500 font-semibold mb-4">
                One last thing... tap to open! 🎁
              </p>
              <motion.button
                onClick={openGift}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-7xl"
              >
                🎁
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <GlassCard className="p-8 text-center border-2 border-yellow-300/60 bg-gradient-to-br from-yellow-50/40 to-rose-50/40">
                <motion.p
                  className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-rose-500"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  💖 YOU ARE MY GREATEST GIFT 💖
                </motion.p>
                {showInner && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-rose-600 font-semibold"
                  >
                    Every day with you is a gift I never want to return. 🎀
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          )}
        </motion.div>

        {/* Final hearts */}
        <motion.div
          className="mt-8 flex justify-center gap-3 text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {["💖", "💗", "💓", "💕", "💘", "💝", "💞"].map((h, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -20, 0], scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
            >
              {h}
            </motion.span>
          ))}
        </motion.div>

        <motion.button
          onClick={() => fireConfetti(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-8 bg-gradient-to-r from-rose-400 to-fuchsia-500 text-white font-bold px-8 py-3 rounded-2xl shadow-xl text-base"
        >
          🎉 Celebrate Again!
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── TYPEWRITER TEXT ──────────────────────────────────────────────────────────
function TypewriterText({ text, className }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(iv);
    }, 40);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <p className={className}>
      {displayed}
      <span className="animate-pulse">|</span>
    </p>
  );
}

// ─── EASTER EGG: SECRET MESSAGE MODAL ────────────────────────────────────────
function EasterEggModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", bounce: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="p-10 text-center max-w-sm">
          <p className="text-4xl mb-4">🤫</p>
          <h3 className="text-xl font-black text-rose-600 mb-3">
            You Found the Secret!
          </h3>
          <p className="text-rose-700 font-semibold">
            Piku is not just my girlfriend — she is my home, my peace, my
            forever. 🏠❤️
          </p>
          <button
            onClick={onClose}
            className="mt-6 bg-rose-400 text-white font-bold px-6 py-2 rounded-xl"
          >
            Close 💕
          </button>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// ─── QUEEN MODE MODAL ─────────────────────────────────────────────────────────
function QueenModeModal({ onClose }) {
  useEffect(() => {
    fireConfetti(true);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-purple-900/80 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
        transition={{ type: "spring", bounce: 0.6 }}
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard className="p-10 text-center max-w-sm border-yellow-300/60 bg-gradient-to-br from-purple-900/60 to-yellow-900/60">
          <motion.p
            className="text-6xl mb-2"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            👑
          </motion.p>
          <h3 className="text-2xl font-black text-yellow-300 mb-2">
            PIKU QUEEN MODE ACTIVATED
          </h3>
          <p className="text-yellow-100 font-semibold text-sm">
            You unlocked the secret! Piku is officially crowned the Queen of my
            heart 👑💜
          </p>
          <div className="flex justify-center gap-2 mt-4 text-2xl">
            {["👑", "✨", "💜", "👑", "✨"].map((e, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ delay: i * 0.15, repeat: Infinity }}
              >
                {e}
              </motion.span>
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-6 bg-yellow-400 text-purple-900 font-black px-6 py-2 rounded-xl"
          >
            Long Live the Queen! 👑
          </button>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

// ─── MUSIC TOGGLE ─────────────────────────────────────────────────────────────
// Note: A real audio source would be needed. This toggles a placeholder.
function MusicToggle({ playing, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 right-4 z-40 bg-white/30 backdrop-blur border border-white/50 rounded-full p-3 text-rose-500 shadow-lg"
      title={playing ? "Pause music" : "Play music"}
    >
      {playing ? (
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          🎵
        </motion.span>
      ) : (
        "🔇"
      )}
    </motion.button>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function Surprise() {
  const [stage, setStage] = useState(0);
  const [titleClicks, setTitleClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [queenMode, setQueenMode] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const konamiRef = useRef([]);
  const audioRef = useRef(null);

  // ── Konami code detector ──
  useEffect(() => {
    const handleKey = (e) => {
      konamiRef.current = [...konamiRef.current, e.key].slice(-10);
      if (konamiRef.current.join(",") === KONAMI.join(",")) {
        setQueenMode(true);
        fireConfetti(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ── Title click easter egg ──
  const handleTitleClick = () => {
    setTitleClicks((c) => {
      const n = c + 1;
      if (n >= 5) {
        setShowEasterEgg(true);
        return 0;
      }
      return n;
    });
  };

  // ── Navigation ──
  const next = useCallback(() => setStage((s) => s + 1), []);

  // ── Music toggle (demo) ──
  const toggleMusic = () => {
    setMusicPlaying((p) => {
      if (audioRef.current) {
        p ? audioRef.current.pause() : audioRef.current.play().catch(() => {});
      }
      return !p;
    });
  };

  return (
    <div className="relative min-h-screen font-sans cursor-none md:cursor-none overflow-x-hidden">
      {/* Custom heart cursor — desktop only */}
      <HeartCursor />

      {/* Animated background */}
      <Background queenMode={queenMode} />

      {/* Music toggle */}
      <MusicToggle playing={musicPlaying} onToggle={toggleMusic} />
      {/* Hidden audio element — swap src for a real audio file */}
      <audio ref={audioRef} loop src={Zara} />

      {/* Stage transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          {stage === 0 && (
            <StageWelcome
              onNext={next}
              titleClicks={titleClicks}
              onTitleClick={handleTitleClick}
            />
          )}
          {stage === 1 && <StageQuiz onNext={next} />}
          {stage === 2 && <StageMemory onNext={next} />}
          {stage === 3 && <StageChallenges onNext={next} />}
          {stage === 4 && <StageMessages onNext={next} />}
          {stage === 5 && <StageLoveMeter onNext={next} />}
          {stage === 6 && <StageCountdown onNext={next} />}
          {stage >= 7 && <StageFinal />}
        </motion.div>
      </AnimatePresence>

      {/* Easter egg modals */}
      <AnimatePresence>
        {showEasterEgg && (
          <EasterEggModal onClose={() => setShowEasterEgg(false)} />
        )}
        {queenMode && <QueenModeModal onClose={() => setQueenMode(false)} />}
      </AnimatePresence>

      {/* Stage skip dots (dev helper — remove for production) */}
      {/* Uncomment if you want quick stage navigation during testing:
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {Array.from({length:8},(_,i)=>(
          <button key={i} onClick={()=>setStage(i)}
            className={`w-2 h-2 rounded-full transition-all ${stage===i?'bg-rose-500 scale-125':'bg-rose-200'}`}
          />
        ))}
      </div>
      */}
    </div>
  );
}
