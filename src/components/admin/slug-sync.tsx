"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/utils";

interface SlugSyncProps {
  titleName: string;
  slugName: string;
  initialTitle: string;
  initialSlug: string;
}

export function SlugSync({
  titleName,
  slugName,
  initialTitle,
  initialSlug,
}: SlugSyncProps) {
  const [slugEdited, setSlugEdited] = useState(
    initialSlug !== slugify(initialTitle),
  );

  useEffect(() => {
    const titleInput = document.querySelector<HTMLInputElement>(
      `input[name='${titleName}']`,
    );
    const slugInput = document.querySelector<HTMLInputElement>(
      `input[name='${slugName}']`,
    );

    if (!titleInput || !slugInput) {
      return;
    }

    const syncedTitleInput = titleInput;
    const syncedSlugInput = slugInput;

    if (!slugEdited && syncedSlugInput.value.trim().length === 0) {
      syncedSlugInput.value = slugify(syncedTitleInput.value);
    }

    function onTitleChange(): void {
      if (!slugEdited) {
        syncedSlugInput.value = slugify(syncedTitleInput.value);
      }
    }

    function onSlugChange(): void {
      setSlugEdited(
        syncedSlugInput.value.trim() !== slugify(syncedTitleInput.value),
      );
    }

    syncedTitleInput.addEventListener("input", onTitleChange);
    syncedSlugInput.addEventListener("input", onSlugChange);

    return () => {
      syncedTitleInput.removeEventListener("input", onTitleChange);
      syncedSlugInput.removeEventListener("input", onSlugChange);
    };
  }, [initialTitle, initialSlug, slugEdited, slugName, titleName]);

  return null;
}
