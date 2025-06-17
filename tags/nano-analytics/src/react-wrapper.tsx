import React from "react";
import { createComponent } from "@lit/react";
import { NanoAnalytics } from "./";

export const NanoAnalyticsComponent = createComponent({
  tagName: "nano-analytics",
  elementClass: NanoAnalytics,
  react: React,
  events: {
    onactivate: "activate",
    onchange: "change",
  },
});
