import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Plus
} from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Suppliers",
      value: "42",
      change: "+2 this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Purchase Orders",
      value: "18",
      change: "3 pending approval",
      icon: ShoppingCart,
      color: "text-green-600"
    },
    {
      title: "Products in Stock",
      value: "1,247",
      change: "15 low stock alerts",
      icon: Package,
      color: "text-orange-600"
    },
    {
      title: "Outstanding Payments",
      value: "$45,320",
      change: "8 overdue",
      icon: DollarSign,
      color: "text-red-600"
    }
  ]

  const recentOrders = [
    { id: "PO-001", supplier: "ABC Electronics", amount: "$12,500", status: "approved", date: "2024-01-15" },
    { id: "PO-002", supplier: "XYZ Materials", amount: "$8,750", status: "pending", date: "2024-01-14" },
    { id: "PO-003", supplier: "Global Supplies", amount: "$15,200", status: "received", date: "2024-01-13" },
    { id: "PO-004", supplier: "Tech Components", amount: "$6,890", status: "draft", date: "2024-01-12" }
  ]

  const lowStockItems = [
    { name: "Laptop Battery Model X", current: 5, minimum: 10, category: "Electronics" },
    { name: "Office Chair Wheels", current: 8, minimum: 15, category: "Furniture" },
    { name: "Printer Toner Cartridge", current: 3, minimum: 12, category: "Office Supplies" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-status-approved text-white"
      case "pending": return "bg-status-pending text-white"
      case "received": return "bg-success text-white"
      case "draft": return "bg-status-draft text-white"
      default: return "bg-muted"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your purchase and inventory operations</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Quick Actions
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-to-br from-card to-accent/10 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Purchase Orders
              <Button variant="outline" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.supplier}</p>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Low Stock Alerts
              </span>
              <Button variant="outline" size="sm">Manage</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="p-3 rounded-lg border border-warning/20 bg-warning/5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="text-warning font-medium">{item.current}</span>
                        <span className="text-muted-foreground"> / {item.minimum}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Current / Min</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}