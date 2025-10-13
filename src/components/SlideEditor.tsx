import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState, useMemo } from "react";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';
import { schema } from "../schema";
import { applyAllLayouts } from '../utils/layoutParser';
import { createAddSlideButtonPlugin } from '../plugins/addSlideButtonPlugin';
import {
  showSlide,
  showAllSlides,
  nextSlide as navNextSlide,
  prevSlide as navPrevSlide
} from '../utils/slideNavigation';
import { validateContent, ValidationError } from '../validation';
import {
  getCurrentSlideIndex,
  getTotalSlides,
  getSlideContent,
  getDocumentJSON,
  getDocumentHTML,
  getDocumentText,
  isDocumentEmpty,
  isEditorFocused,
  getSelectionInfo
} from '../utils/stateAccess';
import {
  canUndo,
  canRedo,
  getHistoryState
} from '../utils/historyUtils';
import { createCommands } from '../commands';
import { createValidator } from '../validation/validatorInstance';
import { validateContent as validateContentFn } from '../validation/validator';
import { validateControlMode } from '../utils/controlMode';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';
import { DEFAULT_SHORTCUTS } from '../keyboard/defaultShortcuts';
import {
  exportToJSON,
  exportToHTML,
  exportToMarkdown,
  exportToText,
  downloadFile
} from '../utils/exporters';
import '../styles.css';

import type { SlideEditorRef, SlideEditorProps, DocNode, ExportFormat, ExportOptions } from '../types';

