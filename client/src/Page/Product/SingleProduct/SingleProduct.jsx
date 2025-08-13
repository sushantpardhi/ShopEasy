import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart,  FaShoppingCart, FaTruck, FaShieldAlt, FaUndo, FaMobile } from "react-icons/fa";
import './SingleProduct.css';
import Iphone1 from '../../../assets/images/Products/Iphone/Mobile1.1.jpg'
import Iphone3 from '../../../assets/images/Products/Iphone/mobile1.3.jpg'
import Iphone2 from '../../../assets/images/Products/Iphone/Mobile1.2.jpg'
import Iphone4 from '../../../assets/images/Products/Iphone/Mobile1.4.jpg'

function SingleProduct() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [wishlistStatus, setWishlistStatus] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState('128GB');
    const [selectedColor, setSelectedColor] = useState('Midnight Black');

    // Mobile phone product data
    const mobileProduct = {
        id: 1,
        name: "iPhone 15 Pro Max",
        brand: "Apple",
        price: 134900,
        originalPrice: 159900,
        discount: 16,
        rating: 4.8,
        reviewCount: 2847,
        images: [
            Iphone1,
            Iphone2,
            Iphone3,
            Iphone4
        ],
        description: "The iPhone 15 Pro Max features a stunning titanium design, the powerful A17 Pro chip, and an advanced camera system with 5x telephoto zoom. Experience the ultimate iPhone with cutting-edge technology and premium materials.",
        keyHighlights: [
            "6.7-inch Super Retina XDR Display",
            "A17 Pro Chip with 6-core GPU",
            "Pro Camera System with 5x Telephoto",
            "Titanium Design",
            "Action Button",
            "USB-C Connectivity"
        ],
        specifications: {
            "Display": "6.7-inch Super Retina XDR OLED",
            "Resolution": "2796 x 1290 pixels at 460 ppi",
            "Processor": "A17 Pro chip",
            "RAM": "8GB",
            "Storage": "128GB/256GB/512GB/1TB",
            "Rear Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
            "Front Camera": "12MP TrueDepth",
            "Battery": "4441 mAh",
            "Operating System": "iOS 17",
            "Connectivity": "5G, Wi-Fi 6E, Bluetooth 5.3",
            "Build": "Titanium frame with textured matte glass back",
            "Water Resistance": "IP68",
            "Dimensions": "159.9 x 76.7 x 8.25 mm",
            "Weight": "221g"
        },
        storageOptions: ["128GB", "256GB", "512GB", "1TB"],
        colorOptions: [
            { name: "Midnight Black", code: "#1f1f1f" },
            { name: "Deep Purple", code: "#5e4b8c" },
            { name: "Gold", code: "#f4e4bc" },
            { name: "Silver", code: "#e8e8e8" }
        ],
        inStock: true,
        stockCount: 25,
        offers: [
            "Get ₹5,000 instant discount on HDFC Bank Cards",
            "Exchange your old phone and get up to ₹25,000 off",
            "No Cost EMI available on all major credit cards",
            "Free Apple Care+ for 3 months"
        ]
    };

    const fullStars = Math.floor(mobileProduct.rating);
    const hasHalfStar = mobileProduct.rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const getStoragePrice = (storage) => {
        const basePrices = {
            "128GB": 134900,
            "256GB": 144900,
            "512GB": 164900,
            "1TB": 184900
        };
        return basePrices[storage] || mobileProduct.price;
    };

    const handleWishlistToggle = () => {
        setWishlistStatus(!wishlistStatus);
    };

    const handleAddToCart = () => {
        console.log('Added to cart:', {
            product: mobileProduct,
            quantity,
            selectedStorage,
            selectedColor,
            finalPrice: getStoragePrice(selectedStorage)
        });
    };

    const handleBuyNow = () => {
        console.log('Buy now:', {
            product: mobileProduct,
            quantity,
            selectedStorage,
            selectedColor,
            finalPrice: getStoragePrice(selectedStorage)
        });
    };

    return (
        <div className="single-product-page">
            <div className="single-product-container">
                {/* Product Images */}
                <div className="single-product-images">
                    <div className="single-product-main-image">
                        <img
                            src={mobileProduct.images[selectedImage]}
                            alt={mobileProduct.name}
                        />
                        <button
                            className={`single-product-wishlist-btn ${wishlistStatus ? 'active' : ''}`}
                            onClick={handleWishlistToggle}
                        >
                            {wishlistStatus ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <div className="single-product-image-indicator">
                            {selectedImage + 1} / {mobileProduct.images.length}
                        </div>
                    </div>
                    <div className="single-product-thumbnail-images">
                        {mobileProduct.images.map((image, index) => (
                            <button
                                key={index}
                                className={`single-product-thumbnail ${selectedImage === index ? 'active' : ''}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img src={image} alt={`${mobileProduct.name} view ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="single-product-details">
                    <div className="single-product-header">
                        <div className="single-product-brand-name">{mobileProduct.brand}</div>
                        <h1 className="single-product-title">{mobileProduct.name}</h1>

                        <div className="single-product-rating">
                            <div className="single-product-stars">
                                {[...Array(fullStars)].map((_, i) => (
                                    <FaStar key={`full-${i}`} />
                                ))}
                                {hasHalfStar && <FaStarHalfAlt key="half" />}
                                {[...Array(emptyStars)].map((_, i) => (
                                    <FaRegStar key={`empty-${i}`} />
                                ))}
                            </div>
                            <span className="single-product-rating-text">
                                {mobileProduct.rating} ({mobileProduct.reviewCount.toLocaleString()} reviews)
                            </span>
                        </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="single-product-key-highlights">
                        <h3>Key Features</h3>
                        <div className="single-product-highlights-grid">
                            {mobileProduct.keyHighlights.map((highlight, index) => (
                                <div key={index} className="single-product-highlight-item">
                                    <FaMobile className="single-product-highlight-icon" />
                                    <span>{highlight}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Storage Selection */}
                    <div className="single-product-selection-group">
                        <h3>Storage:</h3>
                        <div className="single-product-storage-options">
                            {mobileProduct.storageOptions.map(storage => (
                                <button
                                    key={storage}
                                    className={`single-product-storage-btn ${selectedStorage === storage ? 'selected' : ''}`}
                                    onClick={() => setSelectedStorage(storage)}
                                >
                                    <span className="single-product-storage-size">{storage}</span>
                                    <span className="single-product-storage-price">₹{getStoragePrice(storage).toLocaleString()}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className="single-product-selection-group">
                        <h3>Color: <span className="single-product-selected-color">{selectedColor}</span></h3>
                        <div className="single-product-color-options">
                            {mobileProduct.colorOptions.map(color => (
                                <button
                                    key={color.name}
                                    className={`single-product-color-btn ${selectedColor === color.name ? 'selected' : ''}`}
                                    onClick={() => setSelectedColor(color.name)}
                                    style={{ backgroundColor: color.code }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="single-product-price-section">
                        <div className="single-product-price-info">
                            <span className="single-product-current-price">₹{getStoragePrice(selectedStorage).toLocaleString()}</span>
                            <span className="single-product-original-price">₹{(getStoragePrice(selectedStorage) * 1.2).toLocaleString()}</span>
                            <span className="single-product-discount">{mobileProduct.discount}% off</span>
                        </div>
                        <div className="single-product-stock-info">
                            {mobileProduct.inStock ? (
                                <span className="single-product-in-stock">In Stock ({mobileProduct.stockCount} available)</span>
                            ) : (
                                <span className="single-product-out-of-stock">Out of Stock</span>
                            )}
                        </div>
                    </div>

                    {/* Offers */}
                    <div className="single-product-offers-section">
                        <h3>Available Offers</h3>
                        <div className="single-product-offers-list">
                            {mobileProduct.offers.map((offer, index) => (
                                <div key={index} className="single-product-offer-item">
                                    <span className="single-product-offer-badge">OFFER</span>
                                    <span className="single-product-offer-text">{offer}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="single-product-action-buttons">
                        <button
                            className="single-product-add-to-cart-btn"
                            onClick={handleAddToCart}
                            disabled={!mobileProduct.inStock}
                        >
                            <FaShoppingCart />
                            Add to Cart
                        </button>
                        <button
                            className="single-product-buy-now-btn"
                            onClick={handleBuyNow}
                            disabled={!mobileProduct.inStock}
                        >
                            Buy Now
                        </button>
                    </div>

                    {/* Service Information */}
                    <div className="single-product-service-info">
                        <div className="single-product-service-item">
                            <FaTruck />
                            <div>
                                <strong>Free Delivery</strong>
                                <p>Get free delivery on orders above ₹500</p>
                            </div>
                        </div>
                        <div className="single-product-service-item">
                            <FaUndo />
                            <div>
                                <strong>7-Day Returns</strong>
                                <p>Easy returns and exchange policy</p>
                            </div>
                        </div>
                        <div className="single-product-service-item">
                            <FaShieldAlt />
                            <div>
                                <strong>1-Year Warranty</strong>
                                <p>Manufacturer warranty included</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specifications Section */}
            <div className="single-product-specifications-section">
                <h2>Technical Specifications</h2>
                <div className="single-product-specs-grid">
                    {Object.entries(mobileProduct.specifications).map(([key, value]) => (
                        <div key={key} className="single-product-spec-row">
                            <span className="single-product-spec-label">{key}</span>
                            <span className="single-product-spec-value">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Description */}
            <div className="single-product-description-section">
                <h2>About this product</h2>
                <p className="single-product-description">{mobileProduct.description}</p>
            </div>
        </div>
    );
}

export default SingleProduct;
