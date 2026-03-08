import Galaxy from "../ReactBits/Galaxy.jsx";
import useHomeBackground from "../../hooks/useHomeBackground.jsx";

export default function HomeBackground() {
  const { shouldUseGalaxy, galaxyConfig, webglFallbackStyle } =
    useHomeBackground();

  // if (shouldUseGalaxy) {
  //   return <Galaxy {...galaxyConfig} />;
  // }

  return <div style={webglFallbackStyle} aria-hidden="true" />;
}
