// src/pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import ParticleTree3D from "../components/ParticleTree3D";

// A reusable component for the stylish theory nodes
const TheoryNode = ({ title, children }) => (
  <div className="theory-node">
    <div className="theory-node-title">{title}</div>
    <div className="theory-node-content">{children}</div>
  </div>
);

// A wrapper to handle animation and connecting lines for each node
const AnimatedNodeWrapper = ({ children, delay }) => (
  <motion.div
    className="tree-node-wrapper"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);

export default function Home({ setTreeType, setRoute }) {
  const options = [
    { name: "Binary Tree", type: "BT", route: "theory" },
    { name: "Binary Search Tree", type: "BST", route: "theory" },
    { name: "Heap", type: "HEAP", route: "theory" },
    { name: "Tries", type: "TRIES", route: "theory" },
  ];

  return (
    <div className="home-page-layout">
      <motion.h1
        className="home-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        TREES
      </motion.h1>

      <div className="tree-info-container">
        <AnimatedNodeWrapper delay={0.2}>
          <TheoryNode title="What is a Tree?">
            A non-linear data structure representing hierarchical data. It consists of a root node, and connected child nodes.
          </TheoryNode>
          
          <div className="tree-children">
            <AnimatedNodeWrapper delay={0.4}>
              <TheoryNode title="Core Concepts">
                The <b>Root</b> is the topmost node. A <b>Leaf</b> is a node with no children. An <b>Edge</b> is the link between a parent and a child.
              </TheoryNode>
            </AnimatedNodeWrapper>

            <AnimatedNodeWrapper delay={0.6}>
              <TheoryNode title="Why Use Trees?">
                They provide efficient searching, insertion, and deletion. For balanced trees, these operations average O(log n) time.
              </TheoryNode>
              
              <div className="tree-children">
                <AnimatedNodeWrapper delay={0.8}>
                  <TheoryNode title="Real-World Examples">
                    File systems, organization charts, the HTML DOM, and routing algorithms in computer networks.
                  </TheoryNode>
                </AnimatedNodeWrapper>
                <AnimatedNodeWrapper delay={1.0}>
                  <TheoryNode title="Common Types">
                    Includes Binary Search Trees (BST), Heaps, and Tries, each optimized for different tasks.
                  </TheoryNode>
                </AnimatedNodeWrapper>
              </div>
            </AnimatedNodeWrapper>
          </div>
        </AnimatedNodeWrapper>
      </div>

      <div className="home-main-content">
        <motion.div
          className="animation-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <ParticleTree3D />
        </motion.div>

        <motion.div
          className="options-container"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 1.4 } },
          }}
        >
          {options.map((opt) => (
            <motion.div
              key={opt.name}
              className="option-item"
              onClick={() => {
                if (opt.type) setTreeType(opt.type);
                setRoute(opt.route);
              }}
              variants={{
                hidden: { x: 50, opacity: 0 },
                visible: { x: 0, opacity: 1 },
              }}
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {opt.name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}