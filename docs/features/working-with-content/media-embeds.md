# Media & Embeds


Blockslides supports **images and video embeds** through dedicated extensions. You can add inline images with the Image extension, block-level images with advanced controls using ImageBlock, and embed YouTube videos with the Youtube extension. 

::: tip Image vs ImageBlock
Use the **Image** extension for simple inline images within text. Use **ImageBlock** when you need captions, credits, advanced sizing, cropping, or alignment controls. ImageBlock is specifically designed for presentation slides with rich layout options.
:::

## Installation

All media extensions are included in the ExtensionKit by default:

```ts
import { ExtensionKit } from '@blockslides/extension-kit'

const editor = useSlideEditor({
  extensions: [
    ExtensionKit.configure({})
  ]
})
```

To configure FileHandler within ExtensionKit (for handling file uploads):

```ts
ExtensionKit.configure({
  fileHandler: {
    onDrop: (editor, files, pos) => {
      // Handle dropped files
    },
    onPaste: (editor, files, htmlContent) => {
      // Handle pasted files
    },
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }
})
```

If you're building a custom extension setup, you can import individual media extensions:

```ts
import { Image } from '@blockslides/extension-image'
import { ImageBlock } from '@blockslides/extension-image-block'
import { Youtube } from '@blockslides/extension-youtube'
import { FileHandler } from '@blockslides/extension-file-handler'

const editor = useSlideEditor({
  extensions: [
    // ... other extensions
    Image,
    ImageBlock,
    Youtube,
    FileHandler.configure({
      onDrop: (editor, files, pos) => {
        // Handle dropped files
      }
    })
  ]
})
```

### Disabling specific media extensions

You can disable any media extension by setting it to `false`:

```ts
ExtensionKit.configure({
  image: false,
  imageBlock: false,
  youtube: false
})
```

## Images

### Basic Images (Image Extension)

The Image extension provides simple inline images that can be embedded within text or as standalone blocks. It's perfect for straightforward image needs without advanced styling requirements.

#### Adding images

Use the `setImage()` command to insert images:

```ts
// Basic image
editor.commands.setImage({ 
  src: 'https://example.com/photo.jpg' 
})

// With alt text and title
editor.commands.setImage({ 
  src: 'https://example.com/photo.jpg',
  alt: 'Description of the image',
  title: 'Image title'
})

// With dimensions
editor.commands.setImage({ 
  src: 'https://example.com/photo.jpg',
  alt: 'Photo',
  width: 800,
  height: 600
})
```

#### Markdown input support

Images automatically format when you type markdown syntax:

```markdown
![Alt text](https://example.com/image.jpg)
![Alt text](https://example.com/image.jpg "Title")
```

As soon as you complete the syntax, it converts to an image in the editor.

#### Configuration options

Configure the Image extension with these options:

```ts
Image.configure({
  // Make images inline (within text flow)
  inline: true,
  
  // Allow base64 data URLs
  allowBase64: true,
  
  // Add custom HTML attributes
  HTMLAttributes: {
    class: 'my-image-class'
  }
})
```

**Options:**

- **inline** (`boolean`, default: `false`) - Controls if images are inline or block-level
- **allowBase64** (`boolean`, default: `false`) - Enable base64 data URLs in the src attribute
- **HTMLAttributes** (`Record<string, any>`) - Custom HTML attributes added to `<img>` elements

#### Image commands

All available commands for working with images:

```ts
// Insert an image
editor.commands.setImage({
  src: 'https://example.com/image.jpg',
  alt: 'Description',
  title: 'Title',
  width: 1200,
  height: 800
})
```

### Advanced Images (ImageBlock Extension)

The ImageBlock extension provides block-level images with advanced features including captions, credits, sizing modes, cropping positions, and alignment controls. This is the recommended extension for presentation slides.

#### Key features

- **Captions and credits** - Add descriptive text and attribution
- **Size modes** - Choose from fill, fit, or natural sizing
- **Crop positions** - 9-point focal positioning system
- **Custom dimensions** - Set explicit width and height
- **Alignment** - Left, center, right, or stretch
- **Asset tracking** - Optional asset ID for managing uploaded images

