import Image from 'next/image';
import Modal from 'react-modal';
import React, { useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { showCorrectPrice } from '../../utils/helper';
import { ShoppingCartItem, ShoppingCartList } from '../../_types/ShoppingCartItem';

interface PropType {
  shoppingItems: ShoppingCartList,
  // eslint-disable-next-line react/no-unused-prop-types
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
  // eslint-disable-next-line react/no-unused-prop-types
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>
}

interface ModalCartProp extends PropType{
  closeModal: () => void
}

interface WebShopCartProp extends PropType{
  showPayButton?: boolean
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
function CartItem({ shoppingCart, setShoppingCart, showPayButton }: {
  shoppingCart: ShoppingCartItem,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>
  showPayButton: boolean
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
        {!showPayButton && amount === 1 ? null
          : (
            <button type="button" onClick={() => decrementAmount(shoppingCart.id, setShoppingCart)} className="border border-blue-600 mr-2">
              <img src="/remove_black_24dp.svg" alt="-" />
            </button>
          )}
        <button type="button" onClick={() => incrementAmount(shoppingCart.id, setShoppingCart)} className="border border-blue-600 ">
          <img src="/add_black_24dp.svg" alt="+" />
        </button>
      </div>
    </div>
  );
}

function startPaymentProcess(setCheckout: React.Dispatch<React.SetStateAction<boolean>>) {
  setCheckout(true);
}

export function PaymentSection({ cartItemList, setCheckout, showPayButton }: {
  cartItemList: ShoppingCartList,
  showPayButton: boolean
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { t } = useTranslation('common');

  return (
    <div className="px-4">
      {/* <div className="flex justify-between mt-3"> */}
      {/*  <div> */}
      {/*    {t('shoppingCart.subtotal')} */}
      {/*    : */}
      {/*  </div> */}
      {/*  <div> */}
      {/*    <p>{showCorrectPrice(cartItemList.totalPrice)}</p> */}
      {/*  </div> */}
      {/* </div> */}
      {/* <div className="flex justify-between mt-1"> */}
      {/*  <div> */}
      {/*    {t('shoppingCart.postageCosts')} */}
      {/*  </div> */}
      {/*  <div> */}
      {/*    <p>{showCorrectPrice(0.5)}</p> */}
      {/*  </div> */}
      {/* </div> */}
      <div className="flex justify-between mt-1 font-bold">
        <div>
          {t('shoppingCart.netTotal')}
        </div>
        <div>
          <p>{showCorrectPrice(cartItemList.totalPrice)}</p>
        </div>
      </div>
      {showPayButton ? (
        <button type="button" onClick={() => startPaymentProcess(setCheckout)} className="w-full text-center border-blue-600 border-2 text-white bg-blue-600 py-2 mt-4">
          <p>
            {t('shoppingCart.payButton')}
            {' '}
            (
            {showCorrectPrice(cartItemList.totalPrice)}
            )
          </p>
        </button>
      ) : null}
    </div>
  );
}

export function FullShoppingCart({
  shoppingItems, setCheckout, setShoppingCart, showPayButton = true,
} : WebShopCartProp) {
  const { t } = useTranslation('common');
  return (
    <div className="row-span-5 divide-y-2 divide-solid">
      <div>
        {shoppingItems.items.length === 0
          ? (
            <div className="text-lg my-5 text-gray-500 text-center ">
              <Image src="/shopping.svg" width={50} height={50} />
              <p className="text-center">{t('shoppingCart.emptyCart')}</p>
              <p className="text-center">{t('shoppingCart.addMeal')}</p>
            </div>
          )
          : (
            <div className="text-lg text-gray-500 divide-y-2 divide-solid">
              {
                      shoppingItems.items.map((cartItem) => (
                        <CartItem
                          key={cartItem.id}
                          shoppingCart={cartItem}
                          setShoppingCart={setShoppingCart}
                          showPayButton={showPayButton}
                        />
                      ))
                    }
              <PaymentSection
                cartItemList={shoppingItems}
                setCheckout={setCheckout}
                showPayButton={showPayButton}
              />
            </div>
          )}
      </div>
    </div>
  );
}
export function WebShoppingCart(
  {
    showPayButton = true, setShoppingCart, shoppingItems, setCheckout,
  } : WebShopCartProp,
) {
  const { t } = useTranslation('common');

  return (
    <section>
      <div className="divide-y divide-solid">
        <div className="flex justify-between lg:block">
          <p className="text-2xl my-5 font-bold text-center">{t('shoppingCart.title')}</p>
        </div>
      </div>
      <FullShoppingCart
        setShoppingCart={setShoppingCart}
        setCheckout={setCheckout}
        shoppingItems={shoppingItems}
        showPayButton={showPayButton}
      />
    </section>
  );
}

export function WebShoppingCartModal({
  shoppingItems, setShoppingCart, setCheckout,
  closeModal,
}: ModalCartProp) {
  const { t } = useTranslation('common');

  return (
    <section>
      <div className="divide-y divide-solid">
        <div className="flex justify-between lg:block">
          <p className="text-2xl my-5 font-bold text-center">{t('shoppingCart.title')}</p>
          <button type="button" onClick={() => closeModal()} className="visible md:hidden">
            <p className="text-2xl visible lg:hidden my-5 font-bold text-right">X</p>
          </button>
        </div>
        <FullShoppingCart
          setShoppingCart={setShoppingCart}
          setCheckout={setCheckout}
          shoppingItems={shoppingItems}
        />
      </div>
    </section>
  );
}

export function MobileShoppingCart({ shoppingItems, openModal }: {
  shoppingItems: ShoppingCartList,
  openModal: () => void,
}) {
  const { t } = useTranslation('common');

  return (
    <div>
      {
        shoppingItems.items.length !== 0
          ? (
            <button
              type="button"
              onClick={() => openModal()}
              className="w-full text-center border-blue-600 border-2 text-white bg-blue-600 py-2 fixed mt-4 z-10 bottom-0"
            >
              <p>
                {t('shoppingCart.title')}
                {' '}
                (
                {showCorrectPrice(shoppingItems.totalPrice + 0.5)}
                )
              </p>
            </button>
          ) : ''
      }
    </div>
  );
}

export default function ShoppingCart({ shoppingItems, setShoppingCart, setCheckout }: PropType) {
  Modal.setAppElement('#__next');
  const [modalIsOpen, setIsOpen] = React.useState(false);
  useEffect(() => {
    document.body.style.overflow = modalIsOpen ? 'hidden' : 'unset';
    return function cleanup() {
      document.body.style.overflow = 'unset';
    };
  }, [modalIsOpen]);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <section>
      <div className="hidden lg:block">
        <WebShoppingCart
          setShoppingCart={setShoppingCart}
          setCheckout={setCheckout}
          shoppingItems={shoppingItems}
        />
      </div>
      <div className="visible lg:hidden">
        <MobileShoppingCart
          shoppingItems={shoppingItems}
          openModal={() => openModal()}
        />
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={() => closeModal()} contentLabel="Winkelmand">
        <WebShoppingCartModal
          shoppingItems={shoppingItems}
          setShoppingCart={setShoppingCart}
          setCheckout={setCheckout}
          closeModal={() => closeModal()}
        />
      </Modal>
    </section>
  );
}
