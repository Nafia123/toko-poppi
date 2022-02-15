import Head from 'next/head';
import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import Header from '../../components/03-organisms/Header';
import Footer from '../../components/03-organisms/Footer';
import Hero from '../../components/03-organisms/Hero';
import { MenuItemObject } from '../../_types/MenuItemModel';
import MenuItem from '../../components/03-organisms/MenuItem';
import ShoppingCart from '../../components/03-organisms/ShoppingCart';
import { ShoppingCartList } from '../../_types/ShoppingCartItem';
import client from '../../apollo-client';

interface MenuItemData {
  attributes: MenuItemObject
}
interface GqlData{
  menuItems: {
    data: MenuItemData[]
  }
}
export async function getServerSideProps() {
  const query = gql`
     query  { menuItems(filters:{visible: {eq:true}}){
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
      menuImage{
        data {
          attributes{
            url
          }
        }
      }
    }
  }

} } `;
  const { data } = await client.query<GqlData>({ query });
  return {
    props: {
      menuItems: data.menuItems,
    },
  };
}

export default function Pall({ menuItems }: GqlData) {
  const { data } = menuItems;
  const [posFixed, setPosFixed] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartList>({
    items: [], totalPrice: 0,
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => setPosFixed(window.scrollY > 100));
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Bestel uw maaltijd</title>
        <link rel="icon" href="/toko-poppi-logo.png" />
      </Head>
      <Header pallLogo />
      { !checkout
        ? (
          <section className="grid grid-cols-5 xl:grid-cols-6">
            <section className="col-span-5 lg:col-span-4 xl:col-span-5 shadow-right">
              <Hero />
              {data.map(({ attributes }) => (
                <MenuItem
                  key={attributes.menuName}
                  data={attributes}
                  setShoppingCart={setShoppingCart}
                />
              ))}
            </section>
            <section className="w-full">
              <div className={`invisible lg:visible h-screen lg:h-1/2 ${posFixed ? 'fixed top-0 w-1/5 xl:w-1/6' : ''}`}>
                <ShoppingCart
                  shoppingItems={shoppingCart}
                  setCheckout={setCheckout}
                  setShoppingCart={setShoppingCart}
                />
              </div>
            </section>
          </section>
        ) : <div>Test</div>}

      <Footer />
    </div>
  );
}
