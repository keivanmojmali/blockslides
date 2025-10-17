# @autoartifacts/extension-mathematics

## 3.6.7

### Patch Changes

- @autoartifacts/core@3.6.7
- @autoartifacts/pm@3.6.7

## 3.6.6

### Patch Changes

- @autoartifacts/core@3.6.6
- @autoartifacts/pm@3.6.6

## 3.6.5

### Patch Changes

- Updated dependencies [1e4caea]
  - @autoartifacts/core@3.6.5
  - @autoartifacts/pm@3.6.5

## 3.6.4

### Patch Changes

- @autoartifacts/core@3.6.4
- @autoartifacts/pm@3.6.4

## 3.6.3

### Patch Changes

- Updated dependencies [67f7b4a]
  - @autoartifacts/core@3.6.3
  - @autoartifacts/pm@3.6.3

## 3.6.2

### Patch Changes

- @autoartifacts/core@3.6.2
- @autoartifacts/pm@3.6.2

## 3.6.1

### Patch Changes

- @autoartifacts/core@3.6.1
- @autoartifacts/pm@3.6.1

## 3.6.0

### Patch Changes

- Updated dependencies [c0190bd]
  - @autoartifacts/core@3.6.0
  - @autoartifacts/pm@3.6.0

## 3.5.3

### Patch Changes

- @autoartifacts/core@3.5.3
- @autoartifacts/pm@3.5.3

## 3.5.2

### Patch Changes

- @autoartifacts/core@3.5.2
- @autoartifacts/pm@3.5.2

## 3.5.1

### Patch Changes

- @autoartifacts/core@3.5.1
- @autoartifacts/pm@3.5.1

## 3.5.0

### Patch Changes

- @autoartifacts/core@3.5.0
- @autoartifacts/pm@3.5.0

## 3.4.6

### Patch Changes

- Updated dependencies [968016f]
  - @autoartifacts/core@3.4.6
  - @autoartifacts/pm@3.4.6

## 3.4.5

### Patch Changes

- Updated dependencies [0226d42]
- Updated dependencies [37af83b]
- Updated dependencies [f598ac7]
  - @autoartifacts/core@3.4.5
  - @autoartifacts/pm@3.4.5

## 3.4.4

### Patch Changes

- Updated dependencies [00cf1d7]
  - @autoartifacts/core@3.4.4
  - @autoartifacts/pm@3.4.4

## 3.4.3

### Patch Changes

- Updated dependencies [1ea8906]
  - @autoartifacts/core@3.4.3
  - @autoartifacts/pm@3.4.3

## 3.4.2

### Patch Changes

- @autoartifacts/core@3.4.2
- @autoartifacts/pm@3.4.2

## 3.4.1

### Patch Changes

- @autoartifacts/core@3.4.1
- @autoartifacts/pm@3.4.1

## 3.4.0

### Patch Changes

- Updated dependencies [895c73f]
- Updated dependencies [ad51daa]
  - @autoartifacts/core@3.4.0
  - @autoartifacts/pm@3.4.0

## 3.3.1

### Patch Changes

- @autoartifacts/core@3.3.1
- @autoartifacts/pm@3.3.1

## 3.3.0

### Patch Changes

- Updated dependencies [5423726]
- Updated dependencies [5423726]
  - @autoartifacts/core@3.3.0
  - @autoartifacts/pm@3.3.0

## 3.2.2

### Patch Changes

- @autoartifacts/core@3.2.2
- @autoartifacts/pm@3.2.2

## 3.2.1

### Patch Changes

- Updated dependencies [6a2873f]
  - @autoartifacts/core@3.2.1
  - @autoartifacts/pm@3.2.1

## 3.2.0

### Patch Changes

- Updated dependencies [5056e3e]
  - @autoartifacts/core@3.2.0
  - @autoartifacts/pm@3.2.0

## 3.1.0

### Patch Changes

- c868252: Fixed an issue with the mathematics regex using modern negative lookups causing crashes in older Safari versions.
  - @autoartifacts/core@3.1.0
  - @autoartifacts/pm@3.1.0

