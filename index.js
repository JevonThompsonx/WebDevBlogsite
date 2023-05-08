import express from 'express';
import ejs from 'ejs';
import path from 'path';
import fileDirName from './scripts/file-dir-name.js';
const app = express();
const {
    __dirname
} = fileDirName(
    import.meta);
const port = 8080;
app.use(express.static(path.join(__dirname, '')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.listen(port);

app.get('/', (req, res) => {
    try {
        res.render('index')
    } catch {
        res.statusCode(400)
    }
})

let blogPosts = [{
        Title: 'My life as a developer',
        date: '05/06/2023',
        category: 'good news',
        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),
        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 0
    }, {
        Title: 'My javascript journey',
        date: '05/01/2023',
        category: 'good news',
        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),
        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 5
    },
    {
        Title: 'FrontEnd vs Backend',
        date: '05/31/2023',
        category: 'good news',

        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),

        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 7
    },
    {
        Title: 'My life as a developer',
        date: '05/06/2023',
        category: 'good news',

        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),

        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 8
    }, {
        Title: 'My javascript journey',
        date: '05/01/2023',
        category: 'good news',

        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),

        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 2
    },
    {
        Title: 'FrontEnd vs Backend',
        date: '05/31/2023',
        category: 'good news',

        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),

        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 3
    }

]

app.get('/WebDevBlog', (req, res) => {
    let newPosts= blogPosts.slice(0,4)
    res.render('blogPage/testBlog', {
        blogPosts, newPosts
    })
})
app.get('/WebDevBlog/:post', (req, res) => {
    let {
        post
    } = req.params
    //search for title in database and return the result
    //as the page to load
    //send page to 'post' when rendering as a variable
    res.render('/blogPage/post', {
        post,
        blogPost,
    })
})