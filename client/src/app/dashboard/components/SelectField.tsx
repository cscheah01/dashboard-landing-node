"use client";

type SelectFieldProps = {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
};

export default function SelectField({
  label,
  onChange,
  options,
  value,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-sm text-zinc-400">{label}</span>
      <select
        className="mt-2 w-full rounded-md border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-teal-300/50"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
