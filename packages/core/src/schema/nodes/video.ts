import type { DOMOutputSpec } from "@autoartifacts/pm/model";

export const video = {
  attrs: {
    src: { default: "" }, // URL to video or embed code
    provider: { default: "youtube" }, // 'youtube' | 'vimeo' | 'embed'
    width: { default: null },
    aspectRatio: { default: "16:9" }, // '16:9' | '4:3' | '1:1'
    align: { default: "center" }, // 'left' | 'center' | 'right'
  },
  inline: false,
  group: "block",
  draggable: true,
  parseDOM: [
    {
      tag: "iframe",
      getAttrs: (dom: HTMLElement) => ({
        src: dom.getAttribute("src") || "",
        width: dom.getAttribute("width") || null,
        provider: dom.parentElement?.getAttribute("data-provider") || "youtube",
        aspectRatio:
          dom.parentElement?.getAttribute("data-aspect-ratio") || "16:9",
        align: dom.parentElement?.getAttribute("data-align") || "center",
      }),
    },
    {
      tag: "video",
      getAttrs: (dom: HTMLElement) => ({
        src: dom.getAttribute("src") || "",
        width: dom.getAttribute("width") || null,
        provider: "embed",
        aspectRatio: "16:9",
        align: "center",
      }),
    },
  ],
  toDOM(node: any): DOMOutputSpec {
    const { src, provider, width, aspectRatio, align } = node.attrs;
    return [
      "div",
      {
        class: "video-wrapper",
        "data-provider": provider,
        "data-aspect-ratio": aspectRatio,
        "data-align": align,
        "data-node-type": "video",
      },
      [
        "iframe",
        {
          src,
          width: width || "100%",
          frameborder: "0",
          allowfullscreen: "true",
        },
      ],
    ];
  },
};
