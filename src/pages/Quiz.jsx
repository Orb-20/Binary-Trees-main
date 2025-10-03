import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Mascot from '../components/Mascot';

const QUIZ_LENGTH = 7;
const TIME_PER_QUESTION = 15;
const LOW_TIME_THRESHOLD = 5;

// ... (Helper functions remain the same) ...
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);
const generateQuizQuestions = (allQuestions) => {
  if (!allQuestions || allQuestions.length < QUIZ_LENGTH) return [];
  const getQs = (difficulty, count) => {
    const filtered = allQuestions.filter(q => q.difficulty === difficulty);
    return shuffleArray(filtered).slice(0, count);
  };
  const quizSet = [ ...getQs('super-easy', 2), ...getQs('easy', 2), ...getQs('medium', 2), ...getQs('hard', 1) ];
  return shuffleArray(quizSet);
};
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};
const getQuizModule = (type) => {
  const t = type.toLowerCase();
  switch (t) {
    case 'general': return import('../data/quiz-general.json');
    case 'bt': return import('../data/quiz-bt.json');
    case 'bst': return import('../data/quiz-bst.json');
    case 'heap': return import('../data/quiz-heap.json');
    case 'tries': return import('../data/quiz-tries.json');
    default: return Promise.resolve({ default: [] });
  }
};

export default function Quiz({ treeType }) {
  // ... (All state hooks and effects remain the same) ...
  const [gameState, setGameState] = useState('loading');
  const [allCategoryQuestions, setAllCategoryQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_LENGTH * TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [mascotState, setMascotState] = useState("idle");

  useEffect(() => {
    setGameState('loading');
    getQuizModule(treeType)
      .then(module => { setAllCategoryQuestions(module.default); setGameState('ready'); })
      .catch((err) => { console.error(`Failed to load quiz:`, err); setGameState('ready'); });
  }, [treeType]);

  useEffect(() => {
    if (gameState === 'active' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && gameState === 'active') {
      setGameState('finished');
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === "active" && !isAnswered && timeLeft <= LOW_TIME_THRESHOLD && timeLeft > 0) {
      if (mascotState !== "lowTime") setMascotState("lowTime");
    } else if (mascotState === "lowTime" && (isAnswered || timeLeft > LOW_TIME_THRESHOLD)) {
      setMascotState("idle");
    }
  }, [timeLeft, gameState, isAnswered, mascotState]);

  const startQuiz = () => {
    const generatedQuestions = generateQuizQuestions(allCategoryQuestions);
    if (generatedQuestions.length === 0) {
        setGameState('ready');
        alert("Could not start the quiz. Not enough questions available.");
        return;
    }
    setQuestions(generatedQuestions);
    setTimeLeft(QUIZ_LENGTH * TIME_PER_QUESTION);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setMascotState("idle");
    setGameState('active');
  };

  const handleAnswerSelect = (option) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(option);
    const isCorrect = option === questions[currentQuestionIndex].answer;
    setMascotState(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(prev => prev + 1);
    setTimeout(() => {
      setMascotState("idle");
      if (currentQuestionIndex < QUIZ_LENGTH - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setGameState('finished');
      }
    }, 2000);
  };

  const getButtonClass = (option) => {
    if (!isAnswered) return 'btn-tree-op insert';
    if (option === questions[currentQuestionIndex].answer) return 'btn-tree-op insert';
    if (option === selectedAnswer) return 'btn-tree-op delete';
    return 'btn-tree-op';
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  if (gameState === 'loading') return <div className="card">Loading Quiz...</div>;
  if (gameState === 'ready') {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 className="h1">{treeType} Quiz</h2>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="small">Ready for a challenge?</h3>
            <button className="btn-tree-op insert" style={{ padding: '12px 24px', marginTop: '16px' }} onClick={startQuiz}>Start Quiz</button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'finished' || !currentQuestion) {
     return (
      <div style={{ textAlign: 'center' }}>
        <h2 className="h1">Quiz Complete!</h2>
        <motion.div className="card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Mascot state="correct" size={120} style={{ margin: '0 auto -20px' }} />
          <h3 className="small">Final Score</h3>
          <p style={{ fontSize: '3rem', margin: '16px 0', fontWeight: 'bold', color: 'var(--primary)' }}>{score} / {QUIZ_LENGTH}</p>
          <button className="btn-tree-op delete" onClick={startQuiz}>Play Again</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <h2 className="h1">Question {currentQuestionIndex + 1}/{QUIZ_LENGTH}</h2>
        <div className="card" style={{ padding: '8px 16px', marginBottom: '0' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--color-burnt-copper)' }}>{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: '80px', position: 'relative' }}>
        <Mascot
          state={mascotState}
          size={240}
          style={{
            position: 'absolute',
            left: '-80px', // Pushed further to the left
            bottom: '50px', // Positioned relative to the container
            zIndex: 10,
          }}
        />
        <div style={{ position: 'relative', flexGrow: 1, marginLeft: '130px' }}>
          <motion.div
            key={`bubble-tail-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: -20, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
            style={{
              width: 0, height: 0,
              borderTop: '20px solid transparent',
              borderBottom: '20px solid transparent',
              borderRight: `25px solid rgba(255, 255, 255, 0.7)`,
              position: 'absolute',
              left: '-25px',
              top: '30px', // Aligned with the top of the card
              zIndex: 5,
              filter: 'blur(1px)'
          }}/>
          <motion.div
            key={currentQuestionIndex}
            className="card"
            initial={{ opacity: 0, scale: 0.5, x: -200, y: -80 }} // Start animation from mascot's head area
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <h3 className="small" style={{ marginBottom: '24px', textAlign: 'center', minHeight: '50px' }}>{currentQuestion.question}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {currentQuestion.options.map((option) => (
                <button key={option} className={getButtonClass(option)} onClick={() => handleAnswerSelect(option)} disabled={isAnswered} style={{ width: '100%', minHeight: '50px' }}>
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}