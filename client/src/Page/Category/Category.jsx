import './Category.css'
import mobilePhone from "../../assets/images/Products/Iphone/Mobile1.1.jpg";
import laptop2 from "../../assets/images/Products/HP Laptop/Laptop2.1.jpg";
import macbook from "../../assets/images/Products/Macbook/Laptop1.3.jpg";
import ProductSection from "../../components/ProductSection/ProductSection";
import * as toys from '../../assets/images/Products/Toys/Toys.jsx'
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../Context/AuthContext";

function Category(){
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);

    const Electronics = [
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

    const Toys = [
        {id:1, name:"Lego", price: 200, image:toys.Toy9, rating: 3.7},
        {id:2, name:"Barbie", price: 150, image:toys.Toy4, rating: 4.5},
        {id:3, name:"Teddy Bear", price: 100, image:toys.Toy1, rating: 4.2},
        {id:4, name:"Teddy Bear", price: 600, image:toys.Toy5, rating: 4.9},
    ]

    const handleOnClickManage = () => {
        navigate('/manage-categories');
    };

    return (
        <div className='category-container'>
            <div className="category-header">
                {user && user.role === "admin" && (
                    <>
                        <h1 className="category-title">Product Categories</h1>
                        <button className='manage-categories-button' onClick={handleOnClickManage}>
                            Manage Categories
                        </button>
                    </>
                )}
            </div>
            <ProductSection
                title='Electronics'
                products={Electronics}
            />

            <ProductSection
                title='Toys'
                products={Toys}
            />
        </div>
    );
}

export default Category;
