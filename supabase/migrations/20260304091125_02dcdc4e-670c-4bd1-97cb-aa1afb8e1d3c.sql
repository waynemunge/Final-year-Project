
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage settings
CREATE POLICY "Admins can manage settings"
ON public.settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- All authenticated users can view settings
CREATE POLICY "Authenticated users can view settings"
ON public.settings
FOR SELECT
TO authenticated
USING (true);

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
  ('company_info', '{"company_name": "GizmoKe", "email": "info@gizmoke.com", "phone": "+254 700 000 000", "address": "Nairobi, Kenya"}'::jsonb),
  ('notifications', '{"low_stock_alerts": true, "daily_sales_report": true, "new_user_registration": false}'::jsonb),
  ('system', '{"currency": "KES (Kenyan Shilling)", "timezone": "Africa/Nairobi", "reorder_threshold": 20}'::jsonb);
