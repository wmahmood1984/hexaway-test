import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { readName } from "../slices/contractSlice";
import { useAppKitAccount } from "@reown/appkit/react";

const CountdownTimer = ({ durationInSeconds }) => {
  const dispatch = useDispatch();
  const { address } = useAppKitAccount();

  const [timeLeft, setTimeLeft] = useState(Math.max(0, durationInSeconds));
  const intervalRef = useRef(null);

  // Store expiry timestamp for reference
  const expiryTimestamp = useRef(Date.now() + durationInSeconds * 1000);

  useEffect(() => {
    // Reset timer when duration changes
    setTimeLeft(Math.max(0, durationInSeconds));
    expiryTimestamp.current = Date.now() + durationInSeconds * 1000;

    if (durationInSeconds <= 0) {
      dispatch(readName({ address }));
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          dispatch(readName({ address }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [durationInSeconds, address, dispatch]);

  // Calculate time parts
  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = Math.floor(timeLeft % 60);

  // Format expiry date nicely
  const expiryDate = new Date(expiryTimestamp.current).toLocaleString();

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8">
      <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl border border-blue-200">
        <div className="text-center mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">
            ⏰ Package Expiry Countdown
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Time remaining for your current package
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Days", value: days },
            { label: "Hours", value: String(hours).padStart(2, "0") },
            { label: "Minutes", value: String(minutes).padStart(2, "0") },
            { label: "Seconds", value: String(seconds).padStart(2, "0") },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-3 sm:p-4 bg-white/70 rounded-lg border border-blue-100"
            >
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {item.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-xs sm:text-sm text-gray-500">
          Package expires on:{" "}
          <span className="font-medium text-gray-700">{expiryDate}</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
