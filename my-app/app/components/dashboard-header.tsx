"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Cloud,
  MessageSquare,
  Moon,
  Sun,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";

import { UserProfileView } from "@/app/components/user-profile-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  notifications?: number;
}

export function DashboardHeader({ notifications = 5 }: DashboardHeaderProps) {
  const { setTheme, theme } = useTheme();
  return (
    <header className="bg-background/95 sticky top-0 z-10 flex h-16 items-center gap-3 border-b px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-xl font-semibold">Welcome User !</h1>
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl">
                  <Cloud className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cloud Storage</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-2xl">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Messages</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-2xl"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                    {notifications}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 mr-4 rounded-2xl overflow-hidden"
              align="end"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <h4 className="font-semibold">Notifications</h4>
                <Badge variant="secondary" className="rounded-full text-xs">
                  {notifications} New
                </Badge>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="flex flex-col gap-1 p-2">
                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl opacity-80" />
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0 mt-0.5">
                      <Zap className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">
                        Critical Failure
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        Station ST004 reported voltage instability.
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        2 mins ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-l-xl opacity-80" />
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full shrink-0 mt-0.5">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">
                        Stock Warning
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        Battery inventory low at Central Hub.
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        15 mins ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl opacity-80" />
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full shrink-0 mt-0.5">
                      <Cloud className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">
                        System Update
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        AI Agent 'Mechanic' optimized routing.
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        1 hr ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-xl opacity-80" />
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none mb-1">
                        Restock Complete
                      </p>
                      <p className="text-xs text-muted-foreground mb-1">
                        Logistics delivered 50 units to ST001.
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        3 hrs ago
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-2 border-t bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs h-8 rounded-xl"
                  asChild
                >
                  <Link href="/dashboard/notifications">View All Activity</Link>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Theme</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Sheet>
            <SheetTrigger asChild>
              <Avatar className="border-primary h-9 w-9 border-2 cursor-pointer transition-transform hover:scale-105">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="User"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[400px] sm:w-[540px] overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>User Profile</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <UserProfileView />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
