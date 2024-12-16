'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Kbd,
} from '@nextui-org/react';
import { PiPresentation, PiQuestionMark, PiTarget } from 'react-icons/pi';
import { useLocalization } from '@/store/Localization';
import { useSheetStore } from '@/store/Sheet';

export default function Home() {
  const { i18n } = useLocalization();
  const { staticMaps, players, timeRecords } = useSheetStore();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2">
        <div className="flex justify-between">
          <div className="text-center sm:text-start">
            <p className="text-2xl">{i18n('home.welcome')}</p>
            <h1 className="text-7xl sm:text-8xl text-nowrap text-primary">
              PvM-RPG
            </h1>
            <div className="flex sm:hidden justify-center">
              <Image
                src="/pvm-rpg/assets/trackmania.png"
                alt="Trackmania"
                width={180}
                height={180}
              />
            </div>
          </div>
          <div className="hidden sm:flex">
            <Image
              src="/pvm-rpg/assets/trackmania.png"
              alt="Trackmania"
              width={180}
              height={180}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 justify-center sm:justify-around">
          <Card className="p-6 flex flex-col items-center">
            <div className="text-6xl font-semibold">{staticMaps.length}</div>
            <div>{i18n('nav.maps')}</div>
          </Card>
          <Card className="p-6 flex flex-col items-center">
            <div className="text-6xl font-semibold">{players.length}</div>
            <div>{i18n('nav.players')}</div>
          </Card>
          <Card className="p-6 flex flex-col items-center">
            <div className="text-6xl font-semibold">{timeRecords.length}</div>
            <div>{i18n('nav.records')}</div>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex gap-3">
            <PiPresentation size={40} />
            <div className="flex flex-col">
              <p className="text-lg text-primary text-bold">
                {i18n('home.intro.title')}
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>{i18n('home.intro.p1')}</p>
            <br />
            <p>{i18n('home.intro.p2')}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <PiTarget size={40} />
            <div className="flex flex-col">
              <p className="text-lg text-primary text-bold">
                {i18n('home.objective.title')}
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p>{i18n('home.objective.p1')}</p>
            <br />
            <p>{i18n('home.objective.p2')}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="flex gap-3">
            <PiQuestionMark size={40} />
            <div className="flex flex-col">
              <p className="text-lg text-primary text-bold">
                {i18n('home.howto.title')}
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-lg text-default-500 mb-4">
              {i18n('home.howto.categories.title')}
            </p>
            <ul className="list-inside list-disc">
              <li className="mb-2">{i18n('home.howto.categories.p1')}</li>
              <li className="mb-2">{i18n('home.howto.categories.p2')}</li>
              <li className="mb-2">{i18n('home.howto.categories.p3')}</li>
            </ul>
          </CardBody>
          <Divider />
          <CardBody>
            <p className="text-lg text-default-500 mb-4">
              {i18n('home.howto.times.title')}
            </p>
            <p className="mb-2">{i18n('home.howto.times.p1')}</p>
            <ul className="list-inside list-decimal">
              <li className="mb-2">{i18n('home.howto.times.p2')}</li>
              <li className="mb-2">
                {i18n('home.howto.times.p3')}
                <Kbd className="font-semibold">Name</Kbd>
                {i18n('home.howto.times.p4')}
              </li>
              <li className="mb-2">{i18n('home.howto.times.p5')}</li>
              <li className="mb-2">{i18n('home.howto.times.p6')}</li>
              <li className="mb-2">{i18n('home.howto.times.p7')}</li>
            </ul>
          </CardBody>
          <Divider />
          <CardBody>
            <p className="text-lg text-default-500 mb-4">
              {i18n('home.howto.tips.title')}
            </p>
            <p>
              {i18n('home.howto.tips.p1')}
              <Kbd className="font-semibold">/list</Kbd>{' '}
              {i18n('home.howto.tips.p2')}
            </p>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
