export default function packageCard(props) {
  const isOutOfStock = props.stock <= 0;

  return (
    <div className="package-card" key={props.id}>
      <div className="package-header">
        <h3 className="package-name">{props.name}</h3>
        <div className="package-size">{props.title}</div>
      </div>
      <div className="package-price">
        <span className="price-currency">&euro; </span>
        <span className="price-amount">{props.price}</span>
      </div>
      <ul className="package-features">
        <li>
          <i className="fas fa-check"></i> Certificato di proprietà
        </li>
        <li>
          <i className="fas fa-check"></i> Coordinate GPS galattiche
        </li>
        <li>
          <i className="fas fa-check"></i> Mappa personalizzata
        </li>
        <li>
          <i className="fas fa-check"></i> {props.title}
        </li>
        {props.slug.includes("medio") && (
          <>
            <li>
              <i className="fas fa-check"></i> Cornice Premium inclusa
            </li>
          </>
        )}
        {props.slug.includes("grande") && (
          <>
            <li>
              <i className="fas fa-check"></i> Cornice Premium inclusa
            </li>
            <li>
              <i className="fas fa-check"></i> Nome sul registro pubblico
            </li>
          </>
        )}
      </ul>
      
      {/* Pulsante con gestione stock */}
      <button
        className={`add-to-cart-button ${isOutOfStock ? 'disabled' : ''}`}
        onClick={() => props.onAddToCart(props)}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? 'Non disponibile' : 'Aggiungi al carrello'}
      </button>
      
      {/* Visualizzazione stock */}
      <div className="stock-info">
        {isOutOfStock ? (
          <span className="out-of-stock">Terminato</span>
        ) : (
          <span className="in-stock">Ancora {props.stock} disponibili</span>
        )}
      </div>
    </div>
  );
}
