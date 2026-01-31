"use client";
import React, { useState } from "react";
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
import { Edit2 } from "lucide-react";

function UserAddressCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-5 border border-border rounded-2xl bg-card lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-6">Address</h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Country</p>
              <p className="text-sm font-medium">United States</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">City/State</p>
              <p className="text-sm font-medium">Phoenix, Arizona</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Postal Code</p>
              <p className="text-sm font-medium">ERT 2489</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">TAX ID</p>
              <p className="text-sm font-medium">AS4568384</p>
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
                <Label>Country</Label>
                <Input defaultValue="United States" />
              </div>
              <div className="space-y-2">
                <Label>City/State</Label>
                <Input defaultValue="Arizona, United States" />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input defaultValue="ERT 2489" />
              </div>
              <div className="space-y-2">
                <Label>TAX ID</Label>
                <Input defaultValue="AS4568384" />
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

function UserInfoCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-5 border border-border rounded-2xl bg-card lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-6">Personal Information</h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7">
            <div>
              <p className="mb-2 text-xs text-muted-foreground">First Name</p>
              <p className="text-sm font-medium">Musharof</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Last Name</p>
              <p className="text-sm font-medium">Chowdhury</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                Email address
              </p>
              <p className="text-sm font-medium">randomuser@pimjo.com</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">+09 363 398 46</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Bio</p>
              <p className="text-sm font-medium">Team Manager</p>
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
                <Label>First Name</Label>
                <Input defaultValue="Musharof" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input defaultValue="Chowdhury" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="randomuser@pimjo.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue="+09 363 398 46" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Bio</Label>
                <Input defaultValue="Team Manager" />
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

function UserMetaCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-5 border border-border rounded-2xl bg-card lg:p-6 mb-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-border rounded-full relative">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="user"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center xl:text-left">
            <h4 className="mb-2 text-lg font-semibold">Musharof Chowdhury</h4>
            <div className="flex flex-col items-center gap-1 xl:flex-row xl:gap-3">
              <p className="text-sm text-muted-foreground">Team Manager</p>
              <div className="hidden h-3.5 w-px bg-border xl:block"></div>
              <p className="text-sm text-muted-foreground">
                Arizona, United States
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
              <DialogTitle>Edit Profile Meta</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Social Links</Label>
                <div className="grid gap-4">
                  <Input placeholder="Facebook URL" />
                  <Input placeholder="Twitter URL" />
                  <Input placeholder="LinkedIn URL" />
                </div>
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

export default function UserProfilePage() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      <UserMetaCard />
      <UserInfoCard />
      <UserAddressCard />
    </div>
  );
}
