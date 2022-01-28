import Image from 'next/image';
import React, { FormEvent, useState } from 'react';
import { MenuItemObject, Dish } from '../../_types/MenuItemModel';
import styles from '@/styles/Menuitem.module.css';
import { ShoppingCartList } from '../../_types/ShoppingCartItem';
import { showCorrectPrice } from '../../utils/helper';

interface PropData {
  data: MenuItemObject,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>
}

function addToShoppingCart(
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
  itemToAdd: MenuItemObject,
  options: Map<string, string>,
) {
  const optionsArray = Array.from(options.values());
  const menuKey = itemToAdd.menuName + optionsArray.join('');

  setShoppingCart((oldCart) => {
    const newCart = { ...oldCart };
    const newCartList = Array.from(newCart.items);
    const index = newCartList.findIndex((cartItem) => cartItem.id === menuKey);
    if (index === -1) {
      newCartList.push({
        price: itemToAdd.menuPrice,
        amount: 1,
        option: optionsArray,
        name: itemToAdd.menuName,
        id: menuKey,
      });
    } else {
      newCartList[index] = { ...newCartList[index] };
      // eslint-disable-next-line operator-assignment
      newCartList[index].amount = newCartList[index].amount + 1;
    }

    newCart.totalPrice += itemToAdd.menuPrice;
    newCart.items = newCartList;

    return newCart;
  });
}

function OpenOptions({ setShoppingCart, data }: PropData) {
  const { menuDish } = data;
  const [options, setOptions] = useState<Map<string, string>>(new Map<string, string>());
  function changeOptions(event: FormEvent<HTMLSelectElement>, dishName: string) {
    const selectValue = (event.target as HTMLInputElement).value;
    options.set(dishName, selectValue);
    setOptions(options);
  }

  return (
    <div className={`${styles.options} p-8`}>
      {menuDish.map((dish) => (dish.dishOptions
        ? (
          <select key={dish.dishName} onChange={(event) => changeOptions(event, dish.dishName)}>
            {dish.dishOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        ) : null))}
      <button type="submit" onClick={() => addToShoppingCart(setShoppingCart, data, options)}>
        + Voeg to aan Winkelwagen
      </button>
    </div>
  );
}
function ShowDish({ dish } : { dish: Dish }) {
  const { dishName, dishDescription } = dish;
  return (
    <div className="text-gray-500 font-light mb-2" key={dishName}>
      <p>{dishName}</p>
      <p>{dishDescription}</p>
    </div>
  );
}

export default function MenuItem({ data, setShoppingCart } : PropData) {
  const { menuName, menuPrice, menuDish } = data;
  const [showOptions, setShowOptions] = React.useState(false);
  const openClick = () => setShowOptions(!showOptions);
  return (
    <section role="button" aria-hidden onClick={openClick} className="mx-10 my-5 rounded-md shadow-lg border-2">
      <div className="flex justify-between p-8">
        <div className="ml-2">
          <div className="flex">
            <p className="text-4xl font-bold">{menuName}</p>
          </div>
          {menuDish.map((dish) => (!dish.dishOptions ? <ShowDish key={dish.dishName} dish={dish} /> : ''))}
          <p className="text-4xl font-medium mt-10">{showCorrectPrice(menuPrice)}</p>
        </div>
        <Image src="/daal.png" width={150} height={101} />
      </div>
      {showOptions ? <OpenOptions setShoppingCart={setShoppingCart} data={data} /> : null}
    </section>
  );
}
