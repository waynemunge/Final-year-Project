import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSales } from "./useSales";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface PendingSale {
  cart: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
  paymentMethod: string;
  reference: string;
  totalAmount: number;
}

export const usePaystackVerification = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const { createSale } = useSales();
  const { user } = useAuth();

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    const pendingSaleData = sessionStorage.getItem("pendingSale");

    if (reference && pendingSaleData && user && !isVerifying) {
      verifyAndCompleteSale(reference, JSON.parse(pendingSaleData));
    }
  }, [searchParams, user]);

  const verifyAndCompleteSale = async (reference: string, pendingSale: PendingSale) => {
    setIsVerifying(true);

    try {
      // Verify the payment with Paystack
      const response = await supabase.functions.invoke("paystack-verify", {
        body: { reference },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to verify payment");
      }

      const { status, amount } = response.data;

      if (status !== "success") {
        toast.error("Payment was not successful. Please try again.");
        sessionStorage.removeItem("pendingSale");
        clearSearchParams();
        setIsVerifying(false);
        return;
      }

      // Verify amount matches
      if (Math.abs(amount - pendingSale.totalAmount) > 1) {
        toast.error("Payment amount mismatch. Please contact support.");
        sessionStorage.removeItem("pendingSale");
        clearSearchParams();
        setIsVerifying(false);
        return;
      }

      // Create the sale
      const sale = {
        invoice_no: pendingSale.reference,
        total_amount: pendingSale.totalAmount,
        payment_method: "Paystack",
        clerk_id: user!.id,
      };

      const items = pendingSale.cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      }));

      await createSale.mutateAsync({ sale, items });

      toast.success("Payment successful! Sale has been recorded.");
      sessionStorage.removeItem("pendingSale");
      clearSearchParams();
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to verify payment");
    } finally {
      setIsVerifying(false);
    }
  };

  const clearSearchParams = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("reference");
    newParams.delete("trxref");
    setSearchParams(newParams, { replace: true });
  };

  return { isVerifying };
};
