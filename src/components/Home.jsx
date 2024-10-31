import { useState, useEffect } from "react";
import appLogo from "../assets/app_logo.jpg";
import dollarSignLogo from "../assets/dollar_logo.png";
import cashingSound from "../assets/cashing-sound.mp3";

const Home = ({
  first_name,
  clicks,
  profitPerClick,
  handleCardClick,
  handleAnimationEnd,
  calculateProgress,
}) => {
  const cashing = new Audio(cashingSound);

  return (
    <div className="container mx-auto p-4 app-content">
      <div className="text-center my-4">
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
      </div>
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
            +{profitPerClick}💲
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;
