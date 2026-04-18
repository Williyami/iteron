import { useEffect } from "react";

export const FAVICONS = {
  pageturn: "/pageturn-favicon.svg",
  novawear: "/novawear-favicon.svg",
} as const;

export function usePageMeta(title: string, site: "pageturn" | "novawear" = "pageturn") {
  useEffect(() => {
    document.title = title;
    const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (link) link.href = FAVICONS[site];
  }, [title, site]);
}
