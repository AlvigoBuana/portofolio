const scrollGestureIdleDelay = 180;

export const createSteppedScrollController = (getStops) => {
  let gestureActive = false;
  let animationActive = false;
  let gestureTimeoutId = 0;
  let animationTimeoutId = 0;
  let animationFrameId = 0;
  let bypassWheelUntil = 0;

  const finishAnimation = () => {
    animationActive = false;
    window.clearTimeout(animationTimeoutId);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    }
  };

  const handleWheel = (event) => {
    if (performance.now() < bypassWheelUntil) return;
    if (event.ctrlKey || event.deltaY === 0) return;
    if (
      event.target instanceof Element &&
      event.target.closest('input, textarea, select, [contenteditable="true"]')
    ) return;

    const stops = getStops();
    if (stops.length < 2) return;

    const currentScrollY = window.scrollY;
    const firstStop = stops[0];
    const lastStop = stops[stops.length - 1];
    const epsilon = 2;
    const scrollingForward = event.deltaY > 0;

    if (
      currentScrollY < firstStop - epsilon ||
      currentScrollY > lastStop + epsilon ||
      scrollingForward && currentScrollY >= lastStop - epsilon ||
      !scrollingForward && currentScrollY <= firstStop + epsilon
    ) return;

    event.preventDefault();

    window.clearTimeout(gestureTimeoutId);
    gestureTimeoutId = window.setTimeout(() => {
      gestureActive = false;
    }, scrollGestureIdleDelay);

    if (gestureActive || animationActive) return;
    gestureActive = true;

    const target = scrollingForward
      ? stops.find((stop) => stop > currentScrollY + epsilon)
      : [...stops].reverse().find((stop) => stop < currentScrollY - epsilon);

    if (target === undefined) return;

    animationActive = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: target, behavior: 'instant' });
      finishAnimation();
      return;
    }

    const start = window.scrollY;
    const distance = target - start;
    const duration = Math.min(750, Math.max(600, Math.abs(distance) * 0.45));
    const startedAt = performance.now();
    const animateScroll = (timestamp) => {
      const progress = Math.min((timestamp - startedAt) / duration, 1);
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo({
        top: progress === 1 ? target : start + distance * easedProgress,
        behavior: 'instant',
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateScroll);
      } else {
        animationFrameId = 0;
        finishAnimation();
      }
    };

    animationFrameId = requestAnimationFrame(animateScroll);
    animationTimeoutId = window.setTimeout(finishAnimation, duration + 150);
  };

  const handleProgrammaticNavigation = () => {
    finishAnimation();
    gestureActive = false;
    window.clearTimeout(gestureTimeoutId);
    bypassWheelUntil = performance.now() + 1500;
  };

  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('portfolio:navigate', handleProgrammaticNavigation);

  return () => {
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('portfolio:navigate', handleProgrammaticNavigation);
    window.clearTimeout(gestureTimeoutId);
    finishAnimation();
  };
};
