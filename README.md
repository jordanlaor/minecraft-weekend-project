# MINECRAFT

## index Page

- Has a start btn, when clicked navigates to game page
- has a title and a background
- has a link, when pressed- opens an explanation about the different types and tools and everything else on the page is hidden

## game Page

- The page will be divided to 2:
- main part: grid devided to blocks of 2vh x 2vh.
  - overflow-scroll
- side part: display:
  - the different tools
  - the inventory and too reset btns:
    - reset world - resets the current world to be the same as starting point
    - reset game - goes back to index page
- each block will have a data-type attribute that will hold the type of the block.
  - basic block type is sky.
  - the types are: dirt, sky, wood, stone
  - based on the data-type the block will have different bg image.
  - if a block has a data-type other than sky it cant change type.
  - based on inventory a new block can be added
