import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, CreditCard, ExternalLink, Zap, X, AlertTriangle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { getUserSubscription, getSubscriptionPlans, updateSubscription, getTopUpPackages, purchaseTopUp } from "@/api/subscription";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plan, PlanCard } from "@/components/ui/plan-card";

export function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [topUpPackages, setTopUpPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [confirmTopUpOpen, setConfirmTopUpOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedTopUp, setSelectedTopUp] = useState<string | null>(null);
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: ""
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
const [planToChange, setPlanToChange] = useState<Plan | null>(null);
const [confirmPlanChangeOpen, setConfirmPlanChangeOpen] = useState(false);
  
  // Add state for confirmation dialog
  // const [confirmPlanChangeOpen, setConfirmPlanChangeOpen] = useState(false);
  // const [planToChange, setPlanToChange] = useState<any>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscriptionData, plansData, packagesData] = await Promise.all([
          getUserSubscription(),
          getSubscriptionPlans(),
          getTopUpPackages()
        ]);

        setSubscription(subscriptionData.subscription);
        setPlans(plansData.plans);
        setTopUpPackages(packagesData.packages);

        // Set the current plan as selected by default
        if (subscriptionData.subscription?.plan) {
          const currentPlanId = plansData.plans.find(
            p => p.name.toLowerCase() === subscriptionData.subscription.plan.toLowerCase()
          )?.id;
          if (currentPlanId) {
            setSelectedPlan(currentPlanId);
          }
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to fetch subscription data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handlePlanChange = async () => {
    if (!planToChange) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No plan selected to change to",
      });
      return;
    }

    try {
      const response = await updateSubscription({ planId: planToChange.id });
      setSubscription(response.subscription);
      toast({
        title: "Success",
        description: response.message || "Subscription updated successfully",
      });
      setConfirmPlanChangeOpen(false);
      setChangePlanOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update subscription",
      });
    }
  };

  const handleInitiatePlanChange = (plan) => {
    setPlanToChange(plan);
    setConfirmPlanChangeOpen(true);
  };

  const handleTopUpPurchase = async () => {
    if (!selectedTopUp) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a token package to continue",
      });
      return;
    }

    try {
      const response = await purchaseTopUp({ packageId: selectedTopUp });
      // Update the token count in the current subscription
      setSubscription({
        ...subscription,
        tokens: (subscription.tokens || 0) + response.tokens
      });

      toast({
        title: "Success",
        description: response.message || "Token top-up purchased successfully",
      });
      setConfirmTopUpOpen(false);
      setTopUpOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to purchase token top-up",
      });
    }
  };

  const handleContactForEnterprise = () => {
    window.open('https://pythagora.io/contact', '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number | null, currency: string = 'USD') => {
    if (amount === null) return 'Custom';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatTokens = (tokens: number | null) => {
    if (tokens === null) return 'Custom';
    if (tokens >= 1000000) {
      return `${(tokens / 1000000).toLocaleString()}M`;
    }
    return tokens.toLocaleString();
  };

  // Check if user is out of tokens
  const isOutOfTokens = subscription.tokens === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and token usage</p>
      </div>

      {isOutOfTokens && (
        <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold">You've run out of tokens!</AlertTitle>
          <AlertDescription>
            To continue building your apps, please top up your tokens or upgrade your plan.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Plan <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600">{subscription.plan} Plan</Badge></CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Price</h3>
              <p className="text-muted-foreground">
                {subscription.amount > 0 ? (
                  `${formatCurrency(subscription.amount, subscription.currency)} / month`
                ) : (
                  "Free"
                )}
              </p>
            </div>
            <Button onClick={() => setChangePlanOpen(true)}>Change Plan</Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h4 className="font-medium">Token Usage</h4>
                <p className="text-sm text-muted-foreground">
                  {formatTokens(subscription.tokens)} tokens available
                </p>
              </div>
              <Button variant="outline" onClick={() => setTopUpOpen(true)}>
                <Zap className="mr-2 h-4 w-4" />
                Top Up
              </Button>
            </div>
            <Progress
              value={(subscription.tokens / 600000) * 100}
              className="h-2"
              trackClassName="bg-[rgba(243,66,34,0.2)]"
              indicatorClassName="bg-[#F34222]"
            />
            <p className="text-xs text-muted-foreground text-right">
              {subscription.tokens} / 600,000 tokens
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Change Plan Dialog */}
      <Dialog open={changePlanOpen} onOpenChange={setChangePlanOpen}>
  <DialogContent className="sm:max-w-5xl max-h-screen my-6 overflow-y-auto p-6">
    <DialogHeader className="relative">
      <DialogTitle>Change Subscription Plan</DialogTitle>
      {/* …close button, description, etc.… */}
    </DialogHeader>

    <div className="py-4">
    {/* …inside your Change Plan DialogContent… */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
  {plans.map((plan) => {
    const isCurrent = plan.name.toLowerCase() === subscription.plan.toLowerCase();
    const isSelected = plan.id === selectedPlanId;

    return (
      <PlanCard
        key={plan.id}
        plan={plan}
        isCurrent={isCurrent}
        isSelected={isSelected}
        // Only selects the card (blue border)
        onCardClick={() => setSelectedPlanId(plan.id)}
        // Only opens confirmation when the button inside is clicked
        onActionClick={() => {
          setPlanToChange(plan);
          setConfirmPlanChangeOpen(true);
        }}
        onContactForEnterprise={handleContactForEnterprise}
      />
    );
  })}
</div>
  </div>

  </DialogContent>
</Dialog>

      {/* Plan Change Confirmation Dialog */}
      <AlertDialog open={confirmPlanChangeOpen} onOpenChange={setConfirmPlanChangeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {planToChange?.price === 0 && subscription.amount > 0
                ? "Downgrade to Free Plan"
                : `Upgrade to ${planToChange?.name} Plan`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {planToChange?.price === 0 && subscription.amount > 0
                ? "Are you sure you want to downgrade to the Free plan? You'll lose access to premium features and your current token allocation."
                : `Are you sure you want to upgrade to the ${planToChange?.name} plan? Your billing cycle will update immediately.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmPlanChangeOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePlanChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Top Up Dialog */}
      <Dialog open={topUpOpen} onOpenChange={setTopUpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Top Up Tokens</DialogTitle>
            <DialogDescription>
              Select a token package to add to your account.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topUpPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-lg border p-4 cursor-pointer transition-colors hover:border-primary ${selectedTopUp === pkg.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                    }`}
                  onClick={() => setSelectedTopUp(pkg.id)}
                >
                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {formatCurrency(pkg.price, pkg.currency)}
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      {formatTokens(pkg.tokens)} tokens
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTopUpOpen(false)}>
              Cancel
            </Button>
            <AlertDialog open={confirmTopUpOpen} onOpenChange={setConfirmTopUpOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={!selectedTopUp}
                  onClick={() => selectedTopUp && setConfirmTopUpOpen(true)}
                >
                  Continue
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Token Purchase</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to purchase this token package? Your payment method on file will be charged immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setConfirmTopUpOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleTopUpPurchase}>
                    Confirm Purchase
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}