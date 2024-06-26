import fs from 'fs';
import path from 'path';
import Logger from '../../utils/logger.js';

const filePath = path.join(__dirname, '/files/users.json');

export default class UserDAO {
    constructor() {
        Logger.info(`Trabajando en el archivo ${filePath}`);
    }

    async getAll() {
        try {
            if (fs.existsSync(filePath)) {
                const data = await fs.promises.readFile(filePath, 'utf8');
                Logger.info('Usuarios recuperados exitosamente');
                return JSON.parse(data);
            } else {
                Logger.info('No se encontró ningún archivo existente, devolviendo un array vacío');
                return [];
            }
        } catch (error) {
            Logger.error('Error al leer el archivo:', error);
            throw error;
        }
    }

    async save(user) {
        try {
            user.cart = [];
            let users = await this.getAll();

            const newUser = {
                id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
                ...user,
            };

            users.push(newUser);

            await fs.promises.writeFile(filePath, JSON.stringify(users, null, '\t'));
            Logger.info('Usuario guardado con éxito');
            return newUser;
        } catch (error) {
            Logger.error('Error al guardar al usuario:', error);
            throw error;
        }
    }
}
