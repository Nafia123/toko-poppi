import {ShoppingCartItem} from "../../_types/ShoppingCartItem";
import Image from "next/image";

interface prop {
    shoppingItems: Map<string,ShoppingCartItem>
}
export function ShoppingCart({shoppingItems}: prop) {
    return (
        <section>
            <div className="grid grid-rows-6 divide-y divide-solid">
                <div className="row-span-1">
                    <p className="text-2xl my-5 font-bold text-center">Winkelmandje</p>
                </div>
                <div className="row-span-5 divide-y-2 divide-solid">
                    <div className="divide-y-2 divide-solid">
                        {shoppingItems.size === 0 ?
                            <div className="text-lg my-5 text-gray-500 text-center">
                                <Image src="/shopping.svg" width={50} height={50}/>
                                <p className="text-center">Niks in je winkelmandje</p>
                                <p className="text-center">Voeg een maaltijd toe</p>
                            </div>
                            : <div className="text-lg
                                    text-gray-500 divide-y-2 divide-solid">  {
                                Array.from(shoppingItems.keys()).map((itemKey) => {
                                    let {option, price, name, amount} = shoppingItems.get(itemKey)!;
                                    return (
                                        <div key={itemKey} className="p-5">
                                            <div className="flex justify-between">
                                                <div className="flex justify-between">
                                                    <p>{amount}x</p>
                                                    <p className="ml-3">{name}</p>
                                                </div>
                                                <div>
                                                    <p>€{(price * amount).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p>{option.join(', ')}</p>
                                            </div>
                                            <div className='flex justify-end text-3xl mr-2'>
                                                <button className='border border-blue-600 mr-2'>+</button>
                                                <button className='border border-blue-600 mr-2'>-</button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        }
                            </div>
                </div>
            </div>
        </section>
    )
}


