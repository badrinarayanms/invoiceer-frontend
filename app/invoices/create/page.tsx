"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

const API_BASE =  process.env.NEXT_PUBLIC_BASE_URL 

interface Product {
  id: number
  name: string
  price: number
}

interface InvoiceItem {
  product: Product
  quantity: number
  lineTotal: number
}

interface InvoiceData {
  customerName: string
  customerEmail: string
  items: { product: { id: number }; quantity: number }[]
}

export default function CreateInvoicePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`)
        const data = await res.json()
        setProducts(data)
      } catch (err) {
        console.error("Failed to fetch products", err)
        toast({
          title: "Error",
          description: "Failed to load products from server",
          variant: "destructive",
        })
      }
    }

    fetchProducts()
  }, [])

  const addItemToInvoice = () => {
    if (!selectedProductId || quantity <= 0) {
      toast({
        title: "Error",
        description: "Please select a product and enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    const product = products.find((p) => p.id === Number.parseInt(selectedProductId))
    if (!product) return

    const existingIndex = invoiceItems.findIndex((item) => item.product.id === product.id)

    if (existingIndex !== -1) {
      const updatedItems = [...invoiceItems]
      updatedItems[existingIndex].quantity += quantity
      updatedItems[existingIndex].lineTotal = updatedItems[existingIndex].quantity * product.price
      setInvoiceItems(updatedItems)
    } else {
      setInvoiceItems([
        ...invoiceItems,
        {
          product,
          quantity,
          lineTotal: quantity * product.price,
        },
      ])
    }

    setSelectedProductId("")
    setQuantity(1)
  }

  const removeItem = (productId: number) => {
    setInvoiceItems(invoiceItems.filter((item) => item.product.id !== productId))
  }

  const getTotalAmount = () => {
    return invoiceItems.reduce((total, item) => total + item.lineTotal, 0)
  }

  const handleSubmitInvoice = async () => {
  if (!customerName || !customerEmail || invoiceItems.length === 0) {
    toast({
      title: "Error",
      description: "Please fill in all required fields and add at least one item",
      variant: "destructive",
    })
    return
  }

  const invoiceData: InvoiceData = {
    customerName,
    customerEmail,
    items: invoiceItems.map((item) => ({
      product: { id: item.product.id },
      quantity: item.quantity,
    })),
  }

  try {
    setIsCreating(true) // Start loading
    const res = await fetch(`${API_BASE}/invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(errText)
    }

    toast({
      title: "Success",
      description: "Invoice created and emailed successfully!",
    })

    setCustomerName("")
    setCustomerEmail("")
    setInvoiceItems([])

  } catch (err) {
    toast({
      title: "Error",
      description: `Failed to create invoice: ${err}`,
      variant: "destructive",
    })
  } finally {
    setIsCreating(false) // End loading
  }
}


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
        <p className="text-muted-foreground">Generate a new invoice for your customer</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Enter customer details for the invoice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer-name">Name</Label>
              <Input id="customer-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="customer-email">Email</Label>
              <Input id="customer-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
            <CardDescription>Select products and quantity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Product</Label>
              <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - ₹{product.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                min={1}
              />
            </div>
            <Button onClick={addItemToInvoice} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Items</CardTitle>
        </CardHeader>
        <CardContent>
          {invoiceItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">No items added yet.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Line Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceItems.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>₹{item.product.price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.lineTotal}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => removeItem(item.product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">₹{getTotalAmount()}</span>
              </div>

              <Button
  className="mt-4 w-full"
  size="lg"
  onClick={handleSubmitInvoice}
  disabled={isCreating}
>
  {isCreating ? (
    <span className="flex items-center justify-center gap-2">
      <svg
        className="animate-spin h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Processing...
    </span>
  ) : (
    "Create Invoice"
  )}
</Button>

            </>
          )}
        </CardContent>
      </Card>

      <Toaster />
    </div>
  )
}
