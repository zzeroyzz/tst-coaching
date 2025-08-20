// components/ui/card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "flat" | "outline";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

/**
 * Neo-brutalist Card
 * - square corners
 * - 3px border (tailwind.config.ts -> borderWidth.3)
 * - chunky shadows via shadow-nb-* utilities
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-variant={variant}
        className={cn(
          "bg-nb-bg text-nb-ink border-3 border-nb-border rounded-none",
          variant === "default" && "shadow-nb-md",
          variant === "elevated" && "shadow-nb-lg",
          variant === "flat" && "shadow-none",
          variant === "outline" && "shadow-none",
          "overflow-hidden",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "p-6 border-b-3 border-nb-border bg-nb-bg/60",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-nb-ink/70 font-medium", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6", className)}
    {...props}
  />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 border-t-3 border-nb-border", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export default Card;
