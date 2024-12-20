import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import GradeChip from '@/components/chips/GradeChip';
import { Map } from '@/types/Sheet';
import { timeNumberToStr } from '@/utils';
import { useSheetStore } from '@/store/Sheet';

export default function MapsTable() {
  const { maps, loading, error } = useSheetStore();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const columns = [
    { key: 'label', label: 'Map' },
    { key: 'grade.label', label: 'Grade' },
    { key: 'times.alien', label: 'Alien' },
    { key: 'times.player', label: 'Player' },
    { key: 'times.intermediate', label: 'Intermediate' },
    { key: 'times.noob', label: 'Noob' },
    { key: 'exchange.author', label: 'Author' },
    { key: 'exchange.link', label: 'Link' },
  ];

  return (
    <Table isStriped aria-label="Maps table" className="text-white">
      <TableHeader columns={columns}>
        {(column: { key: string; label: string }) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody items={maps}>
        {(map: Map) => (
          <TableRow key={map.label}>
            <TableCell>
              <div className="font-bold">{map.label}</div>
            </TableCell>
            <TableCell>
              <div>{map.grade && <GradeChip grade={map.grade} />}</div>
            </TableCell>
            <TableCell>
              <div>{timeNumberToStr(map.times.alien)}</div>
            </TableCell>
            <TableCell>
              <div>{timeNumberToStr(map.times.player)}</div>
            </TableCell>
            <TableCell>
              <div>{timeNumberToStr(map.times.intermediate)}</div>
            </TableCell>
            <TableCell>
              <div>{timeNumberToStr(map.times.noob)}</div>
            </TableCell>
            <TableCell>
              <div>{map.exchange.author}</div>
            </TableCell>
            <TableCell>
              <div className="flex">
                <Link isExternal showAnchorIcon href={map.exchange.link}>
                  TMX
                </Link>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