#### Adding image blocks

Use `insertImageBlock()` to add images with advanced controls:

```ts
// Basic image block
editor.commands.insertImageBlock({
  src: 'https://example.com/photo.jpg'
})

// With caption and credit
editor.commands.insertImageBlock({
  src: 'https://example.com/photo.jpg',
  alt: 'Mountain landscape',
  caption: 'The Rocky Mountains at sunset',
  credit: 'Photo by Jane Smith'
})

// With size mode and crop position
editor.commands.insertImageBlock({
  src: 'https://example.com/photo.jpg',
  size: 'fill',
  crop: 'center'
})

// With custom dimensions
editor.commands.insertImageBlock({
  src: 'https://example.com/photo.jpg',
  width: '800px',
  height: '600px'
})

// With asset ID for tracking
editor.commands.insertImageBlock({
  src: 'https://cdn.example.com/image.jpg',
  assetId: 'img_abc123',
  caption: 'Product photo'
})
```

#### Replacing existing image blocks

Update an existing image block's source and metadata:

```ts
// Replace the image source
editor.commands.replaceImageBlock({
  src: 'https://example.com/new-photo.jpg'
})

// Update multiple properties
editor.commands.replaceImageBlock({
  src: 'https://example.com/new-photo.jpg',
  alt: 'Updated description',
  caption: 'New caption text',
  size: 'fit',
  crop: 'top'
})
```

::: warning Selection required
The `replaceImageBlock()` command only works when an ImageBlock node is selected in the editor.
:::

#### Size modes

Control how images fill their container with three size modes:

```ts
// Fill - Cover entire container (cropped to fit)
editor.commands.setImageBlockSize('fill')

// Fit - Fit inside container (letterboxed if needed)
editor.commands.setImageBlockSize('fit')

// Natural - Use image's natural dimensions
editor.commands.setImageBlockSize('natural')
```

**Size mode details:**

- **fill** - Image covers the full container using `object-fit: cover`. Content may be cropped but no letterboxing occurs.
- **fit** - Image fits within the container using `object-fit: contain`. The full image is visible with letterboxing if the aspect ratio doesn't match.
- **natural** - Image displays at its native dimensions with `object-fit: none`.

```ts
// Example: Create a full-bleed hero image
editor.commands.insertImageBlock({
  src: 'https://example.com/hero.jpg',
  size: 'fill',
  crop: 'center'
})
```

#### Crop positions

Set the focal point for images using a 9-position grid:

```ts
// Center positions
editor.commands.setImageBlockCrop('center')   // Center
editor.commands.setImageBlockCrop('top')      // Top center
editor.commands.setImageBlockCrop('bottom')   // Bottom center
editor.commands.setImageBlockCrop('left')     // Middle left
editor.commands.setImageBlockCrop('right')    // Middle right

// Corner positions
editor.commands.setImageBlockCrop('top-left')
editor.commands.setImageBlockCrop('top-right')
editor.commands.setImageBlockCrop('bottom-left')
editor.commands.setImageBlockCrop('bottom-right')
```

Crop positions control the `object-position` CSS property, determining which part of the image is visible when using `fill` mode.

```ts
// Example: Portrait photo cropped to show the face
editor.commands.insertImageBlock({
  src: 'https://example.com/portrait.jpg',
  size: 'fill',
  crop: 'top'  // Focus on the top of the image (where the face is)
})
```

#### Alignment

Control how the image block aligns within its container:

```ts
// Align left
editor.commands.setImageBlockAlignment('left')

// Align center (default)
editor.commands.setImageBlockAlignment('center')

// Align right
editor.commands.setImageBlockAlignment('right')

// Stretch to full width
editor.commands.setImageBlockAlignment('stretch')
```

**Alignment values:**

- **left** - Aligns to the left edge
- **center** - Centers horizontally (default)
- **right** - Aligns to the right edge
- **stretch** - Stretches to full container width

