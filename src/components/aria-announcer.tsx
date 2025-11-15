import { useEffect, useRef } from 'react';

interface AriaAnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function AriaAnnouncer({ message, politeness = 'polite' }: AriaAnnouncerProps) {
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to clear the message after it's been announced
    if (message) {
      timeoutRef.current = setTimeout(() => {
        // Message will be cleared by the next render or unmount
      }, 1000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Hook to use announcer
export function useAriaAnnouncer() {
  const announcementRef = useRef<string>('');

  const announce = (message: string) => {
    announcementRef.current = message;
    // Force a re-render by triggering a state update in the component using this hook
  };

  return {
    announcement: announcementRef.current,
    announce,
  };
}
