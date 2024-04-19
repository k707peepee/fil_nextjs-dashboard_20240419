import Image from "next/image";
import LabelLineChart from "../components/dashboard/LabelLineChart";
import CardPage from "../components/dashboard/card";
import LuckBarChart from "../components/dashboard/LuckBarChart";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <CardPage />
      </div>
      <div className="mt-20">
        <LabelLineChart />
      </div>
      <div className="mt-20">
        <LuckBarChart />
      </div>
    </main>
  );
}
