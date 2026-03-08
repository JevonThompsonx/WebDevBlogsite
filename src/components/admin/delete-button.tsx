import { Trash2 } from "lucide-react";
import { deletePostAction } from "@/server/actions/blog";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  slug: string;
}

export function DeleteButton({ slug }: DeleteButtonProps) {
  return (
    <form action={deletePostAction}>
      <input name="slug" type="hidden" value={slug} />
      <Button size="sm" type="submit" variant="danger">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </form>
  );
}
