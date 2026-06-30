import { Dashboard } from "@/components/Dashboard";
import { fetchDashboard } from "@/lib/fetchDashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await fetchDashboard();
  return <Dashboard initialData={data} />;
}
