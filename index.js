const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const sw = require('stopword');

const readFileLines = filename =>
    fs.readFileSync(filename)
        .toString('UTF8')
        .split('\n');

const readSingleFile = filename =>
fs.readFileSync(filename)
    .toString();

var urlencodedParser = bodyParser.urlencoded({ extended: true })

const app = express();

app.set('view engine', 'ejs');

app.listen(process.env.PORT || 3000);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('homepage');
});


app.post('/search', urlencodedParser, function (req, res) {
    
    let query_str = req.body.search;

    let keywords = (readFileLines('./keywords.txt'))[0].split(' ');
    
    let idf = ((readFileLines('./idf.txt'))[0].split(' ')).map(Number);
    
    let lines = readFileLines('./tf_idf.txt'); 
    
    let magnitudes = ((readFileLines('./magnitude.txt'))[0].split(' ')).map(Number);
    
    let no_of_col = keywords.length;

    let no_of_doc = magnitudes.length;

    let tf_idf = Array.from(Array(no_of_doc), _ => Array(no_of_col).fill(0));

    for(let i=0;i<lines.length;i++){
        var arr = (lines[i].split(' ')).map(Number);
        tf_idf[arr[0]][arr[1]]=arr[2];
    }

    queryStr = query_str.toLowerCase().split(' ');

    let words = sw.removeStopwords(queryStr);

    let no_of_word_in_query = words.length;

    let tf_idf_query = Array(no_of_col).fill(0.0);

    let freqMap = {}

    words.forEach(function (w) {
        if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
    });

    let query_mag = 0;

    let indices = [];
    
    
    for (var key in freqMap) {
        if(keywords.includes(key))
        {
            let ind = keywords.indexOf(key);
            indices.push(ind);
            tf_idf_query[ind] = freqMap[key] * idf[ind] / (no_of_word_in_query * 1.0);
            query_mag+= tf_idf_query[ind]*tf_idf_query[ind];
        }
    }
    
    
    query_mag = Math.sqrt(query_mag);
    
    
    let similarityIndex = Array(no_of_doc).fill(0);
    let cos_sim = Array(no_of_doc).fill(0);

    sim={}
    
    for (var i=0;i<no_of_doc;i++)
    {
        let doc_mag = magnitudes[i];
        
        for(var ind of indices)
        {
            
            similarityIndex[i]+=tf_idf[i][ind]*tf_idf_query[ind];
        }
        
        cos_sim[i]=similarityIndex[i] / (query_mag*doc_mag*1.0);

        sim[i+1] = cos_sim[i];
        
    }

    let sortable = [];
    for (var index in sim) {
        sortable.push([index, sim[index]]);
    }

    sortable.sort(function(a, b) {
        return b[1]-a[1];
    });

    let doc=[]
    let title=[];
    let url=[];

    const readURL = readFileLines("lt_url.txt");
    const readTitle = readFileLines("lt_title.txt");

    if(indices.length){
        
        for(let i=0;i<sortable.length;i++)
        {
            if(i==5)
                break;
            title.push(readTitle[parseInt(sortable[i][0])-1].trim());
            url.push(readURL[parseInt(sortable[i][0])-1].trim());
            doc.push(readSingleFile("./Problems/problem_"+sortable[i][0]+".txt"));
        }
    }

    try {
        res.render('search',{docs : doc, urls : url, titles: title, query: query_str});
    } catch (error) {
        alert(error);       
    }

});


app.use((req, res) => {
    res.status(404).render('404');
});
