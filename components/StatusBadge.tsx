import { labelStatus, type StatusTracking } from "@/lib/data";

function nada(status: StatusTracking): string {
  switch (status) {
    case "open":
    case "arrived_indonesia":
      return "badge-orange";
    case "arrived_admin":
      return "badge-blush";
    default:
      return "badge-netral";
  }
}

export default function StatusBadge({ status }: { status: StatusTracking }) {
  return <span className={`badge ${nada(status)}`}>{labelStatus(status)}</span>;
}
