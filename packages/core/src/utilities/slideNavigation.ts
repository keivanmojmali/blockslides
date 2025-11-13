/**
 * Slide Navigation Utilities
 *
 * Handles slide visibility, navigation, and presentation mode
 */

import type { NavigationOptions, SlideInfo } from '../types/index';

/**
 * Get all slide elements in the editor
 */
export function getAllSlides(editorElement: HTMLElement): HTMLElement[] {
  return Array.from(
    editorElement.querySelectorAll('[data-node-type="slide"]')
  ) as HTMLElement[];
}

/**
 * Get the total number of slides
 */
export function getSlideCount(editorElement: HTMLElement): number {
  return getAllSlides(editorElement).length;
}

/**
 * Show only the specified slide, hide all others
 * Used for presentation mode
 */
export function showSlide(
  editorElement: HTMLElement,
  slideIndex: number
): void {
  const slides = getAllSlides(editorElement);

  if (slideIndex < 0 || slideIndex >= slides.length) {
    console.warn(
      `[BlockSlides] Invalid slide index ${slideIndex}. ` +
        `Must be between 0 and ${slides.length - 1}`
    );
    return;
  }

  slides.forEach((slide, index) => {
    if (index === slideIndex) {
      slide.style.display = "block";
      slide.setAttribute("data-active", "true");
    } else {
      slide.style.display = "none";
      slide.setAttribute("data-active", "false");
    }
  });
}

/**
 * Show all slides
 * Used for edit and preview modes
 */
export function showAllSlides(editorElement: HTMLElement): void {
  const slides = getAllSlides(editorElement);

  slides.forEach((slide) => {
    slide.style.display = "block";
    slide.removeAttribute("data-active");
  });
}

/**
 * Get the index of the currently visible slide in presentation mode
 */
export function getCurrentSlideIndex(editorElement: HTMLElement): number {
  const slides = getAllSlides(editorElement);

  for (let i = 0; i < slides.length; i++) {
    if (slides[i].getAttribute("data-active") === "true") {
      return i;
    }
  }

  return 0; // Default to first slide
}

/**
 * Check if can navigate to next slide
 */
export function canGoNext(
  editorElement: HTMLElement,
  circular: boolean = false
): boolean {
  const slides = getAllSlides(editorElement);
  if (slides.length === 0) return false;
  if (circular && slides.length > 0) return true;
  
  const currentIndex = getCurrentSlideIndex(editorElement);
  return currentIndex < slides.length - 1;
}

/**
 * Check if can navigate to previous slide
 */
export function canGoPrev(
  editorElement: HTMLElement,
  circular: boolean = false
): boolean {
  const slides = getAllSlides(editorElement);
  if (slides.length === 0) return false;
  if (circular && slides.length > 0) return true;
  
  const currentIndex = getCurrentSlideIndex(editorElement);
  return currentIndex > 0;
}

/**
 * Get complete slide information
 */
export function getSlideInfo(editorElement: HTMLElement): SlideInfo {
  const slides = getAllSlides(editorElement);
  const index = getCurrentSlideIndex(editorElement);
  const total = slides.length;
  
  return {
    index,
    total,
    isFirst: index === 0,
    isLast: index === total - 1,
    canGoNext: canGoNext(editorElement, false),
    canGoPrev: canGoPrev(editorElement, false)
  };
}

/**
 * Navigate to next slide
 * @returns The new slide index
 */
export function nextSlide(
  editorElement: HTMLElement,
  onSlideChange?: (index: number) => void,
  options?: NavigationOptions
): number {
  const currentIndex = getCurrentSlideIndex(editorElement);
  const slideCount = getSlideCount(editorElement);
  
  if (slideCount === 0) return currentIndex;

  let newIndex: number;
  
  // Handle circular navigation
  if (currentIndex < slideCount - 1) {
    newIndex = currentIndex + 1;
  } else if (options?.circular) {
    newIndex = 0; // Wrap to first slide
  } else {
    return currentIndex; // Can't go further
  }

  // Apply transition if specified
  applyTransition(editorElement, currentIndex, newIndex, options, () => {
    if (onSlideChange) {
      onSlideChange(newIndex);
    }
  });
  
  return newIndex;
}

/**
 * Navigate to previous slide
 * @returns The new slide index
 */
export function prevSlide(
  editorElement: HTMLElement,
  onSlideChange?: (index: number) => void,
  options?: NavigationOptions
): number {
  const currentIndex = getCurrentSlideIndex(editorElement);
  const slideCount = getSlideCount(editorElement);
  
  if (slideCount === 0) return currentIndex;

  let newIndex: number;
  
  // Handle circular navigation
  if (currentIndex > 0) {
    newIndex = currentIndex - 1;
  } else if (options?.circular) {
    newIndex = slideCount - 1; // Wrap to last slide
  } else {
    return currentIndex; // Can't go back
  }

  // Apply transition if specified
  applyTransition(editorElement, currentIndex, newIndex, options, () => {
    if (onSlideChange) {
      onSlideChange(newIndex);
    }
  });
  
  return newIndex;
}

/**
 * Go to specific slide
 * @returns The target slide index
 */
export function goToSlide(
  editorElement: HTMLElement,
  slideIndex: number,
  onSlideChange?: (index: number) => void,
  options?: NavigationOptions
): number {
  const currentIndex = getCurrentSlideIndex(editorElement);
  const slideCount = getSlideCount(editorElement);
  
  // Validate slide index
  if (slideIndex < 0 || slideIndex >= slideCount) {
    console.warn(
      `[BlockSlides] Invalid slide index ${slideIndex}. ` +
        `Must be between 0 and ${slideCount - 1}`
    );
    return currentIndex;
  }

  // Apply transition if specified
  applyTransition(editorElement, currentIndex, slideIndex, options, () => {
    if (onSlideChange) {
      onSlideChange(slideIndex);
    }
  });
  
  return slideIndex;
}

/**
 * Apply transition between slides
 * Helper function to handle slide transitions with animations
 */
function applyTransition(
  editorElement: HTMLElement,
  fromIndex: number,
  toIndex: number,
  options: NavigationOptions | undefined,
  callback: () => void
): void {
  const slides = getAllSlides(editorElement);
  
  // If no transition or transition is 'none', navigate instantly
  if (!options?.transition || options.transition === 'none') {
    showSlide(editorElement, toIndex);
    callback();
    return;
  }

  const duration = options.duration || 300;
  const transition = options.transition;
  const currentSlide = slides[fromIndex];
  const targetSlide = slides[toIndex];

  if (!currentSlide || !targetSlide) {
    showSlide(editorElement, toIndex);
    callback();
    return;
  }

  // Apply exit transition to current slide
  currentSlide.classList.add(`transition-${transition}-out`);

  setTimeout(() => {
    // Actually navigate
    showSlide(editorElement, toIndex);
    
    // Apply enter transition to new slide
    targetSlide.classList.add(`transition-${transition}-in`);
    
    // Call the callback
    callback();

    // Clean up transition classes after animation completes
    setTimeout(() => {
      currentSlide.classList.remove(`transition-${transition}-out`);
      targetSlide.classList.remove(`transition-${transition}-in`);
    }, duration);
  }, duration);
}
