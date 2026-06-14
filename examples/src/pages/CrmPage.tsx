import { useEffect, useRef, useState } from 'react';
import { Plus, Search, MoreVertical, Mail, Building2, Users, Inbox } from 'lucide-react';
import { Avatar } from '@/components/Avatar';
import { Button, IconButton } from '@/components/Button';
import { Badge, Tag } from '@/components/Badge';
import { Card, CardTitle } from '@/components/Card';
import { Menu } from '@/components/Menu';
import { Drawer, ConfirmDialog } from '@/components/Modal';
import { Field } from '@/components/Field';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Select } from '@/components/Select';
import { MultiSelect } from '@/components/Select';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Table, type Column } from '@/components/Table';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Feedback';
import { useToast } from '@/components/Toast';
import { Stack, Inline, Grid } from '@/components/Layout';
import { DocPage, DocSection, Callout, Prose } from '../components';

/* ───────────── model ───────────── */
type Status = 'lead' | 'ativo' | 'inativo';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: Status;
  tags: string[];
  value: number;
  notes?: string;
}

const COMPANIES = ['Acme Inc.', 'Globex', 'Initech', 'Umbrella', 'Soylent'];
const TAGS = ['Hot', 'Cold', 'VIP', 'Renewal', 'Partner', 'Referral'];
const STATUS_META: Record<Status, { label: string; tone: 'info' | 'success' | 'neutral' }> = {
  lead: { label: 'Lead', tone: 'info' },
  ativo: { label: 'Active', tone: 'success' },
  inativo: { label: 'Inactive', tone: 'neutral' },
};

const SEED: Contact[] = [
  { id: '1', name: 'Ana Beatriz Lima', email: 'ana.lima@acme.com', company: 'Acme Inc.', status: 'ativo', tags: ['VIP', 'Renewal'], value: 48000 },
  { id: '2', name: 'Carlos Mendes', email: 'carlos@globex.com', company: 'Globex', status: 'lead', tags: ['Hot'], value: 12500 },
  { id: '3', name: 'Daniela Rocha', email: 'dani.rocha@initech.io', company: 'Initech', status: 'ativo', tags: ['Partner'], value: 86000 },
  { id: '4', name: 'Eduardo Souza', email: 'edu@umbrella.com', company: 'Umbrella', status: 'inativo', tags: ['Cold'], value: 3000 },
  { id: '5', name: 'Fernanda Dias', email: 'fer.dias@soylent.com', company: 'Soylent', status: 'lead', tags: ['Referral', 'Hot'], value: 22000 },
];

const brl = (v: number) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/* ───────────── form (create/edit) ───────────── */
interface FormState {
  name: string;
  email: string;
  company: string | null;
  status: Status;
  tags: string[];
  value: string;
  notes: string;
}

const EMPTY_FORM: FormState = { name: '', email: '', company: null, status: 'lead', tags: [], value: '', notes: '' };

function ContactForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: Contact | null;
  onSubmit: (data: Omit<Contact, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    initial
      ? { name: initial.name, email: initial.email, company: initial.company, status: initial.status, tags: initial.tags, value: String(initial.value), notes: initial.notes ?? '' }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState<{ name?: string; email?: string; company?: string }>({});

  const set = <K extends keyof FormState>(key: K, v: FormState[K]) => setForm((f) => ({ ...f, [key]: v }));

  const submit = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = 'Enter the contact name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.';
    if (!form.company) next.company = 'Select a company.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company!,
      status: form.status,
      tags: form.tags,
      value: Number(form.value) || 0,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex h-full flex-col"
    >
      <Stack gap={5} className="flex-1">
        <Field label="Name" htmlFor="c-name" required error={errors.name}>
          <Input id="c-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Email" htmlFor="c-email" required error={errors.email}>
          <Input id="c-email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="contact@company.com" iconStart={<Mail className="size-4" />} />
        </Field>
        <Field label="Company" htmlFor="c-company" required error={errors.company}>
          <Select
            id="c-company"
            value={form.company}
            onChange={(v) => set('company', v)}
            options={COMPANIES.map((c) => ({ value: c, label: c }))}
            placeholder="Select a company"
            searchable
          />
        </Field>
        <Field label="Status" htmlFor="c-status">
          <Select
            id="c-status"
            value={form.status}
            onChange={(v) => set('status', v as Status)}
            options={(Object.keys(STATUS_META) as Status[]).map((s) => ({ value: s, label: STATUS_META[s].label }))}
          />
        </Field>
        <Field label="Tags" htmlFor="c-tags" hint="Multiple selection — classify the contact.">
          <MultiSelect
            id="c-tags"
            value={form.tags}
            onChange={(v) => set('tags', v)}
            options={TAGS.map((t) => ({ value: t, label: t }))}
            placeholder="Add tags"
            searchable
          />
        </Field>
        <Field label="Deal value ($)" htmlFor="c-value">
          <Input id="c-value" type="number" value={form.value} onChange={(e) => set('value', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Notes" htmlFor="c-notes" hint="Internal context about the contact (optional).">
          <Textarea id="c-notes" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Notes…" />
        </Field>
      </Stack>
      <Inline justify="end" gap={3} className="border-t border-border pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">{initial ? 'Save changes' : 'Create contact'}</Button>
      </Inline>
    </form>
  );
}

/* ───────────── CRM app ───────────── */
function CrmApp() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>(SEED);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'todos'>('todos'); // 'todos' = all
  const [view, setView] = useState<'cards' | 'table'>('cards');

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [toDelete, setToDelete] = useState<Contact | null>(null);
  const idRef = useRef(SEED.length);

  // simulate initial loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = contacts.filter((c) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q);
    const matchS = statusFilter === 'todos' || c.status === statusFilter;
    return matchQ && matchS;
  });

  const openCreate = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (c: Contact) => {
    setEditing(c);
    setDrawerOpen(true);
  };

  const handleSubmit = (data: Omit<Contact, 'id'>) => {
    if (editing) {
      setContacts((cs) => cs.map((c) => (c.id === editing.id ? { ...data, id: editing.id } : c)));
      toast({ tone: 'success', message: `Contact "${data.name}" updated.` });
    } else {
      const id = String(++idRef.current);
      setContacts((cs) => [{ ...data, id }, ...cs]);
      toast({ tone: 'success', message: `Contact "${data.name}" created.` });
    }
    setDrawerOpen(false);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const removed = toDelete;
    setContacts((cs) => cs.filter((c) => c.id !== removed.id));
    setToDelete(null);
    toast({
      tone: 'success',
      message: `"${removed.name}" deleted.`,
      action: { label: 'Undo', onClick: () => setContacts((cs) => [removed, ...cs]) },
    });
  };

  const rowMenu = (c: Contact) => [
    { id: 'edit', label: 'Edit', onSelect: () => openEdit(c) },
    { id: 'del', label: 'Delete', danger: true, onSelect: () => setToDelete(c) },
  ];

  const columns: Column<Contact>[] = [
    {
      key: 'name',
      header: 'Contact',
      sortable: true,
      render: (c) => (
        <Inline gap={2}>
          <Avatar name={c.name} size="sm" />
          <Stack gap={0}>
            <span className="font-medium text-ink">{c.name}</span>
            <span className="text-caption text-ink-secondary">{c.email}</span>
          </Stack>
        </Inline>
      ),
    },
    { key: 'company', header: 'Company', sortable: true, render: (c) => <span className="text-body-sm text-ink">{c.company}</span> },
    { key: 'status', header: 'Status', render: (c) => <Badge tone={STATUS_META[c.status].tone}>{STATUS_META[c.status].label}</Badge> },
    { key: 'value', header: 'Value', align: 'end', sortable: true, render: (c) => <span className="font-medium text-ink">{brl(c.value)}</span> },
    {
      key: 'id',
      header: '',
      align: 'end',
      render: (c) => (
        <Menu trigger={<IconButton aria-label={`Actions for ${c.name}`} size="sm"><MoreVertical className="size-4" /></IconButton>} align="end" items={rowMenu(c)} />
      ),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-page shadow-lg">
      {/* app header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-4">
        <Inline gap={2}>
          <span className="grid size-9 place-items-center rounded-lg bg-brand text-on-brand"><Users className="size-5" /></span>
          <Stack gap={0}>
            <span className="text-h3 font-bold text-ink">GOFI CRM</span>
            <span className="text-caption text-ink-secondary">{contacts.length} contacts</span>
          </Stack>
        </Inline>
        <Button variant="primary" iconStart={<Plus className="size-4" />} onClick={openCreate}>New contact</Button>
      </header>

      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-card px-5 py-3">
        <div className="flex h-10 min-w-52 flex-1 items-center gap-2 rounded-pill border border-border bg-page px-4">
          <Search aria-hidden className="size-4 text-ink-secondary" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or company…"
            aria-label="Search contacts"
            className="min-w-0 flex-1 bg-transparent text-body-sm text-ink outline-none placeholder:text-ink-secondary"
          />
        </div>
        <div className="w-44">
          <Select
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as Status | 'todos')}
            options={[
              { value: 'todos', label: 'All statuses' },
              { value: 'lead', label: 'Lead' },
              { value: 'ativo', label: 'Active' },
              { value: 'inativo', label: 'Inactive' },
            ]}
          />
        </div>
        <SegmentedControl
          value={view}
          onChange={setView}
          options={[{ value: 'cards', label: 'Cards' }, { value: 'table', label: 'Table' }]}
        />
      </div>

      {/* body */}
      <div className="p-5">
        {loading ? (
          <Grid min="260px" gap={4}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}><Skeleton lines={4} height={16} /></Card>
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <EmptyState
            variant={query || statusFilter !== 'todos' ? 'no-results' : 'first-use'}
            icon={<Inbox className="size-8" />}
            title={query || statusFilter !== 'todos' ? `No contacts found` : 'No contacts yet'}
            description={query || statusFilter !== 'todos' ? 'Adjust the search or filters.' : 'Create your first contact to get started.'}
            action={
              query || statusFilter !== 'todos' ? (
                <Button variant="secondary" onClick={() => { setQuery(''); setStatusFilter('todos'); }}>Clear filters</Button>
              ) : (
                <Button variant="primary" iconStart={<Plus className="size-4" />} onClick={openCreate}>New contact</Button>
              )
            }
          />
        ) : view === 'cards' ? (
          <Grid min="260px" gap={4}>
            {filtered.map((c) => (
              <Card key={c.id}>
                <Inline justify="between" align="start">
                  <Inline gap={2}>
                    <Avatar name={c.name} size="md" />
                    <Stack gap={0}>
                      <CardTitle>{c.name}</CardTitle>
                      <span className="text-caption text-ink-secondary">{c.email}</span>
                    </Stack>
                  </Inline>
                  <Menu trigger={<IconButton aria-label={`Actions for ${c.name}`} size="sm"><MoreVertical className="size-4" /></IconButton>} align="end" items={rowMenu(c)} />
                </Inline>
                <Inline gap={2}>
                  <Inline gap={1}><Building2 className="size-4 text-ink-secondary" /><span className="text-body-sm text-ink-secondary">{c.company}</span></Inline>
                  <Badge tone={STATUS_META[c.status].tone}>{STATUS_META[c.status].label}</Badge>
                </Inline>
                <Inline gap={1}>{c.tags.map((t) => <Tag key={t}>{t}</Tag>)}</Inline>
                <Inline justify="between" align="center" className="border-t border-border pt-3">
                  <span className="text-caption text-ink-secondary">Deal value</span>
                  <span className="text-h3 text-ink">{brl(c.value)}</span>
                </Inline>
              </Card>
            ))}
          </Grid>
        ) : (
          <Card variant="outlined" className="p-0">
            <Table rowKey={(c) => c.id} columns={columns} rows={filtered} />
          </Card>
        )}
      </div>

      {/* Create/edit drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? 'Edit contact' : 'New contact'}
        side="right"
        size="md"
      >
        <ContactForm initial={editing} onSubmit={handleSubmit} onCancel={() => setDrawerOpen(false)} />
      </Drawer>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title={`Delete ${toDelete?.name ?? ''}?`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={confirmDelete}
      >
        This action removes the contact from the list. You can undo right after.
      </ConfirmDialog>
    </div>
  );
}

export function CrmPage() {
  return (
    <DocPage
      group="Templates"
      title="GOFI CRM - Full CRUD"
      lead="An example system (CRM) using every feature: list in cards or table, create/edit in a form (drawer) with multiple selection, delete with confirmation and undo, search, filters and the 4 states."
      source="patterns/forms.md"
    >
      <Callout tone="info">
        Everything works live: create, edit and delete contacts, switch between <strong>Cards</strong> and
        <strong> Table</strong>, filter and search. The data lives in the example's local state.
      </Callout>
      <DocSection title="Template">
        <CrmApp />
      </DocSection>
      <DocSection title="What it demonstrates">
        <Prose>
          <ul className="flex list-inside list-disc flex-col gap-1">
            <li><strong>Listing</strong> in <em>cards</em> (responsive grid) with toggle to <em>table</em> (SegmentedControl).</li>
            <li><strong>Create / Edit</strong> in a <em>Drawer</em> with Field + Input + Select + <strong>MultiSelect</strong> (tags) + Textarea, with validation on submit.</li>
            <li><strong>Delete</strong> with <em>ConfirmDialog</em> (destructive) + <em>Toast</em> with “Undo”.</li>
            <li><strong>Search</strong>, <strong>filter</strong> by status and the <strong>4 states</strong> (loading skeleton, empty first-use × no-results, success).</li>
          </ul>
        </Prose>
      </DocSection>
    </DocPage>
  );
}
