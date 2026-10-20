import { createFileRoute } from "@tanstack/react-router";
import { SimApp } from "@/components/sim/SimApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SimApp />;
}
