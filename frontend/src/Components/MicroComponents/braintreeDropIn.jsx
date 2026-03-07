import { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";

export default function BraintreeDropIn({ amount, invoiceId, onSuccess, onError }) {
  const instanceRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false); // 🔥 BLOCCA DOPPIO CLICK

  useEffect(() => {
    let isCancelled = false;

    async function init() {
      try {
        setLoading(true);

        if (!containerRef.current) return;
        containerRef.current.innerHTML = "";

        const res = await fetch("http://localhost:3000/api/payment/token");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Errore ottenendo il token di pagamento");
        }

        if (isCancelled) return;

        const instance = await dropin.create({
          authorization: data.clientToken,
          container: containerRef.current,
          paypal: {
            flow: "checkout",
            amount,
            currency: "EUR",
          },
          card: { cardholderName: true },
        });

        instanceRef.current = instance;
      } catch (err) {
        console.error("Errore creazione Drop-In:", err);
        onError?.(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    init();

    return () => {
      isCancelled = true;
      if (instanceRef.current) {
        instanceRef.current.teardown().catch(() => { });
      }
    };
  }, [amount, onError]);

  const handlePayment = async () => {
    if (!instanceRef.current || isPaying) return; // ⛔ Se sta pagando → blocca
    setIsPaying(true);

    if (!invoiceId) {
      onError?.(new Error("Invoice mancante: conferma prima l'ordine."));
      setIsPaying(false);
      return;
    }

    try {
      const payload = await instanceRef.current.requestPaymentMethod();
      const nonce = payload.nonce;

      const method = payload.type === "PayPalAccount" ? "paypal" : "credit_card";

      const res = await fetch("http://localhost:3000/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          nonce,
          invoice_id: invoiceId,
          method,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        const error = new Error(data.error || "Errore nel pagamento");
        error.details = data;
        console.error("Errore pagamento:", data);
        onError?.(error);
        setIsPaying(false); // 🔥 Riabilita bottone solo se fallisce
        return;
      }

      onSuccess?.(data);
    } catch (err) {
      console.error("Errore richiesta metodo di pagamento:", err);
      onError?.(err);
      setIsPaying(false); // 🔥 Riabilita bottone solo se fallisce
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div ref={containerRef} id="bt-container" />

      <button
        className="checkout-btn"
        disabled={loading || isPaying} // 🔥 BOTTONE bloccato mentre paga
        onClick={handlePayment}
        style={{ marginTop: "15px" }}
      >
        {loading
          ? "Caricamento pagamento..."
          : isPaying
            ? "Elaborazione pagamento..."
            : `Paga €${amount}`}
      </button>
    </div>
  );
}
