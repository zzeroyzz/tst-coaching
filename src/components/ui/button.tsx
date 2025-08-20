"use client"

import * as React from "react"
import clsx from "clsx"
import styles from "./Button.module.css"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

/**
 * Tailwind styling is applied to the inner <button>, while the CSS module
 * handles the wrapper + shadow + hover movement.
 */
const buttonVariants = cva(
  // base styles for the inner button
  "inline-flex items-center justify-center whitespace-nowrap font-bold border-3 border-nb-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nb-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:     "bg-nb-red text-nb-bg",
        destructive: "bg-nb-red text-nb-bg",
        outline:     "bg-nb-bg text-nb-ink hover:bg-nb-yellow",
        secondary:   "bg-nb-lilac text-nb-ink",
        success:     "bg-nb-green text-nb-ink",
        warning:     "bg-nb-amber text-nb-ink",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm:      "h-9 px-3",
        lg:      "h-11 px-8",
        xl:      "h-14 px-10 text-lg",
        icon:    "h-10 w-10 p-0",
      },
      fullWidth: {
        true:  "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
    // optional compound tweaks
    compoundVariants: [
      { variant: "link", class: "font-medium" },
      { variant: "ghost", class: "font-medium" },
    ],
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  /** Extra class for the outer wrapper (affects the shadow block size) */
  wrapperClassName?: string
  /** Use Slot to render as a different element (like Link) */
  asChild?: boolean
  id?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, wrapperClassName, variant, size, fullWidth, asChild = false, children, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button"

  return (
    <div className={clsx(styles.wrapper, wrapperClassName)}>
      <div className={styles.shadow} />
      <Comp
        ref={ref}
        className={clsx(styles.button, buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {children}
      </Comp>
    </div>
  )
})

export { Button, buttonVariants }
export default Button
