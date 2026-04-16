-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;

-- Create a new restrictive SELECT policy for admins and managers only
CREATE POLICY "Admins and managers can view suppliers"
  ON public.suppliers
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));