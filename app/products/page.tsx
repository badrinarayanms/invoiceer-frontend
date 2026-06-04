"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Product {
  id: number
  name: string
  price: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
 const [newProduct, setNewProduct] = useState({ name: "", price: "" })
  const { toast } = useToast()

  const API_BASE = `${process.env.NEXT_PUBLIC_BASE_URL}/products`;
  const router = useRouter()


  useEffect(() => {
    fetchProducts() 
  }, [])

  const fetchProducts = async () => {
  try {
    const res = await fetch(API_BASE, {
      credentials: "include", // ✅ REQUIRED
    })

    if (res.status === 401) {
      router.push("/login")
      return
    }

    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }

    const data = await res.json()
    setProducts(data)

  } catch (err) {
    console.error("Failed to fetch products", err)
  }
}



  const handleAddProduct = async () => {

    const price = Number(newProduct.price)

    if (!newProduct.name || !price || price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values",
        variant: "destructive",
      })
      return
    }

    

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ ADD THIS
        body: JSON.stringify(newProduct),
      })


      if (!res.ok) throw new Error("Failed to add product")

      const data = await res.json()
      setProducts([...products, data])
      setNewProduct({ name: "", price: "0" })
      setIsAddDialogOpen(false)

      toast({ title: "Success", description: "Product added successfully" })
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to add product", variant: "destructive" })
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct) return

    try {
      const res = await fetch(`${API_BASE}/${editingProduct.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ ADD THIS
      body: JSON.stringify({
        name: newProduct.name,
        price: Number(newProduct.price),
      })
    })


      if (!res.ok) throw new Error("Failed to update product")

      await fetchProducts()
      setIsEditDialogOpen(false)
      setEditingProduct(null)

      toast({ title: "Success", description: "Product updated successfully" })
    } catch (err) {
      console.error(err)
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" })
    }
  }

  const handleDeleteProduct = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      credentials: "include", // ✅ ADD THIS
    })

    const message = await res.text()

    if (!res.ok) {
      toast({
        title: "Error",
        description: message || "Failed to delete product",
        variant: "destructive",
      })
      return
    }

    setProducts(products.filter((p) => p.id !== id))
    toast({ title: "Success", description: "Product deleted successfully" })
  } catch (err) {
    console.error(err)
    toast({ title: "Error", description: "Failed to delete product", variant: "destructive" })
  }
}


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
          <p className="text-muted-foreground">Add, edit, and manage your product catalog</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Enter the details for the new product.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  placeholder="₹"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your product inventory and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingProduct(product)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Product Name</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  placeholder="₹45"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value)})
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
