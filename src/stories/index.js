import { generalTreeStory } from './general';
import { binaryTreeStory } from './bt';
import { binarySearchTreeStory } from './bst';
import { heapStory } from './heap';
import { trieStory } from './tries';

export const STORIES = {
  GENERAL: generalTreeStory,
  BT: binaryTreeStory,
  BST: binarySearchTreeStory,
  AVL: `Think of an elf stacking books so that neither side of a shelf gets too tall. If one side becomes too high, the elf quickly rearranges the books (rotates the stack) to keep it balanced and prevent it from toppling over. That's an AVL tree, always keeping things tidy.`,
  RB: `Consider a road with traffic lights that can be red or black. There are strict rules, like no two red lights in a row, to ensure that traffic flows smoothly and no single path gets too congested. These rules and colors keep the flow balanced — that's a Red-Black Tree.`,
  HEAP: heapStory,
  TRIES: trieStory
};