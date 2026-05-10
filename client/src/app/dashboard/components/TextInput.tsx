"use client";

type TextInputProps = {
  label: string;
  min?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: string;
};

export default function TextInput({
  label,
  min,
  onChange,
  placeholder,
  required = true,
  type = "text",
  value,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="text-sm text-zinc-400">{label}</span>
      <input
        className="mt-2 w-full rounded-md border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-teal-300/50"
        min={min}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}
