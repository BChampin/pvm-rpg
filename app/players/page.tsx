'use client'

import { Suspense } from "react"
import PlayersTable from "@/components/players/PlayersTable"

export default function Players() {
  return (
    <div>
      <div className="p-4">
        <Suspense fallback={<div>Loading...</div>}>
          <PlayersTable />
        </Suspense>
      </div>
    </div>
  )
}
