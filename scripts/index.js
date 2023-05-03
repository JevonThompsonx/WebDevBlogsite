import express from 'express';
import ejs from 'ejs';
import path from 'path';
import fileDirName from './file-dir-name.js';


const {__dirname} = fileDirName(import.meta);
const app = express();
const port = 9000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'../views'))
app.use(express.static(path.join(__dirname,'../')));
app.listen(port,()=> {console.log('Listening on port 9000')});

app.get('/', (req,res)=> {
res.render('index')
})
