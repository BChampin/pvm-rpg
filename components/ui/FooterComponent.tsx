'use client';

import { Link } from '@nextui-org/react';
import { PiGithubLogoBold } from 'react-icons/pi';

export default function FooterComponent() {
  return (
    <footer className="border-t-1 border-default text-foreground p-2 flex flex-col sm:flex-row text-center justify-center gap-6">
      <p>Made with ☕ and ❤️ by Sakastien</p>
      <span className="font-bold hidden sm:flex">·</span>
      <p>Data/GSheet by Delaweed</p>
      <span className="font-bold hidden sm:flex">·</span>
      <div>
        <Link
          isExternal
          href="https://github.com/BChampin/pvm-rpg"
          className="text-xl"
        >
          <PiGithubLogoBold />
        </Link>
      </div>
      <span className="font-bold hidden sm:flex">·</span>
      <p>
        Last data update :
        <span className="m-1">
          {process.env.NEXT_PUBLIC_DATA_UPDATE_TIMESTAMP
            ? new Date(
                process.env.NEXT_PUBLIC_DATA_UPDATE_TIMESTAMP
              ).toLocaleString()
            : 'Error'}
        </span>
      </p>
    </footer>
  );
}
