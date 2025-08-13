import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import './ProductCard.css';

function ProductCard({
                         name,
                         price,
                         image,
                         rating,
                         onAddToCart,
                         onToggleWishlist,
                         onProductClick, // Add this new prop
                         isInWishlist = false
                     }) {
    const [wishlistStatus, setWishlistStatus] = useState(isInWishlist);

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const handleWishlistClick = (e) => {
        e.stopPropagation(); // Prevent card click when clicking wishlist
        const newStatus = !wishlistStatus;
        setWishlistStatus(newStatus);
        if (onToggleWishlist) {
            onToggleWishlist(newStatus);
        }
    };

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent card click when clicking add to cart
        if (onAddToCart) {
            onAddToCart();
        }
    };

    const handleCardClick = () => {
        if (onProductClick) {
            onProductClick();
        }
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <button
                className={`wishlist-button ${wishlistStatus ? 'added' : ''}`}
                onClick={handleWishlistClick}
                title={wishlistStatus ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label={wishlistStatus ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                {wishlistStatus ? <FaHeart /> : <FaRegHeart />}
            </button>

            <div className="product-image">
                <img src={image} alt={name} loading="lazy" />
            </div>

            <div className="product-details">
                <div className="product-info">
                    <h3 className="product-title">{name}</h3>

                    <div className="product-rating">
                        <div className="stars">
                            {[...Array(fullStars)].map((_, i) => (
                                <FaStar key={`full-${i}`} />
                            ))}
                            {hasHalfStar && <FaStarHalfAlt key="half" />}
                            {[...Array(emptyStars)].map((_, i) => (
                                <FaRegStar key={`empty-${i}`} />
                            ))}
                        </div>
                        <span className="rating-number">({rating})</span>
                    </div>

                    <p className="product-price">₹{price}</p>
                </div>

                <button className="add-to-cart" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
