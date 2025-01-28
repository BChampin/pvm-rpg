'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { ChevronDownIcon, SearchIcon } from '@/components/svg/Svg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FameChip from '@/components/chips/FameChip';
import { PiArrowsOutSimple } from 'react-icons/pi';
import { Player } from '@/types/Sheet';
import { useLocalization } from '@/store/Localization';
import { useSearchParams } from 'next/navigation';
import { useSheetStore } from '@/store/Sheet';

export default function PlayersTable() {
  const { players, setModalPlayer } = useSheetStore();
  const { i18n } = useLocalization();

  const columns = [
    { name: i18n('players.name').toUpperCase(), uid: 'name', sortable: true },
    {
      name: i18n('nav.category').toUpperCase(),
      uid: 'category',
      sortable: true,
    },
    { name: 'FAME', uid: 'fame' },
    {
      name: i18n('players.times').toUpperCase(),
      uid: 'mapsDone',
      sortable: true,
    },
  ];

  const categoryOptions = useMemo(() => {
    return [
      {
        name: `Alien - ${players.filter((player) => player.category === 'Alien').length}`,
        uid: 'Alien',
      },
      {
        name: `Player - ${players.filter((player) => player.category === 'Player').length}`,
        uid: 'Player',
      },
      {
        name: `Novice - ${players.filter((player) => player.category === 'Novice').length}`,
        uid: 'Novice',
      },
    ];
  }, [players]);

  const [filterValue, setFilterValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Selection>(
    new Set(categoryOptions.map((cat) => cat.uid))
  );
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'noSort',
    direction: 'ascending',
  });
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    let filteredPlayers = [...players];

    if (filterValue) {
      filteredPlayers = filteredPlayers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (Array.from(categoryFilter).length !== categoryOptions.length) {
      filteredPlayers = filteredPlayers.filter((player) =>
        Array.from(categoryFilter).includes(player.category)
      );
    }

    return filteredPlayers;
  }, [players, filterValue, categoryFilter, categoryOptions.length]);
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Player, b: Player) => {
      const first = a[sortDescriptor.column as keyof Player] as number;
      const second = b[sortDescriptor.column as keyof Player] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) setFilterValue(value);
    else setFilterValue('');
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
  }, []);

  // Set from query on load
  const hasRunEffect = useRef(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    if (hasRunEffect.current) return;
    const queryPlayer = searchParams.get('player');
    if (queryPlayer && !filterValue.length) {
      setFilterValue(queryPlayer);
      if (players && players.length > 0) {
        const toShowPlayer = players.find((player) =>
          player.name.toLowerCase().match(queryPlayer.toLowerCase())
        );
        if (toShowPlayer) setModalPlayer(toShowPlayer);
        hasRunEffect.current = true;
      }
    }
  }, [searchParams, players, filterValue.length, setModalPlayer]);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-3 items-end">
          <div className="flex items-center gap-2">
            <div className="font-bold text-3xl mr-3">{i18n('nav.players')}</div>
            <span className="text-default-400 text-small">
              Total : {players.length} {i18n('nav.players')}
            </span>
            <div className="flex sm:hidden">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    endContent={<ChevronDownIcon className="text-small" />}
                    variant="flat"
                  >
                    {i18n('nav.category')}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={categoryFilter}
                  selectionMode="multiple"
                  onSelectionChange={setCategoryFilter}
                >
                  {categoryOptions.map((categoryOption) => (
                    <DropdownItem
                      key={categoryOption.uid}
                      className="capitalize text-foreground"
                    >
                      {categoryOption.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={i18n('nav.searchBy')}
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="hidden sm:flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  {i18n('nav.category')}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={categoryFilter}
                selectionMode="multiple"
                onSelectionChange={setCategoryFilter}
              >
                {categoryOptions.map((categoryOption) => (
                  <DropdownItem
                    key={categoryOption.uid}
                    className="capitalize text-foreground"
                  >
                    {categoryOption.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    categoryFilter,
    onSearchChange,
    players.length,
    categoryOptions,
    onClear,
    i18n,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            {i18n('nav.previous')}
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            {i18n('nav.next')}
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, i18n, onNextPage]);

  return (
    <div>
      <Table
        isHeaderSticky
        aria-label="Players Table"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        isVirtualized
        onSortChange={setSortDescriptor}
        selectionBehavior="toggle"
        selectionMode="single"
        onRowAction={(key) => {
          const toShowPlayer = players.find((player) => player.id === key);
          if (toShowPlayer) setModalPlayer(toShowPlayer);
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No players found'} items={sortedItems}>
          {(player) => (
            <TableRow key={player.id}>
              <TableCell className="flex items-center">
                <Button
                  isIconOnly
                  aria-label="Open"
                  variant="light"
                  onPress={() => {
                    const toShowPlayer = players.find(
                      (allPlayer) => allPlayer.id === player.id
                    );
                    if (toShowPlayer) setModalPlayer(toShowPlayer);
                  }}
                >
                  <span className="text-lg">
                    <PiArrowsOutSimple />
                  </span>
                </Button>
                <div className="font-bold ml-2">{player.name}</div>
              </TableCell>
              <TableCell>
                <p className="text-bold text-small capitalize">
                  {player.category}
                </p>
              </TableCell>
              <TableCell>
                {
                  <FameChip
                    fame={
                      [
                        player.fames?.alien,
                        player.fames?.player,
                        player.fames?.intermediate,
                        player.fames?.noob,
                      ]
                        .filter((f) => !!f)
                        .sort((a, b) => (a.level >= b?.level ? -1 : 1))[0]
                    }
                  />
                }
              </TableCell>
              <TableCell>
                <span>{player.nbRecords}</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
