import express from 'express';
import ejs from 'ejs';
import path from 'path';
import fileDirName from './scripts/file-dir-name.js';
const app = express();
const {__dirname} = fileDirName(import.meta);
const port = 8080;
app.use(express.static(path.join(__dirname,'')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'))

app.listen(port);

app.get('/', (req,res)=> {
    try {
res.render('index')
    }
    catch {
        res.statusCode(400)
    }
})

let blogPosts = [
    {
        Title: 'My life as a developer',
        date: '05/06/2023',
        post: 'loremipsumstuff'
    },     {
        Title: 'My javascript journey',
        date: '05/01/2023',
        post: 'loremipsumstuff'
    }, 
    {
        Title: 'JS',
        date: '05/20/2023',
        post: 'loremipsumstuff'
    },
        {
        Title: 'FrontEnd vs Backend',
        date: '05/31/2023',
        post: 'loremipsumstuff'
    },{
        Title: 'nodeJS',
        date: '05/25/2023',
        post: 'loremipsumstuff'
    }
    
]

app.get('/WebDevBlog', (req,res)=> {
    res.render('blog', {blogPosts})
})