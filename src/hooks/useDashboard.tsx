import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    staleTime: 30_000,
    queryFn: async () => {
      // Get total products
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Get total sales count
      const { count: salesCount } = await supabase
        .from("sales")
        .select("*", { count: "exact", head: true });

      // Get total revenue and profit
      const { data: salesData } = await supabase
        .from("sales")
        .select("total_amount");

      const totalRevenue = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;

      // Get products for profit calculation
      const { data: products } = await supabase
        .from("products")
        .select("cost_price, selling_price, quantity");

      const totalProfit = products?.reduce((sum, product) => 
        sum + (Number(product.selling_price) - Number(product.cost_price)) * product.quantity, 0) || 0;

      return {
        totalProducts: productsCount || 0,
        totalSales: salesCount || 0,
        totalRevenue,
        totalProfit,
      };
    },
  });

  const { data: lowStockItems, isLoading: lowStockLoading } = useQuery({
    queryKey: ["low-stock"],
    staleTime: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("name, quantity, reorder_level");

      if (error) throw error;
      
      // Filter low stock items client-side
      const lowStock = data?.filter(p => p.quantity <= p.reorder_level)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5);
      
      return lowStock;
    },
  });

  const { data: salesTrend, isLoading: trendLoading } = useQuery({
    queryKey: ["sales-trend"],
    staleTime: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("created_at, total_amount")
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by month
      const monthlyData = data?.reduce((acc: any, sale: any) => {
        const month = new Date(sale.created_at).toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = { month, sales: 0, revenue: 0 };
        }
        acc[month].sales += 1;
        acc[month].revenue += Number(sale.total_amount);
        return acc;
      }, {});

      return Object.values(monthlyData || {});
    },
  });

  return {
    stats,
    lowStockItems,
    salesTrend,
    isLoading: statsLoading || lowStockLoading || trendLoading,
  };
};
