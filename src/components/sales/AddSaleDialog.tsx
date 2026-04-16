import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ShoppingCart, CreditCard, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export const AddSaleDialog = () => {
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessingPaystack, setIsProcessingPaystack] = useState(false);

  const { products } = useProducts();
  const { createSale } = useSales();
  const { user } = useAuth();

  const availableProducts = products?.filter(
    (p) => p.quantity > 0 && !cart.find((item) => item.product_id === p.id)
  );

  const addToCart = () => {
    const product = products?.find((p) => p.id === selectedProduct);
    if (!product) return;

    const maxQty = product.quantity;
    const qty = Math.min(quantity, maxQty);

    if (qty <= 0) return;

    setCart([
      ...cart,
      {
        product_id: product.id,
        product_name: product.name,
        quantity: qty,
        unit_price: Number(product.selling_price),
        subtotal: qty * Number(product.selling_price),
      },
    ]);

    setSelectedProduct("");
    setQuantity(1);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const generateInvoiceNo = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `INV-${dateStr}-${random}`;
  };

  const initiatePaystackPayment = async () => {
    if (!user?.email) {
      toast.error("User email not found");
      return;
    }

    setIsProcessingPaystack(true);
    const reference = generateInvoiceNo();

    try {
      const response = await supabase.functions.invoke('paystack-initialize', {
        body: {
          email: user.email,
          amount: totalAmount,
          reference,
          callback_url: window.location.href,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to initialize payment');
      }

      const { authorization_url } = response.data;
      
      // Store cart data in sessionStorage for after redirect
      sessionStorage.setItem('pendingSale', JSON.stringify({
        cart,
        paymentMethod: 'Paystack',
        reference,
        totalAmount,
      }));

      // Redirect to Paystack payment page
      window.location.href = authorization_url;
    } catch (error) {
      console.error('Paystack error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initialize payment');
      setIsProcessingPaystack(false);
    }
  };

  const handleSubmit = async () => {
    if (cart.length === 0 || !paymentMethod || !user) return;

    // For Paystack payments, redirect to payment page
    if (paymentMethod === 'Paystack') {
      await initiatePaystackPayment();
      return;
    }

    const sale = {
      invoice_no: generateInvoiceNo(),
      total_amount: totalAmount,
      payment_method: paymentMethod,
      clerk_id: user.id,
    };

    const items = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
    }));

    try {
      await createSale.mutateAsync({ sale, items });
      setOpen(false);
      setCart([]);
      setPaymentMethod("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const selectedProductData = products?.find((p) => p.id === selectedProduct);
  const maxQuantity = selectedProductData?.quantity || 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Sale</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add Product Section */}
          <div className="space-y-4">
            <Label>Select Products</Label>
            <div className="flex gap-2">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - KES {Number(product.selling_price).toLocaleString()} (Stock: {product.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                min={1}
                max={maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20"
                placeholder="Qty"
              />
              <Button type="button" onClick={addToCart} disabled={!selectedProduct}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Cart Table */}
          {cart.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.product_id}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell className="text-right">KES {item.unit_price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">KES {item.subtotal.toLocaleString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product_id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total:
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      KES {totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No items in cart</p>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Paystack">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Paystack (Card/Mobile Money)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={cart.length === 0 || !paymentMethod || createSale.isPending || isProcessingPaystack}
            className="w-full"
          >
            {isProcessingPaystack ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to Paystack...
              </>
            ) : createSale.isPending ? (
              "Processing..."
            ) : paymentMethod === 'Paystack' ? (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay with Paystack - KES {totalAmount.toLocaleString()}
              </>
            ) : (
              `Complete Sale - KES ${totalAmount.toLocaleString()}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
