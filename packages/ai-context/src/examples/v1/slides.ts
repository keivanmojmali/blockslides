export const slides = `
Examples: Slides (full-document output)

{
  "type": "doc",
  "content": [
    {
      "type": "slide",
      "attrs": { "id": "intro", "size": "16x9" },
      "content": [
        {
          "type": "row",
          "attrs": { "layout": "1-1" },
          "content": [
            { "type": "column", "content": [
              { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Welcome" }] }
            ]},
            { "type": "column", "content": [
              { "type": "imageBlock", "attrs": { "src": "https://picsum.photos/seed/welcome/1200/800", "layout": "cover", "align": "center" } }
            ]}
          ]
        }
      ]
    }
  ]
}

/* more-slide-examples to be added here */
`.trim();


