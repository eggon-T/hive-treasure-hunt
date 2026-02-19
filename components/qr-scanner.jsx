"use client"

import { Html5QrcodeScanner } from "html5-qrcode"
import { useEffect, useRef, useState } from "react"

export default function QrScanner({ qr, setTrigger }) {
  const [scanStatus, setScanStatus] = useState("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const scannerRef = useRef(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (isInitializedRef.current) return

    isInitializedRef.current = true

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
        aspectRatio: 1.0,
        disableFlip: false,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        videoConstraints: {
          facingMode: { ideal: "environment" },
        },
      },
      false,
    )

    scannerRef.current = scanner

    scanner.render(success, error)
    setScanStatus("scanning")

    function success(result) {
      console.log("Scanned:", result, "Expected:", qr)
      if (result === qr) {
        setScanStatus("success")
        scanner.clear()
        setTrigger(true)
      } else {
        setScanStatus("error")
        setErrorMessage("Invalid signal detected. Try another transmission.")
        setTimeout(() => {
          setScanStatus("scanning")
          setErrorMessage("")
        }, 3000)
      }
    }

    function error(err) {
      if (err && !err.includes("NotFoundException")) {
        console.log(err)
      }
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
        scannerRef.current = null
      }
      isInitializedRef.current = false
    }
  }, [qr, setTrigger])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            scanStatus === "success"
              ? "bg-green-500 animate-ping"
              : scanStatus === "error"
                ? "bg-fuchsia-600 animate-pulse"
                : "bg-cyan-500 signal-pulse"
          }`}
        />
        <span
          className={`text-xs font-mono tracking-widest uppercase transition-colors duration-300 ${
            scanStatus === "success"
              ? "text-green-500"
              : scanStatus === "error"
                ? "text-fuchsia-500 text-glow-purple"
                : "text-cyan-500 text-glow"
          }`}
        >
          {scanStatus === "success"
            ? "Signal locked"
            : scanStatus === "error"
              ? "System Error"
              : "Scanning for signal"}
        </span>
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            scanStatus === "success"
              ? "bg-green-500 animate-ping"
              : scanStatus === "error"
                ? "bg-fuchsia-600 animate-pulse"
                : "bg-cyan-500 signal-pulse"
          }`}
        />
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-fuchsia-950/30 border border-fuchsia-500/50 rounded-none text-center shadow-[0_0_15px_rgba(192,38,211,0.2)]">
          <p className="text-xs font-mono text-fuchsia-400 tracking-wide">
            <span className="mr-2">⚠</span>
            {errorMessage}
          </p>
        </div>
      )}

      <div className="mb-4 p-3 bg-background/50 border border-cyan-500/30 rounded backdrop-blur-sm">
        <p className="text-xs font-mono text-cyan-400/80 text-center">
          Position the QR code within the scanning area. Use flashlight for dark areas.
        </p>
      </div>

      <div
        id="reader"
        className="flex flex-col gap-2 items-center justify-center font-mono p-4 
        [&_video]:rounded-lg [&_video]:border-2 [&_video]:border-cyan-500/50
        [&_button]:!bg-cyan-600 [&_button]:!border-cyan-500 [&_button]:!text-white 
        [&_button]:!font-mono [&_button]:!text-xs [&_button]:!px-4 [&_button]:!py-2 
        [&_button]:!rounded-none [&_button]:!min-h-[48px] [&_button]:hover:!bg-cyan-500
        [&_button]:active:!scale-95 [&_button]:!transition-all [&_button]:!shadow-[0_0_15px_rgba(6,182,212,0.3)]
        [&_select]:!bg-black [&_select]:!text-cyan-500 [&_select]:!border-cyan-900 
        [&_select]:!font-mono [&_select]:!text-xs [&_select]:!px-3 [&_select]:!py-2
        [&_select]:!rounded-none [&_select]:!min-h-[48px]
        [&_input[type='range']]:!accent-cyan-500
        max-w-full overflow-hidden"
      />
    </div>
  )
}
