export interface MenuItemObject {
  menuName: string;
  menuDish: Array<Dish>;
  menuPrice: number;
}

export interface Dish {
  dishName: string;
  dishDescription: string;
  dishOptions?: Array<{ dishOption: string }>
}
