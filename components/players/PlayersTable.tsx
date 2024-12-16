'use client'

import React, { useState } from "react"
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Selection,
  Pagination,
  SortDescriptor,
} from "@nextui-org/react"

import { SearchIcon, ChevronDownIcon } from "@/components/svg/Svg"
import { useSheetStore } from "@/store/Sheet"
import { Player } from "@/types/Sheet"
import { useSearchParams } from 'next/navigation'
import FameChip from "@/components/chips/FameChip"

const columns = [
  {name: "NAME", uid: "name", sortable: true},
  {name: "CATEGORY", uid: "category", sortable: true},
  {name: "FAME", uid: "fame" },
  {name: "MAPS DONE", uid: "mapsDone", sortable: true},
]

export default function PlayersTable () {
  const { players } = useSheetStore()

  const categoryOptions = [
    { name: `Alien - ${players.filter(player => player.category === 'Alien').length}`, uid: "Alien" },
    { name: `Player - ${players.filter(player => player.category === 'Player').length}`, uid: "Player" },
    { name: `Novice - ${players.filter(player => player.category === 'Novice').length}`, uid: "Novice" },
  ]

  const [filterValue, setFilterValue] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<Selection>(new Set(categoryOptions.map(cat => cat.uid)))
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "noSort",
    direction: "ascending",
  })
  const [rowsPerPage] = useState(20)
  const [page, setPage] = useState(1)

  const filteredItems = React.useMemo(() => {
    let filteredPlayers = [...players]

    if (!!filterValue) {
      filteredPlayers = filteredPlayers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      )
    }

    if (Array.from(categoryFilter).length !== categoryOptions.length) {
      filteredPlayers = filteredPlayers.filter(player => Array.from(categoryFilter).includes(player.category))
    }

    return filteredPlayers
  }, [players, filterValue, categoryFilter])
  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Player, b: Player) => {
      const first = a[sortDescriptor.column as keyof Player] as number
      const second = b[sortDescriptor.column as keyof Player] as number
      const cmp = first < second ? -1 : first > second ? 1 : 0
      return sortDescriptor.direction === "descending" ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) setFilterValue(value)
    else setFilterValue("")
  }, [])

  const onClear = React.useCallback(() => {
    setFilterValue("")
  }, [])

  // Set from query on load
  const searchParams = useSearchParams()
  const queryPlayer = searchParams.get('player')
  if (queryPlayer && !filterValue.length) setFilterValue(queryPlayer)


  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Category
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
                  <DropdownItem key={categoryOption.uid} className="capitalize">
                    {categoryOption.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total : {players.length} players</span>
        </div>
      </div>
    )
  }, [
    filterValue,
    categoryFilter,
    onSearchChange,
    players.length,
  ])

  const bottomContent = React.useMemo(() => {
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
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [items.length, page, pages, filterValue, onPreviousPage, onNextPage])


  return (
    <Table
      isHeaderSticky
      aria-label="Players Table"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      isVirtualized
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No players found"} items={sortedItems}>
        {(player) => (
          <TableRow key={player.id}>
            <TableCell>
              <div className="font-bold">
                {player.name}
              </div>
            </TableCell>
            <TableCell>
              <p className="text-bold text-small capitalize">
                {player.category}
              </p>
            </TableCell>
            <TableCell>
              {player.fames?.alien && <FameChip fame={player.fames.alien} />}
              {player.fames?.player && <FameChip fame={player.fames.player} />}
              {player.fames?.intermediate && <FameChip fame={player.fames.intermediate} />}
              {player.fames?.noob && <FameChip fame={player.fames.noob} />}
            </TableCell>
            <TableCell>
              <span>
                {player.nbRecords}
              </span>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
