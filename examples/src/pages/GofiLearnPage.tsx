import { useState } from 'react';
import {
  House,
  BookOpen,
  CalendarDays,
  PieChart,
  Award,
  Search,
  MessageCircle,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { Avatar, AvatarStack } from '@/components/Avatar';
import { Button, IconButton } from '@/components/Button';
import { NotificationBadge, Tag } from '@/components/Badge';
import { Card, CardTitle } from '@/components/Card';
import { Pagination } from '@/components/Pagination';
import { Progress } from '@/components/Progress';
import { Stack, Inline, Grid } from '@/components/Layout';
import { cn } from '@/lib/cn';
import { DocPage, DocSection, Callout } from '../components';

const NAV = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'results', label: 'Results', icon: PieChart },
  { id: 'certificate', label: 'Certificate', icon: Award },
];

const FILTERS = ['Upcoming', 'In progress', 'Completed'] as const;
type Filter = (typeof FILTERS)[number];

interface Course {
  name: string;
  teacher: string;
  duration: string;
  done: number;
  total: number;
  pct: number;
  students: string[];
  more: number;
  cta: 'Continue' | 'Complete';
}

const COURSES: Course[] = [
  { name: 'Monetary Policy & Banking', teacher: 'Ida Aguirre', duration: '74h 45m', done: 14, total: 56, pct: 25, students: ['Ana Lima', 'Beto Sá', 'Caio Reis', 'Duda Melo'], more: 3, cta: 'Continue' },
  { name: 'International Economics', teacher: 'Tiffany Fowler', duration: '62h 24m', done: 12, total: 46, pct: 26, students: ['Eva Dias', 'Fábio Cruz', 'Gabi Sousa', 'Hugo Reis'], more: 8, cta: 'Continue' },
  { name: 'Behavioral Economics', teacher: 'Julie Dawson', duration: '44h 32m', done: 3, total: 32, pct: 10, students: ['Ivo Pinto', 'Joana Sá', 'Lia Mota', 'Rui Alves'], more: 2, cta: 'Continue' },
  { name: 'Marketing Strategy', teacher: 'Rory Todd', duration: '28h 12m', done: 22, total: 22, pct: 99, students: ['Maria Reis', 'Nuno Dias', 'Olga Sá', 'Pedro Lima'], more: 6, cta: 'Complete' },
];

const RECOMMENDED = [
  { cat: 'Finance', name: 'Risk Management 101', teacher: 'Helen Park', lessons: 18 },
  { cat: 'Data', name: 'Statistics for Business', teacher: 'Omar Núñez', lessons: 24 },
  { cat: 'Design', name: 'UX Research Basics', teacher: 'Sara Lund', lessons: 12 },
];

