"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Edit2,
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Car,
  CreditCard,
  Zap,
} from "lucide-react";
import authService from "@/app/services/authService";

interface UserData {
  userId: string;
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  location: {
    city: string;
    address?: {
      street?: string;
      area?: string;
      pincode?: string;
    };
    coordinates?: number[];
  };
  vehicle: {
    type: string;
    make: string;
    model: string;
    year: number;
    batteryCapacity: number;
    chargingSpeed: string;
    registrationNumber: string;
  };
  subscription: {
    plan: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  preferences: {
    maxDistance: number;
    pricePreference: string;
    chargingTimePreference: string;
  };
  wallet: {
    balance: number;
    currency: string;
  };
  usage: {
    totalSessions: number;
    avgSessionDuration: number;
    totalEnergyConsumed: number;
    totalAmountSpent: number;
    carbonSaved: number;
    lastChargingSession?: string;
  };
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: string;
}

function UserAddressCard({ userData }: { userData: UserData | null }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!userData) return null;

  return (
    <div className="p-5 border border-border rounded-2xl bg-card lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-6">Address & Location</h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">City</p>
              <p className="text-sm font-medium">{userData.location.city}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Area</p>
              <p className="text-sm font-medium">
                {userData.location.address?.area || "Not specified"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Street</p>
              <p className="text-sm font-medium">
                {userData.location.address?.street || "Not specified"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Postal Code</p>
              <p className="text-sm font-medium">
                {userData.location.address?.pincode || "Not specified"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                Max Distance Preference
              </p>
              <p className="text-sm font-medium">
                {userData.preferences.maxDistance} km
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Coordinates</p>
              <p className="text-sm font-medium">
                {userData.location.coordinates
                  ? `${userData.location.coordinates[1].toFixed(4)}, ${userData.location.coordinates[0].toFixed(4)}`
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 rounded-full">
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>City</Label>
                <Input defaultValue={userData.location.city} />
              </div>
              <div className="space-y-2">
                <Label>Area</Label>
                <Input defaultValue={userData.location.address?.area || ""} />
              </div>
              <div className="space-y-2">
                <Label>Street</Label>
                <Input defaultValue={userData.location.address?.street || ""} />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  defaultValue={userData.location.address?.pincode || ""}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function UserInfoCard({ userData }: { userData: UserData | null }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!userData) return null;

  return (
    <div className="p-5 border border-border rounded-2xl bg-card lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-6">Personal Information</h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            <div>
              <p className="mb-2 text-xs text-muted-foreground flex items-center gap-1">
                <UserIcon className="w-3 h-3" /> Full Name
              </p>
              <p className="text-sm font-medium">{userData.profile.name}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email Address
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{userData.profile.email}</p>
                {userData.isEmailVerified && (
                  <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone Number
              </p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{userData.profile.phone}</p>
                {userData.isPhoneVerified && (
                  <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">User ID</p>
              <p className="text-sm font-medium font-mono">{userData.userId}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                Subscription Plan
              </p>
              <p className="text-sm font-medium capitalize">
                {userData.subscription.plan}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Last Login</p>
              <p className="text-sm font-medium">
                {userData.lastLogin
                  ? new Date(userData.lastLogin).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 rounded-full">
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Edit Personal Information</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={userData.profile.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={userData.profile.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue={userData.profile.phone} disabled />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function UserMetaCard({ userData }: { userData: UserData | null }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!userData) return null;

  return (
    <div className="p-5 border border-border rounded-2xl bg-card lg:p-6 mb-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border-2 border-primary/20 rounded-full relative bg-gradient-to-br from-primary/10 to-primary/5">
            {userData.profile.avatar ? (
              <Image
                src={userData.profile.avatar}
                alt={userData.profile.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-primary" />
              </div>
            )}
          </div>
          <div className="text-center xl:text-left">
            <h4 className="mb-2 text-lg font-semibold">
              {userData.profile.name}
            </h4>
            <div className="flex flex-col items-center gap-1 xl:flex-row xl:gap-3">
              <p className="text-sm text-muted-foreground capitalize">
                {userData.subscription.plan} Plan
              </p>
              <div className="hidden h-3.5 w-px bg-border xl:block"></div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {userData.location.city}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-full shadow-sm border-input hover:bg-accent hover:text-accent-foreground"
        >
          <Edit2 className="w-4 h-4" /> Edit
        </button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Profile Picture URL</Label>
                <Input
                  placeholder="https://example.com/avatar.jpg"
                  defaultValue={userData.profile.avatar || ""}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function VehicleInfoCard({ userData }: { userData: UserData | null }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!userData) return null;

  return (
    <div className="p-5 border border-border rounded-2xl bg-card lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Car className="w-5 h-5" /> Vehicle Information
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Vehicle Type</p>
              <p className="text-sm font-medium capitalize">
                {userData.vehicle.type}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Make & Model</p>
              <p className="text-sm font-medium">
                {userData.vehicle.make} {userData.vehicle.model}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Year</p>
              <p className="text-sm font-medium">{userData.vehicle.year}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                Registration Number
              </p>
              <p className="text-sm font-medium font-mono">
                {userData.vehicle.registrationNumber}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                Battery Capacity
              </p>
              <p className="text-sm font-medium">
                {userData.vehicle.batteryCapacity} kWh
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                Charging Speed
              </p>
              <p className="text-sm font-medium capitalize">
                {userData.vehicle.chargingSpeed}
              </p>
            </div>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 rounded-full">
              <Edit2 className="w-4 h-4" /> Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Edit Vehicle Information</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Input defaultValue={userData.vehicle.type} />
              </div>
              <div className="space-y-2">
                <Label>Make</Label>
                <Input defaultValue={userData.vehicle.make} />
              </div>
              <div className="space-y-2">
                <Label>Model</Label>
                <Input defaultValue={userData.vehicle.model} />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" defaultValue={userData.vehicle.year} />
              </div>
              <div className="space-y-2">
                <Label>Battery Capacity (kWh)</Label>
                <Input
                  type="number"
                  defaultValue={userData.vehicle.batteryCapacity}
                />
              </div>
              <div className="space-y-2">
                <Label>Charging Speed</Label>
                <Input defaultValue={userData.vehicle.chargingSpeed} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setIsOpen(false)}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function UsageStatsCard({ userData }: { userData: UserData | null }) {
  if (!userData) return null;

  return (
    <div className="p-5 border border-border rounded-2xl bg-card lg:p-6">
      <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5" /> Usage Statistics
      </h4>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <p className="mb-2 text-xs text-muted-foreground">Total Sessions</p>
          <p className="text-2xl font-bold text-foreground">
            {userData.usage.totalSessions}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
          <p className="mb-2 text-xs text-muted-foreground">Energy Consumed</p>
          <p className="text-2xl font-bold text-foreground">
            {userData.usage.totalEnergyConsumed.toFixed(1)} kWh
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
          <p className="mb-2 text-xs text-muted-foreground">Carbon Saved</p>
          <p className="text-2xl font-bold text-foreground">
            {userData.usage.carbonSaved.toFixed(1)} kg
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
          <p className="mb-2 text-xs text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold text-foreground">
            ₹{userData.usage.totalAmountSpent.toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
          <p className="mb-2 text-xs text-muted-foreground">
            Avg Session Duration
          </p>
          <p className="text-2xl font-bold text-foreground">
            {userData.usage.avgSessionDuration.toFixed(0)} min
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
          <p className="mb-2 text-xs text-muted-foreground flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> Wallet Balance
          </p>
          <p className="text-2xl font-bold text-foreground">
            ₹{userData.wallet.balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        console.log("🔄 Fetching current user data...");
        const response = await authService.getMe();
        console.log("✅ User data fetched successfully:", response.user);
        setUserData(response.user);
        setError(null);
      } catch (err: any) {
        console.error("❌ Failed to fetch user data:", err);
        setError(err.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        <div className="p-6 border border-red-200 dark:border-red-800 rounded-2xl bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <UserMetaCard userData={userData} />
      <UserInfoCard userData={userData} />
      <VehicleInfoCard userData={userData} />
      <UserAddressCard userData={userData} />
      <UsageStatsCard userData={userData} />
    </div>
  );
}
