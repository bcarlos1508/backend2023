import Ticket from '../dao/models/ticket.js';
import Logger from '../utils/logger.js';

class TicketService {
    async createTicket({ amount, purchaser, products }) {
        try {
            const ticket = new Ticket({
                code: generateUniqueCode(),
                amount,
                purchaser,
            });

            ticket.products = products.map((product) => ({
                product: product.product,
                quantity: product.quantity,
                price: product.price,
            }));

            await ticket.save();

            Logger.info('Ticket creado exitosamente:', ticket);
            
            return ticket;
        } catch (error) {
            Logger.error('Error creando ticket:', error);
            throw error;
        }
    }
}

function generateUniqueCode() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default TicketService;
