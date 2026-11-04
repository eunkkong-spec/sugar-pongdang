import { useContext } from 'react'
import { ShopContext } from './shopContext.js'

export function useShop() {
  return useContext(ShopContext)
}
