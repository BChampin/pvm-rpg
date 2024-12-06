import { useSheetStore } from "@/store/Sheet"
import GradeChip from "@/components/grade/GradeChip"
import { Button, Card, CardHeader, CardFooter, Image, Link } from "@nextui-org/react"

export default function MapsCard() {
  const { maps, loading, error } = useSheetStore()
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {maps.map((map, index) => (
        <Card key={index} isFooterBlurred className="h-[300px]">
          <CardHeader className="absolute z-10 top-1 flex-col items-start">
            <p className="text-tiny text-white/60 uppercase font-bold">{map.exchange.author}</p>
            <h4 className="text-white/90 font-medium text-xl">{map.label}</h4>
          </CardHeader>
          <Image
            removeWrapper
            alt="Relaxing app background"
            className="z-0 w-full h-full object-cover"
            src={map.exchange.thumbnail}
          />
          <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-grow gap-2 items-center justify-between">
              {map.grade && <GradeChip grade={map.grade} />}
              <div className="flex flex-col">
                <p className="text-tiny text-white/60">Alien : {map.times.alien}</p>
                <p className="text-tiny text-white/60">Player : {map.times.player}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-tiny text-white/60">Inter. : {map.times.intermediate}</p>
                <p className="text-tiny text-white/60">Noob : {map.times.noob}</p>
              </div>
              <Button radius="full" size="sm">
                <Link isExternal showAnchorIcon href={map.exchange.link}>
                  TMX
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
