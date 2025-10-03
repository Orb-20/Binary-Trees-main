// src/components/AnimatedMascot.jsx
import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { MASCOT_META } from '../mascot.config';

const MascotSvgs = {
  kiki: (refs) => (
    <svg viewBox="0 0 200 200" role="img" aria-label="Kiki mascot">
      <g ref={refs.container}>
        <circle cx="100" cy="120" r="50" fill={MASCOT_META.kiki.color} />
        <circle cx="100" cy="86" r="36" fill="#FFF8F0" />
        <ellipse ref={refs.leftEye} cx="88" cy="82" rx="6" ry="6" fill="#333" transform-origin="88 82" />
        <ellipse ref={refs.rightEye} cx="112" cy="82" rx="6" ry="6" fill="#333" transform-origin="112 82" />
        <rect ref={refs.mouth} x="86" y="104" width="28" height="8" rx="4" fill={MASCOT_META.kiki.color} transform-origin="100 108" />
        <path d="M60 60 q10 -20 20 0" fill={MASCOT_META.kiki.color} />
        <path d="M140 60 q-10 -20 -20 0" fill={MASCOT_META.kiki.color} />
        <g ref={refs.leftArm} transform-origin="150px 120px"><circle cx="50" cy="120" r="12" fill={MASCOT_META.kiki.color} /></g>
        <g ref={refs.rightArm} transform-origin="50px 120px"><circle cx="150" cy="120" r="12" fill={MASCOT_META.kiki.color} /></g>
      </g>
    </svg>
  ),
  bolt: (refs) => (
     <svg viewBox="0 0 200 200" role="img" aria-label="Bolt mascot">
        <g ref={refs.container}>
            <rect x="60" y="80" width="80" height="80" rx="20" fill={MASCOT_META.bolt.color} />
            <rect x="75" y="50" width="50" height="50" rx="10" fill="#eee" />
            <rect ref={refs.leftEye} x="88" y="65" width="8" height="8" rx="2" fill={MASCOT_META.bolt.accent} transform-origin="92 69" />
            <rect ref={refs.rightEye} x="104" y="65" width="8" height="8" rx="2" fill={MASCOT_META.bolt.accent} transform-origin="108 69" />
            <rect ref={refs.mouth} x="90" y="80" width="20" height="4" rx="2" fill={MASCOT_META.bolt.accent} transform-origin="100 82" />
            <g ref={refs.leftArm} transform-origin="60px 120px"><rect x="30" y="110" width="30" height="15" rx="8" fill={MASCOT_META.bolt.color} /></g>
            <g ref={refs.rightArm} transform-origin="140px 120px"><rect x="140" y="110" width="30" height="15" rx="8" fill={MASCOT_META.bolt.color} /></g>
        </g>
    </svg>
  ),
  sage: (refs) => (
    <svg viewBox="0 0 200 200" role="img" aria-label="Sage mascot">
        <g ref={refs.container}>
            <path d="M 100 40 C 60 40 40 80 40 120 S 60 180 100 180 S 160 160 160 120 S 140 40 100 40 Z" fill={MASCOT_META.sage.color} />
            <circle cx="100" cy="100" r="30" fill={MASCOT_META.sage.accent} />
            <circle ref={refs.leftEye} cx="90" cy="95" r="5" fill="#333" transform-origin="90 95" />
            <circle ref={refs.rightEye} cx="110" cy="95" r="5" fill="#333" transform-origin="110 95" />
            <path ref={refs.mouth} d="M 95 110 L 105 110 L 100 115 Z" fill="#FFB4A2" transform-origin="100 112" />
            <path ref={refs.leftArm} d="M 60 120 C 40 100, 40 140, 60 150 Z" fill={MASCOT_META.sage.color} />
            <path ref={refs.rightArm} d="M 140 120 C 160 100, 160 140, 140 150 Z" fill={MASCOT_META.sage.color} />
        </g>
    </svg>
  )
};

const runAnimation = (reaction, refs) => {
    // Stop any ongoing animations on all animated parts to prevent conflicts
    anime.remove([
        refs.container.current, refs.leftArm.current, refs.rightArm.current,
        refs.mouth.current, refs.leftEye.current, refs.rightEye.current
    ]);

    // --- Persistent idle animations for liveliness ---
    // Smoother, gentle floating animation
    anime({
        targets: refs.container.current,
        translateY: [0, -3, 0],
        easing: 'easeInOutSine',
        duration: 3500,
        loop: true
    });

    // Slow, randomized blinking
    anime({
        targets: [refs.leftEye.current, refs.rightEye.current],
        scaleY: [1, 0.1, 1],
        easing: 'easeInOutSine',
        duration: 250,
        delay: anime.random(3000, 6000), // Blink at random intervals between 3-6 seconds
        loop: true
    });

    // --- Expressive mouth animation for speaking reactions ---
    const mouthSpeaking = () => {
        if(refs.mouth.current) {
            const mouthTimeline = anime.timeline({
                targets: refs.mouth.current,
                duration: 250,
                easing: 'easeInOutSine',
                loop: 2 // Loop the sequence twice for a better effect
            });

            mouthTimeline
                .add({ scaleY: [1, 0.4], scaleX: [1, 1.1] })
                .add({ scaleY: [0.4, 1], scaleX: [1.1, 1] })
                .add({ scaleY: [1, 0.6], scaleX: [1, 1.05] })
                .add({ scaleY: [0.6, 1], scaleX: [1.05, 1] });
        }
    };

    // --- Reaction-specific animations ---
    switch (reaction) {
        case 'greet':
            anime({ targets: refs.rightArm.current, rotate: [0, 30, -10, 0], duration: 1200, easing: 'easeOutElastic(1, .7)'});
            mouthSpeaking();
            break;
        case 'explain':
            anime({ targets: refs.leftArm.current, rotate: [0, -20, 0], duration: 800, easing: 'easeInOutSine' });
            mouthSpeaking();
            break;
        case 'celebrate':
            anime({ targets: refs.container.current, translateY: [-10, 0], scale: [1, 1.05, 1], duration: 700, easing: 'easeOutBack' });
            anime({ targets: [refs.leftArm.current, refs.rightArm.current], rotate: (el, i) => i === 0 ? -25 : 25, duration: 700, easing: 'easeOutBack' });
            break;
        case 'recap':
             anime({ targets: refs.container.current, rotate: [0, 5, -2, 0], duration: 700, easing: 'easeInOutCubic'});
             mouthSpeaking();
             break;
        default: // idle state
            anime({ targets: [refs.leftArm.current, refs.rightArm.current], rotate: 0, translateX: 0, duration: 400 });
            break;
    }
}

export default function AnimatedMascot({ character = 'kiki', reaction = 'idle', size = 80 }) {
  const refs = { container: useRef(), leftEye: useRef(), rightEye: useRef(), mouth: useRef(), leftArm: useRef(), rightArm: useRef() };
  useEffect(() => { runAnimation(reaction, refs); }, [reaction, character]);
  const MascotComponent = MascotSvgs[character];
  return ( <div style={{ width: size, height: size, flexShrink: 0 }}>{MascotComponent(refs)}</div> );
}