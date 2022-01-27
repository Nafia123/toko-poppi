import { MenuItemObject, Dish } from "../../_types/MenuItemModel";
import Image from 'next/image';
import React, {FormEvent, useState} from "react";
import styles from '/styles/Menuitem.module.css'
import {ShoppingCartItem} from "../../_types/ShoppingCartItem";

interface propData {
    data: MenuItemObject,
    setShoppingCart: React.Dispatch<React.SetStateAction<Map<string,ShoppingCartItem>>>
}

function addToShoppingCart(setShoppingCart: React.Dispatch<React.SetStateAction<Map<string,ShoppingCartItem>>>,
                           itemToAdd: MenuItemObject, options: Map<string,string>){
    let optionsArray = Array.from(options.values());
    let menuKey = itemToAdd.menuName + optionsArray.join('');
    setShoppingCart((oldCart) => {
        let newCart = new Map<string,ShoppingCartItem>(oldCart);
        if(newCart.has(menuKey)){
            newCart.get(menuKey)!.amount += 1;
        }else{
            newCart.set(menuKey, {
                price: itemToAdd.menuPrice,
                amount: 1,
                option: optionsArray,
                name: itemToAdd.menuName,
            });
        }

        return newCart;
    })
}



function OpenOptions(menuProps: propData){
    const {setShoppingCart, data} = menuProps;
    const { menuDish } = data;
    let [options, setOptions] = useState<Map<string,string>>(new Map<string, string>());
    function changeOptions(event: FormEvent<HTMLSelectElement>, dishName: string) {
        let selectValue = (event.target as HTMLInputElement).value;
        options.set(dishName,selectValue);
        setOptions(options);
    }

    return(
    <div className={`${styles.options} p-8`}>
        {menuDish.map((dish) =>
        dish.dishOptions ?
        <select onChange={(event) => changeOptions(event,dish.dishName)}>
            {dish.dishOptions.map((option) => <option  key={option}>{option}</option>)}</select> : null
        )}
        <button onClick={() => addToShoppingCart(setShoppingCart, data, options)}>
            + Voeg to aan Winkelwagen</button>
    </div>
    )
}
const ShowDish = (dish: Dish) => {
    const {dishName, dishDescription} = dish;
    return (
        <div className="text-gray-500 font-light mb-2" key={dishName}>
            <p>{dishName}</p>
            <p>{dishDescription}</p>
        </div>
    )
}

export function MenuItem(props: propData) {
    const {menuName, menuPrice , menuDish} = props.data;
    const [showOptions, setShowOptions] = React.useState(false);
    const openClick = () => setShowOptions(!showOptions);
        return (
            <section  className="mx-10 my-5 rounded-md shadow-lg border-2">
                <div onClick={openClick} className="flex justify-between p-8">
                    <div className="ml-2">
                        <div className="flex">
                            <p className="text-4xl font-bold">{menuName}</p>
                        </div>
                        {menuDish.map((dish) => {return !dish.dishOptions ? <ShowDish {...dish}/> : ""})}
                        <p className="text-4xl font-medium mt-10">€{showCorrectPrice(menuPrice)}</p>
                    </div>
                    <Image src="/daal.png" width={150} height={101}/>
                </div>
                {showOptions ? <OpenOptions {...props}/> : null}
            </section>
        )
}

function showCorrectPrice(price: number){
    return price.toFixed(2).toString().replace('.',',')
}


