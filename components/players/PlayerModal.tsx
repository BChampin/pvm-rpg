'use client';

import {
  Avatar,
  AvatarGroup,
  Divider,
  Modal,
  ModalContent,
  useDisclosure,
} from '@nextui-org/react';
import { PiCheckBold, PiXBold } from 'react-icons/pi';
import FameChip from '@/components/chips/FameChip';
import { Player } from '@/types/Sheet';
import { useSheetStore } from '@/store/Sheet';

export default function PlayerModal({ player }: { player: Player }) {
  const { onOpenChange } = useDisclosure();
  const { setModalPlayer } = useSheetStore();

  return (
    <Modal
      isOpen
      onOpenChange={onOpenChange}
      onClose={() => setModalPlayer(null)}
      className="p-8 text-white"
    >
      <ModalContent>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Avatar
              className="w-16 h-16 text-4xl mr-4"
              name={player.name.slice(0, 1)}
            />
            <span className="text-2xl">{player.name}</span>
          </div>
        </div>
        <Divider className="m-2" />
        <div className="row text-lg text-default">Overall fame</div>
        <div className="row">
          {Object.entries(player.fames).map(([key, value]) => (
            <div key={key}>
              <span className="text-lg text-default-500">
                {String(key).charAt(0).toUpperCase() + String(key).slice(1)}
              </span>
              <FameChip fame={value} />
            </div>
          ))}
        </div>
        <Divider className="m-2" />
        <div className="row text-lg text-default">Times</div>
        <div className="row">
          <AvatarGroup>
            <Avatar
              showFallback
              classNames={{
                base: 'bg-transparent -mr-4',
              }}
              fallback={<PiCheckBold className="text-green-600 text-2xl" />}
            />
            <Avatar
              showFallback
              classNames={{
                base: 'bg-transparent -mr-4',
              }}
              fallback={<PiCheckBold className="text-green-600 text-2xl" />}
            />
            <Avatar
              showFallback
              classNames={{
                base: 'bg-transparent -mr-4',
              }}
              fallback={<PiCheckBold className="text-green-600 text-2xl" />}
            />
            <Avatar
              showFallback
              classNames={{
                base: 'bg-transparent -mr-4',
              }}
              fallback={<PiCheckBold className="text-green-600 text-2xl" />}
            />
          </AvatarGroup>
          <AvatarGroup>
            <Avatar
              showFallback
              classNames={{
                base: 'bg-transparent -mr-4',
              }}
              fallback={<PiXBold className="text-red-500 text-2xl" />}
            />
            <Avatar
              showFallback
              classNames={{
                base: 'bg-transparent -mr-4',
              }}
              fallback={<PiXBold className="text-red-500 text-2xl" />}
            />
            <Avatar
              showFallback
              classNames={{
                base: 'bg-transparent -mr-4',
              }}
              fallback={<PiXBold className="text-red-500 text-2xl" />}
            />
            <Avatar
              showFallback
              classNames={{
                base: 'bg-transparent -mr-4',
              }}
              fallback={<PiXBold className="text-red-500 text-2xl" />}
            />
          </AvatarGroup>
        </div>
        TOUTES LES STATS
      </ModalContent>
    </Modal>
  );
}
