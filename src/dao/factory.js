import Users from './dbManagers/user.js';
import Carts from './dbManagers/cart.js';
import Logger from '../utils/logger.js';

export default class Factory {
    constructor(managerType) {
        try {
            switch (managerType) {
                case 'mongo':
                    this.userManager = new Users();
                    this.cartManager = new Carts();
                    break;
                default:
                    throw new Error('Invalid manager type');
            }
            Logger.info(`Factory initialized with manager type: ${managerType}`);
        } catch (error) {
            Logger.error('Error initializing Factory:', error);
            throw error;
        }
    }

    getUserManager() {
        return this.userManager;
    }

    getCartManager() {
        return this.cartManager;
    }
}
