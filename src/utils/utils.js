import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import bcrypt from 'bcrypt';

export const createHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

export const validatePassword = (user, password) => {
    return bcrypt.compare(password, user.password);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

