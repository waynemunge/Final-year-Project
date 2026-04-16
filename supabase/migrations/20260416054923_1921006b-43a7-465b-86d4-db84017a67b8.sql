
-- Create trigger function to auto-decrement product stock on sale
CREATE OR REPLACE FUNCTION public.decrement_product_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET quantity = quantity - NEW.quantity
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$;

-- Attach stock decrement trigger to sales_items
CREATE TRIGGER decrement_stock_on_sale
AFTER INSERT ON public.sales_items
FOR EACH ROW
EXECUTE FUNCTION public.decrement_product_stock();

-- Attach low stock check trigger to sales_items
CREATE TRIGGER check_low_stock_on_sale
AFTER INSERT ON public.sales_items
FOR EACH ROW
EXECUTE FUNCTION public.check_low_stock_after_sale();

-- Attach new user notification trigger to profiles
CREATE TRIGGER notify_on_new_user
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_user_registration();
