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


app.get('/WebDevBlog', (req,res)=> {
    res.render('blog')
})