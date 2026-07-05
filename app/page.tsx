import { Dashboard } from "@/components/Dashboard";
import { fetchDashboard } from "@/lib/fetchDashboard";
import { fetchBitcoinValuation } from "@/lib/fetchBitcoinValuation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [data, valuation] = await Promise.all([
    fetchDashboard(),
    fetchBitcoinValuation()
      .then((value) => ({ value, error: undefined }))
      .catch((err) => ({ value: null, error: String(err) })),
  ]);

  return (
    <Dashboard
      initialData={data}
      initialValuation={valuation.value}
      initialValuationError={valuation.error}
    />
  );
}
