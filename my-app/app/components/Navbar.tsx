"use client";
import React, { useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/componentsAcertinity/ui/navbar-menu";
import { cn } from "@/lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-4xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Home">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/">Home</HoveredLink>
            <HoveredLink href="/#features">Features</HoveredLink>
            <HoveredLink href="/#pricing">Pricing</HoveredLink>
            <HoveredLink href="/#contact">Contact</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Features">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Smart Charging"
              href="/#features"
              src="https://assets.aceternity.com/demos/algochurn.webp"
              description="AI-powered charging optimization for your EV."
            />
            <ProductItem
              title="Station Finder"
              href="/#features"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Find the nearest charging station instantly."
            />
            <ProductItem
              title="Real-time Monitoring"
              href="/#features"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
              description="Track your charging status in real-time."
            />
            <ProductItem
              title="Fleet Management"
              href="/#features"
              src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
              description="Manage your entire EV fleet efficiently."
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/#pricing">Basic Plan</HoveredLink>
            <HoveredLink href="/#pricing">Premium Plan</HoveredLink>
            <HoveredLink href="/#pricing">Enterprise Plan</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
