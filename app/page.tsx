"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus, Receipt, FileText, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL 

interface Invoice {
  id: number
  customerName: string
  customerEmail: string
  totalAmount: number
  createdAt: string
  status?: string
}

interface Product {
  id: number
  name: string
  price: number
}

export default function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [activeInvoices, setActiveInvoices] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [uniqueCustomers, setUniqueCustomers] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch invoices
        const invoicesRes = await fetch(`${API_BASE}/invoices`)
        const invoices: Invoice[] = await invoicesRes.json()

        setTotalRevenue(
          invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
        )
        setActiveInvoices(invoices.length)

        const customerEmails = new Set(invoices.map(inv => inv.customerEmail))
        setUniqueCustomers(customerEmails.size)
      } catch (err) {
        toast({ title: "Failed to load invoices", variant: "destructive" })
      }

      try {
        // Fetch products
        const productsRes = await fetch(`${API_BASE}/products`)
        const products: Product[] = await productsRes.json()
        setProductCount(products.length)
      } catch (err) {
        toast({ title: "Failed to load products", variant: "destructive" })
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Invoicer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your modern invoice management system. Create, manage, and track invoices with ease.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
  <span className="text-muted-foreground text-lg font-semibold">₹</span>
</CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInvoices}</div>
            <p className="text-xs text-muted-foreground">Total created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
            <p className="text-xs text-muted-foreground">Unique emails</p>
          </CardContent>
        </Card>
      </div>

     
      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Manage Products</CardTitle>
              <CardDescription>Add, edit, and manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/products">
                  <Package className="mr-2 h-4 w-4" />
                  Manage Products
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Create Invoice</CardTitle>
              <CardDescription>Generate new invoices for your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/invoices/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>View Invoices</CardTitle>
              <CardDescription>View and manage all your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/invoices">
                  <Receipt className="mr-2 h-4 w-4" />
                  View Invoices
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            About Invoicer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Invoicer is a comprehensive invoice management system designed to streamline your billing process. With
            features like product management, invoice creation, and tracking, you can efficiently handle all your
            invoicing needs in one place. Our modern interface makes it easy to manage your business finances and keep
            track of your revenue.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
