// eslint-disable-next-line import/prefer-default-export
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { WeekMenuType } from '../_types/WeekTimeType';
import {DayMenuItem, MenuItemData} from '../_types/MenuItemModel';

export function showCorrectPrice(price: number): string {
  return `€${price.toFixed(2).toString().replace('.', ',')}`;
}

const weekDayArray = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function dayOfWeekAsString(dayIndex: number): string {
  return weekDayArray[dayIndex] || '';
}

function makeId(length: number) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random()
        * charactersLength));
  }
  return result;
}

export function generateOrderNumber(): { orderId: string, orderNumber: string } {
  const todayDate = (new Date()).toISOString().slice(0, 10).replace(/-/g, '');
  const randomLetter = makeId(1);
  const orderNumber = randomLetter + uuidv4().substring(0, 4);
  const orderId = todayDate + orderNumber;
  return { orderId, orderNumber };
}

export function setupDeliveryTimes(orderTimes: { data: {
  attributes: WeekMenuType
} }): DayMenuItem[] {
  const dayMenuArray: DayMenuItem[] = [];
  const today = DateTime.now();
  const startWeek = DateTime.local().startOf('week');
  if (!orderTimes.data) return [];
  Object.keys(orderTimes.data.attributes).forEach((day, index) => {
    if (!orderTimes.data.attributes[day as keyof WeekMenuType]) return;
    const menuDay = startWeek.set({ day: startWeek.day + index });
    dayMenuArray.push({
      date: menuDay,
      disabled: index <= (today.weekday - 1),
      menuItems: orderTimes.data.attributes[day as keyof WeekMenuType].menuItems.data,
    });
  });
  return dayMenuArray;
}
export function getMenuItemGraphql() {
  return ` menuItems{
            data{
              attributes{
                locale
              
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
        }}
              }
            }
          }
  `;
}
