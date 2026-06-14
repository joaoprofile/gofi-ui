import { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  GraduationCap,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Plus,
  MoreVertical,
  Clock,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { Card, CardTitle } from '@/components/Card';
import { Button, IconButton } from '@/components/Button';
import { Badge, NotificationBadge, Tag } from '@/components/Badge';
import { Avatar, AvatarStack } from '@/components/Avatar';
import { Progress } from '@/components/Progress';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Menu } from '@/components/Menu';
import { Table, type Column } from '@/components/Table';
import { Stack, Inline, Grid } from '@/components/Layout';
import { cn } from '@/lib/cn';
import { DocPage, DocSection, Callout } from '../components';

/* ─────────── sample data ─────────── */
const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'grades', label: 'Grades', icon: GraduationCap },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

const STATS = [
  { label: 'Active courses', value: '6', icon: BookOpen, trend: '+2 this semester' },
  { label: 'Average progress', value: '78%', icon: TrendingUp, trend: '+12% this month' },
  { label: 'Achievements', value: '14', icon: Trophy, trend: '3 new' },
];

const COURSES = [
  { name: 'Calculus II', cat: 'STEM', done: 14, total: 22, color: 'bg-action' },
  { name: 'Art History', cat: 'Humanities', done: 9, total: 12, color: 'bg-accent' },
  { name: 'Web Programming', cat: 'Technology', done: 18, total: 20, color: 'bg-success' },
];

interface Assignment {
  id: string;
  title: string;
  course: string;
  due: string;
  status: 'em-dia' | 'atrasado' | 'concluido';
  progress: number;
}

const ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Integrals problem set', course: 'Calculus II', due: 'Jun 15', status: 'em-dia', progress: 60 },
  { id: '2', title: 'Renaissance essay', course: 'Art History', due: 'Jun 12', status: 'atrasado', progress: 25 },
  { id: '3', title: 'Final React project', course: 'Web Programming', due: 'Jun 20', status: 'em-dia', progress: 90 },
  { id: '4', title: 'Chapter 4 summary', course: 'Web Programming', due: 'Jun 08', status: 'concluido', progress: 100 },
];

const STATUS_TONE = {
  'em-dia': { tone: 'info' as const, label: 'On track' },
  atrasado: { tone: 'danger' as const, label: 'Overdue' },
  concluido: { tone: 'success' as const, label: 'Completed' },
};

function AssignmentsTable() {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'due', dir: 'asc' });
  const columns: Column<Assignment>[] = [
    { key: 'title', header: 'Assignment', sortable: true, render: (r) => (
      <Stack gap={0}>
        <span className="font-medium text-ink">{r.title}</span>
        <span className="text-caption text-ink-secondary">{r.course}</span>
      </Stack>
    ) },
    { key: 'due', header: 'Due', sortable: true, render: (r) => (
      <Inline gap={1}><Clock aria-hidden className="size-3.5 text-ink-secondary" />{r.due}</Inline>
    ) },
    { key: 'status', header: 'Status', render: (r) => (
      <Badge tone={STATUS_TONE[r.status].tone}>{STATUS_TONE[r.status].label}</Badge>
    ) },
    { key: 'progress', header: 'Progress', align: 'end', render: (r) => (
      <div className="w-32"><Progress variant="linear" value={r.progress} max={100} showValue /></div>
    ) },
  ];
  return (
    <Table
      rowKey={(r) => r.id}
      columns={columns}
      rows={ASSIGNMENTS}
      sort={sort}
      onSort={(key) => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))}
      density="comfortable"
    />
  );
}

