
import React, { useEffect } from "react";

export default function About() {

  useEffect(()=>{
    console.log("About")
  },[])
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}