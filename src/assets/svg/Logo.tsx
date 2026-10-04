export default function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <rect width="36" height="36" rx="8" fill="url(#fc_grad)" />
      <path
        d="M8 18L14 12H22L28 18L22 24H14L8 18Z"
        fill="white"
        fillOpacity="0.9"
      />
      <path
        d="M14 18L18 14L22 18L18 22L14 18Z"
        fill="url(#fc_grad)"
      />
      <defs>
        <linearGradient
          id="fc_grad"
          x1="0"
          y1="0"
          x2="36"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}
