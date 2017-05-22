var copy = require('copy');

copy('js/dataTables.listView.js', 'docs', function(err, files) {
    if (err){
        throw err;
    }
    else{
        console.log(files);
    }
});

copy('css/dataTables.listView.css', 'docs', function(err, files) {
    if (err){
        throw err;
    }
    else{
        console.log(files);
    }
});