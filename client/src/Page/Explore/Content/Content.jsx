import './Content.css';
import ProductSection from '../../../components/ProductSection/ProductSection';
import mobilePhone from "../../../assets/images/Products/Iphone/Mobile1.1.jpg";
import laptop2 from "../../../assets/images/Products/HP Laptop/Laptop2.1.jpg";
import macbook from "../../../assets/images/Products/Macbook/Laptop1.3.jpg";

function Content() {
    const newArrivals = [
        { id: 1, name: "IPhone", price: 499.99, image: mobilePhone, rating: 4.8 },
        { id: 2, name: "HP Laptop", price: 499.99, image: laptop2, rating: 3.6 },
        { id: 3, name: "MacBook", price: 599.99, image: macbook, rating: 4.9 },
        { id: 4, name: "IPhone", price: 499.99, image: mobilePhone, rating: 4.8 },
        { id: 5, name: "HP Laptop", price: 499.99, image: laptop2, rating: 3.6 },
        { id: 6, name: "MacBook", price: 599.99, image: macbook, rating: 4.9 },
        { id: 7, name: "IPhone", price: 499.99, image: mobilePhone, rating: 4.8 },
        { id: 8, name: "HP Laptop", price: 499.99, image: laptop2, rating: 3.6 },
        { id: 9, name: "MacBook", price: 599.99, image: macbook, rating: 4.9 },

    ];

    // Example of other product sections
    const featuredProducts = [
        { id: 1, name: "IPhone", price: 499.99, image: mobilePhone, rating: 4.8 },
        { id: 2, name: "HP Laptop", price: 499.99, image: laptop2, rating: 3.6 },
        { id: 3, name: "MacBook", price: 599.99, image: macbook, rating: 4.9 },
    ];

    const bestSellers = [
        { id: 1, name: "IPhone", price: 499.99, image: mobilePhone, rating: 4.8 },
        { id: 2, name: "HP Laptop", price: 499.99, image: laptop2, rating: 3.6 },
        { id: 3, name: "MacBook", price: 599.99, image: macbook, rating: 4.9 },    ];

    return (
        <div className="content">
            <ProductSection
                title="New Arrivals"
                products={newArrivals}
            />

            <ProductSection
                title="Featured Products"
                products={featuredProducts}
            />

            <ProductSection
                title="Best Sellers"
                products={bestSellers}
            />
        </div>
    );
}

export default Content;
