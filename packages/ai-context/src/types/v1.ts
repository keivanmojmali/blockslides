export type SizeKey =
  | "16x9"
  | "4x3"
  | "a4-portrait"
  | "a4-landscape"
  | "letter-portrait"
  | "letter-landscape"
  | "linkedin-banner";

export interface SlideAttrs {
  id?: string | null;
  className?: string | null;
  size?: SizeKey | null;
}

export interface RowAttrs {
  layout?:
    | ""
    | "1"
    | "1-1"
    | "2-1"
    | "1-2"
    | "1-1-1"
    | "2-1-1"
    | "1-2-1"
    | "1-1-2"
    | "1-1-1-1"
    | null;
  className?: string | null;
}

export interface ColumnAttrs {
  className?: string | null;
  contentMode?: "default";
  verticalAlign?: "top" | "center" | "bottom";
  horizontalAlign?: "left" | "center" | "right" | "stretch";
  padding?: "none";
}

export interface ImageBlockAttrs {
  src: string;
  assetId?: string | null;
  alt?: string;
  caption?: string;
  credit?: string;
  layout?: "cover" | "contain" | "fill" | "focus" | "pattern" | null;
  align?: "left" | "center" | "right" | "stretch" | null;
  width?: string | number | null;
  height?: string | number | null;
  fullBleed?: boolean;
  focalX?: number | null;
  focalY?: number | null;
}


