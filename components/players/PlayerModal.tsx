'use client';

import {
  Accordion,
  AccordionItem,
  Avatar,
  Card,
  Divider,
  Link,
  Modal,
  ModalContent,
  ScrollShadow,
  useDisclosure,
} from '@nextui-org/react';
import { Map, MapGrade, Player, TimeRecord, getLevel } from '@/types/Sheet';
import { Medal, MedalGroup } from '@/components/ui/Medals';
import { timeNumberToStr, upperFirst } from '@/utils';
import FameChip from '@/components/chips/FameChip';
import { useLocalization } from '@/store/Localization';
import { useMemo } from 'react';
import { useSheetStore } from '@/store/Sheet';

export default function PlayerModal({ player }: { player: Player }) {
  const { i18n } = useLocalization();
  const { onOpenChange } = useDisclosure();
  const { setModalPlayer, staticMaps, timeRecords } = useSheetStore();

  const totalMedals = useMemo(() => {
    return (
      (player.fames.alien?.level ?? 0) +
      (player.fames.player?.level ?? 0) +
      (player.fames.intermediate?.level ?? 0) +
      (player.fames.noob?.level ?? 0)
    );
  }, [player]);

  const [categorizedDoneMaps] = useMemo(() => {
    const playerTimeRecords = [...timeRecords].filter(
      (timeRecord) => timeRecord.playerId === player.id
    );

    const categorizedDoneMaps: {
      grade: MapGrade;
      nbPerGrade: number;
      categoryTimes: { map: Map; playerMapTime: TimeRecord }[];
      missingMaps: Map[];
    }[] = [];

    staticMaps.forEach((map) => {
      const playerMapTime = playerTimeRecords.find(
        (ptr) => ptr.mapId === map.exchange.id
      );
      let gradeIndex = categorizedDoneMaps.findIndex(
        (cdm) => cdm.grade.level === map.grade.level
      );

      // Init category
      if (gradeIndex < 0) {
        categorizedDoneMaps.push({
          grade: map.grade,
          nbPerGrade: staticMaps.filter(
            (sm) => sm.grade.level === map.grade.level
          ).length,
          categoryTimes: [],
          missingMaps: [],
        });
      }
      gradeIndex = categorizedDoneMaps.findIndex(
        (cdm) => cdm.grade.level === map.grade.level
      );

      if (playerMapTime) {
        categorizedDoneMaps[gradeIndex].categoryTimes.push({
          map,
          playerMapTime,
        });
      } else {
        categorizedDoneMaps[gradeIndex].missingMaps.push(map);
      }
    });
    return [categorizedDoneMaps];
  }, [player.id, staticMaps, timeRecords]);

  return (
    <Modal
      isOpen
      onOpenChange={onOpenChange}
      onClose={() => setModalPlayer(null)}
      className="p-8 text-foreground"
      scrollBehavior="inside"
      size="3xl"
    >
      <ModalContent>
        <ScrollShadow hideScrollBar className="h-[800px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center">
              <Avatar
                className="w-16 h-16 text-4xl mr-4"
                name={player.name.slice(0, 1)}
              />
              <span className="text-2xl">{player.name}</span>
            </div>
            <div className="p-6 flex flex-row items-center gap-4">
              <div className="text-2xl font-semibold text-nowrap">
                {totalMedals} / {staticMaps.length * 4}
              </div>
              <MedalGroup />
            </div>
          </div>
          <Divider className="m-2" />
          <div className="row text-lg text-default">Overall fame</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 justify-around p-2">
            {Object.entries(player.fames).map(([lvl, fame]) => (
              <Card key={lvl} className="p-6 flex flex-col items-center">
                <div className="flex flex-col items-center gap-3">
                  <div>{upperFirst(lvl)}</div>
                  <FameChip fame={fame} />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-1">
                  <Medal level={getLevel(lvl)} />
                  <div className="text-2xl font-semibold text-nowrap">
                    {fame.level} / {staticMaps.length}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Divider className="m-2" />
          <div className="row text-lg text-default">
            {i18n('players.times')}
          </div>
          <div className="p-2">
            <Accordion selectionMode="single" variant="splitted">
              {categorizedDoneMaps.map((cat) => (
                <AccordionItem
                  key={cat.grade.level}
                  aria-label={`${cat.grade.label} - ${cat.categoryTimes.length} / ${cat.nbPerGrade}`}
                  title={`${cat.grade.label} - ${cat.categoryTimes.length} / ${cat.nbPerGrade}`}
                  className="my-2"
                >
                  <div className="text-foreground/70">
                    {i18n('players.times')}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {cat.categoryTimes.map((obj, index) => (
                      <div key={index}>
                        <Link
                          isExternal
                          href={obj.map.exchange.link}
                          className="text-foreground hover:text-primary"
                        >
                          <span>{obj.map.label}</span>
                        </Link>
                        <span className="mx-1">-</span>
                        <span>{timeNumberToStr(obj.playerMapTime.time)}</span>
                        <MedalGroup
                          map={obj.map}
                          time={obj.playerMapTime.time}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-foreground/70 mt-2">
                    {i18n('players.missing')}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {cat.missingMaps.map((map, index) => (
                      <div key={index} className="text-zinc-600">
                        <Link
                          isExternal
                          href={map.exchange.link}
                          className="text-foreground/60 hover:text-primary"
                        >
                          <span>{map.label}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollShadow>
      </ModalContent>
    </Modal>
  );
}
