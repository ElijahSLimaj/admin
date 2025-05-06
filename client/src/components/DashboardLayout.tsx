// src/components/DashboardLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
} from "./ui/sidebar";
import {
  Layers,
  Users,
  Globe,
  CreditCard,
  FileText,
  UserCircle,
  Settings,
  FileEdit,
  ExternalLink,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile } from "@/hooks/useMobile";
import { SidebarIcon } from "./ui/sidebaricons";
import { BackgroundImage } from "./BackgroundImage";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const isMobile = useMobile();

  // Projects submenu state
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(
    location.pathname.startsWith("/projects") ? "projects" : null
  );
  const toggleSubmenu = (key: string) =>
    setOpenSubmenu(openSubmenu === key ? null : key);

  // Sidebar open/collapse
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    if (
      location.pathname.startsWith("/projects") &&
      openSubmenu !== "projects"
    ) {
      setOpenSubmenu("projects");
    }
    if (
      !location.pathname.startsWith("/projects") &&
      openSubmenu === "projects"
    ) {
      setOpenSubmenu(null);
    }
  }, [location.pathname, openSubmenu, isMobile]);

  const navigateTo = (path: string) => {
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isProjectsPage = location.pathname.startsWith("/projects");
  const isDrafts = location.pathname === "/projects/drafts";
  const isDeployed = location.pathname === "/projects/deployed";
  const initial = user?.name?.[0]?.toUpperCase() || "U";

  return (
    <div className="relative min-h-screen">
      {/* 1) BLEED GRAPHIC */}
      <BackgroundImage />

      {/* 2) Dark-mode overlay inset */}
      <div
        className="hidden dark:block absolute inset-4 rounded-xl pointer-events-none -z-10"
        style={{ backgroundColor: "#111016CC" }}
      />

      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen relative">
          {/* ========== SIDEBAR ========== */}
          <Sidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            className="border-r fixed md:relative"
          >
            <SidebarHeader className="pt-6 pb-4">
              <div className="flex items-center px-6">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  {/* Logo */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-primary"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2.00001 17.5228 6.47716 22 12 22Z"
                      fill="currentColor"
                      fillOpacity="0.2"
                    />
                    <path
                      d="M15.5 9C15.5 11.2091 13.7091 13 11.5 13H9V9C9 6.79086 10.7909 5 13 5C15.2091 5 15.5 6.79086 15.5 9Z"
                      fill="currentColor"
                    />
                    <path
                      d="M9 13H11.5C13.7091 13 15.5 14.7909 15.5 17C15.5 19.2091 13.2091 20 11 20C8.79086 20 9 18.2091 9 16V13Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="ml-3 text-xl font-semibold">Pythagora</span>
                </div>
                {isMobile && (
                  <div className="ml-auto">
                    <SidebarTrigger onClick={() => setSidebarOpen(!sidebarOpen)} />
                  </div>
                )}
              </div>
            </SidebarHeader>

            <SidebarContent className="px-3">
              <SidebarMenu className="space-y-2">
                {/* Projects */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isProjectsPage}
                    tooltip="Projects"
                    onClick={() => {
                      toggleSubmenu("projects");
                      if (!isProjectsPage) navigateTo("/projects/drafts");
                    }}
                    className="w-full py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <SidebarIcon icon={<Layers />} isActive={isProjectsPage} />
                    <span>Projects</span>
                    <ChevronDown
                      className={`h-4 w-4 ml-auto transition-transform ${openSubmenu === "projects" ? "rotate-180" : "rotate-0"
                        }`}
                    />
                  </SidebarMenuButton>
                  {openSubmenu === "projects" && (
                    <SidebarMenuSub className="mt-1 ml-2 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={isDrafts}
                          onClick={() => navigateTo("/projects/drafts")}
                          className="flex items-center py-2.5 px-3 w-full rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          <SidebarIcon icon={<FileEdit />} isActive={isDrafts} className="h-4 w-4 mr-3" />
                          Drafts
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          isActive={isDeployed}
                          onClick={() => navigateTo("/projects/deployed")}
                          className="flex items-center py-2.5 px-3 w-full rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground"
                        >
                          <SidebarIcon icon={<ExternalLink />} isActive={isDeployed} className="h-4 w-4 mr-3" />
                          Deployed
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>

                {/* Team */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === "/team"}
                    tooltip="Team"
                    onClick={() => navigateTo("/team")}
                    className="w-full py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <SidebarIcon icon={<Users />} isActive={location.pathname === "/team"} />
                    <span>Team</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Domains */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === "/domains"}
                    tooltip="Domains"
                    onClick={() => navigateTo("/domains")}
                    className="w-full py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <SidebarIcon icon={<Globe />} isActive={location.pathname === "/domains"} />
                    <span>Domains</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Subscription */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === "/subscription"}
                    tooltip="Subscription"
                    onClick={() => navigateTo("/subscription")}
                    className="w-full py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <SidebarIcon icon={<CreditCard />} isActive={location.pathname === "/subscription"} />
                    <span>Subscription</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Payments */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === "/payments"}
                    tooltip="Payments"
                    onClick={() => navigateTo("/payments")}
                    className="w-full py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <SidebarIcon icon={<FileText />} isActive={location.pathname === "/payments"} />
                    <span>Payments</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Account */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === "/"}
                    tooltip="Account"
                    onClick={() => navigateTo("/")}
                    className="w-full py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <SidebarIcon icon={<UserCircle />} isActive={location.pathname === "/"} />
                    <span>Account</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* Settings */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={location.pathname === "/settings"}
                    tooltip="Settings"
                    onClick={() => navigateTo("/settings")}
                    className="w-full py-3 px-4 text-base font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    <SidebarIcon icon={<Settings />} isActive={location.pathname === "/settings"} />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="mt-auto py-6 px-6">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-between text-muted-foreground hover:text-foreground"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-medium">
                    {initial}
                  </div>
                  <span>Log out</span>
                </div>
                <LogOut className="h-5 w-5" />
              </button>
            </SidebarFooter>
          </Sidebar>

          {/* MAIN CONTENT */}
          <SidebarInset className="w-full p-4 relative z-0">
            {isMobile && (
              <div className="fixed top-4 left-4 z-30">
                <SidebarTrigger onClick={() => setSidebarOpen(!sidebarOpen)} />
              </div>
            )}

            <main className="relative flex-1 overflow-y-auto p-6 pt-16 md:pt-6">
              <div className="rounded-xl bg-black/20 p-6">
                <Outlet />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
