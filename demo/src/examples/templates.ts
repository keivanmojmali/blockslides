/**
 * Sample deck built from presets in @blockslides/ai-context.
 */

import { templatesV1 } from "@blockslides/ai-context";

const { listPresetTemplates, buildPresetTemplate, a } = templatesV1;

const presetSlides = listPresetTemplates().map((preset) => buildPresetTemplate(preset.key));

export const templatesSampleDeck = {
  type: "doc",
  content: [a.build()],
} as const;
