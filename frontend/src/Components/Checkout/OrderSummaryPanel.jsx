export default function OrderSummaryPanel({ items, shippingCost, totalFinal }) {
  const itemList = Object.values(items);

  return (
    <div className="checkout-panel order-summary">
      <h3>Riepilogo ordine</h3>
      <ul>
        {itemList.map((item) => (
          <li key={item.id}>
            {item.name} × {item.quantity}
            <span>€{(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="checkout-total">
        <strong>Spedizione:</strong> {shippingCost === 0 ? "Gratis" : `€${shippingCost}`}
      </div>

      <div className="checkout-total">
        <strong>Totale:</strong> €{totalFinal.toFixed(2)}
      </div>
    </div>
  );
}
