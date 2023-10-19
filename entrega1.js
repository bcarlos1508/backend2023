class ProductManager 
{
    constructor() 
    {
        this.products = [];
        this.newId = 0;
    }
    addProduct(title, description, price, thumbnail, code, stock) 
    {
        if (!title || !description || !price || !thumbnail || !code || !stock) 
        {
            console.log('Todos los campos son requeridos');
        } 
        else
        {
            const duplicateCode = this.products.find((product) => product.code === code);
            if (duplicateCode) 
            {
                console.log(`El codigo ${code} ya existe`);
            } 
            else
            {
                const product =
                {
                    id: this.generateId(),
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    code: code,
                    stock: stock
                }
                this.products.push(product)
            }
        }
    }
    generateId() 
    {
        return ++this.newId;
    }
    getProducts()
    {
        return this.products;
    }
    getProductById(searchedId)
    {
        let find = this.products.find((prodIterated) => prodIterated.id === searchedId);
        if (find)
        {
            console.log(find)
        } 
        else
        {
            console.log("No se encontró el producto")
        }
    }
}
const getProducts = new ProductManager();
console.log(getProducts.products);

getProducts.addProduct("Gorra", "Polo RL", 5000, "https://res.cloudinary.com/dsdicaf5h/image/upload/v1678451446/cenicero/54_vpuz2h.png", "2812023GPRLBE", 3);
console.log(getProducts.products); 

getProducts.getProductById(5);