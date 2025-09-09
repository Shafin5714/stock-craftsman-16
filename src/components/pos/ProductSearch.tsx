import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  barcode: string
}

interface ProductSearchProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export function ProductSearch({ products, onAddToCart }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Product Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, barcode, or category..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onAddToCart(product)}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                    {product.stock}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">${product.price}</span>
                  <Button size="sm" disabled={product.stock === 0}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}