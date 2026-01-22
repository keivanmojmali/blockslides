export type SizeKey =
  | "16x9"
  | "4x3"
  | "a4-portrait"
  | "a4-landscape"
  | "letter-portrait"
  | "letter-landscape"
  | "linkedin-banner";

export type SpacingToken = "none" | "sm" | "md" | "lg";
export type BorderRadiusToken = "none" | "sm" | "md" | "lg";
export type AlignValue = "left" | "center" | "right" | "stretch";
export type JustifyValue = "start" | "center" | "end" | "space-between";

export interface SlideAttrs {
  id?: string | null;
  className?: string | null;
  size?: SizeKey | null;
}

/**
 * Base attributes shared by all block types
 */
export interface BaseBlockAttrs {
  align?: AlignValue | null;
  justify?: JustifyValue | null;
  padding?: SpacingToken | string | null;
  margin?: SpacingToken | string | null;
  gap?: SpacingToken | string | null;
  backgroundColor?: string | null;
  backgroundImage?: string | null;
  borderRadius?: BorderRadiusToken | string | null;
  border?: string | null;
  fill?: boolean | null;
  width?: string | null;
  height?: string | null;
}

export interface ColumnAttrs extends BaseBlockAttrs {
  // No column-specific attributes, all from BaseBlockAttrs
}

export type ImageBlockSize = "fill" | "fit" | "natural";
export type ImageBlockCrop = 
  | "center" 
  | "top" 
  | "bottom" 
  | "left" 
  | "right" 
  | "top-left" 
  | "top-right" 
  | "bottom-left" 
  | "bottom-right";

export interface ImageBlockAttrs extends BaseBlockAttrs {
  src: string;
  assetId?: string | null;
  alt?: string;
  caption?: string;
  credit?: string;
  size?: ImageBlockSize | null;
  crop?: ImageBlockCrop | null;
  // Deprecated attributes (kept for backwards compatibility)
  layout?: "cover" | "contain" | "fill" | "focus" | "pattern" | null;
  fullBleed?: boolean;
  focalX?: number | null;
  focalY?: number | null;
}


