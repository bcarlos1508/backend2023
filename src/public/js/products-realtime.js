const socket = io();
const products = document.getElementById('products__list');
const form = document.getElementById('form__prods');
const inputTitle = document.getElementById('input__prod__title');
const inputPrice = document.getElementById('input__prod__price');
const inputStock= document.getElementById('input__prod__stock');

socket.on('productsArray', (array) => {
    let productsArray = '';
    array.forEach(p => {
        productsArray += `<li id="product__${p.id}">${p.title} - $${p.price} (${p.stock} uds.)</li>`;
    })
    products.innerHTML = productsArray;
    socket.emit('message', {message: 'Products recieved correctly'})
})

form.onsubmit = (e) =>{
    e.preventDefault();
    const title = inputTitle.value;
    const desc = 'No description provided.'
    const price = Number(Math.floor(inputPrice.value));
    const stock = Number(Math.floor(inputStock.value));
    const cat = 'none';
    const status = true;
    const code = Math.floor(Math.random()*10000000 + 10000000);
    const obj = {title, desc, price, stock, cat, status, code}
    socket.emit('newProduct', obj);
    socket.on('arrayUpdate', (array) =>{
        let productsArray = '';
        array.forEach(p => {
            productsArray += `<li id="product__${p.id}">${p.title} - $${p.price} (${p.stock} uds.)</li>`;
        })
        products.innerHTML = productsArray;
        socket.emit('update', {message: 'Products updated correctly'})
    })
}