```ts
// Example: Side-aligned image with specific width
editor.commands.insertImageBlock({
  src: 'https://example.com/diagram.jpg',
  align: 'right',
  width: '400px'
})
```

#### Custom dimensions

Set explicit width and height values:

```ts
// Set both dimensions
editor.commands.setImageBlockDimensions({
  width: 800,
  height: 600
})

// Set width only
editor.commands.setImageBlockDimensions({
  width: '80%'
})

// Set height only
editor.commands.setImageBlockDimensions({
  height: '500px'
})
```

Dimensions accept:

- **Numbers** - Converted to pixels (e.g., `800` becomes `"800px"`)
- **Strings** - Any CSS unit (e.g., `"80%"`, `"50vh"`, `"400px"`)
- **null** - Removes the dimension constraint

```ts
// Example: Fixed size image
editor.commands.insertImageBlock({
  src: 'https://example.com/logo.png',
  width: '200px',
  height: '100px',
  align: 'center'
})
```

#### Metadata

Add or update descriptive metadata for images:

```ts
// Set alt text
editor.commands.setImageBlockMetadata({
  alt: 'Team photo at the company retreat'
})

// Set caption
editor.commands.setImageBlockMetadata({
  caption: 'Our team celebrating the product launch'
})

// Set credit
editor.commands.setImageBlockMetadata({
  credit: 'Photography by John Doe'
})

// Set all metadata at once
editor.commands.setImageBlockMetadata({
  alt: 'Sunset over mountains',
  caption: 'Golden hour in the Rockies',
  credit: '© 2024 Nature Photos Inc.'
})
```

**Metadata fields:**

- **alt** - Alternative text for accessibility and SEO
- **caption** - Visible caption text displayed below the image
- **credit** - Attribution text, typically displayed smaller than caption

```ts
// Example: Full metadata for a professional image
editor.commands.insertImageBlock({
  src: 'https://example.com/architecture.jpg',
  alt: 'Modern glass building exterior',
  caption: 'The new headquarters building features floor-to-ceiling windows',
  credit: 'Architectural photography by Smith & Associates'
})
```

#### Configuration options

Customize the ImageBlock extension:

```ts
ImageBlock.configure({
  // Add custom HTML attributes to the container
  HTMLAttributes: {
    class: 'custom-image-block'
  },
  
  // Control CSS injection
  injectCSS: true,
  
  // Add CSP nonce for injected styles
  injectNonce: 'your-nonce-value'
})
```

## YouTube Embeds

The Youtube extension enables embedding YouTube videos directly in your slides with full control over playback options, UI customization, and player behavior.

### Adding YouTube videos

Use the `setYoutubeVideo()` command to embed videos:

```ts
// Basic YouTube embed
editor.commands.setYoutubeVideo({
  src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
})

// With custom dimensions
editor.commands.setYoutubeVideo({
  src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  width: 1280,
  height: 720
})

// Start at a specific timestamp
editor.commands.setYoutubeVideo({
  src: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  start: 30  // Start at 30 seconds
})
```

The extension accepts various YouTube URL formats:

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://music.youtube.com/watch?v=VIDEO_ID`

### Automatic paste handling

Simply paste a YouTube URL and it automatically converts to an embedded video:

```ts
// Enable automatic paste handling (enabled by default)
Youtube.configure({
  addPasteHandler: true
})
```

When a user pastes a YouTube URL in the editor, it's automatically detected and converted to a video embed.

### Configuration options

The Youtube extension offers extensive configuration for playback, UI, and behavior:

#### Playback options

```ts
Youtube.configure({
  // Auto-play video on load
  autoplay: true,
  
  // Loop the video
  loop: true,
  
  // Start time in seconds
  startAt: 60,
  
  // End time in seconds
  endTime: 120,
  
  // Related videos from same channel only (1) or any (0)
  rel: 1
})
```

#### UI customization

