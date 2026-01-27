import React from "react";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";

const Feature1Section = () => {
  return (
    <section className="relative w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Scroll Stack (sticky on large screens) */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-16">
              <ScrollStack
                useWindowScroll
                className=""
                itemDistance={140}
                itemScale={0.04}
                itemStackDistance={40}
                baseScale={0.9}
                rotationAmount={0}
              >
                <ScrollStackItem>
                  <div className="aspect-[16/10] w-full h-full overflow-hidden rounded-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop"
                      alt="Mountains over clouds"
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  </div>
                </ScrollStackItem>
                <ScrollStackItem>
                  <div className="aspect-[16/10] w-full h-full overflow-hidden rounded-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop"
                      alt="Laptop workspace"
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  </div>
                </ScrollStackItem>
                <ScrollStackItem>
                  <div className="aspect-[16/10] w-full h-full overflow-hidden rounded-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"
                      alt="City skyline"
                      className="w-full h-full object-cover rounded-3xl"
                    />
                  </div>
                </ScrollStackItem>
              </ScrollStack>
            </div>
          </div>

          {/* Right: Text content aligned with the cards */}
          <div className="lg:col-span-6 lg:pl-6">
            <div className="space-y-24 pb-48 lg:pb-64">
              <div className="max-w-md">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">Build Quick</h3>
                <p className="mt-3 text-slate-600">
                  Get a beautiful site up and running in no time. Just choose a layout you like and
                  start tweaking it. Smooth scroll keeps your media in view while you read.
                </p>
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">A Lot of Blocks</h3>
                <p className="mt-3 text-slate-600">
                  Mix and match multiple sections to build your pages. The stack on the left advances
                  as you progress through the copy, highlighting each point.
                </p>
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">Fully Responsive</h3>
                <p className="mt-3 text-slate-600">
                  Looks great on any device. Images scale and the interaction remains fluid thanks to
                  Lenis smooth scrolling.
                </p>
              </div>
              {/* Extra content to ensure the section has enough height until the stack finishes */}
              <div className="max-w-md">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">Performance Focused</h3>
                <p className="mt-3 text-slate-600">
                  Under the hood, the scroll effect uses transform caching and stable measurements to
                  avoid layout thrash. The result is smooth, jitter-free motion even on lower-end
                  devices.
                </p>
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">Customizable</h3>
                <p className="mt-3 text-slate-600">
                  Tune spacing, scaling, and stack depth to match your brand. Swap in your own images
                  and copy—no extra wiring needed.
                </p>
              </div>
              <div className="max-w-md">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">Ready to Ship</h3>
                <p className="mt-3 text-slate-600">
                  When you reach the end of this text, the image stack also completes—keeping the
                  layout balanced with no empty gap at the bottom of the section.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature1Section;