## 3.0.9

### Patch Changes

- @autoartifacts/core@3.0.9
- @autoartifacts/pm@3.0.9

## 3.0.8

### Patch Changes

- @autoartifacts/core@3.0.8
- @autoartifacts/pm@3.0.8

## 3.0.7

### Patch Changes

- @autoartifacts/core@3.0.7
- @autoartifacts/pm@3.0.7

## 3.0.6

### Patch Changes

- Updated dependencies [2e71d05]
  - @autoartifacts/core@3.0.6
  - @autoartifacts/pm@3.0.6

## 3.0.5

### Patch Changes

- @autoartifacts/core@3.0.5
- @autoartifacts/pm@3.0.5

## 3.0.4

### Patch Changes

- Updated dependencies [7ed03fa]
  - @autoartifacts/core@3.0.4
  - @autoartifacts/pm@3.0.4

## 3.0.3

### Patch Changes

- Updated dependencies [75cabde]
  - @autoartifacts/core@3.0.3
  - @autoartifacts/pm@3.0.3

## 3.0.2

### Patch Changes

- @autoartifacts/core@3.0.2
- @autoartifacts/pm@3.0.2

## 3.0.1

### Major Changes

- 4a421bf: Change the way inserting math nodes work – now if no LaTeX string is used for both inline and block math nodes, the current text selection will be used and replaced. This should bring the extension more in line with how other extensions work.
- 4a421bf: Updated the default class names of the invisible and mathematics plugins
- ab8bc2f: The Math extension now uses **nodes** to render mathematic content in the editor. This should improve the performance when an editor renders many math equations at the same time.

  This change is not backwards compatible, so you will need to update your code to use the new node-based API.

  At the same time, the `Mathematics` extension has been renamed to `Math` to better align with the naming conventions of other extensions - but the old name is still available for backwards compatibility.

  This extension includes two new nodes:

  - `MathInline` for inline math equations
  - `MathBlock` for block math equations

  The regex patterns for the input rules were also updated to be less conflicting with text including dollar signs. The new patterns are:

  - Inline: `/(?<!\$)\$\$([^$\n]+)\$\$(?!\$)$/` - for inline math equations, which will match text between two double dollar signs.
  - Block: `/^\$\$\$([^$]+)\$\$\$/` - for block math equations, which will match text between two triple dollar signs.

  Since the old way of using text content to reflect math equations came with limitations and performance issues, the new node-based approach now requires an explicit update command to update a math equations latex content. This can be done by using:

  - `editor.commands.updateInlineMath({ latex: '3x^2 + 2x + 1' })` for inline math equations.
  - `editor.commands.updateBlockMath({ latex: '3x^2 + 2x + 1' })` for block math equations.

  Both nodes allow for an `onClick` option that will pass the position and node information up which can be used to trigger a custom action, such as opening a math editor dialog.

### Minor Changes

- 7ac01ef: We open sourced our basic pro extensions

  This release includes the following extensions that were previously only available in our Pro version:

  - `@autoartifacts/extension-drag-handle`
  - `@autoartifacts/extension-drag-handle-react`
  - `@autoartifacts/extension-drag-handle-vue-2`
  - `@autoartifacts/extension-drag-handle-vue-3`
  - `@autoartifacts/extension-emoji`
  - `@autoartifacts/extension-details`
  - `@autoartifacts/extension-file-handler`
  - `@autoartifacts/extension-invisible-characters`
  - `@autoartifacts/extension-mathematics`
  - `@autoartifacts/extension-node-range`
  - `@autoartifacts/extension-table-of-contents`
  - `@autoartifacts/extension-unique-id`

