import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GradientText from "../../ReactBits/GradientText";
import { FEATURE_ITEMS } from "../../../libs/consts";

export default function HomeFeatureCards() {
  return (
    <div className="cards-wrapper">
      {FEATURE_ITEMS.map((item) => (
        <div className="glass-card" key={item.title}>
          <div className="icon">
            <FontAwesomeIcon icon={item.icon} />
          </div>
          <GradientText className="card-title">{item.title}</GradientText>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
