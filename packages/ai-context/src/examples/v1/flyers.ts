export const flyers = `
Examples: Flyers (A4 slides; full-document output)

{
  "type": "doc",
  "content": [
    {
      "type": "slide",
      "attrs": { "id": "a4-flyer", "size": "a4-portrait", "className": "bg-white text-slate-900" },
      "content": [
        {
          "type": "row",
          "attrs": { "layout": "1" },
          "content": [
            { "type": "column", "content": [
              { "type": "heading", "attrs": { "level": 2 }, "content": [{ "type": "text", "text": "Event Title" }] },
              { "type": "paragraph", "content": [{ "type": "text", "text": "Date · Location" }] },
              { "type": "imageBlock", "attrs": { "src": "https://picsum.photos/seed/a4/1600/1000", "layout": "contain", "align": "center", "height": 320 } }
            ]}
          ]
        }
      ]
    }
  ]
}

/* more-flyer-examples to be added here */
`.trim();


