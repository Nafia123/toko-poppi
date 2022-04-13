import React from 'react';
import { gql } from '@apollo/client';
import { DateTime, Settings } from 'luxon';
import { Context } from 'vm';
import { MenuItemData } from '../../_types/MenuItemModel';
import client from '../../apollo-client';
import { WeekMenuType, WeekTimeType } from '../../_types/WeekTimeType';
import { getMenuItemGraphql, setupDeliveryTimes } from '../../utils/helper';
import ShopPage from '../../components/04-page/ShopPage';
import { GqlData } from '../../_types/TokoData';

interface TokoInfo{
  menuItems: {
    data: MenuItemData[]
  }
  tokoLimitOrder:{
    data: {
      attributes: {
        Limit: number
      }
    }
  }
  orders: {
    data: Array<{ attributes: { deliveryTime: DateTime } }>
  }
  tokoOrderDay: {
    data: {
      attributes: WeekTimeType
    }
  }
  tokoWeekMenu: {
    data: {
      attributes: WeekMenuType
    }
  }
}

export async function getStaticProps({ locale } : Context) {
  const today = DateTime.now();
  const startTime = today.set({ hour: 0, minute: 0 });
  const query = gql`
     query  {
 orders(filters:{deliveryTime:{gte:"${startTime.toString()}"}}){
    data{
      attributes{
        deliveryTime
      }
    }
  }
   tokoLimitOrder{
    data{
      attributes{
        Limit
      }      
    }
  }
    tokoWeekMenu(locale: "${locale.slice(0, 2)}"){
        data{
          attributes{
            monday{
              ${getMenuItemGraphql()}
            }
            tuesday{
              ${getMenuItemGraphql()}
            }
            wednesday{
              ${getMenuItemGraphql()}
            }
            thursday{
              ${getMenuItemGraphql()}
            }
            friday{
              ${getMenuItemGraphql()}
            }
            saturday{
              ${getMenuItemGraphql()}
            }
            sunday{
              ${getMenuItemGraphql()}
           }
          }
        }
      }
   tokoOrderDay{
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
  Settings.defaultZone = 'Europe/Amsterdam';
  const { data } = await client.query<TokoInfo>({ query });
  const deliveryTimesArray = setupDeliveryTimes(data.tokoWeekMenu);
  return {
    props: {
      gqlData: {
        orderDay: data.tokoOrderDay,
        orders: data.orders,
        limitOrder: data.tokoLimitOrder,
        weekMenu: data.tokoWeekMenu,
      },
      deliveryTimesArray: JSON.stringify(deliveryTimesArray),
    },
    revalidate: 43200,
  };
}

export default function TokoShop(
  { deliveryTimesArray, gqlData }: { deliveryTimesArray:string, gqlData:GqlData },
) {
  return (
  // <div>Empty</div>
    <ShopPage gqlData={gqlData} deliveryTimesArray={deliveryTimesArray} />
  );
}
