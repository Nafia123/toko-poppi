export function showCorrectPrice(price: number): string{
    return `€${price.toFixed(2).toString().replace('.',',')}`
}