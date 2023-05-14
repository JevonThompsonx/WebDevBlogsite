import express from 'express';
import ejs from 'ejs';
import path from 'path';
import fileDirName from './scripts/file-dir-name.js';
import { v4 as uuid } from 'uuid';

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
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())

app.get('/', (req, res) => {
    try {
        res.render('index')
    } catch {
        res.statusCode(400)
    }
})

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

app.get('/WebDevBlog', (req, res) => {
    let newPosts = blogPosts.slice(0, 5)
    res.render('blogPage/realBlog', {
        blogPosts,
        newPosts
    })
})
app.get('/WebDevBlog/newPost', (req, res) => {
    res.render('blogPage/newPost')
})
app.post('/WebDevBlog', (req, res) => {
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
    console.log(req.body)
    res.send(blogPosts)
})

app.get('/WebDevBlog/:postId', (req, res) => {
    let {
        postId: id
    } = req.params
    const singlePost = blogPosts.find(post => {
     return  post.id === id
    })
    console.log(singlePost)
    res.render('blogPage/showPost', {
        ...singlePost
    })
})