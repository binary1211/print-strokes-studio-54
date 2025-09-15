import { cn } from "@/lib/utils";
import { ProductVariant } from "@/types";

interface SizeSelectorProps {
  variants: ProductVariant[];
  selected: string;
  onSelect: (variantId: string) => void;
  className?: string;
}

const SizeSelector = ({ variants, selected, onSelect, className }: SizeSelectorProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-semibold text-foreground">Size & Options</h3>
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onSelect(variant.id)}
            className={cn(
              "flex-shrink-0 snap-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border-2",
              "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              selected === variant.id
                ? "bg-printStrokes-secondary text-white border-printStrokes-secondary shadow-lg"
                : "bg-background text-foreground border-border hover:border-printStrokes-primary hover:text-printStrokes-primary"
            )}
            aria-current={selected === variant.id ? "true" : "false"}
            aria-label={`Select size ${variant.name} for ₹${variant.price}`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="font-medium">{variant.name}</span>
              <span className="text-xs opacity-75">₹{variant.price}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;