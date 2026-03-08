import CheckoutFields from "./CheckoutFields";
import { BILLING_FIELDS, COMPANY_FIELDS } from "./checkoutConfig";

export default function BillingPanel({
  billing,
  errors,
  wantInvoice,
  sameAsShipping,
  isCompany,
  onBillingChange,
  onToggleIsCompany,
}) {
  const visibleBillingFields = BILLING_FIELDS.filter(
    (key) => !COMPANY_FIELDS.includes(key) || isCompany,
  );

  return (
    <div
      className="checkout-panel"
      style={{
        opacity: wantInvoice ? 1 : 0.5,
        pointerEvents: wantInvoice ? "auto" : "none",
      }}
    >
      <h3>Dati di fatturazione</h3>

      <CheckoutFields
        data={billing}
        fields={visibleBillingFields}
        errorPrefix="billing"
        errors={errors}
        onChange={onBillingChange}
        isDisabled={(key) => !wantInvoice || (sameAsShipping && !COMPANY_FIELDS.includes(key))}
      />

      {wantInvoice && (
        <label>
          <input
            style={{ marginTop: "15px" }}
            type="checkbox"
            checked={isCompany}
            onChange={onToggleIsCompany}
          />{" "}
          Acquisto come azienda
        </label>
      )}
    </div>
  );
}
