import express from "express";
import ProductManager from "./ProductManager.js";

const productManager = new ProductManager('./db/productos.json')
const app= express();

app.use(express.urlencoded({extended:true}))

app.get('/products', async (req,res)=>{
    res.json({
        productos: await productManager.getProducts()
    })
})

app.get('/products/:id', async (req, res) => {
    const idProducto = parseInt(req.params['id'])
    const ProdBuscado = await productManager.getProductById(idProducto)
    if (ProdBuscado) {
      res.json({
        productos: ProdBuscado })
    } else {
      res.json({ error: `No se encontró el producto con id ${idProducto}` })
    }
})

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './views' })
})


app.listen(8080,()=>console.log("Servidor ok 8080"))
