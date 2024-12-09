"use client";

import SectionTitle from "../../shared/SectionTitle";
import PublicTestimonials from "./PublicTestimonials";
import UpcomingEvents from "./UpcomingEvents";
import ResourcePreviews from "./ResourcePreviews";
import WhyJoinUs from "./WhyJoinUs";

export default function LimitedAccessFeatures() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <SectionTitle title="Explore Limited Access Features" />
        <PublicTestimonials />
        <UpcomingEvents />
        <ResourcePreviews />
        <WhyJoinUs />
      </div>
    </section>
  );
}
