/**
 * Slide Navigation Tests
 */

import {
  getAllSlides,
  getSlideCount,
  showSlide,
  showAllSlides,
  getCurrentSlideIndex,
  canGoNext,
  canGoPrev,
  getSlideInfo,
  nextSlide,
  prevSlide,
  goToSlide,
} from "../slideNavigation";

describe("Slide Navigation", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = `
      <div data-node-type="slide">Slide 1</div>
      <div data-node-type="slide">Slide 2</div>
      <div data-node-type="slide">Slide 3</div>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("getAllSlides", () => {
    it("should return all slide elements", () => {
      const slides = getAllSlides(container);
      expect(slides).toHaveLength(3);
      expect(slides[0].textContent).toBe("Slide 1");
    });

    it("should return empty array when no slides", () => {
      const empty = document.createElement("div");
      const slides = getAllSlides(empty);
      expect(slides).toHaveLength(0);
    });
  });

  describe("getSlideCount", () => {
    it("should return correct slide count", () => {
      expect(getSlideCount(container)).toBe(3);
    });

    it("should return 0 for empty container", () => {
      const empty = document.createElement("div");
      expect(getSlideCount(empty)).toBe(0);
    });
  });

  describe("showSlide", () => {
    it("should show specified slide and hide others", () => {
      showSlide(container, 1);

      const slides = getAllSlides(container);
      expect(slides[0].style.display).toBe("none");
      expect(slides[1].style.display).toBe("block");
      expect(slides[2].style.display).toBe("none");

      expect(slides[1].getAttribute("data-active")).toBe("true");
      expect(slides[0].getAttribute("data-active")).toBe("false");
    });

    it("should warn on invalid index", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      showSlide(container, 10);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid slide index")
      );
      warnSpy.mockRestore();
    });

    it("should warn on negative index", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      showSlide(container, -1);

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe("showAllSlides", () => {
    it("should show all slides", () => {
      // First hide some slides
      showSlide(container, 1);

      // Then show all
      showAllSlides(container);

      const slides = getAllSlides(container);
      slides.forEach((slide) => {
        expect(slide.style.display).toBe("block");
        expect(slide.hasAttribute("data-active")).toBe(false);
      });
    });
  });

  describe("getCurrentSlideIndex", () => {
    it("should return index of active slide", () => {
      showSlide(container, 1);
      expect(getCurrentSlideIndex(container)).toBe(1);
    });

    it("should return 0 when no active slide", () => {
      expect(getCurrentSlideIndex(container)).toBe(0);
    });

    it("should return 0 for empty container", () => {
      const empty = document.createElement("div");
      expect(getCurrentSlideIndex(empty)).toBe(0);
    });
  });

  describe("canGoNext", () => {
    it("should return true when not on last slide", () => {
      showSlide(container, 0);
      expect(canGoNext(container)).toBe(true);
    });

    it("should return false when on last slide", () => {
      showSlide(container, 2);
      expect(canGoNext(container)).toBe(false);
    });

    it("should return true with circular navigation", () => {
      showSlide(container, 2);
      expect(canGoNext(container, true)).toBe(true);
    });

    it("should return false for empty container", () => {
      const empty = document.createElement("div");
      expect(canGoNext(empty)).toBe(false);
    });
  });

  describe("canGoPrev", () => {
    it("should return true when not on first slide", () => {
      showSlide(container, 1);
      expect(canGoPrev(container)).toBe(true);
    });

    it("should return false when on first slide", () => {
      showSlide(container, 0);
      expect(canGoPrev(container)).toBe(false);
    });

    it("should return true with circular navigation", () => {
      showSlide(container, 0);
      expect(canGoPrev(container, true)).toBe(true);
    });

    it("should return false for empty container", () => {
      const empty = document.createElement("div");
      expect(canGoPrev(empty)).toBe(false);
    });
  });

  describe("getSlideInfo", () => {
    it("should return complete slide information", () => {
      showSlide(container, 1);

      const info = getSlideInfo(container);

      expect(info.index).toBe(1);
      expect(info.total).toBe(3);
      expect(info.isFirst).toBe(false);
      expect(info.isLast).toBe(false);
      expect(info.canGoNext).toBe(true);
      expect(info.canGoPrev).toBe(true);
    });

    it("should mark first slide correctly", () => {
      showSlide(container, 0);

      const info = getSlideInfo(container);

      expect(info.isFirst).toBe(true);
      expect(info.canGoPrev).toBe(false);
    });

    it("should mark last slide correctly", () => {
      showSlide(container, 2);

      const info = getSlideInfo(container);

      expect(info.isLast).toBe(true);
      expect(info.canGoNext).toBe(false);
    });
  });

  describe("nextSlide", () => {
    it("should move to next slide", () => {
      showSlide(container, 0);

      const newIndex = nextSlide(container);

      expect(newIndex).toBe(1);
    });

    it("should not move past last slide", () => {
      showSlide(container, 2);

      const newIndex = nextSlide(container);

      expect(newIndex).toBe(2);
    });

    it("should wrap to first slide with circular option", () => {
      showSlide(container, 2);

      const newIndex = nextSlide(container, undefined, { circular: true });

      expect(newIndex).toBe(0);
    });

    it("should call onSlideChange callback", () => {
      showSlide(container, 0);
      const callback = jest.fn();

      nextSlide(container, callback);

      expect(callback).toHaveBeenCalledWith(1);
    });

    it("should return current index for empty container", () => {
      const empty = document.createElement("div");
      const index = nextSlide(empty);
      expect(index).toBe(0);
    });

    it("should handle transition option", () => {
      showSlide(container, 0);

      nextSlide(container, undefined, {
        transition: "fade",
        duration: 100,
      });

      // Just verify it doesn't throw
      expect(true).toBe(true);
    });
  });

  describe("prevSlide", () => {
    it("should move to previous slide", () => {
      showSlide(container, 1);

      const newIndex = prevSlide(container);

      expect(newIndex).toBe(0);
    });

    it("should not move before first slide", () => {
      showSlide(container, 0);

      const newIndex = prevSlide(container);

      expect(newIndex).toBe(0);
    });

    it("should wrap to last slide with circular option", () => {
      showSlide(container, 0);

      const newIndex = prevSlide(container, undefined, { circular: true });

      expect(newIndex).toBe(2);
    });

    it("should call onSlideChange callback", () => {
      showSlide(container, 1);
      const callback = jest.fn();

      prevSlide(container, callback);

      expect(callback).toHaveBeenCalledWith(0);
    });

    it("should return current index for empty container", () => {
      const empty = document.createElement("div");
      const index = prevSlide(empty);
      expect(index).toBe(0);
    });
  });

  describe("goToSlide", () => {
    it("should navigate to specified slide", () => {
      const newIndex = goToSlide(container, 2);
      expect(newIndex).toBe(2);
    });

    it("should warn on invalid index", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      const index = goToSlide(container, 10);

      expect(warnSpy).toHaveBeenCalled();
      expect(index).toBe(0); // Should return current index
      warnSpy.mockRestore();
    });

    it("should call onSlideChange callback", () => {
      const callback = jest.fn();

      goToSlide(container, 1, callback);

      expect(callback).toHaveBeenCalledWith(1);
    });

    it("should handle negative index", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      goToSlide(container, -1);

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe("transitions", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should apply transitions with fade effect", (done) => {
      showSlide(container, 0);
      const callback = jest.fn();

      nextSlide(container, callback, {
        transition: "fade",
        duration: 300,
      });

      const slides = getAllSlides(container);

      // After first timeout, slide should be shown
      jest.advanceTimersByTime(300);

      // After second timeout, classes should be cleaned up
      jest.advanceTimersByTime(300);

      expect(callback).toHaveBeenCalled();

      // Restore timers for next test
      jest.useRealTimers();
      done();
    });

    it("should apply transitions with slide effect", (done) => {
      showSlide(container, 0);
      const callback = jest.fn();

      nextSlide(container, callback, {
        transition: "slide",
        duration: 200,
      });

      const slides = getAllSlides(container);

      // Advance through animation
      jest.advanceTimersByTime(200);
      jest.advanceTimersByTime(200);

      expect(callback).toHaveBeenCalled();

      jest.useRealTimers();
      done();
    });

    it("should skip transitions with none option", () => {
      showSlide(container, 0);
      const callback = jest.fn();

      nextSlide(container, callback, {
        transition: "none",
      });

      expect(callback).toHaveBeenCalled();
    });

    it("should handle transition when slides are missing", () => {
      showSlide(container, 0);
      const callback = jest.fn();
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();

      // Try to navigate to an invalid slide with transition
      goToSlide(container, 100, callback, {
        transition: "fade",
        duration: 300,
      });

      // Should have warned about invalid index
      expect(warnSpy).toHaveBeenCalled();
      // Callback won't be called for invalid index
      expect(callback).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it("should apply transition classes to current and target slides", (done) => {
      showSlide(container, 0);
      const callback = jest.fn();

      nextSlide(container, callback, {
        transition: "fade",
        duration: 100,
      });

      const slides = getAllSlides(container);

      // Check that exit class is applied
      expect(
        slides[0].classList.contains("transition-fade-out") ||
          slides[0].className.includes("fade")
      ).toBeTruthy();

      // Advance through first timeout
      jest.advanceTimersByTime(100);

      // Check that enter class is applied to next slide
      expect(
        slides[1].classList.contains("transition-fade-in") ||
          slides[1].className.includes("fade")
      ).toBeTruthy();

      // Advance through cleanup timeout
      jest.advanceTimersByTime(100);

      jest.useRealTimers();
      done();
    });

    it("should work with custom duration", (done) => {
      showSlide(container, 0);
      const callback = jest.fn();

      nextSlide(container, callback, {
        transition: "slide",
        duration: 500,
      });

      jest.advanceTimersByTime(500);
      jest.advanceTimersByTime(500);

      expect(callback).toHaveBeenCalled();

      jest.useRealTimers();
      done();
    });

    it("should handle prevSlide with transitions", (done) => {
      showSlide(container, 2);
      const callback = jest.fn();

      prevSlide(container, callback, {
        transition: "fade",
        duration: 200,
      });

      jest.advanceTimersByTime(200);
      jest.advanceTimersByTime(200);

      expect(callback).toHaveBeenCalled();

      jest.useRealTimers();
      done();
    });

    it("should handle goToSlide with transitions", (done) => {
      showSlide(container, 0);
      const callback = jest.fn();

      goToSlide(container, 2, callback, {
        transition: "slide",
        duration: 250,
      });

      jest.advanceTimersByTime(250);
      jest.advanceTimersByTime(250);

      expect(callback).toHaveBeenCalled();

      jest.useRealTimers();
      done();
    });
  });
});
