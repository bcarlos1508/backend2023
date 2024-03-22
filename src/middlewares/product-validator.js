export const productValidator = (req, res, next) => {
    try {        
        const prod = req.body;
        if (prod.title !== undefined && prod.desc !== undefined && prod.price !== undefined && prod.stock !== undefined && prod.cat !== undefined && prod.status !== undefined && prod.code !== undefined) {
            next()
        } else {
            res.status(404).json({
                message: '(!) Invalid or missing property or value.',
                details: "(i) Product must contain the following properties: title, desc, price, stock, cat, status, code."
            })
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
        console.log(err)
    }
}