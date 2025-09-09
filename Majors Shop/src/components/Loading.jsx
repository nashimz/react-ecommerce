export default function LoadingButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md bg-black text-white text-xs font-medium shadow hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled
    >
      <svg
        className="h-8 w-8 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      Processing…
    </button>
  );
}
