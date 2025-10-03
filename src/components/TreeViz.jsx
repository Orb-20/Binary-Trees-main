import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import anime from 'animejs';

// --- Helper: Toast Notification ---
const Toast = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return (
    <motion.div layout initial={{ opacity: 0, y: 50, scale: 0.3 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.5 }}
      style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', borderRadius: 'var(--radius-md)', background: type === 'error' ? 'var(--color-burnt-copper)' : 'var(--color-deep-forest)', color: 'var(--color-ivory)', boxShadow: 'var(--shadow-lg)', zIndex: 1001 }}>
      {message}
    </motion.div>
  );
};

// --- Helper: Add Node Modal ---
const AddNodeModal = ({ parentNode, onAdd, onCancel }) => {
    const [value, setValue] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); if (value && !isNaN(value)) onAdd(parentNode.id, parseInt(value)); };
    return (
        <form onSubmit={handleSubmit}>
            <h3 className="panel-title" style={{textAlign: 'center'}}>Add Child to {parentNode.value}</h3>
            <div className="form-group"><label htmlFor="nodeValue">New Node's Value</label><input type="number" id="nodeValue" className="tree-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter a number" autoFocus required /></div>
            <div className="modal-actions"><button type="button" className="btn-tree-op delete" onClick={onCancel}>Cancel</button><button type="submit" className="btn-tree-op insert">Add Node</button></div>
            <style jsx>{`.form-group { margin-bottom: 24px; } label { display: block; margin-bottom: 8px; font-weight: 600; color: var(--muted); } .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }`}</style>
        </form>
    );
};

// --- Tree Building Logic ---
const treeBuilders = {
  BST: (values) => {
    const insert = (root, value) => {
      const newNodeId = `node-${value}-${Date.now()}`;
      if (!root) return { id: newNodeId, value, children: [] };
      if (value < root.value) {
        const leftChild = root.children.find(c => c.value < root.value);
        if (!leftChild) root.children.unshift(insert(null, value)); else insert(leftChild, value);
      } else if (value > root.value) {
        const rightChild = root.children.find(c => c.value > root.value);
        if (!rightChild) root.children.push(insert(null, value)); else insert(rightChild, value);
      }
      return root;
    };
    return values.reduce((acc, v) => insert(acc, v), null);
  },
  BT: (values) => {
    if (!values || values.length === 0) return null;
    const nodes = values.map((v, i) => ({ id: `node-${v}-${i}`, value: v, children: [] }));
    nodes.forEach((node, i) => {
      const leftIdx = 2 * i + 1, rightIdx = 2 * i + 2;
      if (leftIdx < nodes.length) node.children.push(nodes[leftIdx]);
      if (rightIdx < nodes.length) node.children.push(nodes[rightIdx]);
    });
    return nodes[0];
  }
};
treeBuilders.GENERAL = treeBuilders.BT; treeBuilders.HEAP = treeBuilders.BT; treeBuilders.TRIES = treeBuilders.BT;

