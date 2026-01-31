import { GradientMesh } from "@/components/ui/gradient-mesh";
import { SignUpForm } from "@/app/components/SignUpForm";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignUp() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Header with Logo and Back Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <a href="/" aria-label="home" className="flex gap-2 items-center">
            <img
              src="/ai-logo-white.png"
              alt="Logo"
              height={50}
              width={50}
              className="h-10 z-10 w-full hidden dark:block object-contain"
            />
            <img
              src="/ai-logo-black.png"
              alt="Logo"
              height={50}
              width={50}
              className="h-10 z-10 w-full dark:hidden block object-contain"
            />
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>

      {/* Mode Toggle - Top Right with better visibility */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border p-1">
          <ModeToggle />
        </div>
      </div>

      <div className="bg-muted relative hidden lg:block">
        <GradientMesh
          colors={["#bcecf6", "#00aaff", "#ffd447"]}
          distortion={8}
          swirl={0.2}
          speed={1}
          rotation={90}
          waveAmp={0.2}
          waveFreq={20}
          waveSpeed={0.2}
          grain={0.06}
        />
      </div>
    </div>
  );
}
