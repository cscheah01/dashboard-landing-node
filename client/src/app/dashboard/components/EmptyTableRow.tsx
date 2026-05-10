import { ReactNode } from "react";

export default function EmptyTableRow({
  children,
  colSpan,
}: {
  children: ReactNode;
  colSpan: number;
}) {
  return (
    <tr>
      <td className="py-10 text-center text-sm text-zinc-500" colSpan={colSpan}>
        {children}
      </td>
    </tr>
  );
}
