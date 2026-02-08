# Start here

Blockslides is a ProseMirror-based toolkit for building editors that create **visual assets**.

- **Slide-first**: your content is organized into slides (containers with dimensions + layout)
- **Slides can be many things**: decks, social graphics, printables, landing page heroes, and more
- **Headless + composable**: embed it in your app, bring your UI, and assemble features via extensions

## Why Blockslides exists

Most editors are built for **documents** (a single, scrolling page). Blockslides is built for **assets** (bounded canvases with layouts).

- **Bounded by design**: each slide has dimensions, so layout decisions are first-class
- **Mix asset types**: a 16:9 slide, an A4 handout, and a social graphic can live in the same document
- **Structured content**: everything is stored as JSON, so it’s easy to render, export, transform, or feed into AI workflows

## Core concepts

Blockslides is built around four main concepts:

**Slides** are containers for your visual assets. Each slide has its own dimensions (like 16:9, A4 portrait, or Instagram square) and contains the layout and content for that asset. Your editor's document is simply an array of slides, and each slide can represent a different type of asset.

**Blocks** are the content pieces inside your slides: paragraphs, headings, images, lists, tables, code blocks, and more. Blocks can nest inside each other to create rich hierarchical content.

**Extensions** are modular pieces of code that add functionality to your editor. Some extensions define block types (like the Heading extension or ImageBlock extension), while others add editor behaviors (like undo/redo, drag-and-drop, or keyboard shortcuts). You compose only the extensions you need.

**Schemas** define the structure of your content as JSON. Every slide, block, and piece of text follows a schema that describes what it is, what attributes it has, and what it can contain. This structured format makes it easy to validate, transform, export, or process your content programmatically.

::: tip Learn more
Check out the **Foundations** section for detailed explanations of [what you can make](/foundations/what-can-you-make), [what blocks are](/foundations/what-are-blocks), [what the schemas look like](/foundations/what-are-the-schemas), and [how extensions work](/foundations/what-are-extensions).
:::

## What you get

Blockslides provides everything you need to build a visual asset editor:

### Editor runtime
A full-featured editor core built on ProseMirror with slide-specific architecture. The `@blockslides/core` package handles document state, transactions, commands, and all the complex editing logic.

### 50+ pre-built extensions
Text formatting (bold, italic, colors, fonts), media embeds (images with advanced controls, YouTube videos), layout primitives (rows, columns, multi-column layouts), tables, math expressions, markdown support, and editor behaviors (undo/redo, drag-and-drop, keyboard shortcuts, file handling).

### React integration
The `@blockslides/react` package provides hooks and components that make it simple to integrate Blockslides into React applications. Vue support is coming soon, and the core is framework-agnostic so you can use it with vanilla JavaScript or any framework.

### Extension Kit
A pre-configured bundle of all extensions with sensible defaults. Configure what you need, disable what you don't, and customize options, or import individual extensions for complete control and smaller bundle sizes.

### Layout system
Built-in column and column group nodes let you create multi-column layouts, sidebars, image-text splits, and complex grid designs. Columns control content stacking and alignment, while column groups organize columns horizontally.

### Import and export
Convert between JSON, HTML, and Markdown formats. Render content to static HTML for display, parse markdown into structured blocks, or serialize your document for storage and transmission.

### AI-ready features
The `@blockslides/ai-context` package provides schema definitions and preset templates that you can feed to AI models, making it easy to build AI-powered template generation, content suggestions, or automated slide creation.


## What you build with it

Blockslides is designed for applications where users create visual assets with structured layouts:

**Presentation editors**: Build slide deck authoring tools with speaker notes, layout templates, and export to various formats. Each presentation slide gets its own container with the layout system for complex designs.

**Social media graphic creators**: Let users design Instagram posts, LinkedIn banners, Twitter cards, and other social media assets with the correct dimensions and layout constraints for each platform.

**Marketing asset tools**: Create editors for landing page hero images, email headers, promotional graphics, thumbnails, or any marketing collateral that needs precise dimensions and layouts.

**Printable document editors**: Build tools for one-pagers, handouts, flyers, or reports with A4/Letter dimensions that can be exported to PDF or printed. Mix presentation slides and printables in the same editor.

**Visual content platforms**: Any application where users need to create, edit, and manage visual content with structured layouts, defined dimensions, and rich formatting options.

The flexibility of the slide concept means you can mix different asset types in a single editor session. A user might create presentation slides, then add a printable handout, then design a social media preview, all in one document.

::: tip See examples
Visit [What can you make?](/foundations/what-can-you-make) to see the different types of assets you can build and how slides adapt to different dimensions and layouts.
:::

## Framework support

**React** is fully supported with the `@blockslides/react` package, which provides hooks for editor state management and components for rendering the editor. The React integration handles all the complexity of keeping your UI in sync with the editor state.

**Vue** support is in development and coming soon.

**Vanilla JavaScript** and other frameworks can use `@blockslides/core` directly. The core is framework-agnostic and works anywhere JavaScript runs. You'll need to handle rendering and state management yourself, but you get complete flexibility.

## Architecture

Blockslides is built on ProseMirror, which provides the foundation for document editing, transactions, and state management. On top of ProseMirror, Blockslides adds slide-specific nodes (slide, column, columnGroup) and a TipTap-inspired extension system for modularity.

The extension system makes everything composable. Each extension is self-contained and adds specific functionality: a block type, a text formatting option, a keyboard shortcut, or an editor behavior. Import only what you need, or use the Extension Kit for a complete setup.

The architecture is headless, meaning Blockslides handles the document editing logic but doesn't impose any UI decisions on you. Bring your own design system, styling, and components. The React package provides basic UI components to get started, but you can replace them with your own.

All content is stored as structured JSON following ProseMirror's schema system. This makes it straightforward to validate content, transform it programmatically, export to different formats, or integrate with APIs and databases.

## Next steps

**Ready to build?** Head to the [React Quickstart](/getting-started/quickstart/react) or [Vue Quickstart](/getting-started/quickstart/vue) to create your first editor in a few minutes.

**Want to understand the concepts first?** The [Foundations](/foundations/what-can-you-make) section explains what you can make, how blocks and extensions work, and what the schemas look like.

**Looking for specific features?** Browse the **Features** section to learn about text formatting, media embeds, layouts, keyboard shortcuts, import/export, AI integration, and customization options.

**Working with React?** Check out the [React documentation](/react/overview) for hooks, components, and integration patterns.
