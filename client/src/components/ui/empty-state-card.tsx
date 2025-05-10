import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';

export interface EmptyStateCardProps {
  // Main heading text
  title: string;
  // Subheading or descriptive text 
  description: string;
  // Text to display inside the button
  buttonText: string;
  // Click handler for the button
  onButtonClick: () => void;
  /// Optional custom icon at the top
  icon?: React.ReactNode;
  // Optional custom icon inside the button
  buttonIcon?: React.ReactNode;
  // Additional classes to apply to the Card container
  className?: string;
}

// A reusable empty-state card with dashed border, icon, and action button
export const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  icon,
  buttonIcon,
  className = '',
}) => {
  const IconComponent =
    icon ?? <FilePlus className="h-12 w-12 text-muted-foreground mb-4" />;
  const ButtonIconComponent =
    buttonIcon ?? <FilePlus className="mr-2 h-4 w-4" />;

  return (
    <Card className={`w-full max-w-md border-2 border-dashed ${className}`}>  
      <CardContent className="flex flex-col items-center justify-center py-10">
        {IconComponent}
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-muted-foreground text-center mt-2 mb-4">
          {description}
        </p>
        <Button onClick={onButtonClick}>
          {ButtonIconComponent}
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
