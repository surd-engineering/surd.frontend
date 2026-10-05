"use client"

import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { NumericFormat } from "react-number-format"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { cn } from "@/lib/cn"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"
import { Icon } from "@/components/ui/icon"

const inputVariants = cva(
    "flex w-full rounded-lg border border-grey-25 text-sm transition-colors bg-grey-25 file:text-sm file:font-medium placeholder:text-grey-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&.invalid]:border-red-500 [&.invalid]:bg-red-50",
    {
        variants: {
            variant: {
                default: "focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
                error: "border-red-500 bg-red-50 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20",
                success: "border-green-500 focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-500/20",
            },
            inputSize: {
                default: "h-14 px-4 py-2",
                sm: "h-10 px-3 py-2",
            },
        },
        defaultVariants: {
            variant: "default",
            inputSize: "default",
        },
    }
)

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
    label?: string | React.ReactNode
    helperText?: string
    error?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    prefix?: string
    hasError?: boolean
    infoTooltip?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            variant,
            inputSize,
            label,
            helperText,
            error,
            leftIcon,
            rightIcon,
            prefix,
            infoTooltip,
            id,
            value,
            defaultValue,
            onChange,
            ...props
        },
        ref
    ) => {
        const generatedId = React.useId()
        const inputId = id || generatedId
        const computedVariant = error ? "error" : variant
        const isNumber = type === "number"

        const sharedInputClass = cn(
            inputVariants({ variant: computedVariant, inputSize, className }),
            leftIcon && !prefix && "pl-10",
            prefix && "pl-20",
            rightIcon && "pr-10"
        )

        return (
            <div className="w-full flex flex-col gap-2">
                {label && (
                    <div className="flex items-center gap-1.5">
                        <label
                            htmlFor={inputId}
                            className="text-md font-medium text-grey-500"
                        >
                            {label} {!props.required && <span className="text-grey-400">(Optional)</span>}
                        </label>
                        {infoTooltip && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="text-grey-400 hover:text-grey-600 cursor-help transition-colors flex items-center justify-center">
                                            <Icon icon={InformationCircleIcon} size={16} />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs">{infoTooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                )}
                <div className="relative">
                    {prefix && (
                        <div className="absolute left-0 top-0 flex h-full items-center border-r border-grey-300 px-3 text-sm text-grey-600 rounded-l-lg">
                            {prefix}
                        </div>
                    )}
                    {leftIcon && !prefix && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-600">
                            {leftIcon}
                        </div>
                    )}

                    {isNumber ? (
                        <NumericFormat
                            id={inputId}
                            className={sharedInputClass}
                            getInputRef={ref}
                            data-mtk-input
                            {...(value !== undefined
                                ? { value: (Array.isArray(value) ? value.join(",") : value) as string | number }
                                : { defaultValue: (Array.isArray(defaultValue) ? defaultValue.join(",") : defaultValue) as string | number }
                            )}
                            thousandSeparator={true}
                            onValueChange={(values) => {
                                if (onChange) {
                                    const mockEvent = {
                                        target: {
                                            name: props.name,
                                            value: values.value,
                                        }
                                    } as React.ChangeEvent<HTMLInputElement>;
                                    onChange(mockEvent);
                                }
                            }}
                            {...props}
                            type="text"
                        />
                    ) : (
                        <input
                            type={type}
                            id={inputId}
                            className={sharedInputClass}
                            ref={ref}
                            data-mtk-input
                            {...(value !== undefined ? { value } : { defaultValue })}
                            onChange={onChange}
                            {...props}
                        />
                    )}

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-600 [&_svg]:size-5">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {helperText && (
                    <p
                        className={cn(
                            "text-xs",
                            error ? "text-red-500" : "text-grey-500"
                        )}
                    >
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input, inputVariants }