- 4a421bf: Added a new `migrateMathStrings` utility that can be used to migrate existing LaTeX math strings on an existing document into the inline math nodes`

### Patch Changes

- 4a421bf: Improved JSDoc documentation and comments
- Updated dependencies [1b4c82b]
- Updated dependencies [1e91f9b]
- Updated dependencies [a92f4a6]
- Updated dependencies [8de8e13]
- Updated dependencies [20f68f6]
- Updated dependencies [5e957e5]
- Updated dependencies [89bd9c7]
- Updated dependencies [d0fda30]
- Updated dependencies [0e3207f]
- Updated dependencies [37913d5]
- Updated dependencies [28c5418]
- Updated dependencies [32958d6]
- Updated dependencies [12bb31a]
- Updated dependencies [9f207a6]
- Updated dependencies [412e1bd]
- Updated dependencies [062afaf]
- Updated dependencies [ff8eed6]
- Updated dependencies [704f462]
- Updated dependencies [95b8c71]
- Updated dependencies [8c69002]
- Updated dependencies [664834f]
- Updated dependencies [ac897e7]
- Updated dependencies [087d114]
- Updated dependencies [32958d6]
- Updated dependencies [fc17b21]
- Updated dependencies [62b0877]
- Updated dependencies [e20006b]
- Updated dependencies [5ba480b]
- Updated dependencies [d6c7558]
- Updated dependencies [062afaf]
- Updated dependencies [9ceeab4]
- Updated dependencies [32958d6]
- Updated dependencies [bf835b0]
- Updated dependencies [4e2f6d8]
- Updated dependencies [32958d6]
  - @autoartifacts/core@3.0.1
  - @autoartifacts/pm@3.0.1

## 3.0.0-beta.30

### Patch Changes

- @autoartifacts/core@3.0.0-beta.30
- @autoartifacts/pm@3.0.0-beta.30

## 3.0.0-beta.29

### Patch Changes

- @autoartifacts/core@3.0.0-beta.29
- @autoartifacts/pm@3.0.0-beta.29

## 3.0.0-beta.28

### Patch Changes

- @autoartifacts/core@3.0.0-beta.28
- @autoartifacts/pm@3.0.0-beta.28

## 3.0.0-beta.27

### Patch Changes

- Updated dependencies [412e1bd]
  - @autoartifacts/core@3.0.0-beta.27
  - @autoartifacts/pm@3.0.0-beta.27

## 3.0.0-beta.26

### Patch Changes

- Updated dependencies [5ba480b]
  - @autoartifacts/core@3.0.0-beta.26
  - @autoartifacts/pm@3.0.0-beta.26

## 3.0.0-beta.25

### Patch Changes

- Updated dependencies [4e2f6d8]
  - @autoartifacts/core@3.0.0-beta.25
  - @autoartifacts/pm@3.0.0-beta.25

## 3.0.0-beta.24

### Patch Changes

- @autoartifacts/core@3.0.0-beta.24
- @autoartifacts/pm@3.0.0-beta.24

## 3.0.0-beta.23

### Patch Changes

- @autoartifacts/core@3.0.0-beta.23
- @autoartifacts/pm@3.0.0-beta.23

## 3.0.0-beta.22

### Patch Changes

- @autoartifacts/core@3.0.0-beta.22
- @autoartifacts/pm@3.0.0-beta.22

## 3.0.0-beta.21

### Patch Changes

- Updated dependencies [813674c]
- Updated dependencies [fc17b21]
  - @autoartifacts/core@3.0.0-beta.21
  - @autoartifacts/pm@3.0.0-beta.21

## 3.0.0-beta.20

### Patch Changes

- @autoartifacts/core@3.0.0-beta.20
- @autoartifacts/pm@3.0.0-beta.20

## 3.0.0-beta.19

### Patch Changes

- Updated dependencies [9ceeab4]
  - @autoartifacts/core@3.0.0-beta.19
  - @autoartifacts/pm@3.0.0-beta.19

## 3.0.0-beta.18

### Major Changes

- 4a421bf: Change the way inserting math nodes work – now if no LaTeX string is used for both inline and block math nodes, the current text selection will be used and replaced. This should bring the extension more in line with how other extensions work.
- 4a421bf: Updated the default class names of the invisible and mathematics plugins

### Minor Changes

- 4a421bf: Added a new `migrateMathStrings` utility that can be used to migrate existing LaTeX math strings on an existing document into the inline math nodes`

