import { Avatar, AvatarStack } from '@/components/Avatar';
import { Inline } from '@/components/Layout';
import { DocPage, DocSection, Example, PropsTable, DoDont, type PropRow } from '../components';

const people = [
  { name: 'Ana Lima', src: 'https://i.pravatar.cc/150?u=ana' },
  { name: 'Bruno Souza', src: 'https://i.pravatar.cc/150?u=bruno' },
  { name: 'Carla Neves', src: 'https://i.pravatar.cc/150?u=carla' },
  { name: 'Diego Prado' },
  { name: 'Elaine Roque' },
];

const avatarProps: PropRow[] = [
  { name: 'name', type: 'string', required: true, description: 'Person\'s name — used in aria-label and to generate the initials.' },
  { name: 'src', type: 'string', description: 'Image URL. Falls back to initials if it fails or is omitted.' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size: 24 / 32 / 40 / 48 / 64px.' },
  { name: 'status', type: "'online' | 'offline'", description: 'Presence indicator at the bottom-right corner.' },
];

const avatarStackProps: PropRow[] = [
  { name: 'items', type: 'AvatarProps[]', required: true, description: 'List of avatars to display.' },
  { name: 'max', type: 'number', default: '3', description: 'Maximum visible; overflow becomes "+N".' },
];

export function AvatarPage() {
  return (
    <DocPage
      group="Atoms"
      title="Avatar"
      lead="Represents a person or entity. Displays an image with automatic fallback to colored initials."
      source="components/avatar.md"
    >
      <DocSection title="Sizes">
        <Example
          align="center"
          code={`<Avatar name="Ana Lima" size="xs" />
<Avatar name="Bruno Souza" size="sm" />
<Avatar name="Carla Neves" size="md" />
<Avatar name="Diego Prado" size="lg" />
<Avatar name="Elaine Roque" size="xl" />`}
        >
          <Inline>
            <Avatar name="Ana Lima" size="xs" />
            <Avatar name="Bruno Souza" size="sm" />
            <Avatar name="Carla Neves" size="md" />
            <Avatar name="Diego Prado" size="lg" />
            <Avatar name="Elaine Roque" size="xl" />
          </Inline>
        </Example>
      </DocSection>

      <DocSection title="Image and fallback to initials" description="When the image is available it is shown; otherwise the initials appear over a color derived from the name.">
        <Example
          align="center"
          code={`<Avatar name="Ana Lima" src="https://i.pravatar.cc/150?u=ana" />
<Avatar name="Bruno Souza" src="https://i.pravatar.cc/150?u=bruno" />
<Avatar name="Carla Neves" />
<Avatar name="Diego Prado" />`}
        >
          <Inline>
            <Avatar name="Ana Lima" src="https://i.pravatar.cc/150?u=ana" />
            <Avatar name="Bruno Souza" src="https://i.pravatar.cc/150?u=bruno" />
            <Avatar name="Carla Neves" />
            <Avatar name="Diego Prado" />
          </Inline>
        </Example>
      </DocSection>

      <DocSection title="Status indicator" description="Online/offline dot at the bottom-right corner with its own aria-label.">
        <Example
          align="center"
          code={`<Avatar name="Ana Lima" status="online" />
<Avatar name="Bruno Souza" status="offline" />
<Avatar name="Carla Neves" src="https://i.pravatar.cc/150?u=carla" status="online" />`}
        >
          <Inline>
            <Avatar name="Ana Lima" status="online" />
            <Avatar name="Bruno Souza" status="offline" />
            <Avatar name="Carla Neves" src="https://i.pravatar.cc/150?u=carla" status="online" />
          </Inline>
        </Example>
      </DocSection>

      <DocSection title="AvatarStack" description='Overlapping group with a "+N" counter for overflow.'>
        <Example
          align="center"
          code={`<AvatarStack max={3} items={[
  { name: 'Ana Lima', src: 'https://i.pravatar.cc/150?u=ana' },
  { name: 'Bruno Souza', src: 'https://i.pravatar.cc/150?u=bruno' },
  { name: 'Carla Neves', src: 'https://i.pravatar.cc/150?u=carla' },
  { name: 'Diego Prado' },
  { name: 'Elaine Roque' },
]} />`}
        >
          <AvatarStack max={3} items={people} />
        </Example>
      </DocSection>

      <DocSection title="Best practices">
        <DoDont
          dos={[
            'Always provide the name: it is used in the aria-label and to generate the initials.',
            'Use src for a real image and let the initials fallback do its job.',
            'Status by color + aria-label (don\'t rely on the colored dot alone).',
          ]}
          donts={[
            'Avatar as the only clickable identifier without an accessible label.',
            'A broken image without a fallback — the component handles it, but don\'t replace src with an empty string.',
          ]}
        />
      </DocSection>

      <DocSection title="Properties">
        <PropsTable title="AvatarProps" rows={avatarProps} />
        <PropsTable title="AvatarStackProps" rows={avatarStackProps} />
      </DocSection>
    </DocPage>
  );
}
