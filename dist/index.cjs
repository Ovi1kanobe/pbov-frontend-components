"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  useDebounce: () => useDebounce,
  useDebouncedRealtimeSubscription: () => useDebouncedRealtimeSubscription,
  useIsMobile: () => useIsMobile
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useDebounce.tsx
var import_react = require("react");
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = (0, import_react.useState)(value);
  (0, import_react.useEffect)(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}

// src/hooks/useMobile.tsx
var React = __toESM(require("react"), 1);
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(void 0);
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}

// src/hooks/useRealtimeSubscription.tsx
var import_react2 = require("react");
var import_pocketbase = require("pocketbase");
function useDebouncedRealtimeSubscription({
  pb,
  collections,
  id = "*",
  onUpdate,
  filter,
  enabled = true,
  debounceMs = 500,
  maxFloodMs = 5e3
}) {
  const debounceTimer = (0, import_react2.useRef)(null);
  const floodStartTime = (0, import_react2.useRef)(null);
  const lastEvent = (0, import_react2.useRef)(void 0);
  const unsubscribersRef = (0, import_react2.useRef)([]);
  const setupRunId = (0, import_react2.useRef)(0);
  const debouncedUpdate = (0, import_react2.useCallback)((event) => {
    lastEvent.current = event;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    const now = Date.now();
    if (!floodStartTime.current) {
      floodStartTime.current = now;
    }
    if (now - floodStartTime.current >= maxFloodMs) {
      floodStartTime.current = now;
      onUpdate(event);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      onUpdate(lastEvent.current);
      floodStartTime.current = null;
    }, debounceMs);
  }, [onUpdate, debounceMs, maxFloodMs]);
  (0, import_react2.useEffect)(() => {
    if (!pb || !enabled) return;
    const collectionArray = Array.isArray(collections) ? collections : [collections];
    const thisRun = ++setupRunId.current;
    unsubscribersRef.current = [];
    let isCancelled = false;
    const setupSubscriptions = async () => {
      try {
        for (const collection of collectionArray) {
          if (isCancelled) break;
          const unsubscribe = await pb.collection(collection).subscribe(id, (event) => {
            if (filter && !filter(event, collection)) {
              return;
            }
            debouncedUpdate(event);
          });
          if (thisRun !== setupRunId.current || isCancelled) {
            try {
              unsubscribe();
            } catch {
              console.error("Error during immediate unsubscribe");
            }
            continue;
          }
          unsubscribersRef.current.push(unsubscribe);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to setup realtime subscriptions:", error);
        }
      }
    };
    setupSubscriptions();
    return () => {
      isCancelled = true;
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
      const fns = unsubscribersRef.current;
      unsubscribersRef.current = [];
      for (const unsubscribe of fns) {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error during unsubscribe:", error);
        }
      }
    };
  }, [pb, collections, id, debouncedUpdate, enabled, filter]);
  const cleanup = (0, import_react2.useCallback)(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    const fns = unsubscribersRef.current;
    unsubscribersRef.current = [];
    for (const unsubscribe of fns) {
      try {
        unsubscribe();
      } catch (error) {
        console.error("Error during manual unsubscribe:", error);
      }
    }
  }, []);
  return cleanup;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useDebounce,
  useDebouncedRealtimeSubscription,
  useIsMobile
});
