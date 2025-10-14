/**
 * Content Export Utilities
 * 
 * Provides functions to export presentations in multiple formats:
 * - JSON (ProseMirror document format)
 * - HTML (standalone or embedded)
 * - Markdown (with slide separators)
 * - Plain Text (readable format)
 */

import type { DocNode } from '../types/index';

/**
 * Export to JSON format
 * @param content - Document content
 * @param pretty - Pretty-print with indentation
 * @returns JSON string
 */
export function exportToJSON(content: DocNode, pretty: boolean = true): string {
  return JSON.stringify(content, null, pretty ? 2 : 0);
}

/**
 * Export to Plain Text format
 * Extracts text content from all nodes with slide separators
 * @param content - Document content
 * @returns Plain text string
 */
export function exportToText(content: DocNode): string {
  let text = '';
  
  content.content?.forEach((slide, index) => {
    text += `\n=== Slide ${index + 1} ===\n\n`;
    text += extractTextFromSlide(slide);
  });
  
  return text.trim();
}

/**
 * Extract text from a slide node
 */
function extractTextFromSlide(slide: any): string {
  let text = '';
  
  const extractFromBlocks = (blocks: any[]): string => {
    if (!Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      if (block.type === 'text') {
        return block.text || '';
      }
      if (block.content) {
        return extractFromBlocks(block.content);
      }
      return '';
    }).join('');
  };
  
  if (slide.content && Array.isArray(slide.content)) {
    slide.content.forEach((row: any) => {
      if (row.content && Array.isArray(row.content)) {
        row.content.forEach((column: any) => {
          if (column.content) {
            text += extractFromBlocks(column.content) + '\n';
          }
        });
      }
    });
  }
  
  return text + '\n';
}

/**
 * Export to HTML format
 * @param content - Document content
 * @param options - Export options (includeStyles, slideNumbers)
 * @returns HTML string
 */
export function exportToHTML(content: DocNode, options: {
  includeStyles?: boolean;
  slideNumbers?: boolean;
} = {}): string {
  const { includeStyles = true, slideNumbers = false } = options;
  
  let html = includeStyles ? getHTMLTemplate('start') : '';
  
  html += '<div class="presentation">\n';
  
  content.content?.forEach((slide, index) => {
    html += `  <div class="slide">\n`;
    if (slideNumbers) {
      html += `    <div class="slide-number">${index + 1}</div>\n`;
    }
    html += convertSlideToHTML(slide);
    html += '  </div>\n';
  });
  
  html += '</div>\n';
  html += includeStyles ? getHTMLTemplate('end') : '';
  
  return html;
}

/**
 * Convert a slide node to HTML
 */
function convertSlideToHTML(slide: any): string {
  let html = '';
  
  const convertBlocks = (blocks: any[]): string => {
    if (!Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          return `    <p>${convertInline(block.content || [])}</p>\n`;
        case 'heading':
          const level = block.attrs?.level || 1;
          return `    <h${level}>${convertInline(block.content || [])}</h${level}>\n`;
        case 'image':
          const alt = block.attrs?.alt || '';
          const src = block.attrs?.src || '';
          const width = block.attrs?.width ? ` width="${block.attrs.width}"` : '';
          return `    <img src="${src}" alt="${alt}"${width}>\n`;
        case 'video':
          return `    <video src="${block.attrs?.src || ''}" controls></video>\n`;
        case 'bulletList':
          return `    <ul>\n${convertBlocks(block.content || []).replace(/^/gm, '  ')}</ul>\n`;
        case 'orderedList':
          return `    <ol>\n${convertBlocks(block.content || []).replace(/^/gm, '  ')}</ol>\n`;
        case 'listItem':
          return `    <li>${convertInline(block.content || [])}</li>\n`;
        case 'codeBlock':
          const code = extractTextFromBlocks(block.content || []);
          return `    <pre><code>${escapeHTML(code)}</code></pre>\n`;
        default:
          return '';
      }
    }).join('');
  };
  
  const convertInline = (inlines: any[]): string => {
    if (!Array.isArray(inlines)) return '';
    
    return inlines.map(node => {
      if (node.type === 'text') {
        let text = escapeHTML(node.text || '');
        if (node.marks && Array.isArray(node.marks)) {
          // Apply marks in reverse order to properly nest them
          const marks = [...node.marks].reverse();
          marks.forEach((mark: any) => {
            switch (mark.type) {
              case 'bold':
                text = `<strong>${text}</strong>`;
                break;
              case 'italic':
                text = `<em>${text}</em>`;
                break;
              case 'underline':
                text = `<u>${text}</u>`;
                break;
              case 'strikethrough':
                text = `<s>${text}</s>`;
                break;
              case 'code':
                text = `<code>${text}</code>`;
                break;
              case 'link':
                const href = mark.attrs?.href || '#';
                const title = mark.attrs?.title ? ` title="${escapeHTML(mark.attrs.title)}"` : '';
                text = `<a href="${escapeHTML(href)}"${title}>${text}</a>`;
                break;
              case 'textColor':
                text = `<span style="color: ${mark.attrs?.color}">${text}</span>`;
                break;
              case 'highlight':
                text = `<span style="background-color: ${mark.attrs?.color}">${text}</span>`;
                break;
            }
          });
        }
        return text;
      }
      return '';
    }).join('');
  };
  
  if (slide.content && Array.isArray(slide.content)) {
    slide.content.forEach((row: any) => {
      if (row.content && Array.isArray(row.content)) {
        row.content.forEach((column: any) => {
          if (column.content) {
            html += convertBlocks(column.content || []);
          }
        });
      }
    });
  }
  
  return html;
}

