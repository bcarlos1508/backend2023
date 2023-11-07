import fs from 'fs';

class ProductManager 
{
    constructor(path) 
    {   
        this.idCounter = 0;
        this.path = path;
    }

    async getProducts(limit) 
    {
        try 
        {
            if(fs.existsSync(this.path)) 
            {
                const products = await fs.promises.readFile(this.path, 'utf8');
                const productsJS = JSON.parse(products);
                if (limit) 
                {
                    return productsJS.slice(0, limit);
                }
                return productsJS;  
            } 
            else 
            {
                return [];
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async manageProduct(limit) {
        try {
          return this.getProducts(limit);
        } catch (error) {
          console.log(error);
        }
      }

    async createProduct(title, description, price, thumbnail, code, stock, limit) 
    {
        try 
        {
            const productsFile=await this.getProducts(limit);
            const duplicateCode = productsFile.find
            (
                (product) => product.code === code
            );
            if (duplicateCode) 
            {
                console.log(`El codigo ${code} ya existe`);
            } 
            else 
            {
                const lastProduct = productsFile[productsFile.length - 1];
                const newId = lastProduct ? lastProduct.id + 1 : 1;
                const product = 
                {
                    id: newId,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                    limit,
                };
                productsFile.push(product);
                await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async deleteProduct(idProduct, limit) 
    {
        try 
        {
            const productsFile = await this.getProducts(limit);
            const productIndex = productsFile.findIndex((product) => product.id === idProduct);  
            if (productIndex === -1) 
            {
                console.log('No se encontró el producto con el ID indicado');
            } 
            else 
            {
                productsFile.splice(productIndex, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
                console.log(`El producto con el ID ${idProduct} fue eliminado exitosamente`);
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async updateProduct(idProduct, updatedFields, limit) 
    {
        try 
        {
            const productsFile = await this.getProducts(limit);
            const productIndex = productsFile.findIndex((product) => product.id === idProduct);  
            if (productIndex === -1) 
            {
                console.log('No se encontró el producto con el ID especificado');
            } 
            else 
            {
                const updatedProduct = 
                {
                ...productsFile[productIndex],
                ...updatedFields,
                id: idProduct, 
                };
                productsFile[productIndex] = updatedProduct;
                await fs.promises.writeFile(this.path, JSON.stringify(productsFile));
                console.log(`Producto actualizado correctamente`);
            }
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async #existingProduct(idProduct) 
    {
        try 
        {
            const productsFile = await this.getProducts();
            return productsFile.find((products) => products.id === idProduct);
        } 
        catch (error) 
        {
            console.log(error);
        }
    }

    async getProductById(idProduct) 
    {
        try 
        {
            const productsFile = await this.getProducts();
            return productsFile.find((products) => products.id === idProduct);
        } 
        catch (error) 
        {
            console.log(error);
        }
    }
}
export default ProductManager;