```ts
Youtube.configure({
  // Hide player controls
  controls: false,
  
  // Show minimal YouTube branding
  modestBranding: true,
  
  // Progress bar color ('red' or 'white')
  progressBarColor: 'white',
  
  // Allow fullscreen
  allowFullscreen: true,
  
  // Video annotations (0 = hide, 1 = show based on user preference)
  ivLoadPolicy: 0
})
```

#### Captions

```ts
Youtube.configure({
  // Enable captions
  ccLoadPolicy: true,
  
  // Caption language
  ccLanguage: 'en'
})
```

#### Player control

```ts
Youtube.configure({
  // Disable keyboard controls
  disableKBcontrols: true,
  
  // Enable JavaScript API
  enableIFrameApi: true,
  
  // Set origin for extra security
  origin: 'https://your-domain.com'
})
```

#### Privacy and sizing

```ts
Youtube.configure({
  // Use youtube-nocookie.com domain for enhanced privacy
  nocookie: true,
  
  // Default dimensions
  width: 854,
  height: 480,
  
  // Make inline instead of block
  inline: false,
  
  // Custom HTML attributes
  HTMLAttributes: {
    class: 'youtube-embed'
  }
})
```

#### Interface language

```ts
Youtube.configure({
  // Set player interface language
  interfaceLanguage: 'es'  // Spanish interface
})
```

#### Playlists

```ts
Youtube.configure({
  // Embed a playlist
  playlist: 'PLQg6GaokU5CwiVmsZ0dZm6VeIg0V5z1tK'
})
```

### Complete configuration example

```ts
// Professional video embed configuration
Youtube.configure({
  // Playback
  autoplay: false,
  loop: false,
  controls: true,
  
  // UI
  modestBranding: true,
  progressBarColor: 'white',
  allowFullscreen: true,
  
  // Privacy
  nocookie: true,
  
  // Sizing
  width: 1280,
  height: 720,
  
  // Captions
  ccLoadPolicy: true,
  ccLanguage: 'en',
  
  // Interface
  interfaceLanguage: 'en',
  
  // Custom attributes
  HTMLAttributes: {
    class: 'presentation-video'
  }
})
```

## File Handling

The FileHandler extension provides drag-and-drop and paste support for images and other files. It serves as the foundation for handling file uploads in your editor.

::: tip See Also
For comprehensive information about drag and drop functionality, including the DragHandle and Dropcursor extensions, see the [Drag & Drop](/features/editor-features/drag-drop) guide.
:::

### Setup

The FileHandler extension **requires configuration with callback functions** to process dropped or pasted files. You'll need to provide handlers that define what happens when users drag files onto the editor or paste them from their clipboard.

```ts
FileHandler.configure({
  // Callback triggered when files are pasted
  onPaste: (editor, files, htmlContent) => {
    // Your file handling logic here
    // Use editor.commands to insert content
  },
  
  // Callback triggered when files are dropped
  onDrop: (editor, files, pos) => {
    // Your file handling logic here
    // Use editor.commands to insert content at the drop position
  },
  
  // Optional: Filter allowed file types
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
})
```

Within these callbacks, you have access to **editor commands** like:
- `editor.commands.insertImageBlock()` - Insert an image block at the cursor
- `editor.commands.insertContentAt()` - Insert content at a specific position
- `editor.commands.setYoutubeVideo()` - Insert a YouTube video
- Any other editor commands for content insertion and manipulation

The FileHandler takes care of detecting file operations and filtering by MIME type—you implement the actual file processing, upload, and insertion logic.

### Callback parameters

#### onPaste callback

```ts
onPaste: (editor, files, pasteContent) => {
  // This is where you handle pasted files
  // Use editor.commands to insert content into the editor
  // Access files array to upload them to your server
  // Use pasteContent to extract data from pasted HTML
}
```

The `onPaste` callback receives three parameters:

- **editor** - The editor instance where you can run commands like `editor.commands.insertImageBlock()`, `editor.commands.insertContentAt()`, and access the editor state
- **files** - Array of File objects from the clipboard that you can upload to your storage service or process as needed
- **pasteContent** - Optional HTML string if the user copied content from a webpage. Useful for extracting image URLs, metadata, or other structured data

