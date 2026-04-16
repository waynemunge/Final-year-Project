import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  format, 
  subMonths, 
  subWeeks, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  startOfDay, 
  endOfDay,
  isWithinInterval
} from "date-fns";
import { useState, useMemo } from "react";

const Reports = () => {
  const [period, setPeriod] = useState("monthly");

  const handleExportPDF = () => {
    window.print();
  };

  // Fetch sales with items and product details
  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ["reports-sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select(`
          id,
          total_amount,
          created_at,
          sales_items(
            quantity,
            unit_price,
            subtotal,
            product_id
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch products for profit calculation
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["reports-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, cost_price, selling_price");

      if (error) throw error;
      return data;
    },
  });

  const isLoading = salesLoading || productsLoading;

  // Get date range based on period
  const getDateRange = useMemo(() => {
    const now = new Date();
    switch (period) {
      case "daily":
        return {
          start: startOfDay(now),
          end: endOfDay(now),
          label: "Today",
          intervals: 7, // Last 7 days
          getIntervalData: (i: number) => {
            const date = subDays(now, 6 - i);
            return {
              start: startOfDay(date),
              end: endOfDay(date),
              label: format(date, "EEE"),
            };
          },
        };
      case "weekly":
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
          label: "This Week",
          intervals: 4, // Last 4 weeks
          getIntervalData: (i: number) => {
            const date = subWeeks(now, 3 - i);
            return {
              start: startOfWeek(date, { weekStartsOn: 1 }),
              end: endOfWeek(date, { weekStartsOn: 1 }),
              label: `Week ${format(date, "w")}`,
            };
          },
        };
      case "monthly":
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          label: "This Month",
          intervals: 6, // Last 6 months
          getIntervalData: (i: number) => {
            const date = subMonths(now, 5 - i);
            return {
              start: startOfMonth(date),
              end: endOfMonth(date),
              label: format(date, "MMM"),
            };
          },
        };
    }
  }, [period]);

  // Filter sales based on selected period for stats
  const filteredSalesData = useMemo(() => {
    if (!salesData) return [];
    return salesData.filter(sale => {
      const saleDate = new Date(sale.created_at);
      return isWithinInterval(saleDate, { start: getDateRange.start, end: getDateRange.end });
    });
  }, [salesData, getDateRange]);

  // Calculate statistics based on filtered data
  const stats = useMemo(() => {
    if (!filteredSalesData || !products) {
      return { totalSales: 0, totalRevenue: 0, totalProfit: 0, profitMargin: 0 };
    }

    const productMap = new Map(products.map(p => [p.id, p]));
    let totalRevenue = 0;
    let totalProfit = 0;

    filteredSalesData.forEach(sale => {
      totalRevenue += Number(sale.total_amount);
      sale.sales_items?.forEach(item => {
        const product = productMap.get(item.product_id);
        if (product) {
          const profit = (Number(product.selling_price) - Number(product.cost_price)) * item.quantity;
          totalProfit += profit;
        }
      });
    });

    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      totalSales: filteredSalesData.length,
      totalRevenue,
      totalProfit,
      profitMargin,
    };
  }, [filteredSalesData, products]);

  // Calculate trend data based on period intervals
  const trendData = useMemo(() => {
    if (!salesData || !products) return [];

    const productMap = new Map(products.map(p => [p.id, p]));
    const intervals: { label: string; sales: number; revenue: number; profit: number }[] = [];

    for (let i = 0; i < getDateRange.intervals; i++) {
      const interval = getDateRange.getIntervalData(i);
      
      const intervalSales = salesData.filter(sale => {
        const saleDate = new Date(sale.created_at);
        return isWithinInterval(saleDate, { start: interval.start, end: interval.end });
      });

      let revenue = 0;
      let profit = 0;

      intervalSales.forEach(sale => {
        revenue += Number(sale.total_amount);
        sale.sales_items?.forEach(item => {
          const product = productMap.get(item.product_id);
          if (product) {
            profit += (Number(product.selling_price) - Number(product.cost_price)) * item.quantity;
          }
        });
      });

      intervals.push({
        label: interval.label,
        sales: intervalSales.length,
        revenue,
        profit,
      });
    }

    return intervals;
  }, [salesData, products, getDateRange]);

  // Calculate top selling products based on filtered data
  const topProducts = useMemo(() => {
    if (!filteredSalesData || !products) return [];

    const productMap = new Map(products.map(p => [p.id, p]));
    const productSales: Map<string, { name: string; sold: number; revenue: number }> = new Map();

    filteredSalesData.forEach(sale => {
      sale.sales_items?.forEach(item => {
        const product = productMap.get(item.product_id);
        if (product) {
          const existing = productSales.get(item.product_id) || { name: product.name, sold: 0, revenue: 0 };
          existing.sold += item.quantity;
          existing.revenue += Number(item.subtotal);
          productSales.set(item.product_id, existing);
        }
      });
    });

    return Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredSalesData, products]);

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground text-sm md:text-base">View detailed business insights</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="md:size-default">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Date Range</span>
              <span className="sm:hidden">Range</span>
            </Button>
            <Button onClick={handleExportPDF} size="sm" className="md:size-default">
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <p className="text-sm text-muted-foreground mb-2">
          Showing data for: <span className="font-medium text-foreground">{getDateRange.label}</span>
        </p>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {period === "daily" ? "Today's" : period === "weekly" ? "This Week's" : "This Month's"} Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalSales.toLocaleString()}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">KES {stats.totalRevenue.toLocaleString()}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">KES {stats.totalProfit.toLocaleString()}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.profitMargin.toFixed(1)}%</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-1 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Sales, Revenue & Profit Trend ({period === "daily" ? "Last 7 Days" : period === "weekly" ? "Last 4 Weeks" : "Last 6 Months"})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `KES ${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="sales" name="Sales Count" fill="hsl(var(--primary))" />
                    <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--accent))" />
                    <Bar dataKey="profit" name="Profit" fill="hsl(var(--success))" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : topProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No sales data available</p>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sold} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">KES {product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
