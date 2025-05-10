import React from 'react';
import StarterIcon from '@/assets/starter.svg';
import ProIcon from '@/assets/pro.svg';
import PremiumIcon from '@/assets/premium.svg';
import EnterpriseIcon from '@/assets/enterprise.svg';
import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Formatting helpers
const formatCurrency = (amount: number | null, currency: string = 'USD'): string => {
  if (amount === null) return 'Custom';
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

const formatTokens = (tokens: number | null): string => {
  if (tokens === null) return 'Custom';
  if (tokens === 0) return 'No tokens included';
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toLocaleString()}M tokens included`;
  }
  return `${tokens.toLocaleString()} tokens included`;
};

export interface Plan {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  tokens: number | null;
  features: string[];
  isEnterprise?: boolean;
}

export interface PlanCardProps {
  /** Plan data */
  plan: Plan;
  /** Whether this plan is the one currently active */
  isCurrent: boolean;
  /** Whether this plan is currently selected (highlight border) */
  isSelected: boolean;
  /** Handler when clicking on the card to select it */
  onCardClick: (plan: Plan) => void;
  /** Handler when clicking the action button (upgrade/order) */
  onActionClick: (plan: Plan) => void;
  /** Handler for the enterprise "Get in Touch" action */
  onContactForEnterprise: () => void;
}

/**
 * A card displaying subscription plan details with icon, features, and action button.
 */
export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrent,
  isSelected,
  onCardClick,
  onActionClick,
  onContactForEnterprise,
}) => {
  const { id, name, price, currency, tokens, features, isEnterprise } = plan;

  // Map plan ID to SVG icon
  const icons: Record<string, string> = {
    free: StarterIcon,
    starter: StarterIcon,
    pro: ProIcon,
    premium: PremiumIcon,
    enterprise: EnterpriseIcon,
  };
  const IconSrc = icons[id];

  return (
    <div
      className={
        `relative flex flex-col rounded-2xl p-6 transition-all break-words
        ${isEnterprise ? 'border-2 border-dashed border-border' : 'border-2'}
        ${isCurrent
          ? 'bg-[#393744] border-transparent'
          : isSelected
          ? 'bg-background border-primary'
          : 'bg-background border-border'}`
      }
      onClick={() => !isEnterprise && onCardClick(plan)}
    >
      {/* "Current plan" badge */}
      {isCurrent && (
        <Badge className="absolute top-4 right-4 px-2 py-1">Current plan</Badge>
      )}

      {/* Plan icon */}
      {IconSrc && (
        <img src={IconSrc} alt={`${name} icon`} className="h-8 w-8 mb-4" />
      )}

      {/* Title & price */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="text-xl font-bold">
          {formatCurrency(price, currency)}
          {price && price !== 0 && (
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              /month
            </span>
          )}
        </div>
      </div>

      {/* Token info */}
      <p className="text-sm text-muted-foreground mb-4">{formatTokens(tokens)}</p>

      {/* Feature list */}
      <div className="flex-grow space-y-2 mb-6">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* Action button */}
      <div>
        {isEnterprise ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onContactForEnterprise();
            }}
          >
            Get in Touch
          </Button>
        ) : isCurrent ? (
          <Button variant="default" disabled className="w-full">
            Current plan
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick(plan);
            }}
          >
            Upgrade to {name}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};