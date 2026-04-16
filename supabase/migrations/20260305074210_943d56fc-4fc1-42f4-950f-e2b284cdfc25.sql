
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow system inserts (via triggers with security definer)
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to create low stock notifications for all admins
CREATE OR REPLACE FUNCTION public.check_low_stock_after_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  product_record RECORD;
  admin_record RECORD;
BEGIN
  -- Get the product that was just sold
  SELECT id, name, quantity, reorder_level
  INTO product_record
  FROM public.products
  WHERE id = NEW.product_id;

  -- Check if quantity is at or below reorder level
  IF product_record.quantity <= product_record.reorder_level THEN
    -- Notify all admin users
    FOR admin_record IN
      SELECT user_id FROM public.user_roles WHERE role = 'admin'
    LOOP
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        admin_record.user_id,
        'Low Stock Alert',
        product_record.name || ' has only ' || product_record.quantity || ' units left (reorder level: ' || product_record.reorder_level || ')',
        'low_stock'
      );
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger on sales_items insert
CREATE TRIGGER trigger_low_stock_check
  AFTER INSERT ON public.sales_items
  FOR EACH ROW
  EXECUTE FUNCTION public.check_low_stock_after_sale();

-- Function to notify admins on new user registration
CREATE OR REPLACE FUNCTION public.notify_new_user_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  FOR admin_record IN
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      admin_record.user_id,
      'New User Registered',
      NEW.full_name || ' (' || NEW.email || ') has joined the system',
      'new_user'
    );
  END LOOP;
  RETURN NEW;
END;
$$;

-- Trigger on profiles insert
CREATE TRIGGER trigger_new_user_notification
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_user_registration();
