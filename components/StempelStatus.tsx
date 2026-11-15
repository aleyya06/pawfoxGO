import { labelStatus, type StatusTracking } from "@/lib/data";

// Status batch sebagai stempel: hijau hanya untuk Open yang tanggal tutupnya
// belum lewat, lilac untuk Arrived admin (siap diambil/dikirim), sisanya
// tinta espresso. Open yang sudah lewat tenggat tampil "Closed".
function nada(status: StatusTracking, tutup: boolean): string {
  if (status === "open" && !tutup) return "stempel-open";
  if (status === "arrived_admin") return "stempel-siap";
  return "stempel-jalan";
}

export default function StempelStatus({
  status,
  tutup = false,
  className,
}: {
  status: StatusTracking;
  tutup?: boolean;
  className?: string;
}) {
  const label = status === "open" && tutup ? "Closed" : labelStatus(status);
  return (
    <span className={`stempel ${nada(status, tutup)}${className ? ` ${className}` : ""}`}>
      <span className="sr-only">Status: </span>
      {label}
    </span>
  );
}
