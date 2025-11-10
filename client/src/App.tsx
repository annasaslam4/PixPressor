import React from "react";
import { Toaster } from "@/components/ui/toaster"; // works now with alias
import "./App.css";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">PixPressor</h1>
        <p className="text-gray-500 mb-8">
          Compress and convert your images in seconds — privacy-first, global, and free.
        </p>
        {/* Your upload UI or main component here */}
      </div>
      <Toaster />
    </>
  );
}

export default App;
