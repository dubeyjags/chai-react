import React, { useId } from 'react'

function CurrencyBox({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions=[],
    selectCurrency='usd',
    amountDisabled = false,
    currencyDisabled = false,
    className = "",
}) {
    const amountInputId = useId();


    return (
        <div
            className={`p-4 rounded-xl text-sm flex bg-[var(--bg)] border border-[var(--border)] ${className}`}
        >
            <div className="w-1/2">
                <label
                    htmlFor={amountInputId}
                    className="text-[var(--text)] text-xs font-medium mb-1 inline-block uppercase tracking-wider"
                >
                    {label}
                </label>
                <input
                    id={amountInputId}
                    className="outline-none w-full bg-transparent py-1 text-[var(--text-h)] text-lg font-semibold placeholder:text-[var(--text)]"
                    type="number"
                    placeholder="0"
                    disabled={amountDisabled}
                    value={amount}
                    onChange={(e) => onAmountChange && onAmountChange(Number(e.target.value))}
                />
            </div>
            <div className="w-1/2 flex flex-col items-end justify-between">
                <p className="text-[var(--text)] text-xs font-medium uppercase tracking-wider mb-1">Currency</p>
                <select
                    id={`amountInputId_${amountInputId}`}
                    className="rounded-lg px-2 py-1.5 text-[var(--text-h)] bg-[var(--bg-card)] border border-[var(--border)] text-sm font-semibold cursor-pointer outline-none uppercase"
                    value={selectCurrency}
                    onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
                    disabled={currencyDisabled}
                >
                    {currencyOptions.map((option) => (
                        <option key={option} value={option} style={{ background: "var(--bg)", color: "var(--text-h)" }}>
                            {option.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default CurrencyBox;
