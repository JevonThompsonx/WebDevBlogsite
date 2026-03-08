import type { Metadata } from "next";
import { publicEnv } from "@/lib/env";
import { siteConfig } from "@/lib/site";

interface MetadataInput {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = "/images/mySite.webp",
}: MetadataInput): Metadata {
  const url = new URL(path, publicEnv.NEXT_PUBLIC_APP_URL);

  return {
    title,
    description,
    metadataBase: new URL(publicEnv.NEXT_PUBLIC_APP_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
