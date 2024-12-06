import { Chip } from "@nextui-org/react"
import { MapGrade } from "@/types"

export default function GradeChip({ grade }: MapGrade) {
  return (
    <Chip
      size="md"
      variant="solid"
      classNames={{
        base: `bg-${grade?.background ?? "white"}`,
        content: `text-${grade?.text ?? "black"}`,
      }}
    >
      {grade?.label}
    </Chip>
  )
}
