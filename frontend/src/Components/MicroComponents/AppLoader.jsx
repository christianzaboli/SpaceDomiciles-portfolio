import { PuffLoader } from "react-spinners";

export default function AppLoader({
  text = "Caricamento...",
  size = 64,
  minHeight = "40vh",
}) {
  return (
    <div className="app-loader" style={{ minHeight }}>
      <PuffLoader color="#caaeff" size={size} speedMultiplier={1} />
      <p className="app-loader-text">{text}</p>
    </div>
  );
}
