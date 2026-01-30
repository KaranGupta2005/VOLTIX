"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+91",
    password: "",
    city: "",
    vehicleType: "sedan",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: 2024,
    batteryCapacity: 60,
    registrationNumber: "",
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // TODO: Add API integration here
    console.log("Form submitted:", formData);

    setTimeout(() => {
      setLoading(false);
      alert("Form submitted! (API not connected yet)");
    }, 1000);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Step {step} of 3:{" "}
            {step === 1
              ? "Personal Info"
              : step === 2
                ? "Vehicle Details"
                : "Review & Submit"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* STEP 1 - Personal Info */}
          {step === 1 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (+91XXXXXXXXXX)</Label>
                <Input
                  id="phone"
                  placeholder="+919876543210"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password (min 6 characters)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2 - Vehicle & Location */}
          {step === 2 && (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>City</Label>
                <Select
                  onValueChange={(val) => handleChange("city", val)}
                  value={formData.city}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Vehicle Type</Label>
                  <Select
                    onValueChange={(val) => handleChange("vehicleType", val)}
                    value={formData.vehicleType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    min={2015}
                    max={2025}
                    value={formData.vehicleYear}
                    onChange={(e) =>
                      handleChange("vehicleYear", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Make</Label>
                  <Input
                    placeholder="Tesla, Tata, MG..."
                    value={formData.vehicleMake}
                    onChange={(e) =>
                      handleChange("vehicleMake", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Model</Label>
                  <Input
                    placeholder="Model Y, Nexon EV..."
                    value={formData.vehicleModel}
                    onChange={(e) =>
                      handleChange("vehicleModel", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Registration Number</Label>
                <Input
                  placeholder="MH01AB1234"
                  className="uppercase"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    handleChange(
                      "registrationNumber",
                      e.target.value.toUpperCase(),
                    )
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Battery Capacity (kWh)</Label>
                <Input
                  type="number"
                  min={10}
                  max={200}
                  value={formData.batteryCapacity}
                  onChange={(e) =>
                    handleChange("batteryCapacity", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 3 - Review */}
          {step === 3 && (
            <div className="space-y-3 text-sm">
              <h3 className="font-semibold text-base mb-2">
                Please review your details:
              </h3>
              <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{formData.name}</span>
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{formData.email}</span>
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{formData.phone}</span>
                <span className="text-muted-foreground">City:</span>
                <span className="font-medium">{formData.city}</span>
                <span className="text-muted-foreground">Vehicle:</span>
                <span className="font-medium">
                  {formData.vehicleYear} {formData.vehicleMake}{" "}
                  {formData.vehicleModel}
                </span>
                <span className="text-muted-foreground">Registration:</span>
                <span className="font-medium">
                  {formData.registrationNumber}
                </span>
                <span className="text-muted-foreground">Battery:</span>
                <span className="font-medium">
                  {formData.batteryCapacity} kWh
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrev} disabled={loading}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          )}
        </CardFooter>
      </Card>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Login
        </a>
      </div>
    </div>
  );
}
