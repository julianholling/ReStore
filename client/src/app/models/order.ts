export interface Order {
    id: number
    buyerId: string
    shippingAddress: ShippingAddress
    orderDate: string
    orderItems: OrderItem[]
    subTotal: number
    deliveryFee: number
    orderStatus: string
    total: number
  }
  
  export interface ShippingAddress {
    fullName: string
    line1: string
    line2: string
    city: string
    state: string
    zip: string
    country: string
  }
  
  export interface OrderItem {
    productId: number
    name: string
    pictureUrl: string
    price: number
    quantity: number
  }