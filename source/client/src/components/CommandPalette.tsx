import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { SEARCH_INDEX, type SearchEntry, type SearchType } from '@/lib/searchIndex';

/** Group order and labels. Pages first — navigation is the common case. */
const GROUPS: { type: SearchType; label: string }[] = [
  { type: 'page', label: 'Pages' },
  { type: 'article', label: 'Articles' },
  { type: 'program', label: 'Programs' },
  { type: 'book', label: 'Books & Courses' },
  { type: 'event', label: 'Events' },
];

const TYPE_ICON: Record<SearchType, string> = {
  page: 'M4 4h16v16H4z M4 9h16',
  article: 'M4 4h16v16H4z M8 9h8 M8 13h5',
  program: 'M12 3l9 5-9 5-9-5 9-5z M21 12l-9 5-9-5',
  book: 'M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z M9 3v18',
  event: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4',
};

function Glyph({ type }: { type: SearchType }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, opacity: 0.55 }}
      aria-hidden="true">
      {TYPE_ICON[type].split(' M').map((d, i) => (
        <path key={i} d={i === 0 ? d : 'M' + d} />
      ))}
    </svg>
  );
}

/**
 * Site-wide command palette. Opens on Cmd/Ctrl-K, or from the navbar search
 * button.
 *
 * Searches the generated index (see scripts/generate-search-index.mjs), which
 * covers every routed page as well as articles, books, programmes and events —
 * the old /search page only knew about 23 hand-maintained content entries and
 * none of the pages.
 *
 * Filtering is done here rather than by cmdk's built-in scorer so that tag
 * matches count: searching "enroll" should find "Join the Gurukul" even though
 * the word appears in neither its title nor its description.
 */
export default function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState('');
  const [, navigate] = useLocation();
  const setOpen = onOpenChange;

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_INDEX;
    const terms = q.split(/\s+/);
    return SEARCH_INDEX.map((entry) => {
      const haystack = [entry.title, entry.excerpt, entry.category, ...entry.tags]
        .join(' ')
        .toLowerCase();
      const title = entry.title.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (!haystack.includes(t)) return null;
        if (title.startsWith(t)) score += 3;
        else if (title.includes(t)) score += 2;
        else score += 1;
      }
      return { entry, score };
    })
      .filter((x): x is { entry: SearchEntry; score: number } => x !== null)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.entry);
  }, [query]);

  const go = useCallback(
    (url: string) => {
      setOpen(false);
      navigate(url);
    },
    [navigate],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search Sanatan International"
      description="Search pages, articles, programmes, books and events"
      className="max-w-2xl"
      // We filter above, including tag matches; cmdk's own scorer would then
      // filter the already-filtered list again and drop valid hits.
      shouldFilter={false}>
      <CommandInput
        placeholder="Search pages, articles, programmes, events…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>No results for “{query}”.</CommandEmpty>
        {GROUPS.map(({ type, label }) => {
          const items = results.filter((r) => r.type === type);
          if (!items.length) return null;
          return (
            <CommandGroup key={type} heading={label}>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  // cmdk does its own filtering on this value; ours already ran,
                  // so keep it unique and always-matching.
                  value={item.id}
                  onSelect={() => go(item.url)}
                  className="gap-3">
                  <Glyph type={item.type} />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{item.title}</span>
                    <span className="truncate text-xs opacity-60">{item.excerpt}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