export const SlideEditor = forwardRef<SlideEditorRef, SlideEditorProps>(
  ({
    content,
    defaultContent,
    onChange,
    editorTheme = 'light',
    editorStyles = '',
    editorMode = 'edit',
    readOnly = false,
    currentSlide = 0,
    onSlideChange,
    onError,
    
    // Add Slide Button Configuration
    showAddSlideButtons = false,
    addSlideButtonClassName,
    addSlideButtonStyle,
    addSlideButtonContent,
    onAddSlideButtonClick,
    
    // Event callbacks
    onCreate,
    onDestroy,
    onUpdate,
    onContentChange,
    onSelectionUpdate,
    onFocus,
    onBlur,
    onTransaction,
    onUndo,
    onRedo,
    
    // History configuration
    historyDepth = 100,
    newGroupDelay = 500,
    
    // Validation configuration
    validationMode = 'lenient',
    autoFixContent = false,
    onValidationError,
    
    // Keyboard shortcuts configuration
    keyboardShortcuts,
    showShortcutsHelp = false,
    
    // Custom plugins
    plugins: customPlugins = []
  }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    
    // Track editable state
    const [isEditableState, setIsEditableState] = useState<boolean>(() => {
      return editorMode === 'edit' && !readOnly;
    });
    
    // Capture initial content once (frozen at mount time)
    const initialContentRef = useRef<DocNode | null>(null);
    if (!initialContentRef.current) {
      initialContentRef.current = content || defaultContent || { type: 'doc', content: [] };
    }
    
    // Internal state for uncontrolled mode
    const [internalContent, setInternalContent] = useState<DocNode>(() => {
      return initialContentRef.current!;
    });
    
    // Determine mode
    const isControlled = content !== undefined;
    
    // Track if we're in the initial mount to prevent sync on first render
    const isInitialMount = useRef(true);
    
    // Create validator instance (memoized)
    const validatorInstance = useMemo(() => createValidator(), []);
    
    // Keyboard shortcuts help state
    const [showHelp, setShowHelp] = useState(showShortcutsHelp);
    
    // Merge shortcuts configuration
    const effectiveShortcuts = useMemo(() => {
      let shortcuts = { ...DEFAULT_SHORTCUTS };
      
      // Apply disabled shortcuts
      if (keyboardShortcuts?.disabled) {
        keyboardShortcuts.disabled.forEach(key => {
          delete shortcuts[key];
        });
      }
      
      // Apply overrides
      if (keyboardShortcuts?.overrides) {
        Object.entries(keyboardShortcuts.overrides).forEach(([key, command]) => {
          if (shortcuts[key]) {
            shortcuts[key] = { ...shortcuts[key], command };
          }
        });
      }
      
      // Add custom shortcuts
      if (keyboardShortcuts?.custom) {
        shortcuts = { ...shortcuts, ...keyboardShortcuts.custom };
      }
      
      return shortcuts;
    }, [keyboardShortcuts]);
    
    // Create a stable editor ref object for callbacks
    const editorRefObject = useRef<SlideEditorRef | null>(null);
    
    // Track previous slide for onSlideChange
    const prevSlideRef = useRef<number>(currentSlide);

    // Validate control mode props and warn about incorrect usage
    useEffect(() => {
      const warnings = validateControlMode({ content, defaultContent, onChange });
      warnings.forEach(warning => {
        console.warn(`[AutoArtifacts] ${warning}`);
      });
    }, [content, defaultContent, onChange]);

    // Handle keyboard shortcuts help toggle
    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        // Shift + ? to toggle help
        if (e.key === '?' && e.shiftKey) {
          e.preventDefault();
          setShowHelp(prev => !prev);
        }
        
        // Escape to close help
        if (e.key === 'Escape' && showHelp) {
          setShowHelp(false);
        }
      };
      
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }, [showHelp]);

    // Expose the complete API via ref
    useImperativeHandle(ref, () => {
      const refObject: SlideEditorRef = {
        view: viewRef.current,
        
        // Editability control
        setEditable: (editable: boolean) => {
          setIsEditableState(editable);
          if (viewRef.current) {
            viewRef.current.setProps({
              editable: () => editable
            });
          }
        },
        
        isEditable: () => {
          return isEditableState;
        },
        
        // State access methods
        getCurrentSlide: () => {
          if (!viewRef.current) return 0;
          return getCurrentSlideIndex(viewRef.current);
        },
        
        getTotalSlides: () => {
          if (!viewRef.current) return 0;
          return getTotalSlides(viewRef.current);
        },
        
        getSlideContent: (slideIndex: number) => {
          if (!viewRef.current) return null;
          return getSlideContent(viewRef.current, slideIndex);
        },
        
        getJSON: () => {
          if (!viewRef.current) {
            return { type: 'doc', content: [] };
          }
          return getDocumentJSON(viewRef.current);
        },
        
        getHTML: () => {
          if (!viewRef.current) return '';
          return getDocumentHTML(viewRef.current);
        },
        
        getText: () => {
          if (!viewRef.current) return '';
          return getDocumentText(viewRef.current);
        },
        
        isEmpty: () => {
          if (!viewRef.current) return true;
          return isDocumentEmpty(viewRef.current);
        },
        
        isFocused: () => {
          if (!viewRef.current) return false;
          return isEditorFocused(viewRef.current);
        },
        
        getSelection: () => {
          if (!viewRef.current) return null;
          return getSelectionInfo(viewRef.current);
        },
        
        // Commands API
        commands: createCommands(() => viewRef.current),
        
        // History state access (direct methods)
        canUndo: () => {
          if (!viewRef.current) return false;
          return canUndo(viewRef.current);
        },
        
        canRedo: () => {
          if (!viewRef.current) return false;
          return canRedo(viewRef.current);
        },
        
        getHistoryState: () => {
          if (!viewRef.current) {
            return {
              canUndo: false,
              canRedo: false,
              undoDepth: 0,
              redoDepth: 0
            };
          }
          return getHistoryState(viewRef.current);
        },
        
        // Validation API
        validator: validatorInstance,
        
        // Content Management
        setContent: (newContent: DocNode) => {
          if (!viewRef.current) {
            console.warn('[AutoArtifacts] Cannot set content: editor not initialized');
            return;
          }
          
          // Warn if in controlled mode
          if (isControlled) {
            console.warn(
              '[AutoArtifacts] setContent() called in controlled mode. ' +
              'This will be overwritten by the next "content" prop update. ' +
              'Update the "content" prop instead.'
            );
          }
          
          try {
            // Validate if validation mode is not off
            if (validationMode !== 'off') {
              const result = validateContentFn(newContent, {
                mode: validationMode,
                throwOnError: false
              });
              
              if (!result.valid && validationMode === 'strict') {
                console.error('[AutoArtifacts] Cannot set invalid content in strict mode');
                return;
              }
            }
            
            // Create new state with new content
            const newState = EditorState.create({
              doc: schema.nodeFromJSON(newContent),
              schema: viewRef.current.state.schema,
              plugins: viewRef.current.state.plugins
            });
            
            // Update the view
            viewRef.current.updateState(newState);
            
            // Update internal state if uncontrolled
            if (!isControlled) {
              setInternalContent(newContent);
            }
            
            // Fire onContentChange
            if (onContentChange && editorRefObject.current) {
              onContentChange({
                editor: editorRefObject.current,
                content: newContent
              });
            }
          } catch (error) {
            console.error('[AutoArtifacts] Failed to set content:', error);
          }
        },
        
        // Export methods
        exportAs: (format: ExportFormat, options?: ExportOptions) => {
          const content = viewRef.current?.state.doc.toJSON();
          if (!content) return '';
          
          switch (format) {
            case 'json':
              return exportToJSON(content as DocNode, options?.pretty);
            case 'html':
              return exportToHTML(content as DocNode, {
                includeStyles: options?.includeStyles,
                slideNumbers: options?.slideNumbers
              });
            case 'markdown':
              return exportToMarkdown(content as DocNode);
            case 'text':
              return exportToText(content as DocNode);
            default:
              return '';
          }
        },
        
        downloadAs: (format: ExportFormat, filename: string, options?: ExportOptions) => {
          const content = viewRef.current?.state.doc.toJSON();
          if (!content) return;
          
          let exportedContent = '';
          let mimeType = '';
          let extension = '';
          
          switch (format) {
            case 'json':
              exportedContent = exportToJSON(content as DocNode, options?.pretty);
              mimeType = 'application/json';
              extension = '.json';
              break;
            case 'html':
              exportedContent = exportToHTML(content as DocNode, {
                includeStyles: options?.includeStyles,
                slideNumbers: options?.slideNumbers
              });
              mimeType = 'text/html';
              extension = '.html';
              break;
            case 'markdown':
              exportedContent = exportToMarkdown(content as DocNode);
              mimeType = 'text/markdown';
              extension = '.md';
              break;
            case 'text':
              exportedContent = exportToText(content as DocNode);
              mimeType = 'text/plain';
              extension = '.txt';
              break;
          }
          
          const fullFilename = filename.endsWith(extension) ? filename : filename + extension;
          downloadFile(exportedContent, fullFilename, mimeType);
        },
        
        // Utility methods
        destroy: () => {
          if (viewRef.current) {
            viewRef.current.destroy();
            viewRef.current = null;
          }
        },
        
        getElement: () => {
          return editorRef.current;
        }
      };
      
      // Store for callbacks
      editorRefObject.current = refObject;
      
      return refObject;
    }, [isEditableState, isControlled, validationMode, onContentChange]);

    // Effect 1: Create editor once (or when fundamental settings change)
    useEffect(() => {
      if (!editorRef.current) return;

      try {
        // Validate initial content before creating editor (unless disabled)
        let contentToUse = initialContentRef.current!;
        
        if (validationMode !== 'off') {
          const validationResult = validateContentFn(initialContentRef.current!, {
            mode: validationMode,
            autoFix: autoFixContent,
            throwOnError: false
          });

          if (!validationResult.valid) {
            console.warn('[AutoArtifacts] Content validation issues:', validationResult);
            
            // Fire onValidationError callback
            if (onValidationError) {
              onValidationError(validationResult);
            }

            // Use fixed content if available and autoFix is enabled
            if (autoFixContent && validationResult.fixed) {
              console.log('[AutoArtifacts] Using auto-fixed content');
              contentToUse = validationResult.fixed;
            } else if (validationMode === 'strict') {
              // In strict mode, don't create editor if invalid
              const error = new Error('Content validation failed in strict mode');
              if (onError) {
                onError(error);
              }
              return;
            }
          }
        }

        // Add plugins including configured history
        const plugins = [
          history({
            depth: historyDepth,
            newGroupDelay: newGroupDelay
          }),
          keymap({
            'Mod-z': undo,
            'Mod-y': redo,
            'Mod-Shift-z': redo
          }),
          keymap(baseKeymap)
        ];

        // Add button plugin if enabled
        if (showAddSlideButtons) {
          plugins.push(
            createAddSlideButtonPlugin(
              () => editorRefObject.current,
              {
                className: addSlideButtonClassName,
                style: addSlideButtonStyle,
                content: addSlideButtonContent,
                onClick: onAddSlideButtonClick
              }
            )
          );
        }

        // Add custom plugins
        if (customPlugins && customPlugins.length > 0) {
          plugins.push(...customPlugins);
        }

        // Create initial state from JSON (using validated/fixed content)
        const state = EditorState.create({
          doc: schema.nodeFromJSON(contentToUse),
          schema,
          plugins
        });

        // Create the editor view
        const view = new EditorView(editorRef.current, {
          state,
          editable: () => isEditableState,
          
          dispatchTransaction(transaction) {
            const oldState = view.state;
            const newState = view.state.apply(transaction);
            view.updateState(newState);

            // Fire onTransaction for every transaction
            if (onTransaction && editorRefObject.current) {
              onTransaction({
                editor: editorRefObject.current,
                transaction
              });
            }

            // Fire onUpdate if document changed
            if (transaction.docChanged) {
              const newContent = newState.doc.toJSON();
              
              if (onUpdate && editorRefObject.current) {
                onUpdate({
                  editor: editorRefObject.current,
                  transaction
                });
              }

              // Controlled mode: call onChange
              if (isControlled && onChange) {
                onChange(newContent);
              }
              
              // Uncontrolled mode: update internal state
              if (!isControlled) {
                setInternalContent(newContent as any);
              }

              // Fire onContentChange with editor ref (works in both modes)
              if (onContentChange && editorRefObject.current) {
                onContentChange({
                  editor: editorRefObject.current,
                  content: newContent as any
                });
              }
            }

            // Fire onSelectionUpdate if selection changed
            if (!oldState.selection.eq(newState.selection)) {
              if (onSelectionUpdate && editorRefObject.current) {
                onSelectionUpdate({
                  editor: editorRefObject.current,
                  selection: newState.selection
                });
              }
            }

            // Fire onUndo/onRedo if these operations occurred
            // ProseMirror history plugin adds metadata to transactions
            if (transaction.getMeta('history$')) {
              const historyMeta = transaction.getMeta('history$');
              if (historyMeta.undo && onUndo && editorRefObject.current) {
                onUndo({
                  editor: editorRefObject.current
                });
              } else if (historyMeta.redo && onRedo && editorRefObject.current) {
                onRedo({
                  editor: editorRefObject.current
                });
              }
            }
          },
          
          // Handle focus/blur events
          handleDOMEvents: {
            focus: (view, event) => {
              if (onFocus && editorRefObject.current) {
                onFocus({
                  editor: editorRefObject.current,
                  event: event as FocusEvent
                });
              }
              return false; // Let ProseMirror handle it
            },
            
            blur: (view, event) => {
              if (onBlur && editorRefObject.current) {
                onBlur({
                  editor: editorRefObject.current,
                  event: event as FocusEvent
                });
              }
              return false; // Let ProseMirror handle it
            }
          }
        });

        viewRef.current = view;

        // Apply layouts after initial render
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          if (editorRef.current) {
            applyAllLayouts(editorRef.current);
          }
          
          // Fire onCreate after editor is fully initialized
          if (onCreate && editorRefObject.current) {
            onCreate({
              editor: editorRefObject.current
            });
          }
          
          // Mark that initial mount is complete
          isInitialMount.current = false;
        }, 0);

        // Cleanup
        return () => {
          // Fire onDestroy before cleanup
          if (onDestroy) {
            onDestroy();
          }
          
          view.destroy();
          viewRef.current = null;
        };
      } catch (error) {
        // Handle validation errors
        if (error instanceof ValidationError) {
          console.error('[AutoArtifacts] Content validation failed:', error.message);
          if (onError) {
            onError(error);
          }
          return; // Don't create editor if validation fails
        }

        // Handle other errors
        if (onError && error instanceof Error) {
          onError(error);
        } else {
          console.error('[AutoArtifacts] Error initializing editor:', error);
        }
      }
    }, [editorMode, readOnly, onCreate, onDestroy, onUpdate, onContentChange, 
        onSelectionUpdate, onFocus, onBlur, onTransaction, onChange, onError, 
        onUndo, onRedo, historyDepth, newGroupDelay, validationMode, autoFixContent, 
        onValidationError, isControlled]);
    
    // Effect 2: Sync content prop changes (controlled mode only)
    useEffect(() => {
      // Skip if editor not initialized or not in controlled mode
      if (!viewRef.current || !isControlled || isInitialMount.current) return;
      
      // Skip if content is undefined
      if (content === undefined) return;
      
      // Get current editor content
      const currentContent = viewRef.current.state.doc.toJSON();
      
      // Check if content actually changed (deep equality check)
      // This prevents infinite update loops and unnecessary updates
      if (JSON.stringify(currentContent) === JSON.stringify(content)) {
        return;
      }
      
      try {
        // Validate new content if needed
        let contentToUse = content;
        
        if (validationMode !== 'off') {
          const validationResult = validateContentFn(content, {
            mode: validationMode,
            autoFix: autoFixContent,
            throwOnError: false
          });
          
          if (!validationResult.valid) {
            console.warn('[AutoArtifacts] Content sync validation issues:', validationResult);
            
            if (autoFixContent && validationResult.fixed) {
              contentToUse = validationResult.fixed;
            } else if (validationMode === 'strict') {
              console.error('[AutoArtifacts] Cannot sync invalid content in strict mode');
              return;
            }
          }
        }
        
        // Update editor state WITHOUT destroying the editor
        const newState = EditorState.create({
          doc: schema.nodeFromJSON(contentToUse),
          schema: viewRef.current.state.schema,
          plugins: viewRef.current.state.plugins,
          selection: viewRef.current.state.selection // Preserve selection if possible
        });
        
        viewRef.current.updateState(newState);
        
        // Re-apply layouts after content sync
        setTimeout(() => {
          if (editorRef.current) {
            applyAllLayouts(editorRef.current);
          }
        }, 0);
      } catch (error) {
        console.error('[AutoArtifacts] Failed to sync content:', error);
        if (onError && error instanceof Error) {
          onError(error);
        }
      }
    }, [content, isControlled, validationMode, autoFixContent, onError]);

    // Re-apply layouts when content changes
    useEffect(() => {
      if (!editorRef.current || !viewRef.current) return;

      // Apply layouts after content updates
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (editorRef.current) {
          applyAllLayouts(editorRef.current);
        }
      }, 0);
    }, [content]); // Run when content prop changes

    // Handle slide visibility based on mode and currentSlide
    useEffect(() => {
      if (!editorRef.current) return;

      if (editorMode === 'present') {
        // In presentation mode, show only current slide
        showSlide(editorRef.current, currentSlide);
      } else {
        // In edit and preview modes, show all slides
        showAllSlides(editorRef.current);
      }
    }, [editorMode, currentSlide]);
    
    // Watch for slide changes and fire enhanced onSlideChange
    useEffect(() => {
      if (currentSlide !== prevSlideRef.current) {
        if (onSlideChange && editorRefObject.current) {
          // Fire old-style callback for backward compatibility
          onSlideChange(currentSlide);
        }
        prevSlideRef.current = currentSlide;
      }
    }, [currentSlide, onSlideChange]);

    // Keyboard navigation for presentation mode
    useEffect(() => {
      if (editorMode !== 'present' || !editorRef.current) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!editorRef.current) return;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
          e.preventDefault();
          navNextSlide(editorRef.current, onSlideChange);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          navPrevSlide(editorRef.current, onSlideChange);
        } else if (e.key === 'Home') {
          e.preventDefault();
          showSlide(editorRef.current, 0);
          if (onSlideChange) onSlideChange(0);
        } else if (e.key === 'End') {
          e.preventDefault();
          const slides = editorRef.current.querySelectorAll('[data-node-type="slide"]');
          const lastIndex = slides.length - 1;
          showSlide(editorRef.current, lastIndex);
          if (onSlideChange) onSlideChange(lastIndex);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [editorMode, onSlideChange]);
    
    // Sync editable state with props
    useEffect(() => {
      const shouldBeEditable = editorMode === 'edit' && !readOnly;
      setIsEditableState(shouldBeEditable);
      
      if (viewRef.current) {
        viewRef.current.setProps({
          editable: () => shouldBeEditable
        });
      }
    }, [editorMode, readOnly]);

    const editorClassName = `autoartifacts-editor theme-${editorTheme} mode-${editorMode} ${readOnly ? 'read-only' : ''} ${editorStyles}`.trim();

    return (
      <>
        <div ref={editorRef} className={editorClassName} />
        
        {showHelp && (
          <KeyboardShortcutsHelp
            shortcuts={effectiveShortcuts}
            onClose={() => setShowHelp(false)}
          />
        )}
      </>
    );
  }
);

SlideEditor.displayName = 'SlideEditor';
