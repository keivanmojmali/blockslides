export * from './callOrReturn';
export * from './contentRedistribution';
export * from './createStyleTag';
export * from './exporters';
export * from './historyUtils';
export * from './layoutParser';
export * from './mergeDeep';
export * from './selectionUtils';
// Export slideNavigation except getCurrentSlideIndex (use stateAccess version instead)
export {
  showSlide,
  showAllSlides,
  nextSlide,
  prevSlide
} from './slideNavigation';
// Export from stateAccess (including getCurrentSlideIndex which takes EditorView)
export {
  getCurrentSlideIndex,
  getTotalSlides,
  getSlideContent,
  getDocumentJSON,
  getDocumentHTML,
  getDocumentText,
  isDocumentEmpty,
  isEditorFocused,
  getSelectionInfo
} from './stateAccess';

