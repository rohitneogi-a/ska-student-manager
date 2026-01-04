import React from "react";

const RippleSpinner = ({ size = 148, color = "hsl(173, 80%, 40%)" }) => (
  <svg
    fill={color}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="0">
      <animate
        id="spinner_kIfO"
        begin="0;spinner_xBIM.end"
        attributeName="r"
        calcMode="spline"
        dur="1.2s"
        values="0;11"
        keySplines=".52,.6,.25,.99"
        fill="freeze"
      />
      <animate
        begin="0;spinner_xBIM.end"
        attributeName="opacity"
        calcMode="spline"
        dur="1.2s"
        values="1;0"
        keySplines=".52,.6,.25,.99"
        fill="freeze"
      />
    </circle>
    <circle cx="12" cy="12" r="0">
      <animate
        begin="spinner_kIfO.begin+0.2s"
        attributeName="r"
        calcMode="spline"
        dur="1.2s"
        values="0;11"
        keySplines=".52,.6,.25,.99"
        fill="freeze"
      />
      <animate
        begin="spinner_kIfO.begin+0.2s"
        attributeName="opacity"
        calcMode="spline"
        dur="1.2s"
        values="1;0"
        keySplines=".52,.6,.25,.99"
        fill="freeze"
      />
    </circle>
    <circle cx="12" cy="12" r="0">
      <animate
        id="spinner_xBIM"
        begin="spinner_kIfO.begin+0.4s"
        attributeName="r"
        calcMode="spline"
        dur="1.2s"
        values="0;11"
        keySplines=".52,.6,.25,.99"
        fill="freeze"
      />
      <animate
        begin="spinner_kIfO.begin+0.4s"
        attributeName="opacity"
        calcMode="spline"
        dur="1.2s"
        values="1;0"
        keySplines=".52,.6,.25,.99"
        fill="freeze"
      />
    </circle>
  </svg>
);

export default RippleSpinner;
