
"use client"
import OCRFormReader from "./ocr-app";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div><h1><a className="color: blue;" href="/demoform.png">Click here to get Sample Form Image</a></h1>
        <hr/></div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <OCRFormReader/>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      Footer
      </footer>
    </div>
  );
}
