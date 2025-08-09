import { AuthRequest } from "./http.types";

export interface ControllerProps {
  [fun: string]: AuthRequest;
}
