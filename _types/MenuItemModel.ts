import { DateTime } from 'luxon';

export interface MenuItemObject {
  menuName: string;
  menuDish: Array<Dish>;
  menuPrice: number;
  allergens: [
    {
      allergens: string
    },
  ]
  menuImage: {
    data: {
      attributes:{
        url: string
      }
    }
  }
}

export interface MenuItemData {
  attributes: MenuItemObject
}

export interface Dish {
  dishName: string;
  dishDescription: string;
  dishOptions?: Array<{ dishOption: string }>
}

export interface DayMenuItem {
  date: DateTime,
  menuItems: MenuItemData[],
  disabled?: boolean
}
