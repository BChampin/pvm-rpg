'use client';

import PlayerModal from '@/components/players/PlayerModal';
import PlayersTable from '@/components/players/PlayersTable';
import { Suspense } from 'react';
import { useSheetStore } from '@/store/Sheet';

export default function Players() {
  const { modalPlayer } = useSheetStore();

  return (
    <div>
      <div className="p-4 text-primary">
        <Suspense fallback={<div>Loading...</div>}>
          <PlayersTable />
          {modalPlayer && <PlayerModal player={modalPlayer} />}
        </Suspense>
      </div>
    </div>
  );
}
