import { useState, useEffect } from "react";

const Header = ({
  username,
  dollars,
  levelNames,
  levelIndex,
  formatProfitPerHour,
}) => {
  return (
    <div className="bg-[#171717] top-side flex items-center w-[100%] h-100 border-2">
      <div className="container mx-auto p-4">
        <nav className="flex justify-between items-center">
          <div className="flex justify-between items-center">
            <div className="ml-4">
              <h2 className="text-white text-lg font-bold mr-4">@{username}</h2>
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
  );
};

export default Header;
