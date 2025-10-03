import React from 'react';
import { motion } from 'framer-motion';

const THEORIES = {
  GENERAL: `# What is a Tree?\nA Tree is a fundamental **non-linear** data structure that represents hierarchical data, like a family tree or a company's organization chart.\n\nIt consists of a collection of **nodes** connected by **edges**, with one special node designated as the **Root**.\n\n## Key Concepts:\n- **Root**: The topmost node, where the tree originates.\n- **Parent**: A node that has child nodes connected below it.\n- **Child**: A node that has a parent node above it.\n- **Leaf**: A node with **no children**. These are the endpoints of the tree.\n- **Edge**: The link or connection between a parent and a child node.`,
  BT: `# What is a Binary Tree?\nA **Binary Tree** is a specialized tree where the "binary" part is key: each node can have **at most two children**.\n\nThese children are referred to as the **left child** and the **right child**. This simple constraint is the foundation for many powerful and efficient data structures like BSTs and Heaps.\n\n## Key Properties:\n- Each node contains a **value** or key.\n- Each node has pointers to a left child and a right child, which can be *null*.\n- The path from the root to any node is **unique**.\n\n## Types of Binary Trees:\n- **Full Binary Tree**: Every node has either **0 or 2** children.\n- **Complete Binary Tree**: All levels are completely filled except possibly the last, which is filled from **left to right**.\n- **Perfect Binary Tree**: A full binary tree where all leaf nodes are at the **same level**.\n- **Skewed Binary Tree**: Each node is connected to only one child, resembling a linked list.`,
  BST: `# Binary Search Tree (BST)\nA **BST** is a special type of binary tree that keeps its data **sorted**. This provides a massive advantage for searching.\n\nFor any given node, it follows one strict rule:\n  - All values in its **left subtree** must be *less than* the node's value.\n  - All values in its **right subtree** must be *greater than* the node's value.\n\nThis property makes search, insert, and delete operations incredibly efficient, with an average time complexity of **O(log n)**. However, if the tree becomes unbalanced, this can degrade to O(n).`,
  AVL: `# AVL Tree\nAn **AVL tree** is a *self-balancing* Binary Search Tree. It's a smarter BST that refuses to become lopsided.\n\nThe heights of the two child subtrees of any node can differ by **at most one**. If they ever differ by more, the tree automatically performs **rotations** to restore its balance.\n\n## Balancing Operations:\n- **Left Rotation (LL)**\n- **Right Rotation (RR)**\n- **Left-Right Rotation (LR)**\n- **Right-Left Rotation (RL)**\n\nBy keeping itself balanced, AVL trees guarantee **O(log n)** time complexity for all major operations, even in the worst-case scenario.`,
  RB: `# Red-Black Tree\nA **Red-Black Tree** is another type of *self-balancing* BST that uses node **colors** (red or black) to ensure balance.\n\nBy enforcing a set of properties, it ensures that the longest path from the root to any leaf is no more than twice as long as the shortest path, keeping operations efficient.\n\n## Core Properties:\n1. Every node is either **red** or **black**.\n2. The root is always **black**.\n3. There are no two adjacent **red** nodes.\n4. Every path from a node to any of its descendant leaves has the **same number of black nodes**.`,
  HEAP: `# Heap\nA **Heap** is a specialized tree-based data structure that is a *nearly complete* binary tree. Its primary use is to efficiently access the minimum or maximum element.\n\nHeaps come in two main types:\n- **Max-Heap**: The value of each parent node is **greater than or equal to** the value of its children. The root holds the largest element.\n- **Min-Heap**: The value of each parent node is **less than or equal to** the value of its children. The root holds the smallest element.\n\nHeaps are the perfect data structure for implementing **Priority Queues** and are the core of the **Heapsort** algorithm.`,
  TRIES: `# Trie (Prefix Tree)\nA **Trie** is a unique tree-like data structure that is highly efficient for storing and retrieving **strings**. Instead of storing keys, each node represents a single character.\n\nThe path from the root to a node represents a **prefix**, and a special marker on a node indicates the end of a complete word.\n\n## Key Advantages:\n- Tries can insert and find strings in **O(L)** time, where L is the length of the string.\n- They are extremely effective for applications like **autocomplete**, **spell checkers**, and **IP routing**.\n\nEach node in a Trie can have multiple children, one for each possible character in the alphabet being used (e.g., 26 for English).`,
};

// Component to parse and style the theory text
const StyledTheoryContent = ({ text }) => {
    const lines = text.split('\n').map((line, index) => {
      // # Title
      if (line.startsWith('# ')) {
        return <h3 key={index} className="theory-title">{line.substring(2)}</h3>;
      }
      // ## Subtitle
      if (line.startsWith('## ')) {
        return <h4 key={index} className="theory-subtitle">{line.substring(3)}</h4>;
      }
      // - List item
      if (line.trim().startsWith('- ')) {
         line = line.replace('- ','');
         const parts = line.split(/(\*\*.*?\*\*)/g);
         return (
             <li key={index} className="theory-bullet">
                {parts.map((part, i) =>
                  part.startsWith('**') ? (
                    <strong key={i} className="theory-keyword">
                      {part.substring(2, part.length - 2)}
                    </strong>
                  ) : (
                    <span key={i}>{part}</span>
                  )
                )}
             </li>
         );
      }
      
      // **bold** and *italic*
      const parts = line.split(/(\*\*.*?\*\*)|(\*.*?\*)/g).filter(Boolean);
  
      return (
        <p key={index} className="theory-paragraph">
          {parts.map((part, i) => {
            if (part.startsWith('**')) {
              return <strong key={i} className="theory-keyword">{part.substring(2, part.length - 2)}</strong>;
            }
            if (part.startsWith('*')) {
              return <em key={i} className="theory-italic">{part.substring(1, part.length - 1)}</em>;
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  
    return <div className="theory-content-container">{lines}</div>;
  };

export default function Theory({ treeType, setRoute }) {
  const text = THEORIES[treeType] || THEORIES["GENERAL"];
  const title = treeType === 'GENERAL' ? 'Introduction to Trees' : `Theory — ${treeType}`;

  return (
    <div>
      <h2 className="h1">{title}</h2>
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <StyledTheoryContent text={text} />
      </motion.div>
      
      <motion.div
        style={{ textAlign: 'center' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <button
          className="btn-tree-op insert"
          style={{ padding: '12px 24px', fontSize: '1.1rem' }}
          onClick={() => setRoute('story')}
        >
          Understand with a Story
        </button>
      </motion.div>
    </div>
  );
}