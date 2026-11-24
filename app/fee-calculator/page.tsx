import type { Metadata } from "next";
import SimpleHero from "@/components/SimpleHero";
import FeeCalculator from "@/components/FeeCalculator";
import { getCourses, getFeeSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Fee Calculator | Furqan Saeed Technical Institute",
  description: "Estimate your total course fee and monthly cost before you apply.",
};

export default async function FeeCalculatorPage() {
  const [courses, fees] = await Promise.all([getCourses(), getFeeSettings()]);
  return (
    <>
      <SimpleHero
        eyebrow="FEE CALCULATOR"
        title="Know Your Cost Before You Apply"
        description="Pick one or more courses to see your monthly fee, admission fee and estimated total."
      />
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-14">
        <FeeCalculator courses={courses} admissionFee={fees.admissionFee} />
        {fees.feeNote && <p className="text-xs text-navy/50 mt-8 text-center">{fees.feeNote}</p>}
      </section>
    </>
  );
}
