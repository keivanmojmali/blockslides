/**
 * Exporters Tests
 */

import {
  exportToJSON,
  exportToText,
  exportToHTML,
  exportToMarkdown,
} from "../exporters";
import type { DocNode } from "../../types";

describe("Exporters", () => {
  const sampleDoc: DocNode = {
    type: "doc",
    content: [
      {
        type: "slide",
        content: [
          {
            type: "row",
            content: [
              {
                type: "column",
                content: [
                  {
                    type: "heading",
                    attrs: { level: 1 },
                    content: [{ type: "text", text: "Slide 1 Title" }],
                  },
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Slide 1 content." }],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "slide",
        content: [
          {
            type: "row",
            content: [
              {
                type: "column",
                content: [
                  {
                    type: "heading",
                    attrs: { level: 2 },
                    content: [{ type: "text", text: "Slide 2 Title" }],
                  },
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Slide 2 content." }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  describe("exportToJSON", () => {
    it("should export to pretty JSON by default", () => {
      const json = exportToJSON(sampleDoc);

      expect(typeof json).toBe("string");
      expect(json).toContain('"type": "doc"');
      expect(json).toContain("\n"); // Pretty print includes newlines
    });

    it("should export to minified JSON when pretty is false", () => {
      const json = exportToJSON(sampleDoc, false);

      expect(typeof json).toBe("string");
      expect(json).toContain('"type":"doc"');
      const prettyJson = exportToJSON(sampleDoc, true);
      expect(json.length).toBeLessThan(prettyJson.length);
    });

    it("should preserve all document structure", () => {
      const json = exportToJSON(sampleDoc);
      const parsed = JSON.parse(json);

      expect(parsed.type).toBe("doc");
      expect(parsed.content).toHaveLength(2);
      expect(parsed.content[0].type).toBe("slide");
    });

    it("should handle empty document", () => {
      const emptyDoc: DocNode = {
        type: "doc",
        content: [],
      };

      const json = exportToJSON(emptyDoc);
      expect(json).toContain('"content"');
      const parsed = JSON.parse(json);
      expect(parsed.content).toEqual([]);
    });
  });

  describe("exportToText", () => {
    it("should export to plain text", () => {
      const text = exportToText(sampleDoc);

      expect(typeof text).toBe("string");
      expect(text).toContain("Slide 1 Title");
      expect(text).toContain("Slide 1 content");
      expect(text).toContain("Slide 2 Title");
    });

    it("should include slide separators", () => {
      const text = exportToText(sampleDoc);

      expect(text).toContain("=== Slide 1 ===");
      expect(text).toContain("=== Slide 2 ===");
    });

    it("should handle empty slides", () => {
      const docWithEmptySlide: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [],
          },
        ],
      };

      const text = exportToText(docWithEmptySlide);
      expect(text).toContain("=== Slide 1 ===");
    });

    it("should handle document with no content", () => {
      const emptyDoc: DocNode = {
        type: "doc",
        content: [],
      };

      const text = exportToText(emptyDoc);
      expect(text).toBe("");
    });

    it("should handle nested content structures", () => {
      const docWithNestedContent: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          { type: "text", text: "First " },
                          { type: "text", text: "paragraph" },
                        ],
                      },
                      {
                        type: "paragraph",
                        content: [{ type: "text", text: "Second paragraph" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const text = exportToText(docWithNestedContent);
      expect(text).toContain("First paragraph");
      expect(text).toContain("Second paragraph");
    });
  });

  describe("exportToHTML", () => {
    it("should export to HTML", () => {
      const html = exportToHTML(sampleDoc);

      expect(typeof html).toBe("string");
      expect(html).toContain("<html");
      expect(html).toContain("</html>");
      expect(html).toContain("Slide 1 Title");
    });

    it("should include styles by default", () => {
      const html = exportToHTML(sampleDoc);

      expect(html).toContain("<style>");
      expect(html).toContain("</style>");
    });

    it("should exclude styles when includeStyles is false", () => {
      const html = exportToHTML(sampleDoc, { includeStyles: false });

      expect(html).not.toContain("<style>");
    });

    it("should include slide numbers when requested", () => {
      const html = exportToHTML(sampleDoc, { slideNumbers: true });

      expect(html).toContain("Slide 1 Title");
      expect(html).toContain("Slide 2 Title");
    });

    it("should handle empty document", () => {
      const emptyDoc: DocNode = {
        type: "doc",
        content: [],
      };

      const html = exportToHTML(emptyDoc);
      expect(html).toContain("<html");
      expect(html).toContain("</html>");
    });

    it("should handle slides with different heading levels", () => {
      const html = exportToHTML(sampleDoc);

      expect(html).toContain("Slide 1 Title"); // h1
      expect(html).toContain("Slide 2 Title"); // h2
    });

    it("should generate valid HTML structure", () => {
      const html = exportToHTML(sampleDoc);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<head>");
      expect(html).toContain("</head>");
      expect(html).toContain("<body>");
      expect(html).toContain("</body>");
    });

    it("should handle both includeStyles and slideNumbers options", () => {
      const html = exportToHTML(sampleDoc, {
        includeStyles: true,
        slideNumbers: true,
      });

      expect(html).toContain("<style>");
      expect(html).toContain("Slide");
    });

    it("should handle images", () => {
      const docWithImage: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "image",
                        attrs: {
                          src: "test.jpg",
                          alt: "Test Image",
                          width: 500,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithImage);
      expect(html).toContain("<img");
      expect(html).toContain('src="test.jpg"');
      expect(html).toContain('alt="Test Image"');
      expect(html).toContain('width="500"');
    });

    it("should handle videos", () => {
      const docWithVideo: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "video",
                        attrs: { src: "test.mp4" },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithVideo);
      expect(html).toContain("<video");
      expect(html).toContain('src="test.mp4"');
      expect(html).toContain("controls");
    });

    it("should handle bullet lists", () => {
      const docWithList: any = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "bulletList",
                        content: [
                          {
                            type: "listItem",
                            content: [
                              {
                                type: "paragraph",
                                content: [{ type: "text", text: "Item 1" }],
                              },
                            ],
                          },
                          {
                            type: "listItem",
                            content: [
                              {
                                type: "paragraph",
                                content: [{ type: "text", text: "Item 2" }],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithList);
      expect(html).toContain("<ul>");
      expect(html).toContain("<li>");
      expect(html).toContain("Item 1");
      expect(html).toContain("Item 2");
    });

    it("should handle ordered lists", () => {
      const docWithOrderedList: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "orderedList",
                        content: [
                          {
                            type: "listItem",
                            content: [
                              {
                                type: "paragraph",
                                content: [{ type: "text", text: "First" }],
                              },
                            ],
                          },
                          {
                            type: "listItem",
                            content: [
                              {
                                type: "paragraph",
                                content: [{ type: "text", text: "Second" }],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithOrderedList);
      expect(html).toContain("<ol>");
      expect(html).toContain("<li>");
      expect(html).toContain("First");
      expect(html).toContain("Second");
    });

    it("should handle code blocks", () => {
      // Note: codeBlock type may not be in the schema, testing the converter logic
      const docWithCodeBlock: any = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "codeBlock",
                        content: [{ type: "text", text: "const x = 42;" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithCodeBlock);
      expect(html).toContain("<pre>");
      expect(html).toContain("<code>");
      expect(html).toContain("const x = 42;");
    });

    it("should handle bold marks", () => {
      const docWithBold: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Bold text",
                            marks: [{ type: "bold" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithBold);
      expect(html).toContain("<strong>Bold text</strong>");
    });

    it("should handle italic marks", () => {
      const docWithItalic: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Italic text",
                            marks: [{ type: "italic" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithItalic);
      expect(html).toContain("<em>Italic text</em>");
    });

    it("should handle underline marks", () => {
      const docWithUnderline: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Underlined",
                            marks: [{ type: "underline" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithUnderline);
      expect(html).toContain("<u>Underlined</u>");
    });

    it("should handle strikethrough marks", () => {
      const docWithStrike: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Strikethrough",
                            marks: [{ type: "strikethrough" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithStrike);
      expect(html).toContain("<s>Strikethrough</s>");
    });

    it("should handle code marks", () => {
      const docWithCodeMark: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "code",
                            marks: [{ type: "code" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithCodeMark);
      expect(html).toContain("<code>code</code>");
    });

    it("should handle link marks with title", () => {
      const docWithLink: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Link text",
                            marks: [
                              {
                                type: "link",
                                attrs: {
                                  href: "https://example.com",
                                  title: "Example Site",
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithLink);
      expect(html).toContain('<a href="https://example.com"');
      expect(html).toContain('title="Example Site"');
      expect(html).toContain("Link text</a>");
    });

    it("should handle text color marks", () => {
      const docWithTextColor: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Colored text",
                            marks: [
                              {
                                type: "textColor",
                                attrs: { color: "#ff0000" },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithTextColor);
      expect(html).toContain('style="color: #ff0000"');
      expect(html).toContain("Colored text");
    });

    it("should handle highlight marks", () => {
      const docWithHighlight: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Highlighted",
                            marks: [
                              {
                                type: "highlight",
                                attrs: { color: "#ffff00" },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithHighlight);
      expect(html).toContain('style="background-color: #ffff00"');
      expect(html).toContain("Highlighted");
    });

    it("should escape HTML special characters", () => {
      const docWithSpecialChars: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: '<script>alert("xss")</script>',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const html = exportToHTML(docWithSpecialChars);
      expect(html).toContain("&lt;script&gt;");
      expect(html).not.toContain("<script>");
    });
  });

  describe("exportToMarkdown", () => {
    it("should export to markdown", () => {
      const markdown = exportToMarkdown(sampleDoc);

      expect(typeof markdown).toBe("string");
      expect(markdown).toContain("# Slide 1 Title");
      expect(markdown).toContain("Slide 1 content");
    });

    it("should include slide separators", () => {
      const markdown = exportToMarkdown(sampleDoc);

      expect(markdown).toContain("---");
    });

    it("should handle headings at different levels", () => {
      const markdown = exportToMarkdown(sampleDoc);

      expect(markdown).toContain("# Slide 1 Title"); // h1
      expect(markdown).toContain("## Slide 2 Title"); // h2
    });

    it("should handle empty document", () => {
      const emptyDoc: DocNode = {
        type: "doc",
        content: [],
      };

      const markdown = exportToMarkdown(emptyDoc);
      expect(typeof markdown).toBe("string");
    });

    it("should handle slides with no content", () => {
      const docWithEmptySlide: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithEmptySlide);
      expect(markdown).toBeTruthy();
    });

    it("should format bullet lists", () => {
      const docWithList: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "bulletList",
                        content: [
                          {
                            type: "listItem",
                            content: [
                              {
                                type: "paragraph",
                                content: [{ type: "text", text: "Item 1" }],
                              },
                            ],
                          },
                          {
                            type: "listItem",
                            content: [
                              {
                                type: "paragraph",
                                content: [{ type: "text", text: "Item 2" }],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithList);
      expect(markdown).toContain("- Item 1");
      expect(markdown).toContain("- Item 2");
    });

    it("should format ordered lists", () => {
      const docWithOrderedList: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "orderedList",
                        content: [
                          {
                            type: "listItem",
                            content: [
                              {
                                type: "paragraph",
                                content: [{ type: "text", text: "First" }],
                              },
                            ],
                          },
                          {
                            type: "listItem",
                            content: [
                              {
                                type: "paragraph",
                                content: [{ type: "text", text: "Second" }],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithOrderedList);
      expect(markdown).toContain("1. First");
      expect(markdown).toContain("2. Second");
    });

    it("should handle code blocks in markdown", () => {
      const docWithCodeBlock: any = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "codeBlock",
                        content: [{ type: "text", text: "const x = 42;" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithCodeBlock);
      expect(markdown).toContain("```");
      expect(markdown).toContain("const x = 42;");
    });

    it("should handle images in markdown", () => {
      const docWithImage: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "image",
                        attrs: {
                          src: "test.jpg",
                          alt: "Test Image",
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithImage);
      expect(markdown).toContain("![Test Image](test.jpg)");
    });

    it("should handle videos in markdown", () => {
      const docWithVideo: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "video",
                        attrs: { src: "test.mp4" },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithVideo);
      expect(markdown).toContain("[Video: test.mp4]");
    });

    it("should handle formatted text", () => {
      const docWithMarks: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Bold text",
                            marks: [{ type: "bold" }],
                          },
                          { type: "text", text: " and " },
                          {
                            type: "text",
                            text: "italic text",
                            marks: [{ type: "italic" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithMarks);
      expect(markdown).toContain("**Bold text**");
      expect(markdown).toContain("*italic text*");
    });

    it("should handle bold and italic combined", () => {
      const docWithBoldItalic: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Bold and italic",
                            marks: [{ type: "bold" }, { type: "italic" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithBoldItalic);
      expect(markdown).toContain("***Bold and italic***");
    });

    it("should handle code marks in markdown", () => {
      const docWithCode: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "code",
                            marks: [{ type: "code" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithCode);
      expect(markdown).toContain("`code`");
    });

    it("should handle strikethrough marks in markdown", () => {
      const docWithStrike: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "strikethrough",
                            marks: [{ type: "strikethrough" }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithStrike);
      expect(markdown).toContain("~~strikethrough~~");
    });

    it("should handle links in markdown", () => {
      const docWithLink: DocNode = {
        type: "doc",
        content: [
          {
            type: "slide",
            content: [
              {
                type: "row",
                content: [
                  {
                    type: "column",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Link text",
                            marks: [
                              {
                                type: "link",
                                attrs: { href: "https://example.com" },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const markdown = exportToMarkdown(docWithLink);
      expect(markdown).toContain("[Link text](https://example.com)");
    });
  });

  describe("Export consistency", () => {
    it("should maintain content across export formats", () => {
      const json = exportToJSON(sampleDoc);
      const text = exportToText(sampleDoc);
      const html = exportToHTML(sampleDoc);
      const markdown = exportToMarkdown(sampleDoc);

      // All exports should contain the same core content
      expect(json).toContain("Slide 1 Title");
      expect(text).toContain("Slide 1 Title");
      expect(html).toContain("Slide 1 Title");
      expect(markdown).toContain("Slide 1 Title");
    });
  });
});
