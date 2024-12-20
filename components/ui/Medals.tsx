'use client';

import { Avatar, AvatarGroup, Tooltip } from '@nextui-org/react';
import { Level, Map, getLevel } from '@/types/Sheet';
import { timeNumberToStr } from '@/utils';

export function Medal({
  level,
  map,
  isGroup,
}: {
  level: Level;
  map?: Map;
  isGroup?: boolean;
}) {
  return (
    <Tooltip
      color="foreground"
      content={`${level.label}${map ? ` - ${timeNumberToStr(map.times[level.level])}` : ''}`}
    >
      <Avatar
        classNames={{
          base: `bg-transparent ${isGroup ? '-mr-6' : ''}`,
        }}
        size="lg"
        src={`/pvm-rpg/assets/${level.icon}.png`}
      />
    </Tooltip>
  );
}

export function MedalGroup({ map, time }: { map?: Map; time?: number }) {
  let medals = ['noob', 'intermediate', 'player', 'alien'];

  if (map && time) {
    medals = [];
    if (map.times.noob > time) medals.push('noob');
    if (map.times.intermediate > time) medals.push('intermediate');
    if (map.times.player > time) medals.push('player');
    if (map.times.alien > time) medals.push('alien');
  }

  const shownMedals = medals.map((str) => getLevel(str));

  return (
    <AvatarGroup>
      {shownMedals.map((medal, index) => (
        <Medal key={index} level={medal} map={map} isGroup />
      ))}
    </AvatarGroup>
  );
}
