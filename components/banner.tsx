import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { AlertTriangle, CheckCircleIcon } from 'lucide-react'
import React from 'react'

const bannerVariants=cva(
    "border text-center p-4 text-sm flex items-center w-full",
    {
        variants:{
            variant:{
                warning:"bg-yellow-200/80 border-yellow-30 text-primary",
                success:"bg-emerald-200/80 border-emerald-30 text-primary",
            }
        },
        defaultVariants:{
            variant:"warning"
        }
    }
)

interface BannerProps extends VariantProps<typeof bannerVariants>{
    label:string
}
const iconMap = {
    warning:AlertTriangle,
    success:CheckCircleIcon
  };
export const Banner = ({label,variant}:BannerProps) => {
    const Icon=iconMap[variant || "warning"]
  return (
    <div className={cn(bannerVariants({variant}))}>
        <Icon className="h-4 w-4 mr-2"/>
        {label}

    </div>
  )
}