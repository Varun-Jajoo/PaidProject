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
import { OrderBook } from "@/components/order-book";
import { Card } from "@/components/ui/card";
import { createTrade } from "@/app/actions/trade-actions";

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
  price: z
    .string()
    .refine(
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      {
        message: "Price must be a positive number",
      }
    ),
});

const commodities = [
  { value: "1", label: "Gold", name: "gold" },
  { value: "2", label: "Silver", name: "silver" },
  { value: "3", label: "Platinum", name: "platinum" },
  { value: "4", label: "Palladium", name: "palladium" },
  { value: "5", label: "Crude Oil", name: "crude_oil" },
  { value: "6", label: "Natural Gas", name: "natural_gas" },
  { value: "7", label: "Brent Crude", name: "brent" },
  { value: "8", label: "Copper", name: "copper" },
  { value: "9", label: "Aluminum", name: "aluminum" },
  { value: "10", label: "Wheat", name: "wheat" },
  { value: "11", label: "Corn", name: "corn" },
  { value: "12", label: "Cotton", name: "cotton" },
  { value: "13", label: "Sugar", name: "sugar" },
  { value: "14", label: "Coffee", name: "coffee" },
];

interface TradeFormProps {
  initialCommodity?: string;
  initialPrice?: number;
}

export function TradeForm({
  initialCommodity = "1",
  initialPrice,
}: TradeFormProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [currentPrice, setCurrentPrice] = useState<number | null>(initialPrice || null);
  const [selectedCommodity, setSelectedCommodity] = useState(initialCommodity);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { portfolio } = useTradingContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commodity: initialCommodity,
      quantity: "",
      price: initialPrice?.toString() || "",
    },
  });

  useEffect(() => {
    if (initialCommodity) {
      form.setValue("commodity", initialCommodity);
      setSelectedCommodity(initialCommodity);
    }
    if (initialPrice) {
      setCurrentPrice(initialPrice);
      form.setValue("price", initialPrice.toString());
    }
  }, [initialCommodity, initialPrice, form]);

  useEffect(() => {
    const updatePrice = async () => {
      const commodity = commodities.find((c) => c.value === selectedCommodity);
      if (commodity) {
        const price = await getCommodityPriceFromMarketData(commodity.name);
        if (price) {
          setCurrentPrice(price);
          form.setValue("price", price.toString());
        }
      }
    };

    updatePrice();
    const interval = setInterval(updatePrice, 10000);
    return () => clearInterval(interval);
  }, [selectedCommodity, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const commodity = commodities.find((c) => c.value === values.commodity);
      if (!commodity) {
        throw new Error("Invalid commodity selected");
      }

      const price = parseFloat(values.price);
      const amount = parseFloat(values.quantity);
      const total = price * amount;

      const tradeId = await createTrade({
        commodityId: values.commodity,
        commodityName: commodity.name,
        price,
        amount,
        total,
        side,
        timestamp: new Date(),
        userId: "user123", // Replace with actual user ID from auth
        status: "pending"
      });

      toast({
        title: "Trade submitted",
        description: `${side === "buy" ? "Bought" : "Sold"} ${values.quantity} ${commodity.label} at ${values.price}`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit trade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Tabs defaultValue={side} onValueChange={(value) => setSide(value as "buy" | "sell")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
        </Tabs>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="commodity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commodity</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCommodity(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a commodity" />
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
                  <FormDescription>
                    Choose the commodity you want to trade
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormDescription>
                    Current market price: {currentPrice ? `$${currentPrice.toFixed(2)}` : "Loading..."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormDescription>
                    Enter the quantity you want to trade
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Processing..." : `${side === "buy" ? "Buy" : "Sell"} Now`}
            </Button>
          </form>
        </Form>
      </Card>

      {selectedCommodity && (
        <OrderBook commodityId={selectedCommodity} />
      )}
    </div>
  );
}
