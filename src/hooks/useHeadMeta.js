import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { applyHead } from "../seo/head";
import { seoFor } from "../seo/seo";

/**
 * Keeps <head> in sync on client-side navigation. The first paint of every URL already carries the same
 * tags from the prerendered HTML (scripts/prerender-meta.mjs); this only matters after in-app route changes.
 * `path` is the unprefixed route ("/", "/project", "/project/:id").
 */
export const useHeadMeta = (path) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "vi";
  useEffect(() => { applyHead(document, seoFor(path, lang, (key, fallback) => t(key, fallback))); }, [path, lang, t]);
};