function GofiLearnApp() {
  const [active, setActive] = useState('courses');
  const [filter, setFilter] = useState<Filter>('In progress');
  const [page, setPage] = useState(1);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand/40 via-accent/15 to-transparent p-2 sm:p-3">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-border px-4 py-3">
          <Inline gap={2} className="w-[180px] shrink-0">
            <span className="grid size-9 place-items-center rounded-lg bg-action text-white">
              <BookOpen className="size-5" />
            </span>
            <span className="text-h3 font-bold text-ink">GOFI Learn</span>
          </Inline>
          <div className="flex h-10 max-w-md flex-1 items-center gap-2 rounded-pill bg-page px-4">
            <Search aria-hidden className="size-4 text-ink-secondary" />
            <input
              type="search"
              placeholder="Search"
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-ink-secondary"
            />
          </div>
          <Inline gap={3} className="ml-auto">
            <div className="relative">
              <IconButton variant="outline" aria-label="Messages (2 unread)">
                <MessageCircle className="size-5" />
              </IconButton>
              <span className="absolute -right-1 -top-1"><NotificationBadge count={2} /></span>
            </div>
            <div className="relative">
              <IconButton variant="outline" aria-label="Notifications (6 unread)">
                <Bell className="size-5" />
              </IconButton>
              <span className="absolute -right-1 -top-1"><NotificationBadge count={6} /></span>
            </div>
            <Inline gap={2} className="border-l border-border pl-3">
              <Avatar name="Cora Richards" size="md" />
              <Stack gap={0} className="hidden md:flex">
                <span className="text-body-sm font-semibold text-ink">Cora Richards</span>
                <span className="text-caption text-ink-secondary">cora.r@edu.com</span>
              </Stack>
            </Inline>
          </Inline>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-border p-4 lg:block">
            <nav aria-label="Main" className="flex flex-col gap-1">
              {NAV.map((item) => {
                const on = item.id === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActive(item.id)}
                    aria-current={on ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-pill px-4 py-2.5 text-body-sm transition-colors duration-100',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                      on ? 'bg-action font-medium text-white' : 'text-ink-secondary hover:bg-hover hover:text-ink',
                    )}
                  >
                    <item.icon aria-hidden className="size-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex flex-col gap-5 bg-page p-5 md:p-6">
            <Inline justify="between" align="center">
              <h1 className="text-h1 text-ink">Courses</h1>
              <div className="flex items-center gap-1 rounded-pill border border-border bg-card p-1">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={cn(
                      'rounded-pill px-3.5 py-1.5 text-body-sm transition-colors duration-100',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
                      filter === f ? 'bg-action font-medium text-white' : 'text-ink-secondary hover:text-ink',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Inline>

            <Inline justify="between" align="center">
              <Button variant="secondary" size="sm" iconStart={<SlidersHorizontal className="size-4" />} iconEnd={<ChevronDown className="size-4" />}>
                Filters
              </Button>
              <Inline gap={2}>
                <span className="text-body-sm text-ink-secondary">Sort by:</span>
                <Button variant="secondary" size="sm" iconStart={<ArrowUpDown className="size-4" />} iconEnd={<ChevronDown className="size-4" />}>
                  Duration
                </Button>
              </Inline>
            </Inline>

            {/* Table */}
            <Card variant="outlined" className="p-0">
              <div className="hidden grid-cols-[1.6fr_1.2fr_0.8fr_1.4fr_1fr_auto] items-center gap-4 border-b border-border px-5 py-3 text-caption font-medium text-ink-secondary lg:grid">
                <span>Course</span><span>Teacher</span><span>Duration</span><span>Progress</span><span>Students</span><span />
              </div>
              <ul role="list" className="divide-y divide-border">
                {COURSES.map((c) => (
                  <li
                    key={c.name}
                    className="grid grid-cols-1 items-center gap-4 px-5 py-4 lg:grid-cols-[1.6fr_1.2fr_0.8fr_1.4fr_1fr_auto]"
                  >
                    <span className="font-medium text-ink">{c.name}</span>
                    <Inline gap={2}><Avatar name={c.teacher} size="sm" /><span className="text-body-sm text-ink">{c.teacher}</span></Inline>
                    <span className="text-body-sm text-ink-secondary tabular-nums">{c.duration}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-body-sm tabular-nums">
                        <span className="font-semibold text-ink">{c.done}</span>
                        <span className="text-ink-secondary">/{c.total}</span>
                      </span>
                      <div className="hidden h-1 flex-1 overflow-hidden rounded-pill bg-border sm:block">
                        <div className={cn('h-full rounded-pill', c.pct >= 99 ? 'bg-success' : 'bg-action')} style={{ width: `${c.pct}%` }} />
                      </div>
                      <span className="text-caption text-ink-secondary tabular-nums">({c.pct}%)</span>
                    </div>
                    <AvatarStack max={4} items={[...c.students.map((s) => ({ name: s })), ...Array.from({ length: c.more }, (_, i) => ({ name: `Student ${i + 5}` }))]} />
                    <Button variant="primary" size="sm">{c.cta}</Button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center border-t border-border px-5 py-4">
                <Pagination page={page} pageCount={8} onChange={setPage} />
              </div>
            </Card>

            {/* Recommended (cards) */}
            <Inline justify="between" align="center">
              <h2 className="text-h2 text-ink">Recommended for you</h2>
              <button type="button" className="rounded-sm text-body-sm font-medium text-action hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                View all
              </button>
            </Inline>
            <Grid min="220px" gap={4}>
              {RECOMMENDED.map((r) => (
                <Card key={r.name}>
                  <Tag>{r.cat}</Tag>
                  <CardTitle>{r.name}</CardTitle>
                  <Inline gap={2}>
                    <Avatar name={r.teacher} size="sm" />
                    <span className="text-body-sm text-ink-secondary">{r.teacher}</span>
                  </Inline>
                  <Progress variant="linear" value={0} max={r.lessons} showValue label={`Lessons in ${r.name}`} />
                  <Button variant="secondary" size="sm" full>Start</Button>
                </Card>
              ))}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GofiLearnPage() {
  return (
    <DocPage
      group="Templates"
      title="GOFI Learn - Courses"
      lead="App shell for a course portal: sidebar, top bar with search and notifications, a rich table (progress + avatar stack), pagination and recommendations in cards."
      source="patterns/app-shell.md"
    >
      <Callout tone="info">
        Built only with design system components and tokens. Switch theme and brand color at the top
        to see the same screen in different variations.
      </Callout>
      <DocSection title="Template">
        <GofiLearnApp />
      </DocSection>
    </DocPage>
  );
}
