import { useEffect } from "react";

interface DocumentMetaOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
}

const DEFAULT_TITLE =
  "World Countries Atlas – Economy, Taxes, Airports & Demographics";
const DEFAULT_DESCRIPTION =
  "Explore open data for 240+ countries and territories: corporate & personal income taxes, GDP & economic indicators, major airports, largest cities, and demographics.";

export function useDocumentTitle({
  title,
  description,
  keywords,
  canonicalPath,
}: DocumentMetaOptions) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title ? `${title} | Countries Atlas` : DEFAULT_TITLE;
    document.title = formattedTitle;

    // 2. Update Description meta tag
    let descMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.name = "description";
      document.head.appendChild(descMeta);
    }
    descMeta.content = description || DEFAULT_DESCRIPTION;

    // 3. Update Open Graph Title & Description
    const ogTitleMeta = document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]',
    );
    if (ogTitleMeta) {
      ogTitleMeta.content = formattedTitle;
    }
    const ogDescMeta = document.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]',
    );
    if (ogDescMeta) {
      ogDescMeta.content = description || DEFAULT_DESCRIPTION;
    }

    // 4. Update Keywords if provided
    if (keywords && keywords.length > 0) {
      let keywordsMeta = document.querySelector<HTMLMetaElement>(
        'meta[name="keywords"]',
      );
      if (!keywordsMeta) {
        keywordsMeta = document.createElement("meta");
        keywordsMeta.name = "keywords";
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.content = keywords.join(", ");
    }

    // 5. Update Canonical URL
    if (canonicalPath) {
      const canonicalLink = document.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]',
      );
      if (canonicalLink) {
        // Base origin + base url
        const baseUrl = window.location.origin + window.location.pathname;
        canonicalLink.href = `${baseUrl}#${canonicalPath}`;
      }
    }

    // Reset to defaults on unmount
    return () => {
      document.title = DEFAULT_TITLE;
      if (descMeta) descMeta.content = DEFAULT_DESCRIPTION;
    };
  }, [title, description, keywords, canonicalPath]);
}
