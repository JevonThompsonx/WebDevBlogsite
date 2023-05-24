# Ideas for improving how the blogsite works

## Slicing

- Rather than slicing on the loaded ejs blogPage to add the 'newBlogPosts' and 'topBlogPosts' arrays, create them on the index file later then pass those through to the realBlog.ejs file as variables  

## Changing post that display as main or in the bottom div  

### Function  

- When logged in there should be a button on each post to edit the post as well as a button to change which post is displayed in the main section and bottom div ('top posts' sections) only  
- On click the button should bring up a page that  lists a small preview of each post currently posted, including 2 pictures(the large one for the main section and the small for the 'top' section), title, and a 50-100 word preview of the post  

### Base idea on building  

- Create button for changing post in the specific area selected
- Add a 'location' key to all post objects
- Create a function that places the objects based on location and skips the ones that don't have any listed 'location'  
  - the post object w/ the 'main' keyword should show up in the main section
    - whenever any main keyword is added to a post object, all other post objects are searched(using `.find(post.id => post.id` ) for the keyword and replaced w/ a empty keyword if there is any other also w/ the main keyword. Only after this should the main keyword be given to the newly selected main post
    - ^ The 'top' section functions the same way only with the set 'location' for that section being 'first', 'second' or 'third' from left to right  
