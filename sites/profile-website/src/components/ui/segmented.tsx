"use client";

type SegmentedProps<T extends string> = {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** Two-or-three way switch used to flip a figure between states. */
export const Segmented = <T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedProps<T>) => (
  <div
    role="radiogroup"
    aria-label={label}
    className="inline-flex rounded-md border border-gray-200 p-0.5 dark:border-neutral-800"
  >
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        role="radio"
        aria-checked={value === option.value}
        onClick={() => onChange(option.value)}
        className={`rounded px-2.5 py-1 text-xs transition-colors ${
          value === option.value
            ? "bg-gray-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
            : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);
