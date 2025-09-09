import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  DollarSign,
  Receipt,
  User,
  Calculator,
  ShoppingCart,
  Clock,
  CheckCircle
} from "lucide-react"

// Mock data
const mockProducts = [
  { id: "1", name: "Laptop Computer", price: 999.99, stock: 15, category: "Electronics", barcode: "123456789" },
  { id: "2", name: "Wireless Mouse", price: 29.99, stock: 50, category: "Electronics", barcode: "987654321" },
  { id: "3", name: "Office Chair", price: 199.99, stock: 8, category: "Furniture", barcode: "456789123" },
  { id: "4", name: "Notebook", price: 4.99, stock: 100, category: "Stationery", barcode: "789123456" },
  { id: "5", name: "Water Bottle", price: 12.99, stock: 25, category: "Accessories", barcode: "321654987" },
  { id: "6", name: "Desk Lamp", price: 45.99, stock: 12, category: "Electronics", barcode: "654987321" }
]

const mockCustomers = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1234567890" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1987654321" },
  { id: "3", name: "Walk-in Customer", email: "", phone: "" }
]

const mockTransactions = [
  { 
    id: "TXN-001", 
    date: "2024-01-09 14:30", 
    customer: "John Doe", 
    items: 3, 
    total: 1074.97, 
    status: "Completed",
    paymentMethod: "Credit Card"
  },
  { 
    id: "TXN-002", 
    date: "2024-01-09 13:15", 
    customer: "Walk-in Customer", 
    items: 1, 
    total: 29.99, 
    status: "Completed",
    paymentMethod: "Cash"
  },
]

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  total: number
}

export default function POSManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [cashAmount, setCashAmount] = useState("")
  const [activeTab, setActiveTab] = useState("pos")

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToCart = (product: typeof mockProducts[0]) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item
        ))
      } else {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stock} items available`,
          variant: "destructive"
        })
      }
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      }])
    }
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    const product = mockProducts.find(p => p.id === id)
    if (!product) return

    if (newQuantity <= 0) {
      removeFromCart(id)
    } else if (newQuantity <= product.stock) {
      setCart(cart.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      ))
    } else {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} items available`,
        variant: "destructive"
      })
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const processPayment = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing payment",
        variant: "destructive"
      })
      return
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive"
      })
      return
    }

    if (paymentMethod === "cash" && (!cashAmount || parseFloat(cashAmount) < total)) {
      toast({
        title: "Insufficient Cash",
        description: "Cash amount is less than total",
        variant: "destructive"
      })
      return
    }

    // Process payment logic here
    toast({
      title: "Payment Processed",
      description: `Transaction completed successfully - ${paymentMethod}`,
    })

    // Clear cart and reset form
    setCart([])
    setSelectedCustomer("")
    setPaymentMethod("")
    setCashAmount("")
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">POS Manager</h1>
        <Badge variant="secondary" className="text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pos">Point of Sale</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="pos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-4">
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
                      <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => addToCart(product)}>
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
            </div>

            {/* Shopping Cart */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Cart ({cart.length})
                    </span>
                    {cart.length > 0 && (
                      <Button variant="outline" size="sm" onClick={clearCart}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Selection */}
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {customer.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Cart Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Cart is empty</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">${item.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (10%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={paymentMethod === "cash" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("cash")}
                        className="flex items-center gap-2"
                      >
                        <DollarSign className="w-4 h-4" />
                        Cash
                      </Button>
                      <Button
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("card")}
                        className="flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Card
                      </Button>
                    </div>

                    {paymentMethod === "cash" && (
                      <div>
                        <Label htmlFor="cash-amount">Cash Amount</Label>
                        <Input
                          id="cash-amount"
                          type="number"
                          placeholder="0.00"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          min="0"
                          step="0.01"
                        />
                        {cashAmount && parseFloat(cashAmount) > total && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Change: ${(parseFloat(cashAmount) - total).toFixed(2)}
                          </p>
                        )}
                      </div>
                    )}

                    <Button 
                      onClick={processPayment} 
                      disabled={cart.length === 0 || !paymentMethod}
                      className="w-full"
                      size="lg"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Process Payment (${total.toFixed(2)})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{transaction.id}</span>
                        <Badge variant={transaction.status === "Completed" ? "default" : "secondary"}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {transaction.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{transaction.customer}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${transaction.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{transaction.items} items</p>
                      <p className="text-xs text-muted-foreground">{transaction.paymentMethod}</p>
                    </div>
                    <div className="ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Receipt className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Receipt - {transaction.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-center border-b pb-4">
                              <h3 className="font-bold text-lg">Store Receipt</h3>
                              <p className="text-sm text-muted-foreground">{transaction.date}</p>
                            </div>
                            <div className="space-y-2">
                              <p><strong>Transaction ID:</strong> {transaction.id}</p>
                              <p><strong>Customer:</strong> {transaction.customer}</p>
                              <p><strong>Items:</strong> {transaction.items}</p>
                              <p><strong>Payment Method:</strong> {transaction.paymentMethod}</p>
                            </div>
                            <div className="border-t pt-4">
                              <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>${transaction.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}