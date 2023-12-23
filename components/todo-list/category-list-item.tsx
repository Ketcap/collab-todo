import { TodoCategory } from "@prisma/client";
import Link from "next/link";
import { Badge } from "../ui/badge";

export type CategoryListItemProps = TodoCategory;

export const CategoryListItem = ({
  id,
  name,
  isPublic,
}: CategoryListItemProps) => (
  <Link href={`/l/${id}`}>
    <div className="flex items-center justify-between">
      <p className="text-sm">{name}</p>
      <Badge>{isPublic ? "Public" : "Private"}</Badge>
    </div>
  </Link>
);
