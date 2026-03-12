import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

function QRScanner({ onScan }) {

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("Scanned QR:", decodedText);
        onScan(decodedText);
      },
      (error) => {
        // ignore scan errors
        console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, [onScan]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div id="reader" style={{ width: "300px" }}></div>
    </div>
  );
}

export default QRScanner;