import { useMemo } from "react";

// use HEVCA system
export function useSupportsHEVCAlpha() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;

    const navigator = window.navigator;
    const ua = navigator.userAgent.toLowerCase();
    const hasMediaCapabilities = !!(
      navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo
    );
    const isSafari =
      ua.indexOf("safari") !== -1 &&
      ua.indexOf("chrome") === -1 &&
      ua.indexOf("version/") !== -1;
    console.log(isSafari, hasMediaCapabilities);
    return isSafari && hasMediaCapabilities;
  }, []);
}

// use  IOS system
export function useIsIOS() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;

    const navigator = window.navigator;
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("iphone") !== -1 || ua.indexOf("ipad") !== -1;
  }, []);
}
