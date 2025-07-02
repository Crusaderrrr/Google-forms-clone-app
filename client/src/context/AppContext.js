import { useContext } from "react";
import { AppContext } from "./AppContextProvider";

export function useApp() {
  return useContext(AppContext);
}