/* ─────────── the portal "screen" ─────────── */
function StudentPortal() {
  const [active, setActive] = useState('dashboard');
  const [view, setView] = useState<'semana' | 'mes'>('semana'); // 'semana' = week, 'mes' = month

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-page shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-6 border-r border-border bg-card p-5 lg:flex">
          <Inline gap={2}>
            <span className="grid size-9 place-items-center rounded-md bg-brand text-on-brand font-bold">G</span>
            <span className="text-h3 font-bold text-ink">GOFI Edu</span>
          </Inline>
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
          <button
            type="button"
            className="mt-auto flex items-center gap-3 rounded-pill px-4 py-2.5 text-body-sm text-ink-secondary transition-colors hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <Settings aria-hidden className="size-5" />
            Settings
          </button>
        </aside>

        {/* Content */}
        <div className="flex flex-col">
          {/* Top bar */}
          <header className="flex items-center gap-4 border-b border-border bg-card px-5 py-3">
            <div className="flex h-10 flex-1 items-center gap-2 rounded-pill border border-border bg-page px-4">
              <Search aria-hidden className="size-4 text-ink-secondary" />
              <input
                type="search"
                placeholder="Search courses, assignments…"
                aria-label="Search"
                className="min-w-0 flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-ink-secondary"
              />
            </div>
            <div className="relative">
              <IconButton variant="ghost" aria-label="Notifications (3 unread)">
                <Bell className="size-5" />
              </IconButton>
              <span className="absolute -right-0.5 -top-0.5">
                <NotificationBadge count={3} />
              </span>
            </div>
            <Menu
              trigger={
                <button type="button" className="flex items-center gap-2 rounded-pill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                  <Avatar name="Ana Souza" size="md" />
                </button>
              }
              align="end"
              items={[
                { id: 'profile', label: 'My profile', onSelect: () => {} },
                { id: 'settings', label: 'Settings', onSelect: () => {} },
                { id: 'logout', label: 'Sign out', danger: true, onSelect: () => {} },
              ]}
            />
          </header>

          {/* Body */}
          <div className="flex flex-col gap-6 p-5 md:p-6">
            {/* Brand hero */}
            <Card variant="brand">
              <Inline justify="between" align="start">
                <Stack gap={2}>
                  <span className="text-caption font-semibold uppercase tracking-wider">Welcome back</span>
                  <CardTitle>Hi, Ana 👋</CardTitle>
                  <p className="max-w-md text-body-sm">
                    You've completed 78% of this week's assignments. 2 deliverables left by Friday.
                  </p>
                </Stack>
                <Button variant="primary" iconStart={<Plus className="size-4" />}>New assignment</Button>
              </Inline>
            </Card>

            {/* Stats */}
            <Grid min="200px" gap={4}>
              {STATS.map((s) => (
                <Card key={s.label}>
                  <Inline justify="between" align="start">
                    <Stack gap={1}>
                      <span className="text-body-sm text-ink-secondary">{s.label}</span>
                      <span className="text-h1 text-ink">{s.value}</span>
                      <span className="text-caption text-success">{s.trend}</span>
                    </Stack>
                    <span className="grid size-10 place-items-center rounded-md bg-sunken text-action">
                      <s.icon aria-hidden className="size-5" />
                    </span>
                  </Inline>
                </Card>
              ))}
            </Grid>

            {/* Courses + schedule */}
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <Card>
                <Inline justify="between">
                  <CardTitle>My courses</CardTitle>
                  <SegmentedControl
                    value={view}
                    onChange={setView}
                    options={[{ value: 'semana', label: 'Week' }, { value: 'mes', label: 'Month' }]}
                  />
                </Inline>
                <Stack gap={4}>
                  {COURSES.map((c) => (
                    <div key={c.name} className="flex flex-col gap-2 rounded-lg border border-border p-4">
                      <Inline justify="between">
                        <Inline gap={2}>
                          <span className={cn('size-9 rounded-md', c.color)} aria-hidden />
                          <Stack gap={0}>
                            <span className="font-medium text-ink">{c.name}</span>
                            <Tag>{c.cat}</Tag>
                          </Stack>
                        </Inline>
                        <IconButton aria-label={`Actions for ${c.name}`} size="sm"><MoreVertical className="size-4" /></IconButton>
                      </Inline>
                      <Progress variant="linear" value={c.done} max={c.total} showValue label={`Progress in ${c.name}`} />
                    </div>
                  ))}
                </Stack>
              </Card>

              <Card>
                <CardTitle>Upcoming classes</CardTitle>
                <Stack gap={3}>
                  {[
                    { t: '09:00', n: 'Calculus II', r: 'Room 204' },
                    { t: '11:00', n: 'Art History', r: 'Auditorium' },
                    { t: '14:30', n: 'Web Programming', r: 'Lab 3' },
                  ].map((a) => (
                    <Inline key={a.n} gap={3} className="rounded-lg bg-sunken p-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-md bg-card text-caption font-semibold text-action tabular-nums">
                        {a.t}
                      </span>
                      <Stack gap={0}>
                        <span className="font-medium text-ink">{a.n}</span>
                        <span className="text-caption text-ink-secondary">{a.r}</span>
                      </Stack>
                    </Inline>
                  ))}
                  <AvatarStack
                    max={4}
                    items={[
                      { name: 'João Lima' }, { name: 'Maria Reis' }, { name: 'Pedro Sá' },
                      { name: 'Lia Nunes' }, { name: 'Rui Alves' }, { name: 'Bia Costa' },
                    ]}
                  />
                </Stack>
              </Card>
            </div>

            {/* Assignments table */}
            <Card>
              <CardTitle>Recent assignments</CardTitle>
              <AssignmentsTable />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShowcasePage() {
  return (
    <DocPage
      group="Patterns"
      title="App Shell - Student Portal"
      lead="The components brought together in a real screen: navigation sidebar, top bar with search and notifications, brand hero, progress cards, schedule and a rich table — faithful to the reference model."
      source="patterns/app-shell.md"
    >
      <Callout tone="info">
        This screen uses <strong>only</strong> design system components and tokens — no literals.
        Toggle the theme at the top to view it in light and dark.
      </Callout>
      <DocSection title="Overview">
        <StudentPortal />
      </DocSection>
    </DocPage>
  );
}
