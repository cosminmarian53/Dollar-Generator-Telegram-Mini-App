import { useState, useEffect } from "react";
import Header from "./components/Header";
import Upgrade from "./components/Upgrade";
import Footer from "./components/Footer";
import "./App.css";

import WebApp from "@twa-dev/sdk";
import Home from "./components/Home";
const levelNames = [
  "☠️Beggar", // From 0 to 4999 coins
  "😐Peasant", // From 5000 coins to 24,999 coins
  "😀Commoner", // From 25,000 coins to 99,999 coins
  "🍷Noble", // From 100,000 coins to 999,999 coins
  "👑King", // From 1,000,000 coins to 1,999,999 coins
  "😈Tyrant", // From 2,000,000 coins to 9,999,999 coins
  "🥶LegendaryWarlord", // From 10,000,000 coins to 50,000,000 coins
  "👹MythicalWarlord", // From 50,000,000 coins to 99,999,999 coins
  "🌕GodKing", // From 100,000,000 coins to 1,000,000,000 coins
  "👁️Genesis", // From 1,000,000,000 coins to ∞
];

const levelMinPoints = [
  0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000,
  1000000000,
];

function App() {
  const { first_name, username } = WebApp.initDataUnsafe.user;
  const [dollars, setDollars] = useState(0);
  const [levelIndex, setLevelIndex] = useState(6);
  const [clicks, setClicks] = useState([]);
  const [currentComponent, setCurrentComponent] = useState("home");
  const [profitPerClick, setProfitPerClick] = useState(6);
  const [profitPerHour, setProfitPerHour] = useState(100);
  const [upgradeCost, setUpgradeCost] = useState(100);

  const handleHomeClick = () => {
    setCurrentComponent("home");
  };

  const handleUpgradeClick = () => {
    setCurrentComponent("upgrade");
  };

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");
  const calculateTimeLeft = (targetHour) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${
      -y / 10
    }deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = "";
    }, 100);

    setDollars((prevDollars) => prevDollars + profitPerClick);
    setClicks((prevClicks) => [
      ...prevClicks,
      { id: Date.now(), x: e.pageX, y: e.pageY },
    ]);
  };

  const handleAnimationEnd = (id) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress =
      ((dollars - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (dollars >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (dollars < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [dollars, levelIndex]);

  const formatProfitPerHour = (profit) => {
    if (profit >= 1000000000000000000)
      return `+${profit / 1000000000000000000}E`;
    if (profit >= 1000000000000000)
      return `+${(profit / 1000000000000000).toFixed(2)}Q`;
    if (profit >= 1000000000000)
      return `+${(profit / 1000000000000).toFixed(2)}T`;
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  useEffect(() => {
    const pointsPerSecond = Math.floor(
      profitPerHour / 3600 + profitPerClick / 2
    );
    const interval = setInterval(() => {
      setDollars((prevDollars) => prevDollars + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  useEffect(() => {
    const loadStorage = () => {
      WebApp.CloudStorage.getItem("dollars", (error, data) => {
        if (error) {
          console.error("Error loading dollars", error);
        } else if (data) {
          setDollars(parseInt(data, 10)); // Ensure the data is parsed as an integer
        }
      });

      WebApp.CloudStorage.getItem("profitPerClick", (error, data) => {
        if (error) {
          console.error("Error loading profitPerClick", error);
        } else if (data) {
          setProfitPerClick(parseInt(data, 10)); // Ensure the data is parsed as an integer
        }
      });

      WebApp.CloudStorage.getItem("profitPerHour", (error, data) => {
        if (error) {
          console.error("Error loading profitPerHour", error);
        } else if (data) {
          setProfitPerHour(parseInt(data, 10)); // Ensure the data is parsed as an integer
        }
      });

      WebApp.CloudStorage.getItem("upgradeCost", (error, data) => {
        if (error) {
          console.error("Error loading upgradeCost", error);
        } else if (data) {
          setUpgradeCost(parseInt(data, 10)); // Ensure the data is parsed as an integer
        }
      });
    };

    loadStorage();
  }, []);

  // Save dollars to storage whenever the dollars state changes
  useEffect(() => {
    WebApp.CloudStorage.setItem(
      "dollars",
      dollars.toString(),
      (error, success) => {
        if (error) {
          console.error("Error saving dollars", error);
        } else if (success) {
          console.log("Dollars saved successfully!");
        }
      }
    );
  }, [dollars]);

  // Save profitPerClick to storage whenever the profitPerClick state changes
  useEffect(() => {
    WebApp.CloudStorage.setItem(
      "profitPerClick",
      profitPerClick.toString(),
      (error, success) => {
        if (error) {
          console.error("Error saving profitPerClick", error);
        } else if (success) {
          console.log("Profit per click saved successfully!");
        }
      }
    );
  }, [profitPerClick]);

  // Save profitPerHour to storage whenever the profitPerHour state changes
  useEffect(() => {
    WebApp.CloudStorage.setItem(
      "profitPerHour",
      profitPerHour.toString(),
      (error, success) => {
        if (error) {
          console.error("Error saving profitPerHour", error);
        } else if (success) {
          console.log("Profit per hour saved successfully!");
        }
      }
    );
  }, [profitPerHour]);

  // Save upgradeCost to storage whenever the upgradeCost state changes
  useEffect(() => {
    WebApp.CloudStorage.setItem(
      "upgradeCost",
      upgradeCost.toString(),
      (error, success) => {
        if (error) {
          console.error("Error saving upgradeCost", error);
        } else if (success) {
          console.log("Upgrade cost saved successfully!");
        }
      }
    );
  }, [upgradeCost]);

  return (
    <>
      <div className="container z-0 flex items-center justify-center flex-col w-100 h-100">
        <Header
          username={username}
          dollars={dollars}
          levelNames={levelNames}
          levelIndex={levelIndex}
          formatProfitPerHour={formatProfitPerHour}
        />
        {currentComponent === "home" ? (
          <Home
            first_name={first_name}
            clicks={clicks}
            profitPerClick={profitPerClick}
            handleCardClick={handleCardClick}
            handleAnimationEnd={handleAnimationEnd}
            calculateProgress={calculateProgress}
          />
        ) : (
          <Upgrade
            levelNames={levelNames}
            levelIndex={levelIndex}
            dollars={dollars}
            setDollars={setDollars}
            profitPerClick={profitPerClick}
            setProfitPerClick={setProfitPerClick}
            setProfitPerHour={setProfitPerHour}
            setUpgradeCost={setUpgradeCost}
            upgradeCost={upgradeCost}
            profitPerHour={profitPerHour}
            formatProfitPerHour={formatProfitPerHour}
            levelMinPoints={levelMinPoints}
          />
        )}
        <Footer
          handleHomeClick={handleHomeClick}
          handleUpgradeClick={handleUpgradeClick}
        />
      </div>
    </>
  );
}

export default App;
