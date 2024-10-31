import { useEffect } from "react";
import "../App.css";

const Upgrade = ({
  levelNames,
  levelIndex,
  dollars,
  setDollars,
  profitPerClick,
  setProfitPerClick,
  setProfitPerHour,
  setUpgradeCost,
  upgradeCost,
  profitPerHour,
  formatProfitPerHour,
}) => {
  const upgrade = () => {
    if (dollars >= upgradeCost) {
      setDollars((prevDollars) => prevDollars - upgradeCost);
      setUpgradeCost((prevCost) => prevCost + 100);
      setProfitPerClick((prevProfit) => prevProfit + 2);
      setProfitPerHour((prevProfit) => prevProfit + 100);
    }
  };

  const formatUpgradeCost = (profit) => {
    if (profit >= 1000000000000000000)
      return `${profit / 1000000000000000000}E`;
    if (profit >= 1000000000000000)
      return `${(profit / 1000000000000000).toFixed(2)}Q`;
    if (profit >= 1000000000000)
      return `${(profit / 1000000000000).toFixed(2)}T`;
    if (profit >= 1000000000) return `${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `${(profit / 1000).toFixed(2)}K`;
    return `${profit}`;
  };

  return (
    <div className="bg-[#171717] mb-6 mt-6 flex items-center w-[100%] h-100 border-2">
      <div className="container mx-auto p-4">
        <div className="flex flex-col justify-center items-center space-y-4">
          <div className="flex justify-center w-full">
            <h2 className="text-white text-lg font-bold">Upgrade</h2>
          </div>
          <div className="flex flex-col items-center w-full">
            <p className="text-sm text-white">
              Current level: {levelNames[levelIndex]}
            </p>
            <p className="text-sm text-white">
              <br />
              <span>Next level:</span> {levelNames[levelIndex + 1]}
            </p>
          </div>
          <div className="flex flex-col items-center w-full">
            <p className="text-sm text-white">
              Profit per click: {profitPerClick}💲
            </p>
          </div>
          <div className="flex flex-col items-center w-full">
            <p className="text-sm text-white">
              Profit per hour: {formatProfitPerHour(profitPerHour)}💲
            </p>
          </div>
          <div className="flex justify-center w-full">
            <button
              className="bg-[#f1c40f] text-black px-4 py-2 rounded-lg"
              onClick={upgrade}
            >
              Upgrade for {formatUpgradeCost(upgradeCost)}💲
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
