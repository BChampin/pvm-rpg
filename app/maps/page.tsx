'use client';

import { PiGridFour, PiList } from 'react-icons/pi';
import { Select, SelectItem, Switch } from '@nextui-org/react';
import MapsCards from '@/components/maps/MapsCards';
import MapsTable from '@/components/maps/MapsTable';
import { useLocalization } from '@/store/Localization';
import { useSheetStore } from '@/store/Sheet';
import { useState } from 'react';

export default function Maps() {
  const { i18n } = useLocalization();
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
      <div className="flex items-center justify-between my-2 px-4">
        <div className="font-bold text-3xl">{i18n('nav.maps')}</div>
        <div className="flex nowrap">
          <Switch
            isSelected={isTableView}
            onValueChange={setIsTableView}
            size="lg"
            color="primary"
            startContent={<PiList />}
            endContent={<PiGridFour />}
          />
          <Select
            className="max-w-xs min-w-[200px] text-white"
            label={i18n('nav.orderBy')}
            items={sortOptions}
            selectedKeys={[sortMethod]}
            variant="bordered"
            onChange={(option) => setSortMethod(option.target.value)}
          >
            {sortOptions.map((sortOption) => (
              <SelectItem className="text-white" key={sortOption.value}>
                {sortOption.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      {isTableView ? <MapsTable /> : <MapsCards />}
    </div>
  );
}
