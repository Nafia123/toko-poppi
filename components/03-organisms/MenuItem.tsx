import { MenuItemObject, Dish } from "../../_types/MenuItemModel";
import Image from 'next/image';
import React, {MouseEventHandler} from "react";
import styles from '/styles/Menuitem.module.css'

type propData = {
    data: MenuItemObject,
    setShoppingCart: React.Dispatch<React.SetStateAction<MenuItemObject[]>>
}


function OpenOptions(menuProps: propData){
    const {setShoppingCart, data} = menuProps;
    return(
        <div className={`${styles.options} p-8`}>
            <select>
                <option>Roti</option>
                <option>Chapati</option>
                <option>Rijst</option>
            </select>
            <button onClick={() => {setShoppingCart((oldCart) => [...oldCart, data])}}>Test 123</button>
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
                        {menuDish.map((dish) =>showDish(dish))}
                        <p className="text-4xl font-medium mt-10">€{menuPrice}</p>
                    </div>
                    <Image src="/daal.png" width={150} height={101}/>
                </div>
                {showOptions ? <OpenOptions {...props}/> : null}
            </section>
        )
}

const showDish = (dish: Dish) => {
    const {dishName, dishDescription} = dish;
    return (
        <div className="text-gray-500 font-light mb-2" key={dishName as string}>
            <p>{dishName}</p>
            <p>{dishDescription}</p>
        </div>
    )
}

