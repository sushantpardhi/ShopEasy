import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    note: {
        type: String,
        trim: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
}, {
    timestamps: true
})

const WishListModel = mongoose.model("WishList", wishListSchema);

export default WishListModel;