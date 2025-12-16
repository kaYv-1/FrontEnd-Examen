import type { LoginRequest, LoginResponse, User, Product, Order } from '@/types'

// Simple in-memory mock persisted in localStorage
const STORAGE_KEYS = {
  PRODUCTS: 'mock_products',
  USERS: 'mock_users',
  ORDERS: 'mock_orders',
}

const defaultProducts: Product[] = [
  {
    id: 'p1',
    name: 'Tomate',
    description: 'Tomate rojo fresco de la huerta',
    price: 2.5,
    quantity: 100,
    image: '',
    category: 'vegetables',
    unit: 'kg',
  },
  {
    id: 'p2',
    name: 'Lechuga',
    description: 'Lechuga orgánica',
    price: 1.8,
    quantity: 50,
    image: '',
    category: 'vegetables',
    unit: 'unidad',
  },
  {
    id: 'p3',
    name: 'Cilantro',
    description: 'Ramo de cilantro fresco',
    price: 0.9,
    quantity: 200,
    image: '',
    category: 'herbs',
    unit: 'rama',
  },
]

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    return JSON.parse(raw) as T
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data))
}

// Initialize storage if empty
const productsStore = load<Product[]>(STORAGE_KEYS.PRODUCTS, defaultProducts)
save(STORAGE_KEYS.PRODUCTS, productsStore)

const usersStore = load<User[]>(STORAGE_KEYS.USERS, [
  { id: 'u1', email: 'cliente@demo.com', name: 'Cliente Demo', role: 'customer' },
])
save(STORAGE_KEYS.USERS, usersStore)

const ordersStore = load<Order[]>(STORAGE_KEYS.ORDERS, [])
save(STORAGE_KEYS.ORDERS, ordersStore)

function generateToken(user: User) {
  // Not a real JWT. Just a base64 with user id and timestamp.
  return btoa(JSON.stringify({ id: user.id, ts: Date.now() }))
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const users = load<User[]>(STORAGE_KEYS.USERS, usersStore)
    const user = users.find((u) => u.email === credentials.email)
    if (!user) throw new Error('Usuario no encontrado')
    // In mock mode accept any password
    const token = generateToken(user)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    return { token, refreshToken: token, user }
  },

  register: async (data: Omit<User, 'id' | 'role'> & { password: string }): Promise<LoginResponse> => {
    const users = load<User[]>(STORAGE_KEYS.USERS, usersStore)
    const exists = users.find((u) => u.email === data.email)
    if (exists) throw new Error('El correo ya está registrado')
    const newUser: User = { id: 'u' + Date.now(), email: data.email, name: data.name, role: 'customer' }
    users.push(newUser)
    save(STORAGE_KEYS.USERS, users)
    const token = generateToken(newUser)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(newUser))
    return { token, refreshToken: token, user: newUser }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  },

  refreshToken: async (): Promise<string> => {
    const user = authService.getCurrentUser()
    if (!user) throw new Error('No autorizado')
    const token = generateToken(user)
    localStorage.setItem('token', token)
    return token
  },
}

export const productService = {
  getAll: async (page = 1, limit = 20): Promise<Product[]> => {
    const products = load<Product[]>(STORAGE_KEYS.PRODUCTS, defaultProducts)
    // simple pagination
    const start = (page - 1) * limit
    return products.slice(start, start + limit)
  },

  getById: async (id: string): Promise<Product> => {
    const products = load<Product[]>(STORAGE_KEYS.PRODUCTS, defaultProducts)
    const p = products.find((x) => x.id === id)
    if (!p) throw new Error('Producto no encontrado')
    return p
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const products = load<Product[]>(STORAGE_KEYS.PRODUCTS, defaultProducts)
    return products.filter((p) => p.category === category)
  },

  search: async (query: string): Promise<Product[]> => {
    const products = load<Product[]>(STORAGE_KEYS.PRODUCTS, defaultProducts)
    const q = query.toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  },

  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const products = load<Product[]>(STORAGE_KEYS.PRODUCTS, defaultProducts)
    const newP: Product = { ...product, id: 'p' + Date.now() }
    products.unshift(newP)
    save(STORAGE_KEYS.PRODUCTS, products)
    return newP
  },

  update: async (id: string, product: Partial<Product>): Promise<Product> => {
    const products = load<Product[]>(STORAGE_KEYS.PRODUCTS, defaultProducts)
    const idx = products.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error('Producto no encontrado')
    products[idx] = { ...products[idx], ...product }
    save(STORAGE_KEYS.PRODUCTS, products)
    return products[idx]
  },

  delete: async (id: string): Promise<void> => {
    let products = load<Product[]>(STORAGE_KEYS.PRODUCTS, defaultProducts)
    products = products.filter((p) => p.id !== id)
    save(STORAGE_KEYS.PRODUCTS, products)
  },
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const orders = load<Order[]>(STORAGE_KEYS.ORDERS, [])
    const user = authService.getCurrentUser()
    if (!user) return []
    return orders.filter((o) => o.userId === user.id)
  },

  getById: async (id: string): Promise<Order> => {
    const orders = load<Order[]>(STORAGE_KEYS.ORDERS, [])
    const o = orders.find((x) => x.id === id)
    if (!o) throw new Error('Orden no encontrada')
    return o
  },

  create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const orders = load<Order[]>(STORAGE_KEYS.ORDERS, [])
    const user = authService.getCurrentUser()
    if (!user) throw new Error('No autorizado')
    const newOrder: Order = {
      id: 'o' + Date.now(),
      userId: user.id,
      items: order.items,
      total: order.total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    orders.unshift(newOrder)
    save(STORAGE_KEYS.ORDERS, orders)
    return newOrder
  },

  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const orders = load<Order[]>(STORAGE_KEYS.ORDERS, [])
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error('Orden no encontrada')
    orders[idx].status = status
    orders[idx].updatedAt = new Date().toISOString()
    save(STORAGE_KEYS.ORDERS, orders)
    return orders[idx]
  },

  cancel: async (id: string): Promise<void> => {
    let orders = load<Order[]>(STORAGE_KEYS.ORDERS, [])
    orders = orders.filter((o) => o.id !== id)
    save(STORAGE_KEYS.ORDERS, orders)
  },
}
