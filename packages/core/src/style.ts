export const style = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 0 !important;
  height: 0 !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.autoartifacts-editor {
  background-color: var(--editor-bg, transparent);
  color: var(--editor-fg, #1a1a1a);
}

.autoartifacts-editor .ProseMirror ::selection {
  background-color: var(--editor-selection-bg, rgba(59, 130, 246, 0.1));
}

.autoartifacts-editor .ProseMirror-selectednode {
  outline: 2px solid var(--editor-selection, #3b82f6);
}

.autoartifacts-editor:focus-within {
  outline: none;
}

.autoartifacts-editor section {
  background-color: var(--slide-bg, #ffffff);
  border: 1px solid var(--slide-border, #e5e5e5);
  border-radius: var(--slide-border-radius, 12px);
  box-shadow: var(--slide-shadow, 0 4px 12px rgba(0, 0, 0, 0.08));
  margin-bottom: var(--slide-margin-bottom, 32px);
  padding: var(--slide-padding, 48px);
  min-height: var(--slide-min-height, 540px);
}

.slide-wrapper {
  position: relative;
}

.add-slide-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin: 16px auto 32px auto; //TODO: make sure this is cented since the slides have only bottom padding 
  padding: 0;
  border: 2px solid var(--slide-border, #e5e5e5);
  border-radius: 25%;
  background-color: var(--slide-bg, #ffffff);
  color: var(--editor-fg, #1a1a1a);
  font-size: 24px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--slide-shadow, 0 4px 12px rgba(0, 0, 0, 0.08));
}

.add-slide-button:hover {
  background-color: var(--editor-hover, #f0f0f0);
  border-color: var(--editor-selection, #3b82f6);
  transform: scale(1.05);
}

.add-slide-button:active {
  background-color: var(--editor-active, #e8e8e8);
  transform: scale(0.95);
}

.add-slide-button:focus {
  outline: 2px solid var(--editor-focus, #3b82f6);
  outline-offset: 2px;
}`;
