export const trieStory = `Tree Corp: The “Dictionary Department” (Tries)
At Tree Corp, after establishing clear hierarchies, the CEO noticed a new challenge: employees were frequently mixing up names, words, and codes when storing data. To solve this, a new department was created: the "Dictionary Department."

In this department, each letter of a word is represented by a unique team member (a node). Starting from the Root (an empty page in a dictionary), each team member represents one letter in a word.

For example, to store the word “CAT”:

- The first team member is 'C'.

- On C's team, there is an 'A'.

- On A's team, there is a 'T'.

The word "CAT" is now built, step-by-step, within the organizational chart. If another word like “CAR” is added, it shares the same path for "C" and "A". However, instead of "T", a new team member, "R", joins "A"'s team. The magic of this department lies in its structure:

- Common beginnings (prefixes) are shared, saving space.

- Words branch off only where they differ.

This system provides significant advantages for the company:

- Fast searching: To check if a word exists, you just follow the letters down the hierarchy.

- Memory saving: Prefixes are not repeated for every word.

- Perfect for auto-complete: Start typing “CA,” and you can instantly find all words that begin with that prefix.

In short:

! A Trie is a tree where each level stores a part of a word, and the paths from the root form complete words. It acts as Tree Corp’s own dictionary team, where members line up to spell out words.`;