const fs = require('fs');
const mongoose = require('mongoose');

mongoose.connect('NOCREDSPLEASE', { useNewUrlParser: true, useUnifiedTopology: true})
var blogSchema = new mongoose.Schema({
    postTitle: String,
    postImage: String,
    postCont: String,
    currentDate: String,
    postDesc: String
});

var blogPost = mongoose.model('blogPost', blogSchema);

var justTest = function(){
    var postList = true; //True is good false means too many titles. 
    getPost('Blog Test', (item) =>{
        console.log(item.length);
        }
    );
    console.log(postList);
}

var saveToMongo = function(title, postContents, image, description, callback){ // We pass the title and contents to here and then we save that to mongodb.
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var saveMon = new blogPost({postTitle: title, postImage: image, postCont: postContents, currentDate: date, postDesc: description});
    saveMon.save(err => {
        if (err) throw err;
        callback();
    })
}

// var justTest = function(title){
//     blogPost.find({postTitle: title}, (err, item)=>{
//         if (err) throw err;
//         if(item.length > 1){
//             console.log('Multiple titles with that name!')
//         };
//     }).lean();
// }

var submitPost = function(callback){ // This checks the blog directory for any files, if they exist it returns the title and contents.
    fs.readdir(`${__dirname}/../blog/`, (err, files) => {
        if (err) throw err;
        var date = new Date();
        var today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        const blogFiles = files;
        blogFiles.forEach((file) => {
            fs.copyFile(`${__dirname}/../blog/${file}`, `${__dirname}/../blogPostBacks/${file}-${today}.bak`, (err) =>{
                if (err) throw err;
                console.log('Backed up files!');
            })
            var title = file.replace(/\..*/, '').replace(/-/g, ' ')
            fs.readFile(`${__dirname}/../blog/${file}` , 'utf8', (err, fileContents)  => {
                var image = fileContents.match(/(?<=<image>).*?(?=<\/image>)/); // pull an <image> tag that will be for our blog tiles
                var description = fileContents.match(/(?<=<desc>).*?(?=<\/desc>)/)// Pull a description for our blog tiles.
                var finalContent = fileContents.replace(/<image>.*<\/image>/, '').replace(/<desc>.*<\/desc>/, '').replace(/^\s*[\r\n]/gm, '');
                saveToMongo(title, finalContent, image[0], description[0], ()=>{
                    fs.unlink(`${__dirname}/../blog/${file}`, (err)=>{
                        if (err) throw err;
                        console.log('Successfully saved blog posts to Mongo and then removed them!')
                    })
                })

            });
        });

    });// end
}

var getPosts = function(callback){
    blogPost.find({}, (err, item) => {
        if (err) throw err;
        //console.log(item);
        return callback(item);
    }).lean()};

var getPost = function(title, callback){
    blogPost.find({postTitle: title}, (err, item) =>{
        if (err) throw err;
        return callback(item);
    }).lean()};

// module.exports = function(){fs.readFile(`${__dirname}/../blog/blogEntry.hbs`, 'utf8', (err,data) => {
//     if (err) throw err;
//     var testPost = blogPost({post: encodeURI(data), postTitle: 'First Post!'}).save(err => {
//         if (err) throw err;
//         console.log('Item Saved!');
//     })
// })}

module.exports = {getPosts, getPost, submitPost, justTest};
