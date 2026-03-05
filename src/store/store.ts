import { create } from "zustand";
import { type AppState } from "./types";
import createFlowSlice from "./slices/flowSlice";
import { createSettingsSlice } from "./slices/settingsSlice";
import { createSidebarSlice } from "./slices/sidebarSlice";
import { createAccountSlice } from "./slices/accountSlice";

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<AppState>((...a) => ({
  ...createFlowSlice(...a),
  ...createSettingsSlice(...a),
  ...createSidebarSlice(...a),
  ...createAccountSlice(...a),
}));

export default useStore;
