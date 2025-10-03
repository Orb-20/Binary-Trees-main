import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import algorithms from '../data/algorithms.json';

// --- Syntax Highlighting Function ---
// This function now processes one line at a time.
const highlightSyntax = (line, language) => {
  if (!line) return '';

  const keywords = {
    cpp: [
      '#include', 'using', 'namespace', 'std', 'int', 'void', 'struct', 'class', 'public', 'private',
      'if', 'else', 'while', 'for', 'return', 'new', 'delete', 'nullptr', 'const', 'enum', 'auto',
      '#define', 'bool', 'true', 'false', 'cout', 'cin', 'vector', 'queue', 'string', 'pair', 'swap',
      'throw', 'runtime_error'
    ],
    java: [
      'import', 'java', 'util', 'public', 'class', 'private', 'void', 'int', 'if', 'else', 'while',
      'for', 'return', 'new', 'null', 'final', 'boolean', 'true', 'false', 'System', 'out', 'print',
      'println', 'enum', 'throws', 'static', 'package'
    ],
  };

  const currentKeywords = keywords[language] || [];
  const keywordRegex = new RegExp(`\\b(${currentKeywords.join('|')})\\b`, 'g');

  return line
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') // HTML escape
    .replace(/(\/\/.*)/g, '<span class="comment">$1</span>') // Comments
    .replace(/"(.*?)"/g, '<span class="value">"$1"</span>') // Strings
    .replace(keywordRegex, '<span class="keyword">$1</span>') // Keywords
    .replace(/(\b[A-Z][a-zA-Z0-9]*\b)/g, '<span class="builtin">$1</span>') // Class names / Types
    .replace(/(\b\d+\b)/g, '<span class="value">$1</span>'); // Numbers
};


// Component to parse and style the algorithm string
const StyledAlgorithm = ({ text }) => {
  const lines = text.split('\n').map((line, index) => {
    // ## Subtitle
    if (line.startsWith('## ')) {
      return <h4 key={index} className="algo-subtitle">{line.substring(3)}</h4>;
    }
    // # Title
    if (line.startsWith('# ')) {
      return <h3 key={index} className="algo-title">{line.substring(2)}</h3>;
    }
    // - List item
    if (line.trim().startsWith('- ')) {
       line = line.replace('- ','');
    }
    
    // **bold** keywords
    const parts = line.split(/(\*\*.*?\*\*)/g);

    return (
      <p key={index} className="algo-line">
        {parts.map((part, i) =>
          part.startsWith('**') ? (
            <strong key={i} className="algo-keyword">
              {part.substring(2, part.length - 2)}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    );
  });

  return <div className="algo-container">{lines}</div>;
};

// --- UPDATED CodeBlock Component ---
// This now splits the code into lines to preserve spacing.
const CodeBlock = ({ code, language }) => {
  return (
    <motion.pre
      className="code-block"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <code>
        {code.split('\n').map((line, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: highlightSyntax(line, language) || ' ' }} />
        ))}
      </code>
    </motion.pre>
  );
};


const AlgorithmSection = ({ title, description, data }) => {
  const [activeTab, setActiveTab] = useState('algorithm');
  const tabs = ['algorithm', 'cpp', 'java'];

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="small">{title}</h3>
      <p className="info">{description}</p>
      <div className="code-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab === 'cpp' ? 'C++' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {activeTab === 'algorithm' ? (
          <StyledAlgorithm key="algorithm" text={data.algorithm} />
        ) : (
          <CodeBlock key={activeTab} code={data[activeTab]} language={activeTab} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Algorithm({ treeType }) {
  const treeAlgorithms = algorithms[treeType] || algorithms['GENERAL'];
  const pageTitle = treeType === 'GENERAL' ? 'Common Tree Algorithms' : `Algorithms — ${treeType}`;

  return (
    <div>
      <h2 className="h1">{pageTitle}</h2>
      {Object.keys(treeAlgorithms).length > 0 ? (
        Object.values(treeAlgorithms).map((algoData, index) => (
          <AlgorithmSection
            key={index}
            title={algoData.title}
            description={algoData.description}
            data={algoData}
          />
        ))
      ) : (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="info">Algorithm examples for {treeType} are not available yet. Please check back later!</p>
        </motion.div>
      )}
    </div>
  );
}