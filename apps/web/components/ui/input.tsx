"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {cva, VariantProps} from "class-variance-authority";

interface UseIsFocusedResult  {
  isFocused: boolean
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
}

const useIsFocused = (props: React.InputHTMLAttributes<HTMLInputElement>): UseIsFocusedResult => {
  const [isFocused, setIsFocused] = React.useState(false)
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    props?.onFocus?.(e)
    setIsFocused(true)
  }

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    props?.onBlur?.(e)
    setIsFocused(false)
  }

  return {
    isFocused,
    inputProps: {
      ...props,
      onFocus,
      onBlur
    }
  }
}

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8"
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
      decorator?: React.ReactElement | string
    }


const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, decorator, ...props }, ref) => {
    const {isFocused, inputProps} = useIsFocused(props)

    return (
      <label
        className={
          cn(
            inputVariants({ size, className }),
            "flex items-center",
            isFocused && "outline-none ring-2 ring-ring ring-offset-2"
          )
        }
      >
        <div className='flex-1 px-3 py-2'>
          <input
            className="w-full outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground"
            type={type}
            ref={ref}
            {...inputProps}
          />
        </div>
        {decorator}
      </label>
    )
  }
)

Input.displayName = "Input"

export { Input }
