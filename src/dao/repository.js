
export default class Repository {
    constructor(factory) {
        this.userManager = factory.getUserManager();
        this.cartManager = factory.getCartManager();
    }

}
