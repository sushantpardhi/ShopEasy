import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true,
        required: false,
        maxlength: 500
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    image:{
        type:String,
        required: true,
        trim: true,
    }

}, {
    timestamps: true
});
const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;