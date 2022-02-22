// eslint-disable-next-line import/prefer-default-export
import { v4 as uuidv4 } from 'uuid';

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
