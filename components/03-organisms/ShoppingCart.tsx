import Image from 'next/image';
import { showCorrectPrice } from '../../utils/helper';
import { ShoppingCartItem, ShoppingCartList } from '../../_types/ShoppingCartItem';

interface PropType {
  shoppingItems: ShoppingCartList,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>
}

function incrementAmount(
  itemKey:string,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
) {
  setShoppingCart((oldCart) => {
    const newCart = { ...oldCart };
    const newCartList = Array.from(newCart.items);
    const index = newCartList.findIndex((cartItem) => cartItem.id === itemKey);
    newCartList[index] = { ...newCartList[index] };
    // eslint-disable-next-line operator-assignment
    newCartList[index].amount = newCartList[index].amount + 1;
    newCart.totalPrice += newCart.items[index].price;
    newCart.items = newCartList;

    return newCart;
  });
}

function decrementAmount(
  itemKey:string,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
) {
  setShoppingCart((oldCart) => {
    const newCart = { ...oldCart };
    const newCartList = Array.from(newCart.items);
    const index = newCartList.findIndex((cartItem) => cartItem.id === itemKey);
    newCartList[index] = { ...newCartList[index] };
    if (newCartList[index].amount === 1) newCartList.splice(index, 1);
    // eslint-disable-next-line operator-assignment
    else newCartList[index].amount = newCartList[index].amount - 1;
    newCart.totalPrice -= newCart.items[index].price;
    newCart.items = newCartList;

    return newCart;
  });
}

function CartItem({ shoppingCart, setShoppingCart }: {
  shoppingCart: ShoppingCartItem,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>
}) {
  const {
    option, amount, name, price,
  } = shoppingCart;
  return (
    <div className="px-4 py-2">
      <div className="flex justify-between">
        <div className="flex justify-between font-bold">
          <p>
            {amount}
            x
          </p>
          <p className="ml-3">{name}</p>
        </div>
        <div>
          <p>{showCorrectPrice(price * amount)}</p>
        </div>
      </div>
      <div>
        <p>{option.join(', ')}</p>
      </div>
      <div className="flex justify-end mt-2">
        <button type="button" onClick={() => incrementAmount(shoppingCart.id, setShoppingCart)} className="border border-blue-600 mr-2">
          <img src="/add_black_24dp.svg" alt="+" />
        </button>
        <button type="button" onClick={() => decrementAmount(shoppingCart.id, setShoppingCart)} className="border border-blue-600">
          <img src="/remove_black_24dp.svg" alt="-" />
        </button>
      </div>
    </div>
  );
}

function startPaymentProcess(setCheckout: React.Dispatch<React.SetStateAction<boolean>>) {
  setCheckout(true);
}

function PaymentSection({ cartItemList, setCheckout }: {
  cartItemList: ShoppingCartList,
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="px-4">
      <div className="flex justify-between mt-3">
        <div>
          Subtotaal:
        </div>
        <div>
          <p>{showCorrectPrice(cartItemList.totalPrice)}</p>
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <div>
          Verzendkosten:
        </div>
        <div>
          <p>{showCorrectPrice(0.5)}</p>
        </div>
      </div>
      <div className="flex justify-between mt-1 font-bold">
        <div>
          Totaal:
        </div>
        <div>
          <p>{showCorrectPrice(cartItemList.totalPrice + 0.5)}</p>
        </div>
      </div>
      <button type="button" onClick={() => startPaymentProcess(setCheckout)} className="w-full text-center border-blue-600 border-2 text-white bg-blue-600 py-2 mt-4">
        <p>
          Betaal (
          {showCorrectPrice(cartItemList.totalPrice + 0.5)}
          )
        </p>
      </button>
    </div>
  );
}

export default function ShoppingCart({ shoppingItems, setShoppingCart, setCheckout }: PropType) {
  return (
    <section>
      <div className="divide-y divide-solid">
        <div className="">
          <p className="text-2xl my-5 font-bold text-center">Winkelmandje</p>
        </div>
        <div className="row-span-5 divide-y-2 divide-solid">
          <div>
            {shoppingItems.items.length === 0
              ? (
                <div className="text-lg my-5 text-gray-500 text-center ">
                  <Image src="/shopping.svg" width={50} height={50} />
                  <p className="text-center">Niks in je winkelmandje</p>
                  <p className="text-center">Voeg een maaltijd toe</p>
                </div>
              )
              : (
                <div className="text-lg
                                    text-gray-500 divide-y-2 divide-solid"
                >
                  {
                                shoppingItems.items.map((cartItem) => (
                                  <CartItem
                                    key={cartItem.id}
                                    shoppingCart={cartItem}
                                    setShoppingCart={setShoppingCart}
                                  />
                                ))
                            }
                  <PaymentSection cartItemList={shoppingItems} setCheckout={setCheckout} />
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
