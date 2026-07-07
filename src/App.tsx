import { useState } from "react";
import { WelcomeStep } from "./components/WelcomeStep";
import { InputStep } from "./components/InputStep";
import { QRCodeStep } from "./components/QRCodeStep";
import { QRCodeData } from "./types";
import { ArrowLeft, Printer, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<QRCodeData>>({});

  const handleNext = (stepData?: Partial<QRCodeData>) => {
    if (stepData) {
      setData((prev) => ({ ...prev, ...stepData }));
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleLogoClick = () => {
    if (step > 0) {
      const confirmReset = window.confirm("Do you want to go back to the home page? Any data you've added will be lost and not saved.");
      if (confirmReset) {
        setData({}); // Reset data
        setStep(0);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={handleNext} data={data} />;
      case 1:
        return <InputStep onNext={handleNext} data={data} />;
      case 2:
        return <QRCodeStep onNext={handleNext} onPrev={handlePrev} data={data} />;
      default:
        return <WelcomeStep onNext={handleNext} data={data} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col font-sans selection:bg-[var(--color-accent)] selection:text-white">
      {/* UTILITY HEADER */}
      <header className="w-full bg-[var(--color-paper)] border-b-2 border-[#0F0F0F] px-4 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">

          {/* LOGO & BRANDING */}
          <div className="flex items-center gap-3">
            {step > 0 && step < 2 && (
              <button
                onClick={handlePrev}
                className="p-2 bg-white border-2 border-[#0F0F0F] shadow-hard hover:shadow-hard-hover font-bold flex items-center justify-center transition-all cursor-pointer"
                aria-label="Back to previous step"
              >
                <ArrowLeft className="w-5 h-5 text-[#0F0F0F]" />
              </button>
            )}

            <div className="flex items-center cursor-pointer group" onClick={handleLogoClick}>
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-[#0F0F0F] border-2 border-[#0F0F0F] shadow-hard flex items-center justify-center group-hover:bg-[var(--color-accent)] transition-colors">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              {/* Brand Name */}
              <div className="flex flex-col ml-3 pl-3 border-l-2 border-[#0F0F0F]">
                <h1 className="font-display font-extrabold text-sm md:text-base leading-none uppercase tracking-wide text-[#0F0F0F]">
                  QR Maps Review
                </h1>
                <p className="font-mono text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                  Free Print Generator
                </p>
              </div>
            </div>
          </div>

          {/* STEPPER BADGE & PRINTER STATUS */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 border-2 border-[#0F0F0F] shadow-[2px_2px_0px_0px_#0F0F0F]">
              <Printer className="w-3.5 h-3.5 text-[var(--color-accent)] animate-pulse" />
              <span className="font-mono font-bold text-[10px] uppercase text-gray-700 tracking-wider">
                Ready to Print
              </span>
            </div>

            {step > 0 && step <= 2 && (
              <div className="flex items-center gap-2 font-mono text-xs md:text-sm font-bold bg-white border-2 border-[#0F0F0F] px-3 py-1.5 shadow-hard">
                <span className="text-[var(--color-accent)]">STEP {step}</span>
                <span className="text-gray-400">/</span>
                <span className="text-[#0F0F0F]">2</span>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-12 flex flex-col items-center justify-center overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full flex justify-center my-auto"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t-2 border-[#0F0F0F] py-6 px-4 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs font-mono font-medium text-[#0F0F0F] gap-4 text-center md:text-left">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm">QR MAPS REVIEW &copy; {new Date().getFullYear()}</span>
            <span className="text-gray-500">Free tool for SMEs to boost their digital reputation.</span>
          </div>

          <div className="flex items-center gap-2 font-bold justify-center">
            <span className="bg-[var(--color-accent)] text-white px-2 py-1 uppercase tracking-widest text-[10px] border border-[#0F0F0F]">
              #LevelUp
            </span>
            <span className="bg-[#0F0F0F] text-white px-2 py-1 uppercase tracking-widest text-[10px] border border-[#0F0F0F]">
              No Server Fees
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}