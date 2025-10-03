// src/App.jsx
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Theory from "./pages/Theory";
import Algorithm from "./pages/Algorithm";
import StoryMode from "./pages/StoryMode";
import Quiz from "./pages/Quiz";
import TreeViz from "./components/TreeViz";
import { motion } from "framer-motion";
import LightRays from "./components/LightRays";

export default function App() {
  const [route, setRoute] = useState("home");
  const [treeType, setTreeType] = useState("GENERAL");

  const componentMap = {
    home: <Home setTreeType={setTreeType} setRoute={setRoute} />,
    theory: <Theory treeType={treeType} setRoute={setRoute} />,
    story: <StoryMode treeType={treeType} />,
    algorithm: <Algorithm treeType={treeType} />,
    quiz: <Quiz treeType={treeType} />,
    viz: <TreeViz treeType={treeType} />,
  };

  return (
    <div className="app">
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={0.4}
        lightSpread={0.5}
        rayLength={1.8}
        followMouse={true}
        mouseInfluence={0.08}
        noiseAmount={0.03}
        distortion={0.02}
      />
      <Sidebar route={route} setRoute={setRoute} />
      <main className="main">
        <motion.div
          key={route}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {componentMap[route]}
        </motion.div>
      </main>
    </div>
  );
}
