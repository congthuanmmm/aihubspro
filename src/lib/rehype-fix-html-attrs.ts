// src/lib/rehype-fix-html-attrs.ts
// Rehype plugin: Converts lowercase HTML attributes (frameborder, allowfullscreen, referrerpolicy, etc.)
// to their React camelCase equivalents to prevent "Invalid DOM property" warnings.

import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Element } from "hast";

const ATTR_MAP: Record<string, string> = {
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
  referrerpolicy: "referrerPolicy",
  crossorigin: "crossOrigin",
  tabindex: "tabIndex",
  accesskey: "accessKey",
  enctype: "encType",
  contenteditable: "contentEditable",
  spellcheck: "spellCheck",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  colspan: "colSpan",
  rowspan: "rowSpan",
  usemap: "useMap",
  "accept-charset": "acceptCharset",
  "http-equiv": "httpEquiv",
  "class": "className",
};

const rehypeFixHtmlAttrs: Plugin = () => {
  return (tree) => {
    visit(tree, "element", (node: Element) => {
      if (!node.properties) return;

      const newProps: typeof node.properties = {};
      for (const [key, value] of Object.entries(node.properties)) {
        const keyLower = key.toLowerCase();
        // Skip frameborder entirely — handled via CSS
        if (keyLower === "frameborder") continue;
        const camelKey = ATTR_MAP[keyLower] || key;
        (newProps as Record<string, unknown>)[camelKey] = value;
      }
      node.properties = newProps;
    });
  };
};

export default rehypeFixHtmlAttrs;
