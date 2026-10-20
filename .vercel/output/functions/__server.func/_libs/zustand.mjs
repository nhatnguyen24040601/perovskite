import { i as __toESM } from "../_runtime.mjs";
import { M as require_react, k as createStore } from "./@react-three/drei+[...].mjs";
//#region node_modules/.pnpm/zustand@5.0.15_@types+react@19.3.0_react@19.3.0_use-sync-external-store@1.7.0_react@19.3.0_/node_modules/zustand/esm/react.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var identity = (arg) => arg;
function useStore(api, selector = identity) {
	const slice = import_react.useSyncExternalStore(api.subscribe, import_react.useCallback(() => selector(api.getState()), [api, selector]), import_react.useCallback(() => selector(api.getInitialState()), [api, selector]));
	import_react.useDebugValue(slice);
	return slice;
}
var createImpl = (createState) => {
	const api = createStore(createState);
	const useBoundStore = (selector) => useStore(api, selector);
	Object.assign(useBoundStore, api);
	return useBoundStore;
};
var create = ((createState) => createState ? createImpl(createState) : createImpl);
//#endregion
export { create as t };