/**
 * Export to Markdown format
 * @param content - Document content
 * @returns Markdown string
 */
export function exportToMarkdown(content: DocNode): string {
  let markdown = '';
  
  content.content?.forEach((slide, index) => {
    if (index > 0) {
      markdown += '\n---\n\n';
    }
    markdown += `<!-- Slide ${index + 1} -->\n\n`;
    markdown += convertSlideToMarkdown(slide);
  });
  
  return markdown.trim();
}

/**
 * Convert a slide node to Markdown
 */
function convertSlideToMarkdown(slide: any): string {
  let markdown = '';
  
  const convertBlocks = (blocks: any[]): string => {
    if (!Array.isArray(blocks)) return '';
    
    return blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          return convertInlineToMd(block.content || []) + '\n\n';
        case 'heading':
          const level = block.attrs?.level || 1;
          return `${'#'.repeat(level)} ${convertInlineToMd(block.content || [])}\n\n`;
        case 'image':
          const alt = block.attrs?.alt || '';
          const src = block.attrs?.src || '';
          return `![${alt}](${src})\n\n`;
        case 'video':
          return `[Video: ${block.attrs?.src || ''}]\n\n`;
        case 'bulletList':
          return convertListToMd(block.content || [], '-') + '\n';
        case 'orderedList':
          return convertListToMd(block.content || [], '1.') + '\n';
        case 'codeBlock':
          const code = extractTextFromBlocks(block.content || []);
          return `\`\`\`\n${code}\n\`\`\`\n\n`;
        default:
          return '';
      }
    }).join('');
  };
  
  const convertInlineToMd = (inlines: any[]): string => {
    if (!Array.isArray(inlines)) return '';
    
    return inlines.map(node => {
      if (node.type === 'text') {
        let text = node.text || '';
        if (node.marks && Array.isArray(node.marks)) {
          // Apply marks
          const hasBold = node.marks.some((m: any) => m.type === 'bold');
          const hasItalic = node.marks.some((m: any) => m.type === 'italic');
          const hasCode = node.marks.some((m: any) => m.type === 'code');
          const hasStrike = node.marks.some((m: any) => m.type === 'strikethrough');
          const link = node.marks.find((m: any) => m.type === 'link');
          
          if (hasCode) text = `\`${text}\``;
          if (hasStrike) text = `~~${text}~~`;
          if (hasBold && hasItalic) text = `***${text}***`;
          else if (hasBold) text = `**${text}**`;
          else if (hasItalic) text = `*${text}*`;
          if (link) text = `[${text}](${link.attrs?.href || '#'})`;
        }
        return text;
      }
      return '';
    }).join('');
  };
  
  const convertListToMd = (items: any[], bullet: string): string => {
    if (!Array.isArray(items)) return '';
    
    return items.map((item, index) => {
      const marker = bullet === '1.' ? `${index + 1}.` : bullet;
      const content = convertInlineToMd(item.content || []);
      return `${marker} ${content}`;
    }).join('\n') + '\n';
  };
  
  if (slide.content && Array.isArray(slide.content)) {
    slide.content.forEach((row: any) => {
      if (row.content && Array.isArray(row.content)) {
        row.content.forEach((column: any) => {
          if (column.content) {
            markdown += convertBlocks(column.content || []);
          }
        });
      }
    });
  }
  
  return markdown;
}

/**
 * Helper: Extract text from blocks recursively
 */
function extractTextFromBlocks(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  
  return blocks.map(block => {
    if (block.type === 'text') {
      return block.text || '';
    }
    if (block.content) {
      return extractTextFromBlocks(block.content);
    }
    return '';
  }).join('');
}

/**
 * Helper: Escape HTML special characters
 */
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * HTML Template
 * Returns the start or end of a complete HTML document
 */
function getHTMLTemplate(part: 'start' | 'end'): string {
  if (part === 'start') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presentation</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .presentation {
      max-width: 1200px;
      margin: 0 auto;
    }
    .slide {
      margin-bottom: 40px;
      padding: 40px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #fff;
      position: relative;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .slide-number {
      position: absolute;
      top: 10px;
      right: 10px;
      color: #999;
      font-size: 14px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      margin-bottom: 0.5em;
    }
    p {
      margin: 0 0 1em 0;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    video {
      max-width: 100%;
      height: auto;
    }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
    }
    pre {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    ul, ol {
      margin: 0 0 1em 0;
      padding-left: 2em;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
`;
  }
  return `</body>
</html>`;
}

/**
 * Download a file to the user's computer
 * @param content - File content as string
 * @param filename - Filename (without extension)
 * @param mimeType - MIME type of the file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

