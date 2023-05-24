import express from 'express';
import ejs from 'ejs';

//needed for filepath
import path from 'path';
import fileDirName from './scripts/file-dir-name.js'; 

//for testing only 
import { v4 as uuid } from 'uuid'; 

//needed to override form req for editing post
import methodOverride  from 'method-override' 

const app = express();
const {
    __dirname
} = fileDirName(
    import.meta);
//serves files 
app.use(express.static(path.join(__dirname, '')));

//Sets ejs as view engine
app.set('view engine', 'ejs');
//sets view folder as '/views'
app.set('views', path.join(__dirname, '/views'))

//DO NOT REMOVE - used for gCloud 
const port = 8080;
app.listen(port);

//middleware
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.use(methodOverride('_method'))



//faux data
let blogPosts = [
    {
        id: uuid(),
        title: 'My life as a developer',
        date: '05/06/2023',
        category: 'good news',
        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),
        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 0
    }, {
        id: uuid(),

        title: 'My javascript journey',
        date: '05/01/2023',
        category: 'good news',
        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),
        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 5
    },
    {
        id: uuid(),

        title: 'FrontEnd vs Backend',
        date: '05/31/2023',
        category: 'good news',

        post: 'loremipsumstuff',
        
        // postSnippet: post.slice(0, 15),

        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 7
    },
    {
        id: uuid(),

        title: 'My life as a developer',
        date: '05/06/2023',
        category: 'good news',

        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),

        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 8
    }, {
        id: uuid(),

        title: 'My javascript journey',
        date: '05/01/2023',
        category: 'good news',

        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),

        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 2
    },
    {
        id: uuid(),

        title: 'FrontEnd vs Backend',
        date: '05/31/2023',
        category: 'good news',

        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),

        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 3
    }

]

app.get('/', (req, res) => { //main page
    try {
        res.render('index')
    } catch {
        res.statusCode(400)
    }
})


app.get('/WebDevBlog', (req, res) => { //main blog page
    try {
    res.render('blogPage/realBlog', {
        blogPosts,
    }) }
    catch {
        res.statusCode(400)
    }
})
app.get('/WebDevBlog/newPost', (req, res) => { //new post 
    try {
    res.render('blogPage/newPost') }
     catch {
        res.statusCode(400)
    }
})
app.post('/WebDevBlog', (req, res) => { //posting from newPost form
    let {
        title,
        date,
        category,
        post,
        smallImage,
        largeImage
    } = req.body;
    let id = uuid()
    blogPosts.push({
        title,
        date,
        category,
        post,
        smallImage,
        largeImage, 
        id
    })
    res.redirect('blogPage/realBlog')
})

app.get('/WebDevBlog/:postId', (req, res) => { //finding specific post
    let {
        postId: id
    } = req.params
    const searchedPost = blogPosts.find(post => post.id === id)
    res.render('blogPage/showPost', {
        ...searchedPost
    })
})

app.get('/WebDevBlog/:postId/edit', (req,res)=> { //editing post form
    let {postId:id} = req.params
    const searchedPost = blogPosts.find(post => post.id === id)
    res.render('blogPage/editPost', {...searchedPost})
} )


app.patch('/WebDevBlog/:postId', (req, res) => { // edit post patch req
    let {postId:id} = req.params;
    const newPost = req.body.post;
    const searchedPost = blogPosts.find(post => post.id === id);
    searchedPost.post = newPost;
    res.redirect('/WebDevBlog')
}) 

