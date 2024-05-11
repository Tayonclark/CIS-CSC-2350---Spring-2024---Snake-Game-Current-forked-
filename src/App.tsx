import "./App.css";
import "./App.css";
import Snake from "./Snake";
import display from "./display";
import { useEffect } from "react";
import React from "react";

export default function App() {
  // Add Snake Tests with display below
  useEffect(() => {
    // Include your display statements to test below
    document.getElementById("output")!.innerText = "OUTPUT:\n";
    display("hey");
  }, []);
}
