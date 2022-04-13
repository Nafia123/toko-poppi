import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Modal from 'react-modal';
import { DateTime, Settings } from 'luxon';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import Header from '../02-molecules/Header';
import Footer from '../02-molecules/Footer';
import Hero from '../02-molecules/Hero';
import MenuItem from '../03-organisms/MenuItem';
import ShoppingCart from '../03-organisms/ShoppingCart';
import { ShoppingCartList } from '../../_types/ShoppingCartItem';
import ViewPayment from '../03-organisms/PaymentView';
import { WeekTimeType } from '../../_types/WeekTimeType';
import { dayOfWeekAsString } from '../../utils/helper';
import { GqlData } from '../../_types/TokoData';
import { DayMenuItem } from '../../_types/MenuItemModel';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

const CUSTOM_STYLES = {
  backgroundColor: '#ffffff',
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function ViewMenus({
  gqlData, setShoppingCart, shoppingCart, posFixed, closed, setCheckout, orderIsFull, weekMenu,
}:
{ gqlData: GqlData,
  shoppingCart: ShoppingCartList,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>,
  posFixed: boolean,
  closed: boolean,
  weekMenu: DayMenuItem[]
  orderIsFull: boolean,
}) {
  const [openModal, setOpenModal] = React.useState(false);
  const { t } = useTranslation('common');
  useEffect(() => {
    setOpenModal(closed);
  }, [closed]);
  useEffect(() => {
    setOpenModal(orderIsFull);
  }, [orderIsFull]);
  Modal.setAppElement('#__next');
  function closeModal() {
    setOpenModal(false);
  }
  return (
    <section className="grid grid-cols-5 xl:grid-cols-6 text-gray-700">
      <section className="col-span-5 lg:col-span-4 xl:col-span-5 shadow-right">
        <Hero />
        <Modal
          style={CUSTOM_STYLES}
          isOpen={openModal}
          className="fixed inset-0 bg-white border-2 border-gray-200"
          onRequestClose={() => closeModal()}
          contentLabel="Gesloten"
        >
          <button type="button" onClick={() => closeModal()}>
            <p className="text-2xl font-bold text-right absolute right-0 top-0 mr-2">X</p>
          </button>
          {
            orderIsFull ? (
              <div className="h-96 w-96 text-center">
                <p className=" text-2xl font-bold">{t('menuItem.modalIsFull.orderModalTitle')}</p>
                <p className=" text-xl">{t('menuItem.modalIsFull.orderModalDescription')}</p>
              </div>
            ) : (
              <div className="h-96 w-96 text-center">
                <p className=" text-2xl font-bold">{t('menuItem.modal.orderModalTitle')}</p>
                <p className=" text-xl">{t('menuItem.modal.orderModalDescription')}</p>
              </div>
            )
          }
        </Modal>
        <div className="mt-2 px-4 md:px-10">
          {weekMenu.map(({ date, menuItems, disabled }) => (
            <div>
              <div className="border border-gray-200 rounded-xl mx-1 mb-3 pb-2 bg-gray-50 relative">
                <p className={`text-4xl p-2 text-gray-800 font-bold font-sans ${disabled ? 'opacity-40' : ''}`}>
                  {date.toFormat('ccc dd/MM')}
                </p>
                {menuItems.map(({ attributes }) => (
                  <MenuItem
                    key={attributes.menuName}
                    pickupDate={date}
                    data={attributes}
                    setShoppingCart={setShoppingCart}
                    orderClosed={disabled}
                  />
                ))}
                {disabled ? <p className="left-0 right-0 absolute top-1/2 text-5xl md:text-6xl text-gray-800 text-center">Niet Beschikbaar</p> : null}
              </div>
              <div className="border-t-2 px-20 mb-3 mt-0.5 mx-10 rounded border-gray-300" />
            </div>
          ))}

        </div>
      </section>
      <section className="col-span-5 lg:col-span-1">
        <div className={`lg:h-1/2 ${posFixed ? 'lg:fixed lg:top-0 lg:w-1/5 xl:w-1/6' : ''}`}>
          <ShoppingCart
            shoppingItems={shoppingCart}
            setCheckout={setCheckout}
            setShoppingCart={setShoppingCart}
          />
        </div>
      </section>
    </section>
  );
}

export default function ShopPage(
  { deliveryTimesArray, gqlData }: { deliveryTimesArray:string, gqlData:GqlData },
) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    shopInfo = null, orderDay, limitOrder, orders,
  } = gqlData;
  const [posFixed, setPosFixed] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [closed, setClosed] = useState(false);
  const [orderIsFull, setOrderIsFull] = useState(false);
  const [weekMenu, setWeekMenu] = useState<DayMenuItem[]>([]);
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartList>({
    items: [], totalPrice: 0,
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => setPosFixed(window.scrollY > 100));
    }
    return function cleanup() {
      window.removeEventListener('scroll', () => setPosFixed(window.scrollY > 100));
    };
  }, [posFixed]);
  useEffect(() => {
    window.onpopstate = () => {
      setCheckout(false);
    };
    if (checkout) {
      window.history.pushState(null, '', window.location.href);
    }
  }, [checkout]);
  useEffect(() => {
    const temp = JSON.parse(deliveryTimesArray);
    const newWeekMenu: DayMenuItem[] = [];
    Settings.defaultZone = 'Europe/Amsterdam';
    Settings.defaultLocale = router.locale || 'en-US';
    temp.forEach((item: any) => {
      newWeekMenu.push({
        date: DateTime.fromISO(item.date),
        menuItems: item.menuItems,
        disabled: item.disabled,
      });
    });
    const newDate = DateTime.local();
    const currentDay = dayOfWeekAsString(newDate.weekday - 1);
    if (((orders.data && limitOrder.data)
        && orders.data.length >= limitOrder.data.attributes.Limit)) {
      setOrderIsFull(true);
    }
    const orderTimeArray = orderDay.data !== null
      ? orderDay.data.attributes[currentDay as keyof WeekTimeType] : [];
    orderTimeArray.forEach(({ from, to }) => {
      if (from === null || to === null) {
        return;
      }
      const fromDate = DateTime.fromObject({
        hour: parseInt(from.slice(0, 2), 10),
        minute: parseInt(from.slice(3, 5), 10),
      });
      const toDate = DateTime.fromObject({
        hour: parseInt(to.slice(0, 2), 10),
        minute: parseInt(to.slice(3, 5), 10),
      });
      if ((newDate >= fromDate && newDate <= toDate) && !orderIsFull) {
        newWeekMenu[newDate.weekday - 1].disabled = false;
      }
    });
    if (newWeekMenu.length === 0) {
      setClosed(true);
      return;
    }
    newWeekMenu.sort();
    setWeekMenu(newWeekMenu);
  }, []);
  return (
    <div>
      <Head>
        <title>{t('generalWeb.tabInfo')}</title>
        <link rel="icon" href="/toko-poppi-logo.png" />
      </Head>
      <Header pallLogo />
      { !checkout
        ? (
          <ViewMenus
            gqlData={gqlData}
            weekMenu={weekMenu}
            setShoppingCart={setShoppingCart}
            shoppingCart={shoppingCart}
            setCheckout={setCheckout}
            posFixed={posFixed}
            closed={closed}
            orderIsFull={orderIsFull}
          />
        )
        : (
          <Elements stripe={stripePromise}>
            <ViewPayment
              setCheckout={setCheckout}
              setShoppingCart={setShoppingCart}
              shoppingCart={shoppingCart}
              posFixed={posFixed}
              formData={shopInfo && shopInfo.data ? shopInfo.data.attributes : undefined}
            />
          </Elements>
        )}
      <Footer />
    </div>
  );
}
