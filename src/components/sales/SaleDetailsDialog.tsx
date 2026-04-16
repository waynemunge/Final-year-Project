import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Printer } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface SaleItem {
  quantity: number;
  product: { name: string } | null;
}

interface Sale {
  id: string;
  invoice_no: string;
  created_at: string;
  total_amount: number;
  payment_method: string;
  clerk?: { full_name: string } | null;
  sales_items?: SaleItem[];
}

interface SaleDetailsDialogProps {
  sale: Sale;
  trigger?: "view" | "print";
}

export const SaleDetailsDialog = ({ sale, trigger = "view" }: SaleDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

  const handlePrint = () => {
    const receiptHTML = `
      <html>
        <head>
          <title>Receipt - ${sale.invoice_no}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'JetBrains Mono', monospace; padding: 24px 16px; max-width: 320px; margin: 0 auto; color: #1a1a1a; }
            .header { text-align: center; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid #1a1a1a; }
            .header .logo { font-size: 22px; font-weight: 700; letter-spacing: 3px; margin-bottom: 4px; }
            .header .subtitle { font-size: 10px; color: #666; letter-spacing: 1px; text-transform: uppercase; }
            .divider { border: none; border-top: 1px dashed #ccc; margin: 12px 0; }
            .info { font-size: 11px; margin: 12px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 3px 0; }
            .info-row .label { color: #888; }
            .info-row .value { font-weight: 600; text-align: right; }
            table { width: 100%; font-size: 11px; border-collapse: collapse; margin: 8px 0; }
            th { text-align: left; padding: 6px 0; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #888; border-bottom: 1px solid #e0e0e0; }
            th:last-child { text-align: right; }
            td { padding: 6px 0; border-bottom: 1px dotted #eee; }
            td:last-child { text-align: right; font-weight: 600; }
            .total-section { background: #f5f5f5; margin: 12px -16px; padding: 12px 16px; }
            .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; }
            .footer { text-align: center; margin-top: 20px; padding-top: 16px; border-top: 2px solid #1a1a1a; }
            .footer p { font-size: 10px; color: #888; margin: 2px 0; }
            .footer .thanks { font-size: 12px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
            @media print { body { margin: 0; padding: 12px; } .total-section { background: #f5f5f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">RECEIPT</div>
            <div class="subtitle">Sales Transaction Record</div>
          </div>
          <div class="info">
            <div class="info-row"><span class="label">Invoice</span><span class="value">${sale.invoice_no}</span></div>
            <div class="info-row"><span class="label">Date</span><span class="value">${format(new Date(sale.created_at), "MMM dd, yyyy · HH:mm")}</span></div>
            <div class="info-row"><span class="label">Clerk</span><span class="value">${sale.clerk?.full_name || "N/A"}</span></div>
            <div class="info-row"><span class="label">Payment</span><span class="value">${sale.payment_method}</span></div>
          </div>
          <hr class="divider" />
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th></tr>
            </thead>
            <tbody>
              ${sale.sales_items?.map(item => `
                <tr><td>${item.product?.name || "Unknown"}</td><td>${item.quantity}</td></tr>
              `).join("") || "<tr><td colspan='2' style='text-align:center;color:#888;'>No items</td></tr>"}
            </tbody>
          </table>
          <div class="total-section">
            <div class="total-row"><span>TOTAL</span><span>KES ${Number(sale.total_amount).toLocaleString()}</span></div>
          </div>
          <div class="footer">
            <p class="thanks">Thank you for your purchase!</p>
            <p>We appreciate your business</p>
          </div>
        </body>
      </html>
    `;

    // Create a hidden iframe for printing (avoids popup blockers)
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    printFrame.style.left = '-9999px';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(receiptHTML);
      frameDoc.close();

      // Wait for content to load then print
      printFrame.onload = () => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        
        // Remove iframe after printing
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      };

      // Fallback for browsers that don't trigger onload
      setTimeout(() => {
        try {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
        } catch (e) {
          console.error('Print failed:', e);
        }
      }, 500);
    }
  };

  if (trigger === "print") {
    return (
      <Button variant="ghost" size="icon" onClick={handlePrint}>
        <Printer className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="bg-primary px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-primary-foreground text-lg font-bold tracking-wide">
              Sale Details
            </DialogTitle>
            <p className="text-primary-foreground/70 text-sm font-mono">{sale.invoice_no}</p>
          </DialogHeader>
        </div>
        <div id={`receipt-${sale.id}`} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Invoice</span>
              <p className="font-semibold mt-0.5">{sale.invoice_no}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Date</span>
              <p className="font-semibold mt-0.5">{format(new Date(sale.created_at), "MMM dd, yyyy · HH:mm")}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Clerk</span>
              <p className="font-semibold mt-0.5">{sale.clerk?.full_name || "N/A"}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Payment</span>
              <p className="font-semibold mt-0.5">{sale.payment_method}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Items</h4>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-xs uppercase tracking-wider">Product</TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.sales_items?.map((item, index) => (
                  <TableRow key={index} className="border-b border-dashed border-border/50">
                    <TableCell className="font-medium">{item.product?.name || "Unknown"}</TableCell>
                    <TableCell className="text-right font-semibold">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted rounded-lg p-4 flex justify-between items-center">
            <span className="font-semibold text-muted-foreground">Total</span>
            <span className="text-xl font-bold">KES {Number(sale.total_amount).toLocaleString()}</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
