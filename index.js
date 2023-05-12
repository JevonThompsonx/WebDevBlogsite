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
app.use(express.urlencoded({ extended: true })) 
app.use(express.json())

app.get('/', (req, res) => {
    try {
        res.render('index')
    } catch {
        res.statusCode(400)
    }
})

let blogPosts = [{
        title: 'My life as a developer',
        date: '05/06/2023',
        category: 'good news',
        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),
        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 0
    }, {
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
        title: 'My life as a developer',
        date: '05/06/2023',
        category: 'good news',

        post: 'loremipsumstuff',
        // postSnippet: post.slice(0, 15),

        smallImage: 'urlHere.com',
        largeImage: 'urlHere.com',
        clicks: 8
    }, {
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

app.get('/WebDevBlog', (req, res) => {
    let newPosts= blogPosts.slice(0,5)
    res.render('blogPage/realBlog', {
        blogPosts, newPosts
    })
})
app.get('/WebDevBlog/newPost', (req,res)=> {
        res.render('blogPage/posts')
})
app.post('/WebDevBlog', (req, res) => {
    let {title , date, category, post, smallImage, largeImage} = req.body
    blogPosts.push({title , date, category, post, smallImage, largeImage})
    console.log(req.body)
    res.send(blogPosts)
})