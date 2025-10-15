/**
 * Utils Index Exports Tests
 */

import * as UtilsIndex from '../index';

describe('Utils Index Exports', () => {
  it('should export layoutParser functions', () => {
    expect(UtilsIndex.parseLayout).toBeDefined();
    expect(UtilsIndex.applyAllLayouts).toBeDefined();
  });

  it('should export historyUtils functions', () => {
    expect(UtilsIndex.canUndo).toBeDefined();
    expect(UtilsIndex.canRedo).toBeDefined();
    expect(UtilsIndex.getUndoDepth).toBeDefined();
    expect(UtilsIndex.getRedoDepth).toBeDefined();
    expect(UtilsIndex.getHistoryState).toBeDefined();
    expect(UtilsIndex.clearHistory).toBeDefined();
  });

  it('should export slideNavigation functions', () => {
    expect(UtilsIndex.showSlide).toBeDefined();
    expect(UtilsIndex.showAllSlides).toBeDefined();
    expect(UtilsIndex.nextSlide).toBeDefined();
    expect(UtilsIndex.prevSlide).toBeDefined();
  });

  it('should export stateAccess functions', () => {
    expect(UtilsIndex.getCurrentSlideIndex).toBeDefined();
    expect(UtilsIndex.getTotalSlides).toBeDefined();
    expect(UtilsIndex.getSlideContent).toBeDefined();
    expect(UtilsIndex.getDocumentJSON).toBeDefined();
    expect(UtilsIndex.getDocumentHTML).toBeDefined();
    expect(UtilsIndex.getDocumentText).toBeDefined();
    expect(UtilsIndex.isDocumentEmpty).toBeDefined();
    expect(UtilsIndex.isEditorFocused).toBeDefined();
    expect(UtilsIndex.getSelectionInfo).toBeDefined();
  });

  it('should export selectionUtils functions', () => {
    expect(UtilsIndex.setTextSelection).toBeDefined();
    expect(UtilsIndex.selectAll).toBeDefined();
  });
});
