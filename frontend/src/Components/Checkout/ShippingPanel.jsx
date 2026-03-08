import CheckoutFields from "./CheckoutFields.jsx";
import { SHIPPING_FIELDS } from "./checkoutConfig.js";

export default function ShippingPanel({
  shipping,
  errors,
  onShippingChange,
  wantInvoice,
  sameAsShipping,
  onToggleWantInvoice,
  onToggleSameAsShipping,
}) {
  return (
    <div className="checkout-panel">
      <h3>Dati di spedizione</h3>
      <CheckoutFields
        data={shipping}
        fields={SHIPPING_FIELDS}
        errorPrefix="shipping"
        errors={errors}
        onChange={onShippingChange}
      />

      <label>
        <input
          style={{ marginTop: "15px" }}
          type="checkbox"
          checked={wantInvoice}
          onChange={onToggleWantInvoice}
        />{" "}
        Voglio la fattura
      </label>

      <br />
      <label>
        <input
          style={{ marginTop: "15px" }}
          type="checkbox"
          disabled={!wantInvoice}
          checked={sameAsShipping}
          onChange={onToggleSameAsShipping}
        />{" "}
        Usa stessi dati per fatturazione
      </label>
    </div>
  );
}
