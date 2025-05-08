"use client";
import { IResult } from "@/services/backtest/result";
import React, { createContext, useContext, useState } from "react";

const ResultContext = createContext<{
  result: IResult | null;
  setResult: (result: IResult | null) => void;
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
  const [result, setResult] = useState<IResult | null>(null);
  return (
    <ResultContext.Provider value={{ result, setResult }}>
      {props.children}
    </ResultContext.Provider>
  );
};

export default BacktestContext;
