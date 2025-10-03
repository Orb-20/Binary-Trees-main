// src/pages/StoryMode.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIALOGUE } from '../stories/dialogue';
import { STORIES } from '../stories'; // Import the story summaries
import StoryTreeAnimation from '../components/StoryTreeAnimation';
import AnimatedMascot from '../components/AnimatedMascot';
import { MASCOT_META } from '../mascot.config.js';

// A new component to parse and style the summary text
const StyledStorySummary = ({ text }) => {
  if (!text) return null;
  
  const lines = text.split('\n').map((line, index) => {
    line = line.trim();
    if (line.length === 0) return null; // Skip empty lines

    // Subheadings
    if (line.includes(':') && !line.startsWith('! -')) {
      return <h4 key={index} className="story-subheading">{line}</h4>;
    }
    // Bullet points
    if (line.startsWith('- ')) {
      return <p key={index} className="story-bullet">{line.substring(2)}</p>;
    }
    // Highlighted rule
    if (line.startsWith('!')) {
      return <p key={index} className="story-rule">{line.substring(2)}</p>;
    }
    // Standard paragraph
    return <p key={index} className="story-paragraph">{line}</p>;
  }).filter(Boolean); // Filter out null (empty) lines

  return <div className="story-text-section">{lines}</div>;
};


// The Modal Component
const SummaryModal = ({ storyText, onClose }) => {
  return (
    <motion.div
      className="summary-modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="summary-modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <h3 className="theory-title">Story Summary</h3>
        <StyledStorySummary text={storyText} />
      </motion.div>
    </motion.div>
  );
};


export default function StoryMode({ treeType }) {
  const [fullDialogue, setFullDialogue] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationFocus, setAnimationFocus] = useState(null);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false); // State for modal
  const chatEndRef = useRef(null);

  const startStory = (dialogue) => {
    if (dialogue.length > 0) {
        setConversation([dialogue[0]]);
        setCurrentIndex(0);
        setAnimationFocus(dialogue[0].animationTarget);
    } else {
        setConversation([]);
        setCurrentIndex(0);
        setAnimationFocus(null);
    }
  };

  useEffect(() => {
    const storyDialogue = DIALOGUE[treeType] || DIALOGUE['GENERAL'];
    setFullDialogue(storyDialogue);
    startStory(storyDialogue);
    setIsSummaryVisible(false); // Close modal on type change
  }, [treeType]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleNext = () => {
    if (currentIndex >= fullDialogue.length - 1) return;
    const nextIndex = currentIndex + 1;
    const nextLine = fullDialogue[nextIndex];
    setCurrentIndex(nextIndex);
    setConversation(prev => [...prev, nextLine]);
    setAnimationFocus(nextLine.animationTarget);
  };

  const handleReset = () => {
    startStory(fullDialogue);
  };

  const isStoryEnd = currentIndex >= fullDialogue.length - 1;

  const handleButtonClick = () => {
    if (isStoryEnd) {
      handleReset();
    } else {
      handleNext();
    }
  };

  return (
    <div>
      <h2 className="h1">Story Mode — {treeType}</h2>
      <div className="card story-canvas">
        <div className="story-animation-panel-small">
          <StoryTreeAnimation 
              treeType={treeType} 
              animationFocus={animationFocus}
              currentIndex={currentIndex} 
            />
        </div>
        
        <div className="story-chat-panel">
          <div className="story-chat-log">
            <AnimatePresence>
              {conversation.map((line, index) => {
                const mascotInfo = MASCOT_META[line.mascotId];
                return (
                  <motion.div
                    key={index}
                    className={`chat-message-row ${line.mascotId}`}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    layout
                  >
                    <AnimatedMascot character={line.mascotId} reaction={line.reaction} size={60} />
                    <div
                      className="chat-bubble"
                      style={{
                        backgroundColor: mascotInfo.bubbleBg,
                        color: mascotInfo.bubbleColor,
                        border: `1px solid rgba(255, 255, 255, 0.3)`
                      }}
                    >
                      {line.text}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
          
          <div className="story-button-group">
            <button
              onClick={handleButtonClick}
              className="btn-tree-op insert"
            >
              {isStoryEnd ? 'Reset Story' : 'Next'}
            </button>
            
            {isStoryEnd && (
              <motion.button
                onClick={() => setIsSummaryVisible(true)}
                className="btn-tree-op delete"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                transition={{ delay: 0.2 }}
              >
                Summarize
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSummaryVisible && (
          <SummaryModal
            storyText={STORIES[treeType] || ''}
            onClose={() => setIsSummaryVisible(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}