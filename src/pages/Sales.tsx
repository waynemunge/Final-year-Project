import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Printer, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSales } from "@/hooks/useSales";
import { AddSaleDialog } from "@/components/sales/AddSaleDialog";
import { SaleDetailsDialog } from "@/components/sales/SaleDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { usePaystackVerification } from "@/hooks/usePaystackVerification";

const Sales = () => {
  const { sales, isLoading } = useSales();
  const { isVerifying } = usePaystackVerification();

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "Cash":
        return "bg-success text-success-foreground";
      case "Paystack":
        return "bg-primary text-primary-foreground";
      case "Mobile Money":
        return "bg-warning text-warning-foreground";
      default:
        return "";
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8">
        {isVerifying && (
          <div className="mb-4 p-4 bg-primary/10 border border-primary rounded-lg flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-primary font-medium">Verifying payment and completing sale...</span>
          </div>
        )}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Sales</h1>
            <p className="text-muted-foreground text-sm md:text-base">Record and manage sales transactions</p>
          </div>
          <AddSaleDialog />
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">+5 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 45,890</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 1,995</div>
              <p className="text-xs text-muted-foreground">Based on today</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Clerk</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : sales && sales.length > 0 ? (
                  sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.invoice_no}</TableCell>
                      <TableCell>{format(new Date(sale.created_at), "MMM dd, yyyy")}</TableCell>
                      <TableCell>{sale.sales_items?.length || 0}</TableCell>
                      <TableCell className="font-medium">
                        KES {Number(sale.total_amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentMethodColor(sale.payment_method)}>
                          {sale.payment_method}
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.clerk?.full_name || "Unknown"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <SaleDetailsDialog sale={sale} trigger="view" />
                          <SaleDetailsDialog sale={sale} trigger="print" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No sales found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sales;
