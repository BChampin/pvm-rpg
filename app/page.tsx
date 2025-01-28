'use client';

import { Card, Divider, Kbd } from '@heroui/react';
import { PiPresentation, PiQuestionMark, PiTarget } from 'react-icons/pi';
import { LoadingComponent } from '@/components/ui/Misc';
import { useLocalization } from '@/store/Localization';
import { useSheetStore } from '@/store/Sheet';

export default function Home() {
  const { i18n } = useLocalization();
  const { staticMaps, players, timeRecords, loading } = useSheetStore();

  return (
    <div>
      <div className="relative flex justify-center py-40 font-medium">
        <div
          className="absolute inset-0 bg-black opacity-40"
          style={{
            backgroundImage: `url(/assets/home_bg_1.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
        <div className="relative z-10 container text-center">
          <p className="text-3xl text-foreground">{i18n('home.welcome')}</p>
          <h1 className="text-7xl sm:text-8xl text-nowrap text-primary">
            PVM-RPG
          </h1>
        </div>
      </div>

      <div className="bg-primary text-secondary flex justify-center py-12 px-8 sm:px-4">
        <div className="container">
          <div className="flex flex-col sm:flex-row gap-8 justify-center sm:justify-around">
            <Card className="p-6 flex flex-col items-center">
              <div className="text-6xl font-semibold">
                {loading.maps ? <LoadingComponent /> : staticMaps.length}
              </div>
              <div>{i18n('nav.maps')}</div>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <div className="text-6xl font-semibold">
                {loading.players ? <LoadingComponent /> : players.length}
              </div>
              <div>{i18n('nav.players')}</div>
            </Card>
            <Card className="p-6 flex flex-col items-center">
              <div className="text-6xl font-semibold">
                {loading.timeRecords ? (
                  <LoadingComponent />
                ) : (
                  timeRecords.length
                )}
              </div>
              <div>{i18n('nav.records')}</div>
            </Card>
          </div>
        </div>
      </div>

      <div className="bg-secondary text-primary flex justify-center py-12 px-8 sm:px-4">
        <div className="container">
          <div className="flex gap-3 items-center text-center">
            <PiPresentation size={40} />
            <p className="text-xl font-semibold">{i18n('home.intro.title')}</p>
          </div>
          <Divider className="my-2 bg-primary" />
          <div>
            <p>{i18n('home.intro.p1')}</p>
            <br />
            <p>{i18n('home.intro.p2')}</p>
          </div>
        </div>
      </div>

      <div className="bg-primary text-secondary flex justify-center py-12 px-8 sm:px-4">
        <div className="container">
          <div className="flex gap-3 items-center text-center">
            <PiTarget size={40} />
            <p className="text-xl font-semibold">
              {i18n('home.objective.title')}
            </p>
          </div>
          <Divider className="my-2 bg-secondary" />
          <div>
            <p>{i18n('home.objective.p1')}</p>
            <br />
            <p>{i18n('home.objective.p2')}</p>
          </div>
        </div>
      </div>

      <div className="text-primary flex justify-center py-12 px-8 sm:px-4">
        <div className="container">
          <div className="flex gap-3 items-center text-center">
            <PiQuestionMark size={40} />
            <p className="text-xl font-semibold">{i18n('home.howto.title')}</p>
          </div>
          <Divider className="my-2 bg-primary" />
          <div>
            <p className="text-lg text-default-500 mb-4">
              {i18n('home.howto.categories.title')}
            </p>
            <ul className="list-inside list-disc">
              <li className="mb-2">{i18n('home.howto.categories.p1')}</li>
              <li className="mb-2">{i18n('home.howto.categories.p2')}</li>
              <li className="mb-2">{i18n('home.howto.categories.p3')}</li>
            </ul>
          </div>
          <Divider className="my-2 bg-primary" />
          <div>
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
          </div>
          <Divider className="my-2 bg-primary" />
          <div>
            <p className="text-lg text-default-500 mb-4">
              {i18n('home.howto.tips.title')}
            </p>
            <p>
              {i18n('home.howto.tips.p1')}
              <Kbd className="font-semibold">/list</Kbd>{' '}
              {i18n('home.howto.tips.p2')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
