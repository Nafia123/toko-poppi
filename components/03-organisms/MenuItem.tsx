import Image from 'next/image';
import React, { FormEvent, useState } from 'react';
import { MenuItemObject, Dish } from '../../_types/MenuItemModel';
// eslint-disable-next-line import/no-absolute-path
import styles from '/styles/Menuitem.module.css';
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
  const defaultOptions = new Map<string, string>();
  menuDish.forEach((dish) => {
    if (dish.dishOptions?.length) {
      defaultOptions.set(dish.dishName, dish.dishOptions[0].dishOption);
    }
  });
  const [options, setOptions] = useState<Map<string, string>>(defaultOptions);
  function changeOptions(event: FormEvent<HTMLSelectElement>, dishName: string) {
    const selectValue = (event.target as HTMLInputElement).value;
    setOptions(options.set(dishName, selectValue));
  }
  return (
    <div className={`${styles.options} p-8 border-x-2 border-b-2 relative`}>
      <div>
        {menuDish.map((dish) => (dish.dishOptions?.length
          ? (
            <div>
              <p className="py-3 text-xl font-bold">
                {dish.dishName}
                :
              </p>
              <select
                className="bg-white ml-0.5 p-2 border-2 pr-8 text-gray-800"
                key={dish.dishName}
                onChange={(event) => changeOptions(event, dish.dishName)}
              >
                {dish.dishOptions.map((option) => <option key={option.dishOption}>{option.dishOption}</option>)}
              </select>
            </div>
          ) : null))}
      </div>
      <button className="mt-5 text-white border-blue-600 border-2 bg-blue-600 p-2" type="submit" onClick={() => addToShoppingCart(setShoppingCart, data, options)}>
        + Voeg to aan Winkelwagen
      </button>
    </div>
  );
}
function ShowDish({ dish } : { dish: Dish }) {
  const { dishName, dishDescription } = dish;
  return (
    <div className="text-gray-500 font-light mb-2 mr-4" key={dishName}>
      <p className="font-bold">{dishName}</p>
      <p className="italic">{dishDescription}</p>
    </div>
  );
}

export default function MenuItem({ data, setShoppingCart } : PropData) {
  const { menuName, menuPrice, menuDish } = data;
  const [showOptions, setShowOptions] = React.useState(false);
  const openClick = () => setShowOptions(!showOptions);
  return (
    <div className="my-5 mx-3 2xl:mx-52 lg:mx-20 rounded-md shadow-lg">
      <section className={` relative ${showOptions ? 'border-x-2 border-t-2' : 'border-2'}`}>
        <div role="button" aria-hidden onClick={openClick} className="flex justify-between p-3 md:p-8">
          <button type="button" className="absolute top-0 right-0 border-l-2 border-b-2 p-0.5">
            <img src="/add_black_24dp.svg" alt="+" />
          </button>
          <div className="ml-2">
            <div className="flex mb-2">
              <p className="text-4xl font-bold">{menuName}</p>
            </div>
            <p className="text-2xl text-gray-800 font-bold my-1">Gerechten:</p>
            {menuDish.map((dish) => (!dish.dishOptions?.length ? <ShowDish key={dish.dishName} dish={dish} /> : ''))}
            <div className="md: mb-10" />
            <p className="text-xl md:text-4xl font-medium mt-2 md:mt-10 md:absolute bottom-5">{showCorrectPrice(menuPrice)}</p>
          </div>
          <img src="/daal.png" alt="Dish" className="mx-1 mt-10 w-20 h-20 md:mr-1 md:mt-0 sm:mt-0 md:w-52 md:h-52 sm:w-40 sm:h-40 right-5 relative my-0 " />
        </div>
      </section>
      {showOptions ? <OpenOptions setShoppingCart={setShoppingCart} data={data} /> : null}
    </div>

  );
}
