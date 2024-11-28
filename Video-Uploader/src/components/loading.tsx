import React from "react";
import { Avatar } from "./ui/avatar";
import logo from "../assets/contentstack.png";

export function Loading() {
  return (
    <div className={`flex gap-3 p-4 `}>
      <Avatar src={logo} alt="Bot Avatar" fallback="CS" />
      <div
        className={`max-w-[80%] space-y-2 items-start
      `}
      >
        <div
          className={`rounded-lg p-3 bg-gray-100 text-gray-900
        `}
        >
          <div className="loader-animation"></div>
        </div>
      </div>
    </div>
  );
}
