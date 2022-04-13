import React, { FormEvent, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { DateTime } from 'luxon';
import { MenuItemObject, Dish } from '../../_types/MenuItemModel';
// eslint-disable-next-line import/no-absolute-path
import styles from '/styles/Menuitem.module.css';
import { ShoppingCartList } from '../../_types/ShoppingCartItem';
import { showCorrectPrice } from '../../utils/helper';

interface PropData {
  data: MenuItemObject,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
  orderClosed?: boolean,
  pickupDate: DateTime
}

function addToShoppingCart(
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
  itemToAdd: MenuItemObject,
  options: Map<string, string>,
  pickupDate: DateTime,
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
        pickupDate: pickupDate.toString(),
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

function OpenOptions({
  setShoppingCart, data, orderClosed, pickupDate,
}: PropData) {
  const { menuDish } = data;
  const defaultOptions = new Map<string, string>();
  menuDish.forEach((dish) => {
    if (dish.dishOptions?.length) {
      defaultOptions.set(dish.dishName, dish.dishOptions[0].dishOption);
    }
  });
  const { t } = useTranslation('common');
  const [options, setOptions] = useState<Map<string, string>>(defaultOptions);
  function changeOptions(event: FormEvent<HTMLSelectElement>, dishName: string) {
    const selectValue = (event.target as HTMLInputElement).value;
    setOptions(options.set(dishName, selectValue));
  }
  return (
    <div className={`${styles.options} p-8 border-x border-b relative rounded-b-lg`}>
      <div>
        {menuDish.map((dish) => (dish.dishOptions?.length
          ? (
            <div key={dish.dishName}>
              <p className="py-3 text-xl font-bold">
                {dish.dishName}
                :
              </p>
              <select
                className="bg-white ml-0.5 p-2 border-2 pr-8 text-gray-800"
                key={dish.dishName}
                onChange={(event) => changeOptions(event, dish.dishName)}
              >
                {dish.dishOptions.map(
                  (option) => <option key={option.dishOption}>{option.dishOption}</option>,
                )}
              </select>
            </div>
          ) : null))}
      </div>
      {!orderClosed ? (
        <button className="mt-5 text-white border-blue-600 border-2 bg-blue-600 p-2" type="submit" onClick={() => addToShoppingCart(setShoppingCart, data, options, pickupDate)}>
          +
          {' '}
          {t('menuItem.addToShoppingCart')}
        </button>
      ) : null}

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

export default function MenuItem({
  data, setShoppingCart, orderClosed, pickupDate,
} : PropData) {
  const {
    menuName, menuPrice, menuDish, menuImage, allergens,
  } = data;
  const { t } = useTranslation('common');
  const [showOptions, setShowOptions] = React.useState(false);
  const openClick = () => setShowOptions(!showOptions);
  return (
    <div className={`my-1 rounded-xl shadow-sm mx-4 bg-white ${orderClosed ? 'opacity-40 pointer-events-none' : ''}`}>
      <section className={`relative ${showOptions ? ' border-t border-x rounded-x-lg rounded-t-lg' : 'border rounded-lg'}`}>
        <div role="button" aria-hidden onClick={openClick} className="flex justify-between p-3 ">
          <button type="button" className="absolute top-0 right-0 border-l border-b py-0.5">
            <img src="/add_black_24dp.svg" alt="+" />
          </button>
          <div className="ml-2">
            <div className="flex mb-2">
              <p className="text-4xl font-bold">{menuName}</p>
            </div>
            <p className="text-2xl text-gray-800 font-bold my-1">
              {t('menuItem.dish')}
              :
            </p>
            {menuDish.map((dish) => (!dish.dishOptions?.length ? <ShowDish key={dish.dishName} dish={dish} /> : ''))}
            <div>
              {allergens.length.valueOf() !== 0
                ? (
                  <p className="underline text-gray-400 text-sm">
                    {t('menuItem.allergens')}
                    {': '}
                    <span className="font-bold italic">{allergens.map((allergen) => (t(`menuItem.allergensList.${allergen.allergens}`))).join(', ')}</span>
                  </p>
                )
                : null}
            </div>
            <div className="md:mb-12" />
            <p className="text-xl md:text-4xl font-medium mt-2 md:mt-10 md:absolute bottom-4">{showCorrectPrice(menuPrice)}</p>
          </div>
          <img src={menuImage.data !== null ? menuImage.data.attributes.url : '/daal.png'} alt="Dish" className="object-cover mx-1 mt-10 w-20 h-20 sm:mt-0 sm:w-40 sm:h-40 md:mr-1 md:mt-0  md:w-52 md:h-52 right-5 relative my-0" />
        </div>
      </section>
      {showOptions ? (
        <OpenOptions
          setShoppingCart={setShoppingCart}
          orderClosed={orderClosed}
          data={data}
          pickupDate={pickupDate}
        />
      ) : null}
    </div>
  );
}
