import { labelStatus, type StatusTracking } from "@/lib/data";

function nada(status: StatusTracking): string {
  switch (status) {
    case "po_dibuka":
    case "otw_indonesia":
      return "badge-orange";
    case "siap_dikirim":
    case "selesai":
      return "badge-blush";
    default:
      return "badge-netral";
  }
}

export default function StatusBadge({ status }: { status: StatusTracking }) {
  return <span className={`badge ${nada(status)}`}>{labelStatus(status)}</span>;
}
