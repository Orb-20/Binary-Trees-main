import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import anime from "animejs";

export default function Mascot({
  state = "idle",
  size = 200,
  className = "",
  style = {},
  useAnime = true,
}) {
  const controls = useAnimation();
  const [liveMessage, setLiveMessage] = useState("");
  
  const leftLeafRef = useRef(null);
  const rightLeafRef = useRef(null);
  const confettiControls = useAnimation();
  const rainControls = useAnimation();

  const wrapperVariants = {
    idle: { y: [0, -4, 0], transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } },
    correct: { y: [0, -15, 0], scale: [1, 1.08, 1], transition: { duration: 0.7, ease: "easeOut" } },
    wrong: { x: [0, -8, 8, -5, 5, 0], rotate: [0, -4, 4, -2, 2, 0], transition: { duration: 0.6, ease: "easeInOut" } },
    lowTime: { x: [0, -1, 1, -1, 1, 0], transition: { duration: 0.3, repeat: Infinity } },
  };

  const leftHandVariants = {
    idle: { y: 0, x: 0, rotate: -15 },
    correct: { y: -25, x: -5, rotate: -45, transition: { duration: 0.5, ease: "backOut" } },
    wrong: { y: 10, x: 5, rotate: 25, transition: { duration: 0.5, ease: "easeOut" } },
    lowTime: { y: [0, -3, 0], rotate: [-15, -20, -15], transition: { duration: 0.3, repeat: Infinity } },
  };
  const rightHandVariants = {
    idle: { y: 0, x: 0, rotate: 15 },
    correct: { y: -25, x: 5, rotate: 45, transition: { duration: 0.5, ease: "backOut" } },
    wrong: { y: 10, x: -5, rotate: -25, transition: { duration: 0.5, ease: "easeOut" } },
    lowTime: { y: [0, -3, 0], rotate: [15, 20, 15], transition: { duration: 0.3, repeat: Infinity } },
  };

  const mouthVariants = {
    idle: { d: "M 48 58 Q 60 62 72 58" },
    correct: { d: "M 46 56 Q 60 74 74 56" },
    wrong: { d: "M 46 62 Q 60 52 74 62" },
    lowTime: { d: "M 55 61 A 5 3 0 1 0 65 61" },
  };

  useEffect(() => {
    controls.start(state);
    if (useAnime) {
      anime.remove([leftLeafRef.current, rightLeafRef.current]);
      if (state === 'lowTime') {
        anime({ targets: [leftLeafRef.current, rightLeafRef.current], rotate: '+=5', duration: 350, direction: "alternate", loop: true, easing: "easeInOutSine" });
      }
    }

    if (state === "correct") {
      setLiveMessage("Correct!");
      confettiControls.start("fire");
      rainControls.start("idle"); 
    } else if (state === "wrong") {
      setLiveMessage("Incorrect.");
      rainControls.start("rain");
      confettiControls.start("idle");
    } else {
      setLiveMessage(state === "lowTime" ? "Time is running low!" : "Idle");
      confettiControls.start("idle");
      rainControls.start("idle");
    }

  }, [state, controls, useAnime, confettiControls, rainControls]);
  
  return (
    <div className={className} style={{ width: size, height: size, position: "relative", pointerEvents: "none", ...style }}>
      <motion.div animate={controls} initial="idle" variants={wrapperVariants} style={{ width: "100%", height: "100%" }}>
        <svg viewBox="0 0 120 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" overflow="visible">
          <defs>
            <linearGradient id="leafGrad" x1="0" x2="1"><stop offset="0%" stopColor="#A9DF8E" /><stop offset="100%" stopColor="#66BB6A" /></linearGradient>
            <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.15" /></filter>
          </defs>
          <motion.g initial="idle" animate={rainControls}>
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.line
                key={`rain-${i}`}
                y1={-10} y2={5}
                stroke="#6FD2E1" strokeWidth="2.5" strokeLinecap="round"
                variants={{
                  idle: { opacity: 0, y: -20, transition: { duration: 0 } },
                  rain: { 
                    opacity: [0, 1, 1, 0],
                    y: [-10, 30, 80],
                    transition: { 
                      duration: 1.2, 
                      delay: i * 0.05, 
                      ease: "easeIn" 
                    }
                  }
                }}
                 style={{
                  x: 60 + (Math.random() - 0.5) * 80,
                }}
              />
            ))}
          </motion.g>
          <g filter="url(#softShadow)">
            <motion.g initial="idle" animate={state} variants={leftHandVariants} transformOrigin="center center">
              <line x1="38" y1="80" x2="50" y2="65" stroke="#7B4F39" strokeWidth="4" strokeLinecap="round" />
              <circle cx="35" cy="85" r="10" fill="#0FA683" stroke="#032F2F" strokeWidth="2" />
            </motion.g>
            <motion.g initial="idle" animate={state} variants={rightHandVariants} transformOrigin="center center">
              <line x1="82" y1="80" x2="70" y2="65" stroke="#7B4F39" strokeWidth="4" strokeLinecap="round" />
              <circle cx="85" cy="85" r="10" fill="#0FA683" stroke="#032F2F" strokeWidth="2" />
            </motion.g>
            <g transform="translate(52, 80)"><rect x="0" y="0" width="16" height="25" rx="4" fill="#7B4F39" /></g>
            <circle cx="60" cy="55" r="30" fill="#8BC34A" stroke="#4CAF50" strokeWidth="2.5" />
            <g>
              <g ref={leftLeafRef} style={{ transformOrigin: "80% 100%" }}><path d="M45 35 C35 23, 50 10, 60 20 Z" fill="url(#leafGrad)" stroke="#4CAF50" strokeWidth="1" transform="rotate(-15 50 25)" /></g>
              <g ref={rightLeafRef} style={{ transformOrigin: "20% 100%" }}><path d="M75 35 C85 23, 70 10, 60 20 Z" fill="url(#leafGrad)" stroke="#4CAF50" strokeWidth="1" transform="rotate(15 70 25)" /></g>
            </g>
            <g>
              <circle cx="48" cy="52" r="3.2" fill="#1B1B1B" />
              <circle cx="72" cy="52" r="3.2" fill="#1B1B1B" />
              <motion.path stroke="#1B1B1B" strokeWidth="2.2" fill="transparent" strokeLinecap="round" initial="idle" animate={state} variants={mouthVariants}/>
              <motion.path d="M78 42 C80 40, 86 38, 86 44 C86 50, 78 56, 76 48 C74 42, 76 44, 78 42 Z" fill="#6FD2E1" initial={{ opacity: 0 }} animate={state === "lowTime" ? { opacity: 1, y: [0, -2, 0], transition: {repeat: Infinity, duration: 1.5} } : { opacity: 0 }} />
            </g>
          </g>
          <motion.g initial="idle" animate={confettiControls}>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.path key={`confetti-${i}`} d="M0,0 L5,2 L10,0 Z"
                fill={['#FFD700', '#FF4500', '#32CD32', '#1E90FF'][i % 4]}
                variants={{ idle: { opacity: 0, scale: 0 }, fire: { opacity: 1, scale: 1, transition: { delay: i * 0.04 } } }}
                style={{ x: 60, y: 55, transformOrigin: 'center center' }}
                animate={{ x: 60 + Math.sin(i * 0.8) * (60 + Math.random() * 20), y: 55 + Math.cos(i * 0.8) * (60 + Math.random() * 20), opacity: 0, scale: 0, }}
                transition={{ duration: 0.8 + Math.random() * 0.5, ease: "easeOut" }}
              />
            ))}
          </motion.g>
        </svg>
      </motion.div>
      <div aria-live="polite" style={{ position: 'absolute', opacity: 0 }}>{liveMessage}</div>
    </div>
  );
}