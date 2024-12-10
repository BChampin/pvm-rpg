'use client'

import { useState } from "react"
import { useSheetStore } from "@/store/Sheet"
import { Avatar, Chip, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User } from "@nextui-org/react"
import { Player } from "@/types/Sheet"

export default function PlayersTable() {
  const { players, timeRecords } = useSheetStore()

  const [playerCategory, setPlayerCategory] = useState('all')
  const playerCategoryOptions = [
    { label: 'Alien', value: 'Alien' },
    { label: 'Player', value: 'Player' },
    { label: 'Novice', value: 'Novice' },
    { label: 'All', value: 'all' },
  ]

  const columns = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "nbMapDone", label: "Maps done" },
  ]

  // { players.filter(player => player.category === playerCategory || playerCategory === 'all').length }

  return (
    <div>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div>
          Players : { players.length }
        </div>
        <User
          avatarProps={{ name: String(players.filter(player => player.category === 'Alien').length) }}
          name="Aliens"
        />
        <User
          avatarProps={{ name: String(players.filter(player => player.category === 'Player').length) }}
          name="Player"
        />
        <User
          avatarProps={{ name: String(players.filter(player => player.category === 'Novice').length) }}
          name="Novices"
        />

        <div>
          Times : { timeRecords.length }
        </div>
        <Select
          className="max-w-xs"
          label="Category"
          items={playerCategoryOptions}
          selectedKeys={[playerCategory]}
          variant="bordered"
          onChange={(option) => setPlayerCategory(option.target.value)}
        >
          {playerCategoryOptions.map((playerCategoryOption) => (
            <SelectItem key={playerCategoryOption.value}>{playerCategoryOption.label}</SelectItem>
          ))}
        </Select>
      </div>

      <Table isStriped aria-label="Players table">
        <TableHeader columns={columns}>
          {(column: { key: string, label: string }) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={players}>
          {(player: Player) => (
            <TableRow key={player.id}>
              <TableCell>
                <div className="font-bold">
                  {player.name}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  {player.category}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  {timeRecords.filter(t => t.playerId === player.id).length}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
