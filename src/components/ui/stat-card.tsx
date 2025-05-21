'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    positive?: boolean;
  };
  subtitle?: string;
  className?: string;
  iconColor?: string;
  iconClassName?: string;
  valueClassName?: string;
  onClick?: () => void;
  footer?: ReactNode;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  className,
  iconColor = "text-primary",
  iconClassName,
  valueClassName,
  onClick,
  footer
}: StatCardProps) {
  const isTrendPositive = trend?.positive ?? (trend?.value !== undefined ? trend.value >= 0 : true);
  const trendColor = isTrendPositive ? 'text-green-500' : 'text-red-500';
  const trendIcon = isTrendPositive ? '↑' : '↓';
  const trendValue = trend?.value !== undefined ? Math.abs(trend.value) : null;
  
  return (
    <motion.div
      whileHover={onClick ? { y: -5, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "h-full cursor-default",
        onClick && "cursor-pointer",
      )}
      onClick={onClick}
    >
      <Card className={cn(
        "h-full p-6 transition-all duration-300 hover:shadow-md",
        className
      )}>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {Icon && (
              <Icon className={cn("h-5 w-5", iconColor, iconClassName)} />
            )}
          </div>
          
          <div className="flex flex-col">
            <span className={cn("text-2xl font-bold", valueClassName)}>
              {value}
            </span>
            
            {subtitle && (
              <p className="text-xs text-muted-foreground/80 mt-1">{subtitle}</p>
            )}
            
            {trend && trendValue !== null && (
              <div className="flex items-center mt-2 text-sm">
                <span className={cn(trendColor, "mr-1 font-medium")}>
                  {trendIcon} {trendValue}%
                </span>
                <span className="text-xs text-muted-foreground/80">vs. last period</span>
              </div>
            )}
          </div>
          
          {footer && (
            <div className="mt-4 pt-4 border-t border-border">
              {footer}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

interface StatGroupProps {
  children: ReactNode;
  className?: string;
}

export function StatGroup({ children, className }: StatGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1, duration: 0.5 }}
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
} 