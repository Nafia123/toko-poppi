import React from 'react';
import { gql } from '@apollo/client';
import { DateTime, Settings } from 'luxon';
import { Context } from 'vm';
import client from '../../apollo-client';
import { CompanyFormData } from '../../components/03-organisms/PaymentView';
import { WeekMenuType, WeekTimeType } from '../../_types/WeekTimeType';
import { getMenuItemGraphql, setupDeliveryTimes } from '../../utils/helper';
import ShopPage from '../../components/04-page/ShopPage';
import { GqlData } from '../../_types/TokoData';

interface PallInfo{
  pallInfo: {
    data: {
      attributes: CompanyFormData
    }
  }
  pallLimitOrder:{
    data: {
      attributes: {
        Limit: number
      }
    }
  }
  pallWeekMenu: {
    data: {
      attributes: WeekMenuType
    }
  }
  orders: {
    data: Array<{ attributes: { deliveryTime: DateTime } }>
  }
  pallOrderDay: {
    data: {
      attributes: WeekTimeType
    }
  }
}

export async function getStaticProps({ locale } : Context) {
  const today = DateTime.now();
  const startTime = today.set({ hour: 0, minute: 0 });
  const query = gql`
     query  { menuItems(locale: "${locale.slice(0, 2)}", filters:{pallVisible: {eq:true}}, pagination:{limit:5}){
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
 orders(filters:{deliveryTime:{gte:"${startTime.toString()}"}}){
    data{
      attributes{
        deliveryTime
      }
    }
  }
   pallLimitOrder{
    data{
      attributes{
        Limit
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
   pallWeekMenu(locale: "${locale.slice(0, 2)}"){
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
  Settings.defaultZone = 'Europe/Amsterdam';
  const { data } = await client.query<PallInfo>({ query });
  const deliveryTimesArray = setupDeliveryTimes(data.pallWeekMenu);
  return {
    props: {
      gqlData: {
        shopInfo: data.pallInfo,
        orderDay: data.pallOrderDay,
        orders: data.orders,
        limitOrder: data.pallLimitOrder,
        weekMenu: data.pallWeekMenu,
      },
      deliveryTimesArray: JSON.stringify(deliveryTimesArray),
    },
    revalidate: 43200,
  };
}

export default function Pall(
  { deliveryTimesArray, gqlData }: { deliveryTimesArray:string, gqlData:GqlData },
) {
  return (
    <ShopPage gqlData={gqlData} deliveryTimesArray={deliveryTimesArray} />
  );
}
