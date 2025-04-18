"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useTradingContext } from "@/context/trading-context"
import { getCommodityPrice } from "@/app/actions/commodity-actions"

const formSchema = z.object({
  commodity: z.string().min(1, "Commodity is required"),
  quantity: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
    message: "Quantity must be a positive number",
  }),
})

// List of available commodities
const commodities = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "platinum", label: "Platinum" },
  { value: "palladium", label: "Palladium" },
  { value: "crude_oil", label: "Crude Oil" },
  { value: "natural_gas", label: "Natural Gas" },
  { value: "brent", label: "Brent Crude" },
  { value: "copper", label: "Copper" },
  { value: "aluminum", label: "Aluminum" },
  { value: "wheat", label: "Wheat" },
  { value: "corn", label: "Corn" },
  { value: "cotton", label: "Cotton" },
  { value: "sugar", label: "Sugar" },
  { value: "coffee", label: "Coffee" },
]

export function TradeForm() {
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [selectedCommodity, setSelectedCommodity] = useState("gold")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { executeTrade, portfolio } = useTradingContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commodity: "gold",
      quantity: "",
    },
  })

  // Fetch current price when commodity changes
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const result = await getCommodityPrice(selectedCommodity)
        if (result) {
          setCurrentPrice(result.price)
        } else {
          // If API fails, use a mock price
          setCurrentPrice(1000 + Math.random() * 500)
        }
      } catch (error) {
        console.error("Failed to fetch commodity price:", error)
        setCurrentPrice(1000 + Math.random() * 500)
      }
    }

    fetchPrice()
    // Set up interval to refresh price every 30 seconds
    const intervalId = setInterval(fetchPrice, 30000)
    return () => clearInterval(intervalId)
  }, [selectedCommodity])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentPrice) {
      toast({
        title: "Error",
        description: "Could not get current price. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const quantity = Number.parseFloat(values.quantity)
    const totalCost = quantity * currentPrice

    try {
      const success = await executeTrade(values.commodity, side, quantity, currentPrice)

      if (success) {
        toast({
          title: "Trade Executed",
          description: `${side === "buy" ? "Bought" : "Sold"} ${quantity} ${values.commodity} at ${currentPrice.toFixed(
            2,
          )}`,
        })
        form.reset({
          commodity: values.commodity,
          quantity: "",
        })
      } else {
        toast({
          title: "Trade Failed",
          description:
            side === "buy"
              ? `Insufficient funds. You need $${totalCost.toFixed(2)} but have $${portfolio.cash.toFixed(2)}`
              : "Insufficient quantity to sell",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while executing the trade",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommodityChange = (value: string) => {
    setSelectedCommodity(value)
    form.setValue("commodity", value)
  }

  const estimatedTotal =
    currentPrice && form.watch("quantity") ? currentPrice * Number.parseFloat(form.watch("quantity")) : 0

  return (
    <div className="space-y-6">
      <Tabs value={side} onValueChange={(value) => setSide(value as "buy" | "sell")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buy" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
            Sell
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-lg bg-muted p-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Available Cash:</span>
          <span className="font-medium">${portfolio.cash.toFixed(2)}</span>
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
                <Select onValueChange={handleCommodityChange} defaultValue={field.value}>
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
              <span className="text-sm text-muted-foreground">Current Price:</span>
              <span className="font-medium">{currentPrice ? `$${currentPrice.toFixed(2)}` : "Loading..."}</span>
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
                <FormDescription>Enter the amount you want to {side}.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Estimated Total:</span>
              <span className="font-medium">${estimatedTotal.toFixed(2)}</span>
            </div>
          </div>

          <Button
            type="submit"
            className={side === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : side === "buy" ? "Buy" : "Sell"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
