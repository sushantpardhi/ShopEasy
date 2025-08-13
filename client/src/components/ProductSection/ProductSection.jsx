import { useNavigate } from 'react-router-dom';
import './ProductSection.css';
import ProductCard from "../ProductCard/ProductCard";

function ProductSection({ title, products }) {
    const navigate = useNavigate();

    if (!products || products.length === 0) {
        return null;
    }

    const handleAddToCart = (product) => {
        console.log('Added to cart:', product);
        // Add your cart logic here
    };

    const handleToggleWishlist = (product, isAdded) => {
        console.log('Wishlist toggled:', { product, isAdded });
        // Add your wishlist logic here
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <section className="product-section">
            <div className="section-header">
                <h2 className="section-title">{title}</h2>
            </div>
            <div className="products-grid" role="list">
                {products.map((product) => (
                    <div key={product.id} className="product-item" role="listitem">
                        <ProductCard
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            rating={product.rating}
                            onAddToCart={() => handleAddToCart(product)}
                            onToggleWishlist={(isAdded) => handleToggleWishlist(product, isAdded)}
                            onProductClick={() => handleProductClick(product.id)}
                            isInWishlist={product.isInWishlist || false}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ProductSection;
