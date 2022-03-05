import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Modal from 'react-modal';
import { DateTime, Settings } from 'luxon';
import useTranslation from 'next-translate/useTranslation';
import { Context } from 'vm';
import { useRouter } from 'next/router';
import Header from '../../components/02-molecules/Header';
import Footer from '../../components/02-molecules/Footer';
import Hero from '../../components/02-molecules/Hero';
import { MenuItemObject } from '../../_types/MenuItemModel';
import MenuItem from '../../components/03-organisms/MenuItem';
import ShoppingCart from '../../components/03-organisms/ShoppingCart';
import { ShoppingCartList } from '../../_types/ShoppingCartItem';
import client from '../../apollo-client';
import ViewPayment, { CompanyFormData } from '../../components/03-organisms/PaymentView';
import { WeekTimeType } from '../../_types/WeekTimeType';
import { dayOfWeekAsString } from '../../utils/helper';

interface MenuItemData {
  attributes: MenuItemObject
}
interface GqlData{
  menuItems: {
    data: MenuItemData[]
  }
  pallInfo: {
    data: {
      attributes: CompanyFormData
    }
  }
  pallOrderDay: {
    data: {
      attributes: WeekTimeType
    }
  }
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

export async function getStaticProps({ locale } : Context) {
  const query = gql`
     query  { menuItems(locale: "${locale.slice(0, 2)}", filters:{visible: {eq:true}}, pagination:{limit:5}){
  data {
    attributes{
      menuName
      menuDish {
        dishName
        dishDescription
        dishOptions {
         dishOption
        }
      }
      menuPrice
      allergens {
        allergens
      }
      menuImage{
        data {
          attributes{
            url
          }
        }
      }
    }
  }
} 
  pallInfo {
  data {
    attributes{
      streetName
      houseNumber
      companyName
      city
      zipcode
  }

  }}
   pallOrderDay{
        data{
          attributes{
            monday{
              from
              to
              lunchBreak
            }
            tuesday{
              from
              to
              lunchBreak

            }
            wednesday{
              from
              to
              lunchBreak
              
            }
            thursday{
              from
              to
              lunchBreak

            }
            friday{
              from
              to
              lunchBreak
            }
            saturday{
              from
              to
              lunchBreak
            }
            sunday{
              from
              to
              lunchBreak
           }
          }
        }
      }
} `;
  const { data } = await client.query<GqlData>({ query });
  return {
    props: {
      menuItems: data.menuItems,
      pallInfo: data.pallInfo,
      pallOrderDay: data.pallOrderDay,
    },
  };
}

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
  gqlData, setShoppingCart, shoppingCart, posFixed, closed, setCheckout,
}:
{ gqlData: GqlData,
  shoppingCart: ShoppingCartList,
  setShoppingCart: React.Dispatch<React.SetStateAction<ShoppingCartList>>,
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>,
  posFixed: boolean,
  closed: boolean,
}) {
  const [openModal, setOpenModal] = React.useState(false);
  const { menuItems: { data } } = gqlData;
  const { t } = useTranslation('common');
  useEffect(() => {
    setOpenModal(closed);
  }, [closed]);
  Modal.setAppElement('#__next');
  function closeModal() {
    setOpenModal(false);
  }
  return (
    <section className="grid grid-cols-5 xl:grid-cols-6">
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
          <div className="h-96 w-96 text-center">
            <p className=" text-2xl font-bold">{t('menuItem.modal.orderModalTitle')}</p>
            <p className=" text-xl">{t('menuItem.modal.orderModalDescription')}</p>
          </div>
        </Modal>
        {data.map(({ attributes }) => (
          <MenuItem
            key={attributes.menuName}
            data={attributes}
            setShoppingCart={setShoppingCart}
            orderClosed={closed}
          />
        ))}
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

export default function Pall(gqlData: GqlData) {
  const { t } = useTranslation('common');
  const { pallInfo, pallOrderDay } = gqlData;
  const [posFixed, setPosFixed] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [closed, setClosed] = useState(false);
  const router = useRouter();
  const [deliveryTimes, setDeliveryTimes] = useState<DateTime[]>([]);
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
    const deliveryTimesArray: DateTime[] = [];
    Settings.defaultZone = 'Europe/Amsterdam';
    Settings.defaultLocale = router.locale || 'en-US';
    const newDate = DateTime.local();
    const currentDay = dayOfWeekAsString(newDate.weekday - 1);
    const orderTimeArray = pallOrderDay.data !== null
      ? pallOrderDay.data.attributes[currentDay as keyof WeekTimeType] : [];
    orderTimeArray.forEach(({ from, to, lunchBreak }) => {
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
      if (newDate >= fromDate && newDate <= toDate) {
        deliveryTimesArray.push(DateTime.fromObject({
          hour: parseInt(lunchBreak.slice(0, 2), 10),
          minute: parseInt(lunchBreak.slice(3, 5), 10),
        }));
      }
    });
    for (let i = 1; i < 6; i++) {
      const nextDate = newDate.set({ day: newDate.day + i });
      const nextDay = dayOfWeekAsString(nextDate.weekday - 1);
      if (newDate.weekNumber !== nextDate.weekNumber) break;
      const orderTimeArrayNextWeek = pallOrderDay.data !== null
        ? pallOrderDay.data.attributes[nextDay as keyof WeekTimeType] : [];
      orderTimeArrayNextWeek.forEach(({ from, to, lunchBreak }) => {
        if (lunchBreak === null || from === null || to === null) {
          return;
        }
        deliveryTimesArray.push(nextDate.set({
          hour: parseInt(lunchBreak.slice(0, 2), 10),
          minute: parseInt(lunchBreak.slice(3, 5), 10),
        }));
      });
    }

    if (deliveryTimesArray.length === 0) {
      setClosed(true);
      return;
    }
    setDeliveryTimes(deliveryTimesArray);
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
            setShoppingCart={setShoppingCart}
            shoppingCart={shoppingCart}
            setCheckout={setCheckout}
            posFixed={posFixed}
            closed={closed}
          />
        )
        : (
          <Elements stripe={stripePromise}>
            <ViewPayment
              setCheckout={setCheckout}
              setShoppingCart={setShoppingCart}
              shoppingCart={shoppingCart}
              posFixed={posFixed}
              formData={pallInfo.data ? pallInfo.data.attributes : undefined}
              deliveryTimes={deliveryTimes}
            />
          </Elements>
        )}
      <Footer />
    </div>
  );
}
