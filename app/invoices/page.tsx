"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const API_BASE =  process.env.NEXT_PUBLIC_BASE_URL 

interface Invoice {
  id: number
  customerName: string
  customerEmail: string
  totalAmount: number
  createdAt: string
  items: {
    product: { id: number; name: string; price: number }
    quantity: number
  }[]
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch(`${API_BASE}/invoices`)
        const data = await res.json()
        setInvoices(data)
      } catch (err) {
        console.error("Error fetching invoices:", err)
        toast({
          title: "Failed to Load",
          description: "Could not fetch invoices from server",
          variant: "destructive",
        })
      }
    }

    fetchInvoices()
  }, [])

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsViewDialogOpen(true)
  }

  const handleResendEmail = async (invoiceId: number) => {
    try {
      const res = await fetch(`${API_BASE}/invoices/${invoiceId}/resend`, {
        method: "POST",
      })

      if (!res.ok) throw new Error("Failed to resend")

      toast({
        title: "Success",
        description: `Invoice #${invoiceId} resent successfully!`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to resend invoice #${invoiceId}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">All Invoices</h1>
        <p className="text-muted-foreground">View and manage all your invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>A list of all invoices in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <Badge variant="outline">#{invoice.id}</Badge>
                  </TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>{invoice.customerEmail}</TableCell>
                  <TableCell className="font-semibold">₹{invoice.totalAmount}</TableCell>
                  <TableCell>{invoice.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {/* <Button variant="outline" size="sm" onClick={() => handleResendEmail(invoice.id)}>
                        <Mail className="h-4 w-4 mr-1" />
                        Resend
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              {selectedInvoice && `Invoice #${selectedInvoice.id} for ${selectedInvoice.customerName}`}
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Customer Information</h4>
                  <p className="text-sm text-muted-foreground">Name: {selectedInvoice.customerName}</p>
                  <p className="text-sm text-muted-foreground">Email: {selectedInvoice.customerEmail}</p>
                  <p className="text-sm text-muted-foreground">Date: {selectedInvoice.createdAt}</p>
                </div>
                <div className="text-right">
                  <h4 className="font-semibold">Invoice #{selectedInvoice.id}</h4>
                  <p className="text-2xl font-bold">₹{selectedInvoice.totalAmount}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-3">Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>₹{item.product.price}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.quantity * item.product.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total Amount:</span>
                <span className="text-xl font-bold">₹{selectedInvoice.totalAmount}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
