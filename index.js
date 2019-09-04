const fs = require('fs');
const express = require('express');
const axios = require('axios');

let app = express();

function getCollapsible(n, category, content) {
    return `
    <div class="card">
        <div class="card-header" id="heading${n}">
            <h2 class="mb-0">
                <button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse${n}" aria-expanded="false" aria-controls="collapse${n}">
                    ${category}
                </button>
            </h2>
        </div>
        <div id="collapse${n}" class="collapse" aria-labelledby="heading${n}" data-parent="#accordionExample">
            <div class="card-body">
                <div class="row">
                    ${content}
                </div>
            </div>
        </div>
    </div>
    `;
}

function getCard(title, price, image, description) {
    return `
    <div class="card m-1 p-1 col-12 col-md-3">
        <img src="${image}" class="card-img-top" alt="item image">
        <div class="card-body">
            <h5 class="card-title">${title} [$${price}]</h5>
            <p class="card-text">${description}</p>
            <a href="#" class="btn btn-primary">Add to Cart</a>
        </div>
    </div>
    `;
}

function funcionar (call) {
    fs.readFile("index.html", (err, data) => {
        if (err) console.error();
        call(data.toString());
    });
}

app.get('/', (req, res) => {
    funcionar((info) => {
        //console.log(info);
        let link = 'https://gist.githubusercontent.com/josejbocanegra/c6c2c82a091b880d0f6062b0a90cce88/raw/abb6016942f7db2797846988b039005c6ea62c2f/categories.json';
        axios.get(link).then((response) => {
            //console.log(response.data);
            let content = '';
            response.data.forEach((category, i) => {
                let filling = '';
                category.products.forEach(product => {
                    filling += getCard(product.name, product.price, product.image, product.description) + '\n';
                });
                content += getCollapsible(i, category.name, filling) + '\n';
            });
            let end = info.replace('$CONTENT$', content);
            res.send(end);
        }).catch((err) => {
            console.log(err);
        });
    });
});

app.listen(8081);