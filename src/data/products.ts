export type Category = 'Feminino' | 'Masculino' | 'Infantil'
export type Filter = 'Todos' | Category | 'Novidades'

export interface Product {
  id: number
  image: string
  name: string
  price: string
  originalPrice?: string
  category: Category
  isNew?: boolean
}

export const products: Product[] = [
  {
    id: 1,
    image: 'https://lourd-pajama-catalog.lovable.app/assets/pijama-feminino-1-D5cT5RrO.jpg',
    name: 'Pijama Rosé Clássico',
    price: 'R$ 189,90',
    category: 'Feminino',
    isNew: true,
  },
  {
    id: 2,
    image: 'https://lourd-pajama-catalog.lovable.app/assets/pijama-feminino-2-V8KN36Sr.jpg',
    name: 'Pijama Lavanda Renda',
    price: 'R$ 219,90',
    category: 'Feminino',
    isNew: true,
  },
  {
    id: 3,
    image: 'https://lourd-pajama-catalog.lovable.app/assets/pijama-feminino-3-eUmkyOCb.jpg',
    name: 'Camisola Champagne Longa',
    price: 'R$ 249,90',
    originalPrice: 'R$ 299,90',
    category: 'Feminino',
  },
  {
    id: 4,
    image: 'https://lourd-pajama-catalog.lovable.app/assets/pijama-feminino-4-DtbW83Q0.jpg',
    name: 'Pijama Fleece Terracota',
    price: 'R$ 199,90',
    category: 'Feminino',
  },
  {
    id: 5,
    image: 'https://lourd-pajama-catalog.lovable.app/assets/pijama-masculino-1-CNx85n2W.jpg',
    name: 'Pijama Listrado Marinho',
    price: 'R$ 179,90',
    category: 'Masculino',
    isNew: true,
  },
  {
    id: 6,
    image: 'https://lourd-pajama-catalog.lovable.app/assets/pijama-masculino-2-BKt394Qe.jpg',
    name: 'Pijama Modal Cinza',
    price: 'R$ 169,90',
    originalPrice: 'R$ 199,90',
    category: 'Masculino',
  },
  {
    id: 7,
    image: 'https://lourd-pajama-catalog.lovable.app/assets/pijama-infantil-1-Bs5N5po1.jpg',
    name: 'Pijama Estrelinhas Rosa',
    price: 'R$ 119,90',
    category: 'Infantil',
    isNew: true,
  },
  {
    id: 8,
    image: 'https://lourd-pajama-catalog.lovable.app/assets/pijama-infantil-2-BufAD8rJ.jpg',
    name: 'Pijama Dinossauros Azul',
    price: 'R$ 119,90',
    category: 'Infantil',
  },
]
