import { useState, useEffect, memo, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";

type Subscription = {
  id: string;
  name: string;
  price: number;
};

function SavingsCalculator() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: "1", name: "Project Management", price: 15 },
    { id: "2", name: "CRM", price: 25 },
  ]);
  const [seats, setSeats] = useState<number>(20);
  const [savings, setSavings] = useState<number>(0);
  const monthlyFlatFee = 250;

  const addSubscription = useCallback(() => {
    const newId = Date.now().toString();
    setSubscriptions((prev) => [...prev, { id: newId, name: "", price: 0 }]);
  }, []);

  const removeSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  }, []);

  const updateSubscription = useCallback(
    (id: string, field: "name" | "price", value: string | number) => {
      setSubscriptions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub))
      );
    },
    []
  );

  const totalMonthlyPerPerson = subscriptions.reduce(
    (total, sub) => total + sub.price,
    0,
  );
  const totalMonthly = totalMonthlyPerPerson * seats;
  const totalYearly = totalMonthly * 12;
  const yearlyFlatFeeCost = monthlyFlatFee * 12;

  useEffect(() => {
    setSavings(totalYearly - yearlyFlatFeeCost);
  }, [subscriptions, seats, totalYearly]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-primary-200">
      <h3 className="text-xl font-bold text-primary-900 mb-4">
        Software Savings Calculator
      </h3>
      <p className="text-primary-600 mb-6">
        See how much you could save with our flat monthly fee compared to having
        multiple SaaS subscriptions per team member.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-3">
            What SaaS tools do you pay for per user?
          </label>

          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex gap-3 items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={sub.name}
                    onChange={(e) =>
                      updateSubscription(sub.id, "name", e.target.value)
                    }
                    placeholder="Tool name"
                    className="w-full px-3 py-2 border border-primary-300 rounded-md text-sm"
                  />
                </div>

                <div className="w-32 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={sub.price}
                    onChange={(e) =>
                      updateSubscription(
                        sub.id,
                        "price",
                        Number(e.target.value),
                      )
                    }
                    placeholder="Price/user"
                    className="w-full pl-8 pr-3 py-2 border border-primary-300 rounded-md text-sm"
                    min="0"
                  />
                </div>

                <button
                  onClick={() => removeSubscription(sub.id)}
                  className="p-2 text-primary-400 hover:text-primary-600"
                  aria-label="Remove subscription"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addSubscription}
            className="mt-3 flex items-center text-sm text-primary-600 hover:text-primary-800"
          >
            <Plus className="h-4 w-4 mr-1" /> Add another subscription
          </button>
        </div>

        <div>
          <label
            htmlFor="seats"
            className="block text-sm font-medium text-primary-700 mb-1"
          >
            How many team members do you have?
          </label>
          <input
            type="number"
            id="seats"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="block w-full px-4 py-2 border border-primary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            min="1"
          />
        </div>
      </div>

      <div className="mt-8 bg-primary-50 p-4 rounded-lg border border-primary-200">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-primary-600">Per-user SaaS costs:</p>
            <p className="text-xl font-bold text-primary-900">
              ${totalYearly.toLocaleString()}/year
            </p>
            <p className="text-xs text-primary-500">
              ${totalMonthlyPerPerson.toLocaleString()}/user/month × {seats}{" "}
              users = ${totalMonthly.toLocaleString()}/month
            </p>
          </div>
          <div>
            <p className="text-sm text-primary-600">With our flat fee:</p>
            <p className="text-xl font-bold text-primary-900">
              ${yearlyFlatFeeCost.toLocaleString()}/year
            </p>
            <p className="text-xs text-primary-500">
              ${monthlyFlatFee}/month (unlimited users)
            </p>
            <p className="text-xs text-primary-500 mt-1">
              *One-time project fee required for initial build, then $250/month for maintenance and support.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-primary-200">
          <div className="flex justify-between items-center">
            <p className="font-medium text-primary-900">Your annual savings:</p>
            <p className="text-xl font-bold text-[#10b981]">
              {savings > 0 ? `$${savings.toLocaleString()}` : "$0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(SavingsCalculator);
