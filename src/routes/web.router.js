import { Router } from 'express'

export const webRouter = Router()

webRouter.get('/', (req,res)=> {
    res.render('index', {titulo: 'Inicio'})   
})

webRouter.get('/productos', (req,res)=> {
    res.render('products-realtime', {titulo: 'Productos'})   
})