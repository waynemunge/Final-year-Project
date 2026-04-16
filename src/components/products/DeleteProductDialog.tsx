import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

interface DeleteProductDialogProps {
  productId: string;
  productName: string;
}

export const DeleteProductDialog = ({ productId, productName }: DeleteProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const [hasSalesHistory, setHasSalesHistory] = useState(false);
  const { deleteProduct } = useProducts();

  const handleDelete = () => {
    deleteProduct.mutate(productId, {
      onSuccess: () => {
        setOpen(false);
        setHasSalesHistory(false);
      },
      onError: (error: Error) => {
        // Check if it's a foreign key constraint error
        if (error.message.includes("violates foreign key constraint") || 
            error.message.includes("sales_items")) {
          setHasSalesHistory(true);
        }
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setHasSalesHistory(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {hasSalesHistory ? "Cannot Delete Product" : "Delete Product"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              {hasSalesHistory ? (
                <>
                  <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-md">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        "{productName}" has sales history
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This product cannot be deleted because it appears in past sales records. 
                        Deleting it would affect your sales history and reports.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Instead of deleting, you can set the quantity to 0 
                    to mark it as out of stock, or update its details if needed.
                  </p>
                </>
              ) : (
                <p>
                  Are you sure you want to delete <strong>{productName}</strong>? 
                  This action cannot be undone.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {hasSalesHistory ? (
            <AlertDialogCancel>Close</AlertDialogCancel>
          ) : (
            <>
              <AlertDialogCancel disabled={deleteProduct.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={deleteProduct.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteProduct.isPending ? "Deleting..." : "Delete Product"}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
