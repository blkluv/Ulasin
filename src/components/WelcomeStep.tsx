import { useState, useEffect } from "react";
import { StepProps } from "../types";
import { QrCode, Star, TrendingUp, ArrowRight, MousePointerClick, CheckCircle2, MessageSquareHeart, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function WelcomeStep({ onNext }: StepProps) {
  // State for card swapping
  const [activeMockup, setActiveMockup] = useState<"akrilik" | "stiker">("akrilik");

  // Auto-swap effect every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMockup((prev) => (prev === "akrilik" ? "stiker" : "akrilik"));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }
  };

  return (
    <div className="w-full max-w-4xl py-6 md:py-10">
      {/* HERO SECTION */}
      <div className="border-2 border-[var(--color-ink)] bg-white shadow-hard-lg mb-12 p-6 md:p-12 relative">
        {/* Background Accent Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0Y4RjlGNiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50 z-0"></div>

        <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">

          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-[var(--color-accent)] text-white px-3 py-1 font-mono font-bold text-xs uppercase border-2 border-[var(--color-ink)] shadow-[2px_2px_0px_0px_var(--color-ink)]">
              <Zap className="w-4 h-4" /> Generator QR Siap Cetak 100% Gratis
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-5xl font-display font-extrabold text-[var(--color-ink)] leading-[1.15] uppercase tracking-tight">
              <span className="whitespace-nowrap">Cetak QR Code</span><br/>
              <span className="text-white bg-[var(--color-ink)] px-2 leading-snug inline-block mt-1">Ulasan Maps</span>
            </h1>

            <p className="text-sm md:text-base text-gray-800 font-medium max-w-xl leading-relaxed border-l-4 border-[var(--color-accent)] pl-4">
              <strong>Ubah setiap transaksi kasir menjadi ulasan Bintang 5.</strong> Tanpa perlu mengetik nama toko. Satu scan dari ponsel pembeli akan langsung membuka halaman penilaian Google Anda dalam 2 detik.
            </p>

            <button
              onClick={() => onNext()}
              className="mt-4 inline-flex items-center gap-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-display font-bold text-lg md:text-xl px-6 md:px-8 py-4 border-2 border-[var(--color-ink)] shadow-hard hover:shadow-hard-hover transition-all cursor-pointer group w-full sm:w-auto justify-center relative z-20"
            >
              BUAT DESAIN SEKARANG
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* MOCKUP SHOWCASE - AUTO SWAP CARDS */}
          <div className="flex relative justify-center items-center w-full min-h-[360px] md:min-h-[460px] lg:w-[400px] mt-6 lg:mt-0 max-w-full pt-8 pb-4">

            {/* Stiker Gerobak Mockup */}
            <motion.div
              animate={{
                rotate: activeMockup === "stiker" ? -2 : 6,
                scale: activeMockup === "stiker" ? 1.05 : 0.9,
                zIndex: activeMockup === "stiker" ? 20 : 10,
                x: activeMockup === "stiker" ? 0 : 25,
                y: activeMockup === "stiker" ? 0 : 20,
                opacity: activeMockup === "stiker" ? 1 : 0.8,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className="absolute w-[200px] sm:w-56 md:w-72 aspect-[3/4] bg-white border-2 border-[var(--color-ink)] shadow-hard-lg overflow-hidden"
            >
              <img src="/stiker-gerobak.webp" alt="Stiker di Kaca Toko" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-[var(--color-ink)] text-white font-mono text-[10px] md:text-xs py-2 px-2 font-bold text-center border-t-2 border-[var(--color-ink)] uppercase">
                Stiker Kaca / Meja
              </div>
            </motion.div>

            {/* Akrilik Kasir Mockup */}
            <motion.div
              animate={{
                rotate: activeMockup === "akrilik" ? -2 : -8,
                scale: activeMockup === "akrilik" ? 1.05 : 0.9,
                zIndex: activeMockup === "akrilik" ? 20 : 10,
                x: activeMockup === "akrilik" ? 0 : -25,
                y: activeMockup === "akrilik" ? 0 : 20,
                opacity: activeMockup === "akrilik" ? 1 : 0.8,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
              className="absolute w-[200px] sm:w-56 md:w-72 aspect-[3/4] bg-white border-2 border-[var(--color-ink)] shadow-hard-lg overflow-hidden"
            >
              <img src="/akrilik-kasir.webp" alt="Stand Akrilik Meja Kasir" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 inset-x-0 bg-[var(--color-accent)] text-white font-mono text-[10px] md:text-xs py-2 px-2 font-bold text-center border-t-2 border-[var(--color-ink)] uppercase">
                Stand Akrilik Kasir
              </div>
            </motion.div>

            {/* Badge Siap Cetak (Attached closer to the visual cards) */}
            <motion.div
              animate={{
                y: [0, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-8 sm:top-2 left-[10%] sm:left-[20%] lg:-left-6 bg-yellow-300 text-[var(--color-ink)] font-mono font-extrabold text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1.5 border-2 border-[var(--color-ink)] -rotate-12 z-30 shadow-[2px_2px_0px_0px_var(--color-ink)] pointer-events-none"
            >
              ⭐ SIAP PRINT!
            </motion.div>
          </div>

        </div>
      </div>

      {/* FEATURES GRID - BAHASA AWAM YANG MUDAH DIPAHAMI */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-6 mb-16"
      >
        <motion.div variants={item} className="bg-white p-6 border-2 border-[var(--color-ink)] shadow-hard flex flex-col h-full">
          <div className="w-10 h-10 bg-blue-50 border-2 border-[var(--color-ink)] flex items-center justify-center mb-4">
            <MousePointerClick className="w-5 h-5 text-[var(--color-ink)]" />
          </div>
          <h3 className="font-display font-bold text-xl uppercase mb-2">Langsung Terbuka Tanpa Repot</h3>
          <p className="text-gray-600 font-medium text-sm leading-relaxed mt-auto">
            Jangan biarkan pembeli nyasar atau salah pilih toko lain saat mencari nama usaha Anda. Satu scan langsung membuka kolom ulasan Anda.
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-[var(--color-ink)] text-white p-6 border-2 border-[var(--color-ink)] shadow-hard flex flex-col h-full relative">
          <div className="absolute top-4 right-4 text-[var(--color-accent)] font-mono font-bold">02</div>
          <div className="w-10 h-10 bg-[var(--color-accent)] border-2 border-[var(--color-ink)] flex items-center justify-center mb-4">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-display font-bold text-xl uppercase mb-2">Siap Print & Pajang</h3>
          <p className="text-gray-300 font-medium text-sm leading-relaxed mt-auto">
            Didesain pas untuk stand akrilik kasir (A4/A5) dan stiker meja tahan air. Tinggal unduh, cetak, dan letakkan di tempat yang mudah dilihat.
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 border-2 border-[var(--color-ink)] shadow-hard flex flex-col h-full">
          <div className="w-10 h-10 bg-green-50 border-2 border-[var(--color-ink)] flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--color-ink)]" />
          </div>
          <h3 className="font-display font-bold text-xl uppercase mb-2">Tampil Paling Atas</h3>
          <p className="text-gray-600 font-medium text-sm leading-relaxed mt-auto">
            8 dari 10 pembeli baru memilih toko dengan rating tertinggi. Kumpulkan banyak ulasan bintang 5 agar toko Anda selalu disarankan nomor satu oleh Google.
          </p>
        </motion.div>
      </motion.div>

      {/* WHY SECTION / EDUKASI - BAHASA MEMBUMI */}
      <div className="bg-white border-2 border-[var(--color-ink)] shadow-hard-lg overflow-hidden">

        <div className="bg-[#FFFDE6] border-b-2 border-[var(--color-ink)] p-4 flex items-center gap-3">
          <MessageSquareHeart className="w-6 h-6 text-yellow-600 shrink-0" />
          <h2 className="font-display font-extrabold text-xl md:text-2xl uppercase tracking-wide text-left">
            Mengapa Ulasan Google Maps Sangat Penting Bagi Usaha Anda?
          </h2>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">

          <div className="space-y-6 text-left">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-blue-100 border-2 border-[var(--color-ink)] flex items-center justify-center mt-0.5 font-mono font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="font-display font-bold text-base md:text-lg uppercase mb-1">Dapat Rekomendasi AI (ChatGPT / Gemini)</h4>
                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                  Sekarang banyak orang bertanya ke AI seperti <em>"Cafe nyaman terdekat di sini"</em>. AI hanya akan menyarankan tempat yang memiliki <strong>rating 4.5 ke atas dan banyak ulasannya</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-green-100 border-2 border-[var(--color-ink)] flex items-center justify-center mt-0.5 font-mono font-bold text-sm">
                2
              </div>
              <div>
                <h4 className="font-display font-bold text-base md:text-lg uppercase mb-1">Muncul Di Urutan Teratas Pencarian</h4>
                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                  Google sangat menyukai toko yang rajin mendapat ulasan baru. Toko yang bintangnya banyak akan selalu <strong>dimunculkan di urutan paling atas (3 Teratas)</strong> saat seseorang mencari di Google Maps.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 shrink-0 bg-rose-100 border-2 border-[var(--color-ink)] flex items-center justify-center mt-0.5 font-mono font-bold text-sm">
                3
              </div>
              <div>
                <h4 className="font-display font-bold text-base md:text-lg uppercase mb-1">Bikin Pembeli Baru Makin Percaya</h4>
                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                  Calon pelanggan baru pasti membaca komentar orang lain sebelum mampir. Testimoni jujur dari pelanggan yang puas adalah <strong>cara termudah untuk meyakinkan pembeli baru agar datang ke toko Anda</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* SHOWCASE AKRILIK MEJA DI BAGIAN BAWAH */}
          <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-4 flex flex-col items-center justify-center relative shadow-inner h-full min-h-[280px]">
            <div className="absolute top-2 left-2 flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400 border border-[var(--color-ink)]"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 border border-[var(--color-ink)]"></div>
              <div className="w-3 h-3 rounded-full bg-green-400 border border-[var(--color-ink)]"></div>
            </div>
            <div className="w-full max-w-[220px] aspect-[3/4] my-4 overflow-hidden border-2 border-[var(--color-ink)] shadow-hard bg-white">
              <img src="/akrilir meja.webp" alt="Contoh Stand Akrilik" className="w-full h-full object-cover" />
            </div>
            <div className="mt-auto text-center w-full">
              <p className="font-mono font-bold text-[11px] bg-[var(--color-ink)] text-white py-1.5 px-2 uppercase tracking-wider block">
                PAJANG DI KASIR ATAU MEJA
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
