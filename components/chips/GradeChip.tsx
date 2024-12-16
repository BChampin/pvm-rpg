import { Chip } from "@nextui-org/react"
import { MapGrade } from "@/types/Sheet"

export default function GradeChip({ grade }: { grade: MapGrade}) {
  return (
    <Chip
      size="md"
      variant="flat"
      classNames={{
        base: `bg-${grade?.background ?? "white"}`,
        content: `text-${grade?.text ?? "black"}`,
      }}
    >
      {grade?.label}
    </Chip>
  )
}
