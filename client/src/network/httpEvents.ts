import { onUnauthorized } from "./http";
import { store } from "../redux/store";
import { resetAllstate } from "../redux/actions/root.action";

onUnauthorized(() => {
  store.dispatch(resetAllstate());
});
