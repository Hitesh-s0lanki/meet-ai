"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PricingCard } from "../components/pricing-card";

export const UpgradeView = () => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions()
  );
  const { data: currentSubscription } = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  );

  return (
    <div className="flex flex-col flex-1 p-4 md:px-8 gap-y-10">
      <div className="flex flex-col flex-1 items-center mt-4 gap-y-10">
        <h5 className="text-2xl font-medium md:text-3xl">
          You are on the
          <span className="text-primary font-semibold px-2">
            {currentSubscription?.name ?? "Free"}
          </span>
          plan.
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(
            ({
              result: {
                items: [product],
              },
            }) => {
              const isCurrentProduct = currentSubscription?.id === product.id;
              const isPremium = !!currentSubscription;
              let buttonText = "Upgrade";
              let onClick = () =>
                authClient.checkout({ products: [product.id] });

              if (isCurrentProduct) {
                buttonText = "Manage";
                onClick = () => authClient.customer.portal();
              } else if (isPremium) {
                buttonText = "Change Plan";
                onClick = () => authClient.customer.portal();
              }

              return (
                <PricingCard
                  key={product.id}
                  onClick={onClick}
                  title={product.name}
                  buttonText={buttonText}
                  description={product.description}
                  variant={
                    product.metadata.variant === "highlighted"
                      ? "highlighted"
                      : "default"
                  }
                  price={
                    product.prices[0].amountType === "fixed"
                      ? product.prices[0].priceAmount / 100
                      : 0
                  }
                  priceSuffix={`/${product.prices[0].recurringInterval}`}
                  features={product.benefits.map(
                    (benefit) => benefit.description
                  )}
                  badge={product.metadata.badge as string | null}
                />
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export const UpgradeViewLoader = () => {
  return (
    <LoadingState
      title="Loading..."
      description="This may take a few seconds..."
    />
  );
};

export const UpgradeViewError = () => {
  return <ErrorState title="Error" description="Please try again later." />;
};
