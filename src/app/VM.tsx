"use client";
import React, { useState, useEffect } from "react";
import { Coins, DollarSign } from "lucide-react";

const products = [
  { id: "A1", name: "Cola", price: 1.5 },
  { id: "A2", name: "Chips", price: 1.0 },
  { id: "A3", name: "Candy", price: 0.75 },
];

type MachineState =
  | "IDLE"
  | "PRODUCT_SELECTED"
  | "PAYMENT_PENDING"
  | "DISPENSING"
  | "CHANGE_RETURN";

export function VendingMachine() {
  const [state, setState] = useState<MachineState>("IDLE");
  const [display, setDisplay] = useState<string>("Select a product");
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[0] | null
  >(null);
  const [insertedMoney, setInsertedMoney] = useState<number>(0);
  const [dispensedProduct, setDispensedProduct] = useState<string | null>(null);

  useEffect(() => {
    if (state === "DISPENSING") {
      setTimeout(() => {
        setDispensedProduct(selectedProduct?.name ?? null);
        setState("CHANGE_RETURN");
      }, 2000);
    } else if (state === "CHANGE_RETURN") {
      setTimeout(() => {
        const change = insertedMoney - (selectedProduct?.price ?? 0);
        setDisplay(`Change: $${change.toFixed(2)}`);
        setTimeout(() => {
          setState("IDLE");
          setDisplay("Select a product");
          setSelectedProduct(null);
          setInsertedMoney(0);
          setDispensedProduct(null);
        }, 3000);
      }, 2000);
    }
  }, [state, selectedProduct, insertedMoney]);

  const handleProductSelection = (product: (typeof products)[0]) => {
    if (state === "IDLE") {
      setSelectedProduct(product);
      setDisplay(`${product.name}: $${product.price.toFixed(2)}`);
      setState("PRODUCT_SELECTED");
    }
  };

  const handleMoneyInsertion = (amount: number) => {
    if (state === "PRODUCT_SELECTED" || state === "PAYMENT_PENDING") {
      const newTotal = insertedMoney + amount;
      setInsertedMoney(newTotal);
      setState("PAYMENT_PENDING");
      if (selectedProduct && newTotal >= selectedProduct.price) {
        setDisplay("Processing...");
        setState("DISPENSING");
      } else {
        setDisplay(`Inserted: $${newTotal.toFixed(2)}`);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="relative w-80">
        <div className="absolute -top-8 left-0 right-0 text-center">
          <span className="inline-block -skew-x-12 transform rounded-t-lg bg-yellow-400 px-4 py-2 text-2xl font-bold text-black">
            Snack-O-Matic
          </span>
        </div>
        <div className="w-full rounded-lg bg-blue-500 p-6 pt-10 shadow-lg">
          <div className="mb-4 flex h-16 items-center justify-center rounded bg-white p-4">
            <p className="text-center text-xl font-bold">{display}</p>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductSelection(product)}
                className="rounded bg-yellow-400 px-4 py-2 text-black transition-colors hover:bg-yellow-500"
              >
                {product.id}
              </button>
            ))}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleMoneyInsertion(1)}
              className="flex items-center justify-center rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
            >
              <DollarSign className="mr-2" size={18} />
              $1
            </button>
            <button
              onClick={() => handleMoneyInsertion(0.25)}
              className="flex items-center justify-center rounded bg-gray-300 px-4 py-2 text-black transition-colors hover:bg-gray-400"
            >
              <Coins className="mr-2" size={18} />
              25¢
            </button>
          </div>
          <div className="flex h-24 items-center justify-center rounded bg-gray-200 p-4">
            {dispensedProduct ? (
              <p className="text-lg font-semibold">
                Dispensed: {dispensedProduct}
              </p>
            ) : (
              <p className="text-gray-500">Product will be dispensed here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
