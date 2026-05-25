import React, { useState } from "react";
import CurrencyBox from "./CurrencyBox";
import useCurrencyConvertor from "../../hooks/useCurrencyInfo";

const CurrencyConvertor = () => {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [convertedAmount, setConvertedAmount] = useState(0);

  const currencyConvertor = useCurrencyConvertor(from);

  const options = currencyConvertor ? Object.keys(currencyConvertor) : [];


  const swap = () => {
    setFrom(to);
    setTo(from);
    setConvertedAmount(amount);
    setAmount(convertedAmount);
  };

  const convert = () => {
    setConvertedAmount(amount * currencyConvertor[to]);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[var(--bg)] text-[var(--text-h)]">
      <div className="w-full max-w-md mx-4 relative">
        {/* heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-h)] tracking-wide">
            💱 Currency Converter
          </h1>
          <p className="text-[var(--text)] text-sm mt-1">
            Real-time exchange rates
          </p>
        </div>

        {/* card */}
        <div
          className="rounded-2xl p-6 shadow-2xl bg-[var(--bg-card)]"
          style={{
            backdropFilter: "blur(20px)",
            border: "1px solid var(--border)",
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert();
            }}
          >
            <div className="w-full mb-2">
              <CurrencyBox
                label="From"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
                onAmountChange={(amount) => setAmount(amount)}
              />
            </div>

            {/* swap divider */}
            <div className="relative w-full flex items-center justify-center my-4">
              <div className="absolute w-full h-px bg-[var(--border)]" />
              <button
                type="button"
                onClick={swap}
                className="relative z-10 flex items-center gap-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              >
                ⇅ Swap
              </button>
            </div>

            <div className="w-full mb-5">
              <CurrencyBox
                label="To"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setTo(currency)}
                selectCurrency={to}
                amountDisabled
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white text-sm tracking-wide shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
            >
              Convert {amount} {from.toUpperCase()} → {to.toUpperCase()}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConvertor;
