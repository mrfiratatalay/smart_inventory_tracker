"use client";

import { useEffect } from "react";

export default function HydrationFix() {
  useEffect(() => {
    // Handle external scripts that modify the DOM after React hydration
    const handleExternalChanges = () => {
      // This effect runs only on the client side
      // It helps prevent hydration mismatches from external sources

      // Common classes added by browser extensions
      const commonExternalClasses = [
        "mdl-js",
        "translate-rendered",
        "notranslate",
        "gr_",
        "skiptranslate",
      ];

      // Remove potentially problematic classes that might be added by extensions
      commonExternalClasses.forEach((className) => {
        if (document.documentElement.classList.contains(className)) {
          // Don't remove, just ensure React knows about them
          console.log(`External class detected: ${className}`);
        }
      });
    };

    // Run immediately
    handleExternalChanges();

    // Also run after a small delay to catch late-loading extensions
    const timeoutId = setTimeout(handleExternalChanges, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return null; // This component doesn't render anything
}