### Patch Changes

- 4a421bf: Improved JSDoc documentation and comments
  - @autoartifacts/core@3.0.0-beta.18
  - @autoartifacts/pm@3.0.0-beta.18

## 3.0.0-beta.17

### Major Changes

- ab8bc2f: The Math extension now uses **nodes** to render mathematic content in the editor. This should improve the performance when an editor renders many math equations at the same time.

  This change is not backwards compatible, so you will need to update your code to use the new node-based API.

  At the same time, the `Mathematics` extension has been renamed to `Math` to better align with the naming conventions of other extensions - but the old name is still available for backwards compatibility.

  This extension includes two new nodes:

  - `MathInline` for inline math equations
  - `MathBlock` for block math equations

  The regex patterns for the input rules were also updated to be less conflicting with text including dollar signs. The new patterns are:

  - Inline: `/(?<!\$)\$\$([^$\n]+)\$\$(?!\$)$/` - for inline math equations, which will match text between two double dollar signs.
  - Block: `/^\$\$\$([^$]+)\$\$\$/` - for block math equations, which will match text between two triple dollar signs.

  Since the old way of using text content to reflect math equations came with limitations and performance issues, the new node-based approach now requires an explicit update command to update a math equations latex content. This can be done by using:

  - `editor.commands.updateInlineMath({ latex: '3x^2 + 2x + 1' })` for inline math equations.
  - `editor.commands.updateBlockMath({ latex: '3x^2 + 2x + 1' })` for block math equations.

  Both nodes allow for an `onClick` option that will pass the position and node information up which can be used to trigger a custom action, such as opening a math editor dialog.

### Patch Changes

- Updated dependencies [e20006b]
  - @autoartifacts/core@3.0.0-beta.17
  - @autoartifacts/pm@3.0.0-beta.17

## 3.0.0-beta.16

### Patch Changes

- Updated dependencies [ac897e7]
- Updated dependencies [bf835b0]
  - @autoartifacts/core@3.0.0-beta.16
  - @autoartifacts/pm@3.0.0-beta.16

## 3.0.0-beta.15

### Patch Changes

- Updated dependencies [087d114]
  - @autoartifacts/core@3.0.0-beta.15
  - @autoartifacts/pm@3.0.0-beta.15

## 3.0.0-beta.14

### Patch Changes

- Updated dependencies [95b8c71]
  - @autoartifacts/core@3.0.0-beta.14
  - @autoartifacts/pm@3.0.0-beta.14

## 3.0.0-beta.13

### Patch Changes

- @autoartifacts/core@3.0.0-beta.13
- @autoartifacts/pm@3.0.0-beta.13

## 3.0.0-beta.12

### Patch Changes

- @autoartifacts/core@3.0.0-beta.12
- @autoartifacts/pm@3.0.0-beta.12

## 3.0.0-beta.11

### Patch Changes

- @autoartifacts/core@3.0.0-beta.11
- @autoartifacts/pm@3.0.0-beta.11

## 3.0.0-beta.10

### Minor Changes

- 7ac01ef: We open sourced our basic pro extensions

  This release includes the following extensions that were previously only available in our Pro version:

  - `@autoartifacts/extension-drag-handle`
  - `@autoartifacts/extension-drag-handle-react`
  - `@autoartifacts/extension-drag-handle-vue-2`
  - `@autoartifacts/extension-drag-handle-vue-3`
  - `@autoartifacts/extension-emoji`
  - `@autoartifacts/extension-details`
  - `@autoartifacts/extension-file-handler`
  - `@autoartifacts/extension-invisible-characters`
  - `@autoartifacts/extension-mathematics`
  - `@autoartifacts/extension-node-range`
  - `@autoartifacts/extension-table-of-contents`
  - `@autoartifacts/extension-unique-id`

### Patch Changes

- @autoartifacts/core@3.0.0-beta.10
- @autoartifacts/pm@3.0.0-beta.10