// --- Main Component ---
export default function TreeViz({ treeType = 'GENERAL' }) {
  const [treeData, setTreeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("50, 30, 70, 20, 40, 60, 80");
  const [toast, setToast] = useState(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const [traversalResult, setTraversalResult] = useState([]);
  const [activeTab, setActiveTab] = useState('build');

  const svgRef = useRef();
  const containerRef = useRef();

  const showToast = (message, type = 'info') => setToast({ id: Date.now(), message, type });

  const drawTree = useCallback(() => {
    const svg = d3.select(svgRef.current); svg.selectAll('*').remove();
    const container = d3.select(containerRef.current);
    if (!container.node()) return;
    const { width, height } = container.node().getBoundingClientRect();
    if (!treeData) {
      svg.append('text').attr('x', width / 2).attr('y', height / 2).attr('text-anchor', 'middle')
         .attr('font-family', 'Inter, sans-serif').attr('font-size', '1.1rem').attr('fill', 'var(--muted)')
         .text('Use the controls to build a tree.');
      return;
    }
    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([width - 100, height - 150]);
    treeLayout(root);
    const g = svg.append('g').attr('transform', 'translate(50, 75)');
    g.selectAll('.link').data(root.links()).enter().append('path').attr('class', 'link').attr('d', d3.linkVertical().x(d => d.x).y(d => d.y)).attr('stroke', 'var(--color-antique-gold)').attr('stroke-width', 2).attr('fill', 'none');
    const nodeGroup = g.selectAll('.node').data(root.descendants()).enter().append('g').attr('class', 'node').attr('id', d => `vis-node-${d.data.id}`).attr('transform', d => `translate(${d.x},${d.y})`).style('cursor', 'pointer').on('click', (event, d) => setSelectedNode(d.data.id === selectedNode?.id ? null : d.data));
    nodeGroup.append('circle').attr('r', 25).attr('stroke-width', 3).attr('fill', d => (selectedNode?.id === d.data.id) ? 'var(--color-jade)' : 'var(--color-ivory)').attr('stroke', d => (selectedNode?.id === d.data.id) ? 'var(--color-deep-forest)' : 'var(--color-jade)');
    nodeGroup.append('text').text(d => d.data.value).attr('dy', '0.35em').attr('text-anchor', 'middle').attr('fill', d => (selectedNode?.id === d.data.id) ? '#FFFFFF' : 'var(--color-deep-forest)').attr('font-size', 14).attr('font-weight', 'bold');
  }, [treeData, selectedNode]);

  useEffect(() => {
    drawTree();
    const handleResize = () => drawTree();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawTree]);

  const handleBuildTree = () => {
    const values = inputValue.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (values.length === 0) { showToast("Please enter valid, comma-separated numbers.", "error"); return; }
    const builder = treeBuilders[treeType];
    setTreeData(builder(values)); setSelectedNode(null); setTraversalResult([]);
    showToast("Tree built successfully!");
  };
  const handleAddNode = (parentId, value) => {
    const newNode = { id: `node-${value}-${Date.now()}`, value, children: [] };
    const newTree = JSON.parse(JSON.stringify(treeData));
    let parentFound = false;
    const findAndAdd = (node) => {
        if (node.id === parentId) {
            parentFound = true;
            if(node.children.length >= 2) { showToast("This node already has two children.", "error"); return; }
            node.children.push(newNode); node.children.sort((a,b) => a.value - b.value);
            showToast(`Node ${value} added successfully.`);
        }
        node.children.forEach(findAndAdd);
    };
    findAndAdd(newTree); if(parentFound) setTreeData(newTree); setIsModalOpen(false);
  };
  const handleDeleteNode = () => {
      if(!selectedNode) return;
      const recursivelyDelete = (node, id) => {
          if (!node) return null;
          node.children = node.children.filter(child => child.id !== id);
          node.children.forEach(child => recursivelyDelete(child, id));
          return node;
      };
      if (treeData.id === selectedNode.id) setTreeData(null);
      else setTreeData(recursivelyDelete(JSON.parse(JSON.stringify(treeData)), selectedNode.id));
      showToast(`Node ${selectedNode.value} deleted.`); setSelectedNode(null);
  };
  const handleTraversal = async (type) => {
    if (isTraversing || !treeData) return;
    setIsTraversing(true); setTraversalResult([]);
    const path = [];
    const traversalFunctions = {
        preorder: (node) => { if(node) { path.push(node); node.children.forEach(traversalFunctions.preorder); }},
        inorder: (node) => { if(node) { traversalFunctions.inorder(node.children[0]); path.push(node); traversalFunctions.inorder(node.children[1]); }},
        postorder: (node) => { if(node) { node.children.forEach(traversalFunctions.postorder); path.push(node); }}
    };
    traversalFunctions[type](treeData);

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    for (const node of path) {
        const isSelected = selectedNode?.id === node.id;
        await anime({ targets: `#vis-node-${node.id} circle`, scale: 1.2, fill: 'var(--color-royal-plum)', stroke: 'var(--color-deep-forest)', duration: 200, easing: 'easeOutExpo' }).finished;
        await wait(300);
        await anime({ targets: `#vis-node-${node.id} circle`, scale: 1, fill: isSelected ? 'var(--color-jade)' : 'var(--color-ivory)', stroke: isSelected ? 'var(--color-deep-forest)' : 'var(--color-jade)', duration: 200, easing: 'easeInExpo' }).finished;
    }
    
    drawTree();
    setTraversalResult(path.map(n => n.value));
    setIsTraversing(false);
  };

  return (
    <div className="visualize-page">
      <AnimatePresence>
        {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      </AnimatePresence>
      <h2 className="h1">Interactive Tree Visualization</h2>
      
      <div className="main-content">
        <div className="viz-container card" ref={containerRef}>
            <svg ref={svgRef} width="100%" height="100%"></svg>
        </div>

        <aside className="right-panel card">
            <div className="panel-content">
                 <div className="tab-bar">
                    <button className={`tab-btn ${activeTab === 'build' ? 'active' : ''}`} onClick={()=>setActiveTab('build')}>Build</button>
                    <button className={`tab-btn ${activeTab === 'actions' ? 'active' : ''}`} onClick={()=>setActiveTab('actions')}>Actions</button>
                    <button className={`tab-btn ${activeTab === 'traversal' ? 'active' : ''}`} onClick={()=>setActiveTab('traversal')}>Traversal</button>
                </div>
                <div className="tab-content">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-10}}>
                            {activeTab === 'build' && (
                                <div className="panel-section">
                                    <h3 className="panel-title">Build Tree</h3>
                                    <p className="panel-description">Enter numbers to create a {treeType}.</p>
                                    <div className="build-group">
                                        <input type="text" className="tree-input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                                        <button className="btn-tree-op insert" onClick={handleBuildTree}>Build</button>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'actions' && (
                                <div className="panel-section">
                                    <h3 className="panel-title">Node Actions</h3>
                                    <p className="panel-description">{selectedNode ? `Selected: ${selectedNode.value}` : 'Select a node to act on it.'}</p>
                                    <div className="button-group">
                                        <button className="btn-tree-op action" onClick={() => setIsModalOpen(true)} disabled={!selectedNode || isTraversing}>Add Child</button>
                                        <button className="btn-tree-op delete" onClick={handleDeleteNode} disabled={!selectedNode || isTraversing}>Delete</button>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'traversal' && (
                               <div className="panel-section">
                                    <h3 className="panel-title">Traversal</h3>
                                    <p className="panel-description">Animate the traversal of the tree.</p>
                                    <div className="button-group traversal">
                                        <button className="btn-tree-op traversal-btn" onClick={() => handleTraversal('preorder')} disabled={isTraversing || !treeData}>Pre-order</button>
                                        <button className="btn-tree-op traversal-btn" onClick={() => handleTraversal('inorder')} disabled={isTraversing || !treeData}>In-order</button>
                                        <button className="btn-tree-op traversal-btn" onClick={() => handleTraversal('postorder')} disabled={isTraversing || !treeData}>Post-order</button>
                                    </div>
                                    <AnimatePresence>
                                        {traversalResult.length > 0 && (
                                            <motion.div className="traversal-result" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}>
                                                <strong>Result:</strong>
                                                <span>[ {traversalResult.join(', ')} ]</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </aside>
      </div>

      <AnimatePresence>
        {isModalOpen && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="modal-content card" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}><AddNodeModal parentNode={selectedNode} onAdd={handleAddNode} onCancel={() => setIsModalOpen(false)} /></motion.div></motion.div>}
      </AnimatePresence>

      <style jsx>{`
        .visualize-page { padding: 24px; display: flex; flex-direction: column; height: calc(100vh - 64px); }
        .h1 { text-align: center; margin-bottom: 16px; flex-shrink: 0; }
        .main-content { display: flex; flex-grow: 1; gap: 24px; min-height: 0; }
        .viz-container { flex-grow: 1; padding: 8px; }
        .right-panel { width: 340px; flex-shrink: 0; display: flex; flex-direction: column; padding: 8px; }
        
        .panel-content { display: flex; flex-direction: column; height: 100%; }
        .tab-bar { display: flex; background: var(--color-ivory); border-radius: var(--radius-md); padding: 4px; order: 2; margin-top: 16px; }
        .tab-btn { flex: 1; background: transparent; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: 600; color: var(--muted); transition: all 0.2s ease; font-size: 0.9rem; }
        .tab-btn.active { background: white; color: var(--color-jade); box-shadow: var(--shadow-sm); }
        
        .tab-content { background: var(--color-ivory); border-radius: var(--radius-md); padding: 16px; flex-grow: 1; order: 1; }
        
        .panel-section { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .panel-title { margin: 0 0 8px 0; font-family: 'Montserrat', sans-serif; color: var(--color-deep-forest); }
        .panel-description { font-size: 0.9rem; color: var(--muted); margin: 0 0 16px 0; min-height: 2.5em; }
        .build-group { display: flex; flex-direction: column; gap: 12px; }
        
        .button-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .button-group.traversal { grid-template-columns: 1fr; }
        
        .btn-tree-op.action { background-color: var(--color-soft-cyan); color: var(--color-deep-forest); }
        .btn-tree-op.action:hover:not(:disabled) { background-color: #63c5d4; }
        .btn-tree-op.traversal-btn { background-color: var(--color-antique-gold); color: white; }
        .btn-tree-op.traversal-btn:hover:not(:disabled) { background-color: #d4ae6a; }

        .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { width: 90%; max-width: 400px; }
        
        .traversal-result { margin-top: 16px; padding: 12px; background: white; border-radius: var(--radius-md); color: var(--color-deep-forest); font-family: 'JetBrains Mono', monospace; word-wrap: break-word; }
        .traversal-result strong { color: var(--color-burnt-copper); }
      `}</style>
    </div>
  );
}