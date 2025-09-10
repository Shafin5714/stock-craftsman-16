import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Minus, Trash2, ShoppingCart, User, DollarSign, CreditCard, Receipt } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  total: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

interface CartProps {
  cart: CartItem[]
  customers: Customer[]
  selectedCustomer: string
  paymentMethod: string
  cashAmount: string
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveFromCart: (id: string) => void
  onClearCart: () => void
  onCustomerChange: (customerId: string) => void
  onPaymentMethodChange: (method: string) => void
  onCashAmountChange: (amount: string) => void
  onProcessPayment: () => void
}

export function Cart({
  cart,
  customers,
  selectedCustomer,
  paymentMethod,
  cashAmount,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCustomerChange,
  onPaymentMethodChange,
  onCashAmountChange,
  onProcessPayment
}: CartProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart ({cart.length})
          </span>
          {cart.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClearCart}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer and Date Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">* Customer</Label>
            <Select value={selectedCustomer} onValueChange={onCustomerChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">* Date</Label>
            <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        <Separator />

        {/* Order Table */}
        <div className="space-y-3">
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Cart is empty</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="p-2 text-xs font-medium">SL</th>
                    <th className="p-2 text-xs font-medium">Product</th>
                    <th className="p-2 text-xs font-medium">Quantity</th>
                    <th className="p-2 text-xs font-medium">Price</th>
                    <th className="p-2 text-xs font-medium">Discount</th>
                    <th className="p-2 text-xs font-medium">Amount</th>
                    <th className="p-2 text-xs font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2 text-sm">{index + 1}</td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">Stock: 100</div>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="p-2 text-sm">{item.price.toFixed(2)}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Input className="w-14 h-6 text-xs" defaultValue="0" />
                          <Select defaultValue="%">
                            <SelectTrigger className="w-15 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="%">%</SelectItem>
                              <SelectItem value="R">R</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="p-2 font-medium text-sm">{item.total.toFixed(2)}</td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-red-500"
                          onClick={() => onRemoveFromCart(item.id)}
                        >
                          ×
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              onClick={() => onPaymentMethodChange("cash")}
              className="flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Cash
            </Button>
            <Button
              variant={paymentMethod === "card" ? "default" : "outline"}
              onClick={() => onPaymentMethodChange("card")}
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
                onChange={(e) => onCashAmountChange(e.target.value)}
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
            onClick={onProcessPayment} 
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
  )
}