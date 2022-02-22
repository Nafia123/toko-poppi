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

export interface Dish {
  dishName: string;
  dishDescription: string;
  dishOptions?: Array<{ dishOption: string }>
}
