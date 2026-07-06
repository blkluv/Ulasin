import { useState, useEffect } from "react";
import { StepProps } from "../types";
import { Search, Store, Info, ArrowRight, ShieldCheck, HelpCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function InputStep({ onNext, data }: StepProps) {
  const [rawInput, setRawInput] = useState(data.url?.split("placeid=")[1] || "");
  const [businessName, setBusinessName] = useState(data.businessName || "");
  const [showTutorial, setShowTutorial] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  // Auto-validate and Extract Place ID on input change
  useEffect(() => {
    if (!rawInput.trim()) {
      setErrorMsg(null);
      setWarningMsg(null);
      return;
    }

    const input = rawInput.trim();
    setErrorMsg(null);
    setWarningMsg(null);

    // 1. Check if user pasted a full URL instead of just ID
    if (input.includes("http")) {
      // Try to extract placeid from URL parameters
      try {
        const urlObj = new URL(input);
        const placeIdParam = urlObj.searchParams.get("placeid");
        if (placeIdParam) {
          setRawInput(placeIdParam); // Auto-replace input with the extracted ID
          return;
        }

        // If it's a map link without placeid param, hard block (this is useless for our system)
        if (input.includes("maps.app.goo.gl") || input.includes("google.com/maps")) {
          setErrorMsg("Gunakan tool pencari di atas untuk mendapatkan Place ID, bukan link peta biasa.");
          return;
        }
      } catch (e) {
        // Invalid URL format
        setErrorMsg("URL tidak valid.");
        return;
      }
    }

    // 2. Loose Validation (Just Warnings, won't block submit unless it's completely illogical)
    // Most Google Place IDs start with ChIJ and are 27 chars, but we only HARD BLOCK if it's ridiculously short
    if (input.length < 10) {
      setErrorMsg("Place ID terlalu pendek. Pastikan Anda menyalin semuanya (biasanya sekitar 27 karakter).");
    } else if (!input.startsWith("ChIJ")) {
      setWarningMsg("Catatan: Place ID biasanya diawali dengan 'ChIJ'. Pastikan Anda memasukkan kode yang benar.");
    }
  }, [rawInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // JS Logic Validation
    const finalPlaceId = rawInput.trim();
    const finalName = businessName.trim();

    if (!finalPlaceId || !finalName) {
      setErrorMsg("Nama usaha dan Place ID tidak boleh kosong.");
      return;
    }

    if (errorMsg) {
      return; // Stop ONLY if there's a hard error
    }

    // Generate the magical review URL
    const finalUrl = `https://search.google.com/local/writereview?placeid=${finalPlaceId}`;
    onNext({ url: finalUrl, businessName: finalName });
  };

  // Determine if button should be disabled (Warnings don't disable the button!)
  const isSubmitDisabled = !rawInput.trim() || !businessName.trim() || errorMsg !== null;

  return (
    <div className="w-full max-w-2xl py-4 md:py-8">
      {/* FORMULIR UTAMA */}
      <div className="bg-white border-4 border-[#0F0F0F] shadow-hard-lg p-6 md:p-10 relative">
        <div className="absolute top-0 right-0 bg-[#0F0F0F] text-white font-mono text-xs font-bold px-3 py-1 uppercase">
          Langkah 01 / Data Usaha
        </div>

        <div className="mb-8 text-left border-b-2 border-[#0F0F0F] pb-4">
          <h2 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-tight">
            Siapkan Mesin Penarik Ulasan Anda
          </h2>
          <p className="text-gray-600 font-medium text-sm mt-2 leading-relaxed">
            Hanya butuh waktu kurang dari semenit. Masukkan nama usaha dan <strong>Place ID Google Maps</strong> Anda di bawah ini agar QR Code langsung membuka popup ulasan bintang 5.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left mb-8">
          {/* FIELD 1 */}
          <div className="space-y-2">
            <label className="font-display font-bold text-sm uppercase flex items-center gap-2">
              <Store className="w-4 h-4" /> 1. Nama Usaha / Toko Anda
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Contoh: Kopi Senja Nusantara"
              maxLength={60}
              className="w-full bg-white border-2 border-[#0F0F0F] p-3.5 text-base md:text-lg font-bold focus:bg-[#F4F4F0] focus:outline-none focus:ring-2 focus:ring-[#FF4500] transition-colors placeholder:text-gray-400 placeholder:font-normal font-sans"
              required
            />
          </div>

          {/* FIELD 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-display font-bold text-sm uppercase flex items-center gap-2">
                <Search className="w-4 h-4" /> 2. Masukkan Place ID
              </label>
              <button
                type="button"
                onClick={() => setShowTutorial(!showTutorial)}
                className="text-[var(--color-accent)] hover:text-[var(--color-ink)] font-bold text-xs uppercase flex items-center gap-1 transition-colors underline decoration-2 underline-offset-2 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Cara Mencari Place ID?
              </button>
            </div>

            <input
              type="text"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Contoh: ChIJxxxxxxxxxxxxxxxx"
              maxLength={200}
              className={`w-full bg-white border-2 p-3.5 text-sm md:text-base font-mono font-bold focus:outline-none focus:ring-2 transition-colors placeholder:text-gray-400 placeholder:font-normal
                ${errorMsg ? 'border-red-500 focus:bg-red-50 focus:ring-red-500/20 text-red-700' : 'border-[#0F0F0F] focus:bg-[#F4F4F0] focus:ring-[#FF4500] text-[#0F0F0F]'}`}
              required
            />

            {/* ERROR FEEDBACK */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-600 font-medium text-xs flex items-start gap-1.5 mt-2"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </motion.div>
              )}
              {warningMsg && !errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-amber-600 font-medium text-xs flex items-start gap-1.5 mt-2 bg-amber-50 p-2 border border-amber-200"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{warningMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-gray-300 disabled:border-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-display font-bold text-xl py-4 border-2 border-[#0F0F0F] shadow-hard hover:shadow-hard-hover transition-all flex items-center justify-center gap-2 uppercase cursor-pointer"
            >
              <span>GENERATE DESAIN SIAP CETAK</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>

        {/* TUTORIAL DROPDOWN (BAGAIMANA CARA MENCARI PLACE ID) */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#FFFDE6] border-2 border-[#0F0F0F] p-5 text-sm shadow-[4px_4px_0px_0px_#0F0F0F]">
                <div className="flex items-center gap-2 font-bold font-display uppercase mb-3 text-[#0F0F0F] border-b-2 border-[#0F0F0F] pb-2">
                  <Info className="w-5 h-5 text-[var(--color-accent)]" /> 3 Langkah Mudah Mencari Place ID (Gratis)
                </div>

                <p className="text-gray-700 font-medium mb-4 text-xs md:text-sm">
                  Place ID adalah kode unik dari Google. Jika menggunakan ini, pelanggan yang men-scan akan <strong>langsung diarahkan ke pop-up pemberian bintang (tanpa perlu menekan tombol apa pun lagi).</strong>
                </p>

                <ol className="list-decimal pl-5 space-y-3 text-gray-800 font-medium text-xs md:text-sm">
                  <li>Buka website gratis: <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline hover:text-[var(--color-accent)]">Google Place ID Finder</a></li>
                  <li>Ketik nama toko / bisnis Anda di kotak pencarian peta tersebut.</li>
                  <li>
                    Pilih toko Anda. Sebuah balon informasi akan muncul di peta. <strong>Salin teks yang muncul setelah tulisan "Place ID"</strong> (biasanya dimulai dengan huruf <code className="bg-white font-mono px-1 py-0.5 border border-[#0F0F0F]">ChIJ...</code>).

                    {/* GAMBAR CONTOH PLACE ID - DIBAGI 2 BAGIAN UNTUK RESPONSIVITAS MOBILE */}
                    <div className="mt-4 flex flex-col gap-3 w-full max-w-[400px] md:max-w-[480px]">
                      <img src="/placeid-bagian1.webp" alt="Langkah 1: Cari Nama Toko" className="w-full h-auto block drop-shadow-sm rounded-md" />
                      <img src="/placeid-bagian2.webp" alt="Langkah 2: Salin Place ID" className="w-full h-auto block drop-shadow-sm rounded-md" />
                    </div>
                  </li>
                </ol>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>Privasi Terjamin &bull; Diproses Secara Lokal</span>
      </div>
    </div>
  );
}
