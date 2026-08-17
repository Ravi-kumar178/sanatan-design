import { Suspense, lazy, useCallback, useEffect, useState } from 'react';

/**
 * Eager, near-zero-cost trigger for the command palette.
 *
 * The palette itself (cmdk, the Radix dialog and the 56-entry index) is ~12 kB
 * gzipped, and most visits never open it — so only this listener ships in the
 * entry chunk, and the palette is fetched the first time it's actually needed.
 */
const CommandPalette = lazy(() => import('./CommandPalette'));

export default function CommandPaletteMount() {
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);

  const trigger = useCallback(() => {
    setArmed(true);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Once armed, Cmd-K toggles; before that it can only open.
        if (armed) setOpen((v) => !v);
        else trigger();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [armed, trigger]);

  // Lets the navbar button open the palette without prop drilling.
  useEffect(() => {
    window.addEventListener('si:open-search', trigger);
    return () => window.removeEventListener('si:open-search', trigger);
  }, [trigger]);

  if (!armed) return null;

  return (
    <Suspense fallback={null}>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </Suspense>
  );
}
