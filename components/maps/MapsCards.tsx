import { Card, CardFooter, CardHeader, Image, Link } from '@nextui-org/react';
import GradeChip from '@/components/chips/GradeChip';
import { MedalGroup } from '@/components/ui/Medals';
import { useSheetStore } from '@/store/Sheet';

export default function MapsCard() {
  const { maps, loading, error } = useSheetStore();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {maps.map((map, index) => (
        <Link key={index} isExternal href={map.exchange.link}>
          <Card isFooterBlurred className="h-[150px] sm:h-[300px] w-full">
            <CardHeader className="absolute z-10 flex justify-between pt-0 pr-6">
              {map.grade && <GradeChip grade={map.grade} />}
              <MedalGroup map={map} />
            </CardHeader>
            <Image
              removeWrapper
              alt="Relaxing app background"
              className="z-0 w-full h-full object-cover"
              src={map.exchange.thumbnail}
            />
            <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
              <div className="flex flex-grow gap-2 items-center">
                <div>
                  <p className="text-tiny text-white/70 uppercase font-bold">
                    {map.exchange.author}
                  </p>
                  <h4 className="text-white font-medium text-xl">
                    {map.label}
                  </h4>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
