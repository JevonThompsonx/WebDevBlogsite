import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="section-eyebrow">404</p>
      <h1 className="section-title text-[clamp(2.6rem,5vw,4.8rem)]">
        The page you were looking for is not here.
      </h1>
      <p className="section-copy max-w-2xl">
        It may have moved, been renamed, or never existed in the first place.
      </p>
      <Link className={buttonClasses("primary", "lg")} href="/">
        Return home
      </Link>
    </div>
  );
}
