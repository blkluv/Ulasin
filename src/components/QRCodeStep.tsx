import { useRef, useState, useEffect } from "react";
import { StepProps } from "../types";
import { QRCodeSVG } from "qrcode.react";
import { Download, RefreshCcw, Image as ImageIcon, LayoutGrid, Info, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function QRCodeStep({ data, onPrev }: StepProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [templateType, setTemplateType] = useState<"poster" | "square">("poster");

  // Function to draw the complete design on a canvas using a template image
  const generateCanvas = (): Promise<HTMLCanvasElement | null> => {
    return new Promise((resolve) => {
      if (!qrRef.current) return resolve(null);
      const svg = qrRef.current.querySelector("svg");
      if (!svg) return resolve(null);

      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      // Setup parameters based on chosen template
      let bgSrc = "/template.jpg";
      let qrSizeRatio = 0.48;
      let qrYRatio = 0.487;

      if (templateType === "square") {
        bgSrc = "/template-square.jpg";
        qrSizeRatio = 0.48; // Lebih besar untuk versi kotak
        qrYRatio = 0.17; // Lebih ke atas untuk versi kotak
      }

      // Load the template background image
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";

      bgImg.onload = () => {
        canvas.width = bgImg.width;
        canvas.height = bgImg.height;

        // Draw background template
        ctx.drawImage(bgImg, 0, 0);

        // Calculate QR size and position relative to the template dimensions
        const qrSize = bgImg.width * qrSizeRatio;
        const qrX = (bgImg.width - qrSize) / 2;
        const qrY = bgImg.height * qrYRatio;

        // Draw QR Code and its container
        const qrImg = new Image();
        qrImg.onload = () => {
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          resolve(canvas);
        };

        qrImg.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
      };

      bgImg.onerror = () => {
        console.error(`Gagal memuat template ${bgSrc}. Pastikan file ada di folder public/.`);
        resolve(null);
      };

      bgImg.src = bgSrc;
    });
  };

  useEffect(() => {
    let isMounted = true;
    setPreviewUrl(null); // Kosongkan preview sejenak agar muncul efek loading

    const renderPreview = async () => {
      // Add a slight delay to ensure QR is rendered in DOM first
      setTimeout(async () => {
        const canvas = await generateCanvas();
        if (canvas && isMounted) {
          setPreviewUrl(canvas.toDataURL("image/png"));
        }
      }, 150);
    };

    renderPreview();

    return () => { isMounted = false; };
  }, [data.url, data.businessName, templateType]);

  const downloadQRCode = async () => {
    const canvas = await generateCanvas();
    if (!canvas) return;

    const pngFile = canvas.toDataURL("image/png");
    const typeLabel = templateType === "square" ? "StikerMeja" : "PosterStand";
    const filename = `QR-${typeLabel}-${(data.businessName || "Toko").replace(/\s+/g, '-')}.png`;

    // Detect if user is on an iOS device (iPhone/iPad/iPod)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      // For iOS: Try to use Web Share API if available, otherwise open in new tab
      try {
        // Convert base64 to Blob for sharing
        const res = await fetch(pngFile);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: "image/png" });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Desain QR Code Ulasan',
            text: 'Ini adalah desain QR Code Google Maps Anda.',
          });
        } else {
          // Fallback: Open in new tab so user can long-press to save
          const newWindow = window.open();
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#0F0F0F;min-height:100vh;flex-direction:column;color:white;font-family:sans-serif;">
                  <p style="margin-bottom:20px;padding:10px 20px;background:#E0481D;border-radius:20px;font-weight:bold;">Tekan tahan gambar di bawah lalu pilih "Simpan Gambar"</p>
                  <img src="${pngFile}" style="max-width:90%;max-height:80vh;object-fit:contain;border:4px solid white;" alt="QR Code" />
                </body>
              </html>
            `);
          } else {
            alert("Harap izinkan popup (pop-up blocker) untuk mengunduh gambar ini.");
          }
        }
      } catch (err) {
        console.error("Error sharing on iOS", err);
        // Direct fallback if share fails/is cancelled
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(`<img src="${pngFile}" style="max-width:100%;" />`);
        }
      }
    } else {
      // For Android, PC, Mac: Standard download behavior
      const downloadLink = document.createElement("a");
      downloadLink.download = filename;
      downloadLink.href = pngFile;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="w-full max-w-4xl py-4 md:py-8">
      {/* HEADER PESAN SUKSES - DIPERBAIKI UNTUK MOBILE & URL PANJANG */}
      <div className="bg-[#1A1A1A] text-white p-5 md:p-6 mb-8 border-2 border-[var(--color-ink)] shadow-hard-accent flex flex-row items-center gap-4 md:gap-5 rounded-sm overflow-hidden">
        <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-accent)] shrink-0 animate-pulse" />
        <div className="text-left flex-1 min-w-0">
          <h2 className="font-display font-extrabold text-lg md:text-2xl uppercase tracking-wider mb-1 line-clamp-1 text-white">
            Siap Untuk Mendominasi Google Maps!
          </h2>
          <p className="font-sans text-xs md:text-sm text-gray-300 font-medium">
            Desain beresolusi tinggi Anda selesai diproses. Cetak sekarang dan taruh di kasir sebelum jam ramai hari ini.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-start">

        {/* PANEL KIRI: PENGATURAN & UNDUH */}
        <div className="order-2 md:order-1 flex flex-col gap-8">

          {/* PEMILIHAN JENIS CETAKAN */}
          <div className="bg-white border-2 border-[var(--color-ink)] p-5 shadow-hard text-left">
            <h3 className="font-display font-bold uppercase text-sm border-b-2 border-[var(--color-ink)] pb-2 mb-4">
              Pilih Format Desain Cetakan
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setTemplateType("poster")}
                className={`py-3.5 px-2 flex flex-col items-center justify-center gap-2 border-2 transition-all font-bold cursor-pointer uppercase text-xs md:text-sm
                  ${templateType === "poster" ? "bg-[var(--color-accent)] border-[var(--color-ink)] text-white shadow-hard-accent" : "bg-[var(--color-paper)] border-gray-300 text-gray-600 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"}`}
              >
                <ImageIcon className="w-5 h-5" /> Stand Kasir (A4/A5)
              </button>

              <button
                onClick={() => setTemplateType("square")}
                className={`py-3.5 px-2 flex flex-col items-center justify-center gap-2 border-2 transition-all font-bold cursor-pointer uppercase text-xs md:text-sm
                  ${templateType === "square" ? "bg-[var(--color-accent)] border-[var(--color-ink)] text-white shadow-hard-accent" : "bg-[var(--color-paper)] border-gray-300 text-gray-600 hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"}`}
              >
                <LayoutGrid className="w-5 h-5" /> Stiker Meja (1:1)
              </button>
            </div>

            {/* INFO DESKRIPSI SINGKAT */}
            <AnimatePresence mode="wait">
              <motion.div
                key={templateType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="bg-[#FFFDE6] border-2 border-[var(--color-ink)] p-3 text-sm font-medium flex gap-2"
              >
                <Info className="w-5 h-5 shrink-0 text-[var(--color-ink)]" />
                <p className="text-xs md:text-sm leading-relaxed text-gray-800 font-medium">
                  {templateType === "poster"
                    ? "Format potret vertikal. Sangat pas dicetak dan disisipkan pada Standee Akrilik di kasir agar langsung menarik perhatian pembeli saat bayar."
                    : "Format kotak presisi 1:1. Menghemat ruang, sempurna untuk dicetak sebagai stiker tahan air dan ditempel di setiap meja makan/kaca."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex flex-col gap-4">
            <button
              onClick={downloadQRCode}
              disabled={!previewUrl}
              className="w-full bg-[var(--color-ink)] hover:bg-[#222222] text-white font-display font-extrabold text-xl md:text-lg py-5 border-2 border-[var(--color-ink)] shadow-hard-accent hover:shadow-hard-hover hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase flex items-center justify-center gap-3 cursor-pointer"
            >
              <Download className="w-6 h-6" /> UNDUH GAMBAR
            </button>

            <button
              onClick={onPrev}
              className="w-full bg-white hover:bg-gray-100 text-[var(--color-ink)] font-bold py-4 border-2 border-[var(--color-ink)] shadow-hard hover:shadow-hard-hover hover:translate-x-1 hover:translate-y-1 transition-all uppercase flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <RefreshCcw className="w-4 h-4" /> Ganti Data / Link Toko
            </button>
          </div>

          {/* QA WARNING / REMINDER */}
          <div className="bg-yellow-100 border-2 border-yellow-400 p-4 border-l-4 border-l-yellow-500 shadow-sm text-left">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="font-bold text-yellow-900 text-sm mb-1 uppercase tracking-wide font-display">Wajib Tes Sebelum Cetak!</h4>
                <p className="text-yellow-800 text-xs md:text-sm font-medium leading-relaxed">
                  Pindai (scan) QR Code di layar ini menggunakan kamera HP Anda <strong>sebelum mencetaknya secara massal</strong>. Pastikan pop-up ulasan Google Maps toko Anda langsung terbuka. Jika salah tempat atau gagal, silakan <button onClick={onPrev} className="underline font-bold text-yellow-900 hover:text-black">kembali</button> dan periksa ulang <strong>Place ID</strong> Anda dengan teliti.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: PREVIEW GAMBAR */}
        <div className="order-1 md:order-2 w-full max-w-[340px] mx-auto md:w-[340px]">
          <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-4 flex flex-col items-center justify-center relative min-h-[480px] shadow-hard-lg">

            <div className="absolute top-0 left-0 bg-[var(--color-ink)] text-white font-mono text-[10px] px-2 py-0.5 border-b-2 border-r-2 border-[var(--color-ink)] font-bold">
              LIVE PRINT PREVIEW
            </div>

            {/* Hidden QR Code source */}
            <div className="hidden" ref={qrRef}>
              <QRCodeSVG
                value={data.url || ""}
                size={600} // Lebih besar untuk kualitas cetak
                level="H"
                includeMargin={false}
                fgColor="#000000"
              />
            </div>

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Pratinjau Hasil"
                className="w-full h-auto border-2 border-gray-300 shadow-sm block"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                 <div className="w-12 h-12 border-4 border-[var(--color-ink)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
                 <p className="font-mono font-bold text-sm uppercase text-[var(--color-ink)]">Memproses Cetakan...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
