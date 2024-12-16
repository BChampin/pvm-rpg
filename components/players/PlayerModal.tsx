import {
  Avatar,
  Divider,
  Modal,
  ModalContent,
  useDisclosure,
} from '@nextui-org/react';
import FameChip from '@/components/chips/FameChip';
import { Player } from '@/types/Sheet';

export default function PlayerModal({ player }: { player: Player }) {
  const { onOpenChange } = useDisclosure();

  console.log(player);

  return (
    <Modal isOpen onOpenChange={onOpenChange} className="p-8">
      <ModalContent>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Avatar name={player.name} />
            <span className="text-2xl">{player.name}</span>
          </div>
        </div>
        <Divider className="m-2" />
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
        TOUTES LES STATS
      </ModalContent>
    </Modal>
  );
}