#### onDrop callback

```ts
onDrop: (editor, files, pos) => {
  // This is where you handle dropped files
  // Use editor.commands to insert content at the drop position
  // Access the pos parameter to know where files were dropped
  // Upload files and insert them at the specific location
}
```

The `onDrop` callback receives three parameters:

- **editor** - The editor instance with full access to commands and state
- **files** - Array of File objects that were dropped onto the editor
- **pos** - The exact document position (number) where the files were dropped, enabling precise insertion control

### Filtering file types

Restrict which file types can be dropped or pasted:

```ts
FileHandler.configure({
  // Only allow images
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  onDrop: (editor, files, pos) => {
    // Only accepted mime types reach this callback
    console.log('Valid files dropped:', files)
  }
})
```

If `allowedMimeTypes` is not specified, all file types are allowed.

### Handle pasted images from HTML

When users copy content from websites and paste it into the editor, the `onPaste` callback receives both `files` and `htmlContent`. The `htmlContent` parameter contains the HTML markup including any `<img>` tags with their URLs.

To extract images from pasted HTML:

```ts
onPaste: (editor, files, htmlContent) => {
  // Handle direct file pastes
  if (files.length > 0) {
    // Process actual files...
  }
  
  // Handle images embedded in HTML
  if (htmlContent) {
    // This is where you would parse the HTML and extract image URLs
    // Then use editor.commands to insert them as ImageBlocks
  }
}
```

**Key considerations:**

- Pasted HTML images reference external URLs (the original website)
- You can insert these URLs directly, but they depend on external sources
- For better control, download the images and upload to your own storage
- Preserve metadata like alt text and titles when available
- Handle both file pastes and HTML pastes in the same callback

## Working with Media Programmatically

### Querying media in content

Find and inspect media elements in your document:

```ts
// Find all images
const images: any[] = []
editor.state.doc.descendants((node) => {
  if (node.type.name === 'image' || node.type.name === 'imageBlock') {
    images.push({
      type: node.type.name,
      src: node.attrs.src,
      alt: node.attrs.alt
    })
  }
})

console.log('Found images:', images)
```

```ts
// Find all YouTube videos
const videos: any[] = []
editor.state.doc.descendants((node) => {
  if (node.type.name === 'youtube') {
    videos.push({
      src: node.attrs.src,
      width: node.attrs.width,
      height: node.attrs.height
    })
  }
})

console.log('Found videos:', videos)
```

### Getting media at cursor position

Check if the current selection is a media element:

```ts
const { from, to } = editor.state.selection
const node = editor.state.doc.nodeAt(from)

if (node?.type.name === 'imageBlock') {
  console.log('Selected image:', {
    src: node.attrs.src,
    caption: node.attrs.caption,
    size: node.attrs.size
  })
}
```

### Updating media sources

You can find and update any node in the document using the methods below. Here's an example of updating image URLs, which is especially handy when **working with private storage buckets** where URLs expire and need to be refreshed.

You can organize your code to fit your needs. Here are the building blocks:

**To collect asset IDs from images:**

```ts
const assetIds: string[] = []
editor.state.doc.descendants((node) => {
  if (node.type.name === 'imageBlock' && node.attrs.assetId) {
    assetIds.push(node.attrs.assetId)
  }
})
```

**To update image URLs:**

```ts
editor.state.doc.descendants((node, pos) => {
  if (node.type.name === 'imageBlock' && node.attrs.assetId) {
    // Select the image node
    editor.commands.setTextSelection(pos)
    
    // Replace with your fresh URL
    editor.commands.replaceImageBlock({
      src: yourFreshUrl
    })
  }
})
```

**Key considerations:**

- Fetch fresh URLs from your backend using the asset IDs
- Consider batch fetching multiple URLs at once for better performance
- Handle async operations outside of the `descendants` traversal
- The asset ID remains unchanged, only the URL is updated
