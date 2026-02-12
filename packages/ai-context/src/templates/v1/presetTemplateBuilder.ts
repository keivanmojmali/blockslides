import { blocks, slide, type SlideNode } from "./schemaBuilder";

export type PresetKey =
  | "tpl.titleAndSubheader"
  | "tpl.imageAndText"
  | "tpl.textAndImage"
  | "tpl.twoColumns"
  | "tpl.twoColumnsWithHeader"
  | "tpl.threeColumns"
  | "tpl.threeColumnsWithHeader"
  | "tpl.fourColumns"
  | "tpl.fourColumnsWithHeader"
  | "tpl.titleWithBullets"
  | "tpl.titleBulletsAndImage"
  | "tpl.twoImageColumns"
  | "tpl.accentLeft"
  | "tpl.accentRight"
  | "tpl.accentTop"
  | "tpl.accentRightFit"
  | "tpl.accentLeftFit"
  | "tpl.fullImage";

type PresetTemplate = {
  key: PresetKey;
  label: string;
  description?: string;
  icon?: string;
  build: () => SlideNode;
};

const titleAndSubheaderIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="22" width="60" height="12" rx="2" fill="#D4D4D8"/><rect x="26" y="38" width="44" height="8" rx="2" fill="#E5E7EB"/></svg>';

const titleAndSubheader: PresetTemplate = {
  key: "tpl.titleAndSubheader",
  label: "Title & Subheader",
  description: "Centered title and subtitle for a new presentation",
  icon: titleAndSubheaderIcon,
  build: () =>
    slide.singleCol({
      columnAttrs: {
        justify: "center",
        align: "center",
        gap: "md",
        padding: "lg",
        fill: true,
        backgroundColor: "#ffffff",
      },
      content: [
        blocks.heading("Lorem ipsum dolor sit amet", 1),
        blocks.paragraph("Consectetur adipiscing elit. Sed do eiusmod tempor incididunt."),
      ],
    }),
};

const imageTextIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="26" width="24" height="16" rx="2" fill="#E5E7EB"/><rect x="21" y="31" width="14" height="6" rx="1" fill="#D4D4D8"/><rect x="46" y="24" width="34" height="6" rx="1.5" fill="#D4D4D8"/><rect x="46" y="33" width="34" height="5" rx="1.5" fill="#E5E7EB"/><rect x="46" y="41" width="28" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const textImageIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="24" width="34" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="33" width="34" height="5" rx="1.5" fill="#E5E7EB"/><rect x="18" y="41" width="28" height="5" rx="1.5" fill="#E5E7EB"/><rect x="56" y="26" width="24" height="16" rx="2" fill="#E5E7EB"/><rect x="61" y="31" width="14" height="6" rx="1" fill="#D4D4D8"/></svg>';

const twoColumnsIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="22" width="26" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="31" width="26" height="5" rx="1.5" fill="#E5E7EB"/><rect x="18" y="39" width="22" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="22" width="26" height="6" rx="1.5" fill="#D4D4D8"/><rect x="52" y="31" width="26" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="39" width="22" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const twoColumnsHeaderIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="18" width="60" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="28" width="26" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="37" width="26" height="5" rx="1.5" fill="#E5E7EB"/><rect x="18" y="45" width="22" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="28" width="26" height="6" rx="1.5" fill="#D4D4D8"/><rect x="52" y="37" width="26" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="45" width="22" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const threeColumnsIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="14" y="22" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="14" y="31" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="14" y="39" width="18" height="5" rx="1.5" fill="#E5E7EB"/><rect x="38" y="22" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="38" y="31" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="38" y="39" width="18" height="5" rx="1.5" fill="#E5E7EB"/><rect x="62" y="22" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="62" y="31" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="62" y="39" width="18" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const threeColumnsHeaderIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="16" width="60" height="6" rx="1.5" fill="#D4D4D8"/><rect x="14" y="28" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="14" y="37" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="14" y="45" width="18" height="5" rx="1.5" fill="#E5E7EB"/><rect x="38" y="28" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="38" y="37" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="38" y="45" width="18" height="5" rx="1.5" fill="#E5E7EB"/><rect x="62" y="28" width="20" height="6" rx="1.5" fill="#D4D4D8"/><rect x="62" y="37" width="20" height="5" rx="1.5" fill="#E5E7EB"/><rect x="62" y="45" width="18" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const fourColumnsHeaderIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="16" width="60" height="6" rx="1.5" fill="#D4D4D8"/><rect x="12" y="28" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="12" y="37" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="12" y="45" width="14" height="5" rx="1.5" fill="#E5E7EB"/><rect x="32" y="28" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="32" y="37" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="32" y="45" width="14" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="28" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="52" y="37" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="45" width="14" height="5" rx="1.5" fill="#E5E7EB"/><rect x="72" y="28" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="72" y="37" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="72" y="45" width="14" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const fourColumnsIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="12" y="22" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="12" y="31" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="12" y="39" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="32" y="22" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="32" y="31" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="32" y="39" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="22" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="52" y="31" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="52" y="39" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="72" y="22" width="16" height="6" rx="1.5" fill="#D4D4D8"/><rect x="72" y="31" width="16" height="5" rx="1.5" fill="#E5E7EB"/><rect x="72" y="39" width="16" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const fullImageIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="14" y="14" width="68" height="44" rx="3" fill="#E5E7EB"/><path d="M18 50 34 32l12 14 8-10 16 14H18Z" fill="#D4D4D8"/><circle cx="32" cy="26" r="4" fill="#D4D4D8"/></svg>';

const twoImageColumnsIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="18" width="64" height="6" rx="1.5" fill="#D4D4D8"/><rect x="16" y="28" width="28" height="14" rx="2" fill="#E5E7EB"/><rect x="52" y="28" width="28" height="14" rx="2" fill="#E5E7EB"/><rect x="16" y="46" width="20" height="4" rx="1" fill="#D4D4D8"/><rect x="52" y="46" width="20" height="4" rx="1" fill="#D4D4D8"/></svg>';

const accentLeftIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="12" y="18" width="20" height="36" rx="2" fill="#EFEFEF"/><rect x="18" y="30" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="36" y="26" width="42" height="6" rx="1.5" fill="#D4D4D8"/><rect x="36" y="36" width="38" height="5" rx="1.5" fill="#E5E7EB"/><rect x="36" y="44" width="32" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const accentRightIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="64" y="18" width="20" height="36" rx="2" fill="#EFEFEF"/><rect x="70" y="30" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="16" y="26" width="42" height="6" rx="1.5" fill="#D4D4D8"/><rect x="16" y="36" width="38" height="5" rx="1.5" fill="#E5E7EB"/><rect x="16" y="44" width="32" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const accentTopIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="14" y="14" width="68" height="16" rx="2" fill="#EFEFEF"/><rect x="44" y="18" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="18" y="36" width="60" height="6" rx="1.5" fill="#D4D4D8"/><rect x="18" y="46" width="56" height="5" rx="1.5" fill="#E5E7EB"/><rect x="18" y="54" width="48" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const accentRightFitIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="64" y="24" width="16" height="20" rx="2" fill="#E5E7EB"/><rect x="68" y="28" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="14" y="28" width="44" height="6" rx="1.5" fill="#D4D4D8"/><rect x="14" y="38" width="40" height="5" rx="1.5" fill="#E5E7EB"/><rect x="14" y="46" width="32" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const accentLeftFitIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="24" width="16" height="20" rx="2" fill="#E5E7EB"/><rect x="20" y="28" width="8" height="8" rx="1" fill="#CCCCCC"/><rect x="36" y="28" width="44" height="6" rx="1.5" fill="#D4D4D8"/><rect x="36" y="38" width="40" height="5" rx="1.5" fill="#E5E7EB"/><rect x="36" y="46" width="32" height="5" rx="1.5" fill="#E5E7EB"/></svg>';

const titleBulletsIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="18" y="20" width="60" height="6" rx="1.5" fill="#D4D4D8"/><circle cx="22" cy="32" r="2" fill="#D4D4D8"/><rect x="28" y="30" width="44" height="4" rx="1" fill="#E5E7EB"/><circle cx="22" cy="39" r="2" fill="#D4D4D8"/><rect x="28" y="37" width="44" height="4" rx="1" fill="#E5E7EB"/><circle cx="22" cy="46" r="2" fill="#D4D4D8"/><rect x="28" y="44" width="36" height="4" rx="1" fill="#E5E7EB"/></svg>';

