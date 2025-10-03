// src/stories/dialogue.js
export const DIALOGUE = {
  GENERAL: [
    { mascotId: 'kiki', reaction: 'greet', text: "Hi there! Welcome to Tree Corp. I'm Kiki, your guide.", animationTarget: null, visibleNodeIds: [], visibleLinkIndices: [] },
    { mascotId: 'kiki', reaction: 'explain', text: "At the top, we have our CEO. She's the 'Root' of our company.", animationTarget: { type: 'node', label: 'CEO' }, visibleNodeIds: [1], visibleLinkIndices: [] },
    { mascotId: 'bolt', reaction: 'celebrate', text: "And the CEO hires managers, who are the 'Nodes' of our tree!", animationTarget: { type: 'node', label: 'Manager' }, visibleNodeIds: [1, 2, 3, 4], visibleLinkIndices: [0, 1, 2] },
    { mascotId: 'kiki', reaction: 'explain', text: "Exactly, Bolt! Every employee reports to just one supervisor, their 'parent'.", animationTarget: { type: 'link', start: 'CEO', end: 'Manager' }, visibleNodeIds: [1, 2, 3, 4], visibleLinkIndices: [0, 1, 2] },
    { mascotId: 'bolt', reaction: 'explain', text: "Some of us don't manage anyone. We're called 'Leaves'!", animationTarget: { type: 'node', label: 'Team' }, visibleNodeIds: [1, 2, 3, 4, 5, 6, 7], visibleLinkIndices: [0, 1, 2, 3, 4, 5] },
    { mascotId: 'sage', reaction: 'recap', text: "This clear structure helps us stay organized and find anyone easily.", animationTarget: { type: 'reset' }, visibleNodeIds: [1, 2, 3, 4, 5, 6, 7], visibleLinkIndices: [0, 1, 2, 3, 4, 5] }
  ],
  BT: [
    { mascotId: 'kiki', reaction: 'explain', text: "At Tree Corp, we have a special rule called the 'Two-Member Policy'.", animationTarget: null, visibleNodeIds: [], visibleLinkIndices: [] },
    { mascotId: 'bolt', reaction: 'nudge', text: "It means every manager can have at most TWO team members!", animationTarget: { type: 'node', label: 'Manager' }, visibleNodeIds: [1, 2, 3, 4, 5], visibleLinkIndices: [0, 1, 2, 3] },
    { mascotId: 'kiki', reaction: 'hint', text: "We call them a 'left child' and a 'right child'.", animationTarget: { type: 'link', start: 'Manager', end: 'Team' }, visibleNodeIds: [1, 2, 3, 4, 5], visibleLinkIndices: [0, 1, 2, 3] },
    { mascotId: 'sage', reaction: 'recap', text: "This structure is a Binary Tree. Simple and tidy!", animationTarget: { type: 'reset' }, visibleNodeIds: [1, 2, 3, 4, 5], visibleLinkIndices: [0, 1, 2, 3] },
  ],
  BST: [
    { mascotId: 'kiki', reaction: 'explain', text: "Now for our 'Sorted Teammates Policy', which creates a Binary Search Tree, or BST.", animationTarget: null, visibleNodeIds: [], visibleLinkIndices: [] },
    { mascotId: 'kiki', reaction: 'explain', text: "The rule is simple: for any manager, team members with a LOWER rank go to the LEFT.", animationTarget: { type: 'node', value: 30 }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
    { mascotId: 'bolt', reaction: 'explain', text: "And team members with a HIGHER rank go to the RIGHT. See how 70 is to the right of our CEO, 50?", animationTarget: { type: 'node', value: 70 }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
    { mascotId: 'kiki', reaction: 'hint', text: "This rule applies everywhere! Look at the manager with rank 30...", animationTarget: { type: 'node', value: 30 }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
    { mascotId: 'bolt', reaction: 'celebrate', text: "Their team follows the same rule: 20 is on the left (lower) and 40 is on the right (higher)!", animationTarget: { type: 'node', value: 40 }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
    { mascotId: 'sage', reaction: 'recap', text: "This perfect sorting makes finding anyone incredibly fast. You just go left for lower or right for higher!", animationTarget: { type: 'reset' }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
  ],
  HEAP: [
    { mascotId: 'kiki', reaction: 'explain', text: "Next is the 'Strongest-on-Top' rule. This is called a Max-Heap.", animationTarget: null, visibleNodeIds: [], visibleLinkIndices: [] },
    { mascotId: 'kiki', reaction: 'explain', text: "In a Max-Heap, every manager (a 'parent' node) must have a value GREATER than or equal to their team members (their 'children').", animationTarget: { type: 'node', value: 100 }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
    { mascotId: 'bolt', reaction: 'celebrate', text: "Exactly! Our CEO, with value 100, is stronger than both managers with values 80 and 90.", animationTarget: { type: 'node', value: 80 }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
    { mascotId: 'kiki', reaction: 'hint', text: "And look at the manager with value 90. They are stronger than their team member with value 70.", animationTarget: { type: 'node', value: 70 }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
    { mascotId: 'bolt', reaction: 'explain', text: "But notice something important! Unlike a BST, the children themselves don't have a specific order. 80 and 90 are siblings, and their positions could be swapped.", animationTarget: { type: 'node', value: 90 }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
    { mascotId: 'sage', reaction: 'recap', text: "This structure is perfect for priority queues, because we can always find the most important item (the max value) right at the root!", animationTarget: { type: 'reset' }, visibleNodeIds: [1, 2, 3, 4, 5, 6], visibleLinkIndices: [0, 1, 2, 3, 4] },
  ],
  TRIES: [
    { mascotId: 'kiki', reaction: 'greet', text: "Finally, let's visit the 'Dictionary Department', which is structured as a Trie.", animationTarget: null, visibleNodeIds: [], visibleLinkIndices: [] },
    { mascotId: 'bolt', reaction: 'explain', text: "Here, each letter of a word is a team member!", animationTarget: { type: 'node', label: 'C' }, visibleNodeIds: [1, 2], visibleLinkIndices: [0] },
    { mascotId: 'kiki', reaction: 'explain', text: "For the word 'CAT', you'd go from 'C', to 'A', to 'T'.", animationTarget: { type: 'node', label: 'T' }, visibleNodeIds: [1, 2, 3, 4], visibleLinkIndices: [0, 1, 2] },
    { mascotId: 'bolt', reaction: 'celebrate', text: "Words with common beginnings, like 'CAT' and 'CAR', share the same path for 'C' and 'A'!", animationTarget: { type: 'link', start: 'A', end: 'R' }, visibleNodeIds: [1, 2, 3, 4, 5], visibleLinkIndices: [0, 1, 2, 3] },
    { mascotId: 'sage', reaction: 'recap', text: "This makes Tries perfect for auto-complete and spell-checking.", animationTarget: { type: 'reset' }, visibleNodeIds: [1, 2, 3, 4, 5], visibleLinkIndices: [0, 1, 2, 3] },
  ]
};