'use client';

import PlayersTable from '@/components/players/PlayersTable';
import { Suspense } from 'react';

export default function Players() {
  return (
    <div>
      <div className="p-4 text-white">
        <Suspense fallback={<div>Loading...</div>}>
          <PlayersTable />
        </Suspense>
      </div>
    </div>
  );
}
