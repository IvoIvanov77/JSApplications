const Promise = require('./Promise');


let p = new Promise(function (resolve, reject) {
    reject('ivaylo')
});


p.then((result) => console.log(result))
    .catch((error) => console.log(error));