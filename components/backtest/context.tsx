"use client";
import { BacktestResult } from "@/services/backtest/account";
import React, { createContext, useContext, useState } from "react";

const ResultContext = createContext<{
  result: BacktestResult | null;
  setResult: (result: BacktestResult | null) => void;
}>({
  result: null,
  setResult: (result) => {},
});

export const useBacktestResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useBacktestResult must be used within a BacktestProvider");
  }
  return context;
};

const BacktestContext: React.FC<React.PropsWithChildren> = (props) => {
  const [result, setResult] = useState<BacktestResult | null>(null);
  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {props.children}
    </ResultContext.Provider>
  );
};

export default BacktestContext;
