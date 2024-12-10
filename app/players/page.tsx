'use client'

import { useSheetStore } from "@/store/Sheet"
import PlayersTable from "@/components/players/PlayersTable"

export default function Players() {
  return (
    <div>
      <PlayersTable />
    </div>
  )
}
