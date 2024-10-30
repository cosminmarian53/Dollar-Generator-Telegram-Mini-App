import { useState, useEffect } from "react";
import appLogo from "./assets/app_logo.jpg";
import dollarSignLogo from "./assets/dollar_logo.png";
import cashingSound from "./assets/cashing-sound.mp3";
import "./App.css";

import WebApp from "@twa-dev/sdk";
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
  const pointsToAdd = 15;
  const profitPerHour = 12530;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");
  const cashing = new Audio(cashingSound);
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

    setDollars((prevDollars) => prevDollars + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
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
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setDollars((prevDollars) => prevDollars + pointsPerSecond);
    }, 1000);
    return () => clearInterval(interval);
  }, [profitPerHour]);

  useEffect(() => {
    const loadDollarsStorage = () => {
      WebApp.CloudStorage.getItem("dollars", (error, data) => {
        if (error) {
          console.error("Error loading dollars", error);
        } else if (data) {
          setDollars(parseInt(data, 10)); // Ensure the data is parsed as an integer
        }
      });
    };

    loadDollarsStorage();
  }, []);

  // Save dollars to storage whenever the dollars state changes
  useEffect(() => {
    const saveDollarsStorage = () => {
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
    };

    saveDollarsStorage();
  }, [dollars]);

  return (
    <>
      <div className="container z-0 flex items-center justify-center flex-col w-100 h-100">
        <div className="bg-[#171717] top-side flex items-center w-[100%] h-100 border-2">
          <div className="container mx-auto p-4">
            <nav className="flex justify-between items-center">
              <div className="flex justify-between items-center">
                <div className="ml-4">
                  <h2 className="text-white text-lg font-bold mr-4">
                    @{username}
                  </h2>
                </div>

                <div className="flex justify-between">
                  <p className="text-sm text-white">{levelNames[levelIndex]}</p>
                </div>
                <div className="flex ml-8">
                  <h2 className="text-white text-lg font-bold">
                    {formatProfitPerHour(dollars)}💲
                  </h2>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div className="container mx-auto p-4 app-content">
          <header className="text-center my-4">
            <img
              src={appLogo}
              className="mx-auto h-16 application-logo"
              alt="Application logo"
            />
            <h1 className="text-white text-2xl font-bold">
              🤑Welcome to Dollar Generator, {first_name}!
            </h1>
            <p className="text-white text-lg">
              Click the button below to generate as many dollars as you can!💵
            </p>
            <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
              <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                <div
                  className="progress-gradient h-2 rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </header>
          <main className="text-center">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded big-button"
              onClick={handleCardClick}
            >
              <img
                src={dollarSignLogo}
                className="h-[35px] w-[35px]"
                alt="Dollar sign"
                onClick={() => {
                  cashing.play();
                  cashing.volume = 0.3;
                }}
              />
            </button>
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
                style={{
                  top: `${click.y - 40}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-in-out`,
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                +{pointsToAdd}💲
              </div>
            ))}
          </main>
          <footer className="text-center mt-4"></footer>
        </div>
      </div>
    </>
  );
}

export default App;
