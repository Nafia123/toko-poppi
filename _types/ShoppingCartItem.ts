export interface ShoppingCartItem {
  price: number,
  option: Array<string>,
  amount: number,
  name: string,
  id: string,
  pickupDate:string
}

export interface ShoppingCartList {
  totalPrice: number,
  items: Array<ShoppingCartItem>
}
