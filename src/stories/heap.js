export const heapStory = `Tree Corp: The “Strongest on Top” Rule (Heap)
Even with the Two-Teammate and Sorted Teammates policies in place, the CEO of Tree Corp felt there was room for improvement. A new, golden rule was announced: the "Strongest-on-Top Policy."

This system ensures a manager (parent) is always "stronger" than their team members (children):

- In a Max-Heap, the manager always has the highest value compared to their team members.

- In a Min-Heap, the manager always has the lowest value.

At every level of Tree Corp, the manager is either the strongest (Max-Heap) or the weakest (Min-Heap). Unlike a BST, the order of left versus right team members doesn't matter. The only thing that counts is the relationship between a manager and their direct reports. This provides several key benefits:

- Quick access: Need to find the strongest (or weakest) team member? They're always at the top (the root).

- Efficiency: Promotions and demotions (insertions and deletions) are handled quickly while maintaining the structure.

- Versatility: The structure is perfect for tasks like managing priority jobs, creating leaderboards, or scheduling.

In short:

- A Binary Tree Corp has a maximum of two team members per manager.

- A BST Corp sorts team members by value (left is smaller, right is bigger).

! - A Heap Corp ensures that a parent is always stronger (Max-Heap) or weaker (Min-Heap) than their children.`;