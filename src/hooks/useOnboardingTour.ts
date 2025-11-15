import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function useOnboardingTour(hasSeenTour: boolean, onComplete: () => void) {
  useEffect(() => {
    if (!hasSeenTour && typeof window !== 'undefined') {
      // Small delay to ensure DOM is ready
      const timeout = setTimeout(() => {
        const driverObj = driver({
          showProgress: true,
          steps: [
            {
              element: 'h1',
              popover: {
                title: 'Welcome to Color Palette Generator! 🎨',
                description: 'Create beautiful, harmonious color palettes using color theory. Let\'s take a quick tour!',
                side: 'bottom',
                align: 'start'
              }
            },
            {
              element: '[data-tour="harmony-selector"]',
              popover: {
                title: 'Choose Color Harmony',
                description: 'Select different color theory models. Each shows a live preview of how the palette will look!',
                side: 'bottom',
                align: 'start'
              }
            },
            {
              element: '[data-tour="generate-button"]',
              popover: {
                title: 'Generate Palettes',
                description: 'Click here or press SPACE to generate a new random palette. Try it out!',
                side: 'bottom',
                align: 'center'
              }
            },
            {
              element: '[data-tour="quick-actions"]',
              popover: {
                title: 'Quick Actions',
                description: 'Undo/redo changes, lock colors, randomize, invert, and more! Keyboard shortcuts are shown for quick access.',
                side: 'bottom',
                align: 'start'
              }
            },
            {
              element: '[data-tour="tabs"]',
              popover: {
                title: 'Organized Tabs',
                description: 'Everything is organized into tabs: Palette, Adjust, Export, and Advanced features.',
                side: 'bottom',
                align: 'start'
              }
            },
            {
              popover: {
                title: 'You\'re all set! 🎉',
                description: 'Start creating beautiful color palettes. Press ? anytime to see keyboard shortcuts, or click the help icon.',
              }
            }
          ],
          onDestroyStarted: () => {
            onComplete();
            driverObj.destroy();
          },
        });

        driverObj.drive();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [hasSeenTour, onComplete]);
}
