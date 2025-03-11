
import { useState, useEffect } from "react";

export default function SavingsCalculator() {
  const [seatPrice, setSeatPrice] = useState<number>(50);
  const [seats, setSeats] = useState<number>(10);
  const [savings, setSavings] = useState<number>(0);
  const monthlyFlatFee = 750;

  useEffect(() => {
    const yearlyTraditionalCost = seatPrice * seats * 12;
    const yearlyFlatFeeCost = monthlyFlatFee * 12;
    setSavings(yearlyTraditionalCost - yearlyFlatFeeCost);
  }, [seatPrice, seats]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-primary-200">
      <h3 className="text-xl font-bold text-primary-900 mb-4">Savings Calculator</h3>
      <p className="text-primary-600 mb-6">
        See how much you could save with our flat monthly fee approach compared to per-seat pricing.
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="seatPrice" className="block text-sm font-medium text-primary-700 mb-1">
            What do you pay per user per month?
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-500">$</span>
            <input
              type="number"
              id="seatPrice"
              value={seatPrice}
              onChange={(e) => setSeatPrice(Number(e.target.value))}
              className="block w-full pl-8 pr-4 py-2 border border-primary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              min="1"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="seats" className="block text-sm font-medium text-primary-700 mb-1">
            How many users do you have?
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
            <p className="text-sm text-primary-600">Your current yearly cost:</p>
            <p className="text-xl font-bold text-primary-900">${(seatPrice * seats * 12).toLocaleString()}</p>
            <p className="text-xs text-primary-500">${(seatPrice * seats).toLocaleString()}/month</p>
          </div>
          <div>
            <p className="text-sm text-primary-600">With our flat fee:</p>
            <p className="text-xl font-bold text-primary-900">${(monthlyFlatFee * 12).toLocaleString()}</p>
            <p className="text-xs text-primary-500">${monthlyFlatFee}/month</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-primary-200">
          <div className="flex justify-between items-center">
            <p className="font-medium text-primary-900">Your annual savings:</p>
            <p className="text-xl font-bold text-[#10b981]">
              {savings > 0 ? `$${savings.toLocaleString()}` : '$0'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
