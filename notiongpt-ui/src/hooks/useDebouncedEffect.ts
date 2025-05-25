import { useEffect } from 'react';

export function useDebouncedEffect(callback: () => void, delay: number, p0: unknown) {
  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