const titleBulletsImageIcon =
  '<svg width="96" height="72" viewBox="0 0 96 72" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="84" height="60" rx="4" stroke="#D4D4D8" stroke-width="2" fill="#F9FAFB"/><rect x="16" y="18" width="64" height="6" rx="1.5" fill="#D4D4D8"/><circle cx="20" cy="31" r="2" fill="#D4D4D8"/><rect x="26" y="29" width="24" height="4" rx="1" fill="#E5E7EB"/><circle cx="20" cy="38" r="2" fill="#D4D4D8"/><rect x="26" y="36" width="24" height="4" rx="1" fill="#E5E7EB"/><circle cx="20" cy="45" r="2" fill="#D4D4D8"/><rect x="26" y="43" width="20" height="4" rx="1" fill="#E5E7EB"/><rect x="56" y="31" width="24" height="16" rx="2" fill="#E5E7EB"/><rect x="61" y="36" width="14" height="6" rx="1" fill="#D4D4D8"/></svg>';
const imageAndText: PresetTemplate = {
  key: "tpl.imageAndText",
  label: "Image & Text",
  description: "Image on left, text on right",
  icon: imageTextIcon,
  build: () =>
    slide.twoCol(
      blocks.column(
        [
          blocks.imageBlock({
            src: "https://placehold.co/640x480/png",
            size: "fit",
          }),
        ],
        {
        }
      ),
      blocks.column(
        [
          blocks.heading("Lorem ipsum dolor sit amet", 2),
          blocks.paragraph("Consectetur adipiscing elit. Sed do eiusmod tempor incididunt."),
          blocks.paragraph("Ut enim ad minim veniam, quis nostrud exercitation."),
        ],
        {
          padding: "lg",
          gap: "sm",
          fill: true,
        }
      )
    ),
};

const textAndImage: PresetTemplate = {
  key: "tpl.textAndImage",
  label: "Text & Image",
  description: "Text on left, image on right",
  icon: textImageIcon,
  build: () =>
    slide.twoCol(
      blocks.column(
        [
          blocks.heading("Lorem ipsum dolor sit amet", 2),
          blocks.paragraph("Consectetur adipiscing elit. Sed do eiusmod tempor incididunt."),
          blocks.paragraph("Ut enim ad minim veniam, quis nostrud exercitation."),
        ],
        {
          justify: "center",
          padding: "lg",
          gap: "sm",
          fill: true,
        }
      ),
      blocks.column(
        [
          blocks.imageBlock({
            src: "https://placehold.co/640x480/png",
            size: "fit",
          }),
        ],
        {
          align: "center",
          justify: "center",
          padding: "lg",
          fill: true,
        }
      )
    ),
};

const twoColumns: PresetTemplate = {
  key: "tpl.twoColumns",
  label: "Two Columns",
  description: "Header above two balanced text columns",
  icon: twoColumnsIcon,
  build: () => ({
    type: "slide",
    attrs: { id: "slide-1", size: "16x9" },
    content: [
      blocks.heading("Section heading", 2),
      blocks.columnGroup([
        blocks.column(
          [
            blocks.paragraph("Lorem ipsum dolor sit amet."),
            blocks.paragraph("Consectetur adipiscing elit. Sed do eiusmod tempor incididunt."),
            blocks.paragraph("Ut enim ad minim veniam, quis nostrud exercitation."),
          ],
          { padding: "md", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.paragraph("Lorem ipsum dolor sit amet."),
            blocks.paragraph("Consectetur adipiscing elit. Sed do eiusmod tempor incididunt."),
            blocks.paragraph("Ut enim ad minim veniam, quis nostrud exercitation."),
          ],
          { padding: "md", gap: "sm", fill: true }
        ),
      ]),
    ],
  }),
};

const twoColumnsWithHeader: PresetTemplate = {
  key: "tpl.twoColumnsWithHeader",
  label: "Two Columns + Header",
  description: "Header plus two columns, each with its own heading",
  icon: twoColumnsHeaderIcon,
  build: () => ({
    type: "slide",
    attrs: { id: "slide-1", size: "16x9" },
    content: [
      blocks.heading("Section heading", 2),
      blocks.columnGroup([
        blocks.column(
          [
            blocks.heading("Column heading", 4),
            blocks.paragraph("Consectetur adipiscing elit. Sed do eiusmod tempor incididunt."),
            blocks.paragraph("Ut enim ad minim veniam, quis nostrud exercitation."),
          ],
          { padding: "md", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.heading("Column heading", 4),
            blocks.paragraph("Consectetur adipiscing elit. Sed do eiusmod tempor incididunt."),
            blocks.paragraph("Ut enim ad minim veniam, quis nostrud exercitation."),
          ],
          { padding: "md", gap: "sm", fill: true }
        ),
      ]),
    ],
  }),
};

