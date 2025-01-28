import { Chip } from '@heroui/react';
import { Fame } from '@/types/Sheet';

export default function FameChip({ fame }: { fame: Fame }) {
  return (
    <Chip
      size="md"
      variant="flat"
      classNames={{
        base: `bg-${fame?.color ?? 'white'}`,
        content: `text-${fame?.text ?? 'black'}`,
      }}
    >
      {fame?.label}
    </Chip>
  );
}
