# What can you make?

Blockslides stores your content as **slides**; a flexible JSON data structure you can shape into many kinds of visual assets.

```ts
const doc = {
  type: "doc", // Top level doc. Always there/ Always the same
  content: [
    {
      type: "slide", // <-- The slide block / Only valid child of top level doc
      attrs: { size: "4x3" }, // Where the asset layout is defined
      content: [...],
    },
  ],
};
```

The editor’s content is an array of slides.

Each slide can represent a different type of asset. In the example above, we have a classic `4x3` slide.

If we wanted the next slide to be a LinkedIn banner, we’d add this new slide to the `content` array:

```ts
{
  type: "slide",
  attrs: { size: "linkedin-banner" },
  content: [...],
}
```

**You can mix different asset types in the same editor.**

!!!! TODO: ADD A PICTURE OF A SLIDE AND LINKEDIN BANNER IN THE SAME EDITOR 

## Examples of assets you can create
- Presentation decks
- LinkedIn banners and social cover images
- Instagram posts and reels covers
- Twitter/X cards
- Hero/landing banners and thumbnails
- Printable one-pagers and handouts (A4/Letter/PDF)
- etc...

## Built-in sizes 
We ship with a few sizes to make it easy to experiment. <br/>
These are values you can set in the size attribute of the slide.
<br/>
You can also easily add your own. 
- `16x9`, `4x3`
- `a4-portrait`, `a4-landscape`
- `letter-portrait`, `letter-landscape`
- `linkedin-banner`

!!! TODO: link to page that shows how you can build your own 

## Pre-built layouts you can start from
Blockslides includes pre-built slide templates you can use as a starting point. 
These are not values for the size object but rather entire blocks of code that you can insert into 
the content array of the top level doc. 
```ts
!!! TODO: add explanation of the code and refine the explanation of what templates are
```
<br /> 
We are constantly adding more. 

!!! TODO: turn this into a carousel where they can browse the templates 
!!! TODO: link them to where they can learn more about the templates and how to use them 

- `tpl.titleAndSubheader`
- `tpl.imageAndText`
- `tpl.textAndImage`
- `tpl.twoColumns`
- `tpl.twoColumnsWithHeader`
- `tpl.threeColumns`
- `tpl.threeColumnsWithHeader`
- `tpl.fourColumns`
- `tpl.fourColumnsWithHeader`
- `tpl.titleWithBullets`
- `tpl.titleBulletsAndImage`
- `tpl.twoImageColumns`
- `tpl.accentLeft`
- `tpl.accentRight`
- `tpl.accentTop`
- `tpl.accentRightFit`
- `tpl.accentLeftFit`
- `tpl.fullImage`

