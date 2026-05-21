const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
    preferences: {
        budget: { type: String, enum: ['budget', 'standard', 'luxury'], default: 'standard' },
        travelStyle: { type: String, enum: ['adventure', 'relaxation', 'cultural', 'family'], default: 'adventure' }
    },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
