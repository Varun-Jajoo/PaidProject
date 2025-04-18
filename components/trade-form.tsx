"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useTradingContext } from "@/context/trading-context";
import { getCommodityPriceFromMarketData } from "@/app/actions/market-data";

const formSchema = z.object({
  commodity: z.string().min(1, "Commodity is required"),
  quantity: z
    .string()
    .refine(
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      {
        message: "Quantity must be a positive number",
      }
    ),
});

// List of available commodities
const commodities = [
  // Metals
  { value: "GOLD", label: "Gold (10g)" },
  { value: "SILVER", label: "Silver (10g)" },
  { value: "COPPER", label: "Copper (kg)" },
  { value: "ALUMINIUM", label: "Aluminium (kg)" },
  { value: "LEAD", label: "Lead (kg)" },
  { value: "ZINC", label: "Zinc (kg)" },
  { value: "NICKEL", label: "Nickel (kg)" },
  // Energy
  { value: "CRUDEOIL", label: "Crude Oil (barrel)" },
  { value: "NATURALGAS", label: "Natural Gas (MMBtu)" },
  { value: "BRENT", label: "Brent Crude (barrel)" },
  { value: "HEATINGOIL", label: "Heating Oil (barrel)" },
  // Agriculture
  { value: "COTTON", label: "Cotton (bale)" },
  { value: "SOYBEAN", label: "Soybean (kg)" },
  { value: "WHEAT", label: "Wheat (kg)" },
  { value: "CORN", label: "Corn (kg)" },
  { value: "SUGAR", label: "Sugar (kg)" },
  // Others
  { value: "RUBBER", label: "Rubber (kg)" },
  { value: "MENTHAOIL", label: "Mentha Oil (kg)" },
  { value: "CPO", label: "CPO (kg)" },
];

interface TradeFormProps {
  initialCommodity?: string;
  initialPrice?: number;
}

export function TradeForm({
  initialCommodity = "GOLD",
  initialPrice,
}: TradeFormProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [currentPrice, setCurrentPrice] = useState<number | null>(
    initialPrice || null
  );
  const [selectedCommodity, setSelectedCommodity] = useState(initialCommodity);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { executeTrade, portfolio } = useTradingContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commodity: initialCommodity,
      quantity: "",
    },
  });

  // Update form when initialCommodity or initialPrice changes
  useEffect(() => {
    if (initialCommodity) {
      form.setValue("commodity", initialCommodity);
      setSelectedCommodity(initialCommodity);
    }
    if (initialPrice) {
      setCurrentPrice(initialPrice);
    }
  }, [initialCommodity, initialPrice, form]);

  // Fetch current price when commodity changes
  useEffect(() => {
    // Don't fetch price if initialPrice is provided
    if (initialPrice !== undefined) {
      return;
    }

    const getPrice = async () => {
      try {
        const price = await getCommodityPriceFromMarketData(selectedCommodity);
        if (price !== null) {
          setCurrentPrice(price);
        } else {
          // If price not found in market data, use a mock price
          setCurrentPrice(1000 + Math.random() * 500);
        }
      } catch (error) {
        console.error("Error fetching price:", error);
        setCurrentPrice(1000 + Math.random() * 500);
      }
    };

    getPrice();
    // Set up interval to refresh price every 30 seconds
    const intervalId = setInterval(getPrice, 30000);
    return () => clearInterval(intervalId);
  }, [selectedCommodity, initialPrice]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentPrice) {
      toast({
        title: "Error",
        description: "Could not get current price. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const quantity = Number.parseFloat(values.quantity);
    const totalCost = quantity * currentPrice;

    try {
      const success = await executeTrade(
        values.commodity,
        side,
        quantity,
        currentPrice
      );

      if (success) {
        toast({
          title: "Trade Executed",
          description: `${side === "buy" ? "Bought" : "Sold"} ${quantity} ${
            values.commodity
          } at ${currentPrice.toFixed(2)}`,
        });
        form.reset({
          commodity: values.commodity,
          quantity: "",
        });
      } else {
        toast({
          title: "Trade Failed",
          description:
            side === "buy"
              ? `Insufficient funds. You need $${totalCost.toFixed(
                  2
                )} but have $${portfolio.cash.toFixed(2)}`
              : "Insufficient quantity to sell",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while executing the trade",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommodityChange = (value: string) => {
    setSelectedCommodity(value);
    form.setValue("commodity", value);
  };

  const estimatedTotal =
    currentPrice && form.watch("quantity")
      ? currentPrice * Number.parseFloat(form.watch("quantity"))
      : 0;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={side}
        onValueChange={(value) => setSide(value as "buy" | "sell")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="buy"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Buy
          </TabsTrigger>
          <TabsTrigger
            value="sell"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
          >
            Sell
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-lg bg-muted p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Available Cash:</span>
          <span className="font-medium">{formatPrice(portfolio.cash)}</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="commodity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commodity</FormLabel>
                <Select
                  onValueChange={handleCommodityChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {commodities.map((commodity) => (
                      <SelectItem key={commodity.value} value={commodity.value}>
                        {commodity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Current Price:
              </span>
              <span className="font-medium">
                {currentPrice ? formatPrice(currentPrice) : "Loading..."}
              </span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the amount you want to {side}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Estimated Total:
              </span>
              <span className="font-medium">{formatPrice(estimatedTotal)}</span>
            </div>
          </div>

          <Button
            type="submit"
            className={
              side === "buy"
                ? "bg-green-500 hover:bg-green-600 w-full"
                : "bg-red-500 hover:bg-red-600 w-full"
            }
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : side === "buy" ? "Buy" : "Sell"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
