"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createPriceAlert } from "@/app/actions/price-alerts";
import { useToast } from "@/hooks/use-toast";

type PriceAlertDialogProps = {
  symbol: string;
  currentPrice: number;
};

export function PriceAlertDialog({
  symbol,
  currentPrice,
}: PriceAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(currentPrice.toString());
  const [condition, setCondition] = useState<"above" | "below">("above");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice)) {
        throw new Error("Invalid price");
      }

      const alert = {
        userId: "demo-user", // In a real app, get this from auth context
        symbol: symbol,
        price: numericPrice,
        condition: condition,
        active: true,
        createdAt: new Date(),
      };

      await createPriceAlert(alert);

      toast({
        title: "Price Alert Created",
        description: `You will be notified when ${symbol} goes ${condition} ₹${numericPrice}`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create price alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Set Price Alert for {symbol}</DialogTitle>
            <DialogDescription>
              Get notified when the price reaches your target.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Alert Condition</Label>
              <RadioGroup
                value={condition}
                onValueChange={(val) => setCondition(val as "above" | "below")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="above" id="above" />
                  <Label htmlFor="above">Price goes above</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="below" id="below" />
                  <Label htmlFor="below">Price goes below</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label>Target Price (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter target price"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Alert</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
