'use client';

import { PiGridFour, PiList } from 'react-icons/pi';
import { Select, SelectItem, Switch } from '@nextui-org/react';
import MapsCards from '@/components/maps/MapsCards';
import MapsTable from '@/components/maps/MapsTable';
import { useSheetStore } from '@/store/Sheet';
import { useState } from 'react';

export default function Maps() {
  const [isTableView, setIsTableView] = useState(false);
  const { sortMethod, setSortMethod } = useSheetStore();

  const sortOptions = [
    {
      label: 'Grade - Ascending',
      value: 'grade.ascending',
    },
    {
      label: 'Grade - Descending',
      value: 'grade.descending',
    },
    {
      label: 'Alphabetical - Ascending',
      value: 'alphabetical.ascending',
    },
    {
      label: 'Alphabetical - Descending',
      value: 'alphabetical.descending',
    },
    {
      label: 'Duration - Ascending',
      value: 'duration.ascending',
    },
    {
      label: 'Duration - Descending',
      value: 'duration.descending',
    },
  ];

  return (
    <div>
      Maps page
      <div className="row">
        <Switch
          isSelected={isTableView}
          onValueChange={setIsTableView}
          size="lg"
          color="primary"
          startContent={<PiList />}
          endContent={<PiGridFour />}
        />
        <Select
          className="max-w-xs"
          label="Sorting"
          items={sortOptions}
          selectedKeys={[sortMethod]}
          variant="bordered"
          onChange={(option) => setSortMethod(option.target.value)}
        >
          {sortOptions.map((sortOption) => (
            <SelectItem key={sortOption.value}>{sortOption.label}</SelectItem>
          ))}
        </Select>
      </div>
      {isTableView ? <MapsTable /> : <MapsCards />}
    </div>
  );
}
