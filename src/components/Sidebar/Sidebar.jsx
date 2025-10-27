import React, { useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers"; // for balance conversion

export default function Sidebar({ active, setActive, user }) {
  const { address, provider } = useAppKitAccount();
  const [balance, setBalance] = useState(null);

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "packages", label: "Packages" },
    { key: "income", label: "Income" },
    { key: "referrals", label: "Referrals" },
    { key: "community", label: "Community" },
  ];

 
  useEffect(() => {
    const getBalance = async () => {
      if (address && provider) {
        try {
          const rawBalance = await provider.getBalance(address);
          const ethValue = ethers.utils.formatEther(rawBalance);
          setBalance(parseFloat(ethValue).toFixed(4)); // 4 decimal places
        } catch (err) {
          console.error("Error fetching balance:", err);
          setBalance(null);
        }
      }
    };
    getBalance();
  }, [address, provider]);

  const shortenAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <aside className="w-72 sidebarclr border-r hidden md:flex flex-col p-6 sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-6 sidelogotype">
        {/* Optional Logo */}
        {/* <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
          MV
        </div> */}

        <div>
          <h3 className="text-lg font-semibold">MagicVerse</h3>
          {address ? (
            <p className="text-xs text-slate-500">
              {shortenAddress(address)}{" "}
              {balance !== null && (
                <span className="text-slate-400">({balance} BNB)</span>
              )}
            </p>
          ) : (
            <p className="text-xs text-red-500">Wallet not connected</p>
          )}
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2 listcstmbtns">
          {menuItems.map((t) => (
            <li key={t.key}>
              <button
                onClick={() => setActive(t.key)}
                className={`sidebar-btn ${active === t.key ? "active" : ""}`}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
        <div className="text-xs text-slate-500">User ID</div>
        <div className="font-semibold">{user?.id || "N/A"}</div>
      </div>
    </aside>
  );
}
