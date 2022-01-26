export interface MenuItemObject {
    menuName: String;
    menuDish: Array<Dish>;
    menuPrice: String;
}

export interface Dish {
    dishName: String;
    dishDescription: String;
}
