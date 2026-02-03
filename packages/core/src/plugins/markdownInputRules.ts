/**
 * Markdown Input Rules Plugin
 * 
 * Provides markdown syntax support for text formatting, headings, lists, and links.
 * Users can type markdown syntax and it will automatically convert to formatted content.
 */

import {
  InputRule,
  inputRules,
  textblockTypeInputRule,
  wrappingInputRule,
} from "@blockslides/pm/inputrules";
import { MarkType, Schema } from "@blockslides/pm/model";
import { Plugin, EditorState } from "@blockslides/pm/state";

/**
 * Create an input rule for marks (bold, italic, code, etc.)
 */
function markInputRule(regexp: RegExp, markType: MarkType, getAttrs?: any): InputRule {
  return new InputRule(regexp, (state: EditorState, match: RegExpMatchArray, start: number, end: number) => {
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const { tr } = state;
    
    if (match[1]) {
      const textStart = start + match[0].indexOf(match[1]);
      const textEnd = textStart + match[1].length;
      
      if (textEnd < end) tr.delete(textEnd, end);
      if (textStart > start) tr.delete(start, textStart);
      
      end = start + match[1].length;
    }
    
    tr.addMark(start, end, markType.create(attrs));
    tr.removeStoredMark(markType);
    
    return tr;
  });
}

/**
 * Create an input rule for links [text](url)
 */
function linkInputRule(markType: MarkType): InputRule {
  return new InputRule(
    /\[([^\]]+)\]\(([^)]+)\)$/,
    (state: EditorState, match: RegExpMatchArray, start: number, end: number) => {
      const [, text, href] = match;
      const { tr } = state;
      
      // Delete the markdown syntax
      tr.delete(start, end);
      
      // Insert the link text with the link mark
      const linkMark = markType.create({ href, title: null, target: '_blank' });
      tr.insertText(text, start);
      tr.addMark(start, start + text.length, linkMark);
      
      return tr;
    }
  );
}

/**
 * Create markdown input rules plugin
 * 
 * Supports:
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Code: `text`
 * - Strikethrough: ~~text~~
 * - Links: [text](url)
 * - Headings: # through ######
 * - Bullet lists: -, *, +
 * - Ordered lists: 1., 2., etc.
 */
export function createMarkdownInputRules(schema: Schema): Plugin {
  const rules: InputRule[] = [];

  // Bold: **text** or __text__
  if (schema.marks.bold) {
    rules.push(
      markInputRule(/\*\*([^*]+)\*\*$/, schema.marks.bold),
      markInputRule(/__([^_]+)__$/, schema.marks.bold)
    );
  }

  // Italic: *text* or _text_
  // Need to be careful not to conflict with bold or bullet lists
  if (schema.marks.italic) {
    rules.push(
      markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, schema.marks.italic),
      markInputRule(/(?:^|[^_])(_([^_]+)_)$/, schema.marks.italic)
    );
  }

  // Code: `text`
  if (schema.marks.code) {
    rules.push(
      markInputRule(/`([^`]+)`$/, schema.marks.code)
    );
  }

  // Strikethrough: ~~text~~
  if (schema.marks.strikethrough) {
    rules.push(
      markInputRule(/~~([^~]+)~~$/, schema.marks.strikethrough)
    );
  }

  // Links: [text](url)
  if (schema.marks.link) {
    rules.push(linkInputRule(schema.marks.link));
  }

  // Headings: # text, ## text, ### text, etc. (levels 1-6)
  if (schema.nodes.heading) {
    for (let level = 1; level <= 6; level++) {
      rules.push(
        textblockTypeInputRule(
          new RegExp(`^(#{${level}})\\s$`),
          schema.nodes.heading,
          () => ({ level })
        )
      );
    }
  }

  // Bullet list: -, *, or +
  if (schema.nodes.bulletList) {
    rules.push(
      wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bulletList)
    );
  }

  // Ordered list: 1. or 1) 
  if (schema.nodes.orderedList) {
    rules.push(
      wrappingInputRule(
        /^(\d+)\.\s$/,
        schema.nodes.orderedList,
        match => ({ start: +match[1] }),
        (match, node) => node.childCount + node.attrs.start === +match[1]
      )
    );
  }

  return inputRules({ rules });
}

