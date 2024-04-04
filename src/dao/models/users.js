import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number
    },
    dni: {
        type: Number
    },
    gender: {
        type: String
    },
    birthDate: {
        type: Date
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShoppingCart'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    documents: [{
        name: {
            type: String,
            required: true
        },
        reference: {
            type: String,
            required: true
        }
    }],
    last_connection: {
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