const threeColumns: PresetTemplate = {
  key: "tpl.threeColumns",
  label: "Three Columns",
  description: "Balanced three-column text",
  icon: threeColumnsIcon,
  build: () => ({
    type: "slide",
    attrs: { id: "slide-1", size: "16x9" },
    content: [
      blocks.columnGroup([
        blocks.column(
          [
            blocks.paragraph("Lorem ipsum dolor sit amet."),
            blocks.paragraph("Consectetur adipiscing elit. Sed do eiusmod tempor incididunt."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.paragraph("Ut enim ad minim veniam."),
            blocks.paragraph("Quis nostrud exercitation ullamco laboris."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.paragraph("Nisi ut aliquip ex ea commodo consequat."),
            blocks.paragraph("Duis aute irure dolor in reprehenderit."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
      ]),
    ],
  }),
};

const threeColumnsWithHeader: PresetTemplate = {
  key: "tpl.threeColumnsWithHeader",
  label: "Three Columns + Header",
  description: "Header plus three columns",
  icon: threeColumnsHeaderIcon,
  build: () => ({
    type: "slide",
    attrs: { id: "slide-1", size: "16x9" },
    content: [
      blocks.heading("Section heading", 2),
      blocks.columnGroup([
        blocks.column(
          [
            blocks.heading("Column heading", 4),
            blocks.paragraph("Lorem ipsum dolor sit amet."),
            blocks.paragraph("Consectetur adipiscing elit. Sed do eiusmod tempor incididunt."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.heading("Column heading", 4),
            blocks.paragraph("Ut enim ad minim veniam."),
            blocks.paragraph("Quis nostrud exercitation ullamco laboris."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.heading("Column heading", 4),
            blocks.paragraph("Nisi ut aliquip ex ea commodo consequat."),
            blocks.paragraph("Duis aute irure dolor in reprehenderit."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
      ]),
    ],
  }),
};

const fourColumnsWithHeader: PresetTemplate = {
  key: "tpl.fourColumnsWithHeader",
  label: "Four Columns + Header",
  description: "Header plus four columns",
  icon: fourColumnsHeaderIcon,
  build: () => ({
    type: "slide",
    attrs: { id: "slide-1", size: "16x9" },
    content: [
      blocks.heading("Section heading", 2),
      blocks.columnGroup([
        blocks.column(
          [
            blocks.heading("Column heading", 4),
            blocks.paragraph("Lorem ipsum dolor sit amet."),
            blocks.paragraph("Consectetur adipiscing elit."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.heading("Column heading", 4),
            blocks.paragraph("Ut enim ad minim veniam."),
            blocks.paragraph("Quis nostrud exercitation ullamco laboris."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.heading("Column heading", 4),
            blocks.paragraph("Nisi ut aliquip ex ea commodo consequat."),
            blocks.paragraph("Duis aute irure dolor in reprehenderit."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.heading("Column heading", 4),
            blocks.paragraph("Excepteur sint occaecat cupidatat."),
            blocks.paragraph("Sunt in culpa qui officia."),
          ],
          { padding: "sm", gap: "sm", fill: true }
        ),
      ]),
    ],
  }),
};

const fullImage: PresetTemplate = {
  key: "tpl.fullImage",
  label: "Full Image",
  description: "Edge-to-edge image filling the slide",
  icon: fullImageIcon,
  build: () =>
    slide.singleCol({
      columnAttrs: { padding: "none", fill: true, align: "stretch" },
      content: [
        blocks.imageBlock({
          src: "https://placehold.co/1920x1080/png",
          size: "fill",
          crop: "center",
        }),
      ],
    }),
};

const fourColumns: PresetTemplate = {
  key: "tpl.fourColumns",
  label: "Four Columns",
  description: "Balanced four-column text",
  icon: fourColumnsIcon,
  build: () => ({
    type: "slide",
    attrs: { id: "slide-1", size: "16x9" },
    content: [
      blocks.columnGroup(
        Array.from({ length: 4 }).map(() =>
          blocks.column(
            [
              blocks.paragraph("Lorem ipsum dolor sit amet."),
              blocks.paragraph("Consectetur adipiscing elit."),
            ],
            { padding: "sm", gap: "sm", fill: true }
          )
        )
      ),
    ],
  }),
};

const titleWithBullets: PresetTemplate = {
  key: "tpl.titleWithBullets",
  label: "Title with Bullets",
  description: "Header and a bullet list",
  icon: titleBulletsIcon,
  build: () =>
    slide.singleCol({
      columnAttrs: { padding: "md", gap: "md" },
      content: [
        blocks.heading("Lorem ipsum dolor sit amet", 2),
        blocks.bulletList([
          "Consectetur adipiscing elit.",
          "Sed do eiusmod tempor incididunt.",
          "Ut enim ad minim veniam.",
        ]),
      ],
    }),
};

const titleBulletsAndImage: PresetTemplate = {
  key: "tpl.titleBulletsAndImage",
  label: "Title, Bullets & Image",
  description: "Title with bullets and an image",
  icon: titleBulletsImageIcon,
  build: () =>
    slide.twoCol(
      blocks.column(
        [
          blocks.heading("Lorem ipsum dolor sit amet", 2),
          blocks.bulletList([
            "Consectetur adipiscing elit.",
            "Sed do eiusmod tempor incididunt.",
            "Ut enim ad minim veniam.",
          ]),
        ],
        { padding: "md", gap: "sm", fill: true }
      ),
      blocks.column(
        [
          blocks.imageBlock({
            src: "https://placehold.co/480x360/png",
            size: "fit",
          }),
        ],
        {
          align: "center",
          justify: "center",
          padding: "md",
          fill: true,
        }
      )
    ),
};

const accentLeft: PresetTemplate = {
  key: "tpl.accentLeft",
  label: "Accent left",
  description: "Accent band with image on the left, text on the right",
  icon: accentLeftIcon,
  build: () =>
    slide.twoCol(
      blocks.column(
        [
          blocks.imageBlock({
            src: "https://placehold.co/320x240/png",
            size: "fill",
            crop: "center",
          }),
        ],
        {
          backgroundColor: "#f1f5f9",
          padding: "none",
          fill: true,
          align: "stretch",
        }
      ),
      blocks.column(
        [
          blocks.heading("Accent left", 3),
          blocks.paragraph("Short supporting copy goes here."),
          blocks.paragraph("Add one more line if needed."),
        ],
        { padding: "md", gap: "sm", fill: true, justify: "center" }
      )
    ),
};

const accentRight: PresetTemplate = {
  key: "tpl.accentRight",
  label: "Accent right",
  description: "Accent band with image on the right, text on the left",
  icon: accentRightIcon,
  build: () =>
    slide.twoCol(
      blocks.column(
        [
          blocks.heading("Accent right", 3),
          blocks.paragraph("Short supporting copy goes here."),
          blocks.paragraph("Add one more line if needed."),
        ],
        { padding: "md", gap: "sm", fill: true, justify: "center" }
      ),
      blocks.column(
        [
          blocks.imageBlock({
            src: "https://placehold.co/320x240/png",
            size: "fill",
            crop: "center",
          }),
        ],
        {
          backgroundColor: "#f1f5f9",
          padding: "none",
          fill: true,
          align: "stretch",
        }
      )
    ),
};

const accentTop: PresetTemplate = {
  key: "tpl.accentTop",
  label: "Accent top",
  description: "Accent band on top with image, text below",
  icon: accentTopIcon,
  build: () =>
    ({
      type: "slide",
      attrs: { id: "slide-1", size: "16x9" },
      content: [
        {
          type: "column",
          attrs: { backgroundColor: "#f1f5f9", padding: "none", height: "200px", align: "stretch" },
          content: [
            blocks.imageBlock({
              src: "https://placehold.co/1200x400/png",
              size: "fill",
              crop: "center",
            }),
          ],
        },
        {
          type: "column",
          attrs: { padding: "md", gap: "sm", fill: true, justify: "end" },
          content: [
            blocks.heading("Accent top", 3),
            blocks.paragraph("Short supporting copy goes here."),
            blocks.paragraph("Add one more line if needed."),
          ],
        },
      ],
    } as SlideNode),
};

const accentRightFit: PresetTemplate = {
  key: "tpl.accentRightFit",
  label: "Accent right (fit)",
  description: "Text with a tighter image card on the right",
  icon: accentRightFitIcon,
  build: () =>
    slide.twoCol(
      blocks.column(
        [
          blocks.heading("Accent right (fit)", 3),
          blocks.paragraph("Short supporting copy goes here."),
          blocks.paragraph("Add one more line if needed."),
        ],
        { padding: "md", gap: "sm", fill: true, justify: "center" }
      ),
      blocks.column(
        [
          blocks.column(
            [
              blocks.imageBlock({
                src: "https://placehold.co/240x200/png",
                size: "fit",
              }),
            ],
            { backgroundColor: "#f1f5f9", padding: "md", gap: "sm", borderRadius: "lg", align: "center" }
          ),
        ],
        {
          padding: "md",
          fill: true,
          justify: "center",
          align: "center",
        }
      )
    ),
};

const accentLeftFit: PresetTemplate = {
  key: "tpl.accentLeftFit",
  label: "Accent left (fit)",
  description: "Compact image card on the left, text on the right",
  icon: accentLeftFitIcon,
  build: () =>
    slide.twoCol(
      blocks.column(
        [
          blocks.column(
            [
              blocks.imageBlock({
                src: "https://placehold.co/240x200/png",
                size: "fit",
              }),
            ],
            { backgroundColor: "#f1f5f9", padding: "md", gap: "sm", borderRadius: "lg", align: "center" }
          ),
        ],
        {
          padding: "md",
          fill: true,
          justify: "center",
          align: "center",
        }
      ),
      blocks.column(
        [
          blocks.heading("Accent left (fit)", 3),
          blocks.paragraph("Short supporting copy goes here."),
          blocks.paragraph("Add one more line if needed."),
        ],
        { padding: "md", gap: "sm", fill: true, justify: "center" }
      )
    ),
};

const twoImageColumns: PresetTemplate = {
  key: "tpl.twoImageColumns",
  label: "2 image columns",
  description: "Header with two image cards",
  icon: twoImageColumnsIcon,
  build: () => ({
    type: "slide",
    attrs: { id: "slide-1", size: "16x9" },
    content: [
      blocks.heading("Images", 2),
      blocks.columnGroup([
        blocks.column(
          [
            blocks.imageBlock({
              src: "https://placehold.co/640x360/png",
              size: "fit",
            }),
            blocks.heading("Image title", 4),
            blocks.paragraph("Short supporting copy goes here."),
          ],
          { padding: "md", gap: "sm", fill: true }
        ),
        blocks.column(
          [
            blocks.imageBlock({
              src: "https://placehold.co/640x360/png",
              size: "fit",
            }),
            blocks.heading("Image title", 4),
            blocks.paragraph("Short supporting copy goes here."),
          ],
          { padding: "md", gap: "sm", fill: true }
        ),
      ]),
    ],
  }),
};

const registry: Record<PresetKey, PresetTemplate> = {
  "tpl.titleAndSubheader": titleAndSubheader,
  "tpl.accentLeft": accentLeft,
  "tpl.accentRight": accentRight,
  "tpl.accentTop": accentTop,
  "tpl.accentRightFit": accentRightFit,
  "tpl.accentLeftFit": accentLeftFit,
  "tpl.imageAndText": imageAndText,
  "tpl.textAndImage": textAndImage,
  "tpl.twoColumns": twoColumns,
  "tpl.twoColumnsWithHeader": twoColumnsWithHeader,
  "tpl.threeColumns": threeColumns,
  "tpl.threeColumnsWithHeader": threeColumnsWithHeader,
  "tpl.fourColumns": fourColumns,
  "tpl.fourColumnsWithHeader": fourColumnsWithHeader,
  "tpl.titleWithBullets": titleWithBullets,
  "tpl.titleBulletsAndImage": titleBulletsAndImage,
  "tpl.fullImage": fullImage,
  "tpl.twoImageColumns": twoImageColumns,

};

export const listPresetTemplates = (): PresetTemplate[] => Object.values(registry);

export const buildPresetTemplate = (key: PresetKey): SlideNode => registry[key].build();

export type { PresetTemplate };
