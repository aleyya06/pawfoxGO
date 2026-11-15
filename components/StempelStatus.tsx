import { labelStatus, type StatusTracking } from "@/lib/data";

// Status batch sebagai stempel: hijau khusus Open (PO masih bisa diikuti),
// lilac untuk Arrived admin (barang siap diambil/dikirim), sisanya tinta espresso.
function nada(status: StatusTracking): string {
  if (status === "open") return "stempel-open";
  if (status === "arrived_admin") return "stempel-siap";
  return "stempel-jalan";
}

export default function StempelStatus({ status, className }: { status: StatusTracking; className?: string }) {
  return (
    <span className={`stempel ${nada(status)}${className ? ` ${className}` : ""}`}>
      <span className="sr-only">Status: </span>
      {labelStatus(status)}
    </span>
  );
}
