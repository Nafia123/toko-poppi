import Head from "next/head";
import {Header} from "../../components/03-organisms/Header";
import {Footer} from "../../components/03-organisms/Footer";
import {Hero} from "../../components/03-organisms/Hero";
import {MenuItemObject} from "../../_types/MenuItemModel";
import { MenuItem } from "../../components/03-organisms/MenuItem";
import {ShoppingCart} from "../../components/03-organisms/ShoppingCart";
import {useEffect, useState} from "react";
import {ShoppingCartList} from "../../_types/ShoppingCartItem";




export default function Pall() {
    const [posFixed, setPosFixed] = useState(false);
    const [checkout, setCheckout] = useState(false);
    const [shoppingCart, setShoppingCart] = useState<ShoppingCartList>({
        items: [], totalPrice: 0
    });
    useEffect(() => {
        if( typeof window !== "undefined"){
            window.addEventListener("scroll", () => setPosFixed(window.scrollY> 100))
        }
    }, []);
    return (
        <div>
            <Head>
                <title>Bestel uw maaltijd</title>
                <link rel="icon" href="/toko-poppi-logo.png" />
            </Head>
            <Header/>
            { !checkout ?
                <section className="grid grid-cols-6">
                    <section className="col-span-5 shadow-right">
                        <Hero/>
                        {data.map((menu) => <MenuItem key={menu.menuName} data={menu} setShoppingCart={setShoppingCart}/>)}
                    </section>
                    <section className="col-span-1">
                        <div className={`h-screen ${posFixed ? "fixed top-0 w-1/6 " : ""}`}>
                            <ShoppingCart shoppingItems={shoppingCart} setCheckout={setCheckout} setShoppingCart={setShoppingCart}/>
                        </div>
                    </section>
                </section> : <div>Test</div>}

            <Footer/>
        </div>
    )
}



const data : Array<MenuItemObject> = [{
    menuDish: [{
        dishName: "Dal makhni",
        dishDescription: "Gesplitste bruine kikkererwten, zwarte bonen en kidney bonen gekook in een pot in de oven"
    }],
    menuName: "Amritsar1",
    menuPrice: 8.00
}, {
    menuDish: [{
        dishName: "Dal makhni",
        dishDescription: "Gesplitste bruine kikkererwten, zwarte bonen en kidney bonen gekook in een pot in de oven"
    },{
            dishName: "Groente",
            dishDescription: "Courgette"
        },{
        dishName: "Side Dish",
        dishDescription: "Side Dish of their choice",
        dishOptions: ["Rijst","Chapati","Naan"]
    }],
    menuName: "Amritsar2",
    menuPrice: 8.50
},
    {
        menuDish: [{
            dishName: "Dal makhni",
            dishDescription: "Gesplitste bruine kikkererwten, zwarte bonen en kidney bonen gekook in een pot in de oven"
        }],
        menuName: "Amritsar3",
        menuPrice:8.00
    }]