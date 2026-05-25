import React, { useCallback, useEffect, useState, useRef } from "react";

const PasswordGenerator = () => {
  const [length, setLength] = useState(8);
  const [numberAllowed, setnumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%&`*()_+-=[]{}|,./?<>";
    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }
    setPassword(pass);
  }, [length, numberAllowed, charAllowed]);


  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  const copyToClipBoard = useCallback(() => {    {
    passwordRef.current?.select();
    navigator.clipboard.writeText(password);
  }
  }, [password]);

  return (
    <>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl rounded-2xl p-8 w-[520px]">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent)] mb-3 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-h)] tracking-wide">Password Generator</h1>
          <p className="text-[var(--text)] text-sm mt-1">Create a strong, secure password</p>
        </div>

        {/* Password Display */}
        <div className="flex rounded-xl overflow-hidden border border-[var(--border)] mb-5 shadow-inner bg-[var(--bg)]">
          <input
            type="text"
            value={password}
            ref={passwordRef}
            readOnly
            className="flex-1 bg-transparent text-green-400 font-mono text-sm outline-none px-4 py-3 tracking-widest"
          />
          <button
            className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent)] text-white px-5 py-3 font-semibold text-sm transition-colors duration-150 cursor-pointer"
            onClick={copyToClipBoard}
          >
            Copy
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Length Slider */}
          <div className="bg-[var(--bg)] rounded-xl px-4 py-3 border border-[var(--border)]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[var(--text-h)] text-sm font-medium">Password Length</span>
              <span className="text-[var(--accent)] font-bold text-sm bg-[var(--bg-card)] px-2 py-0.5 rounded-md">{length}</span>
            </div>
            <input
              id="range"
              name="range"
              type="range"
              min={6}
              max={40}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[var(--accent)] bg-[var(--accent)]"
            />
            <div className="flex justify-between text-[var(--text)] text-xs mt-1">
              <span>6</span>
              <span>40</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-3">
            <label
              htmlFor="number"
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                numberAllowed
                  ? "bg-[var(--bg-card)] border-[var(--accent)] text-[var(--accent)]"
                  : "bg-[var(--bg)] border-[var(--border)] text-[var(--text)]"
              }`}
            >
              <input
                id="number"
                name="number"
                type="checkbox"
                defaultChecked={numberAllowed}
                onChange={() => setnumberAllowed((prev) => !prev)}
                className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
              />
              <span className="text-sm font-medium">Numbers</span>
            </label>

            <label
              htmlFor="charactors"
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-150 ${
                charAllowed
                  ? "bg-[var(--bg-card)] border-[var(--accent)] text-[var(--accent)]"
                  : "bg-[var(--bg)] border-[var(--border)] text-[var(--text)]"
              }`}
            >
              <input
                id="charactors"
                name="charactors"
                type="checkbox"
                defaultChecked={charAllowed}
                onChange={() => setCharAllowed((prev) => !prev)}
                className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
              />
              <span className="text-sm font-medium">Symbols</span>
            </label>
          </div>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={passwordGenerator}
          className="mt-5 w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent)] text-white font-semibold py-3 rounded-xl transition-colors duration-150 cursor-pointer text-sm tracking-wide shadow-lg"
        >
          Generate New Password
        </button>
      </div>
    </>
  );
};

export default PasswordGenerator;
