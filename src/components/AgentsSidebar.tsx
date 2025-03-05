
import { Link, useLocation } from "react-router-dom";
import { Bot, PlusCircle, Home, Settings, List, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const AgentsSidebar: React.FC = () => {
  const location = useLocation();
  
  const mainMenuItems = [
    {
      title: "Dashboard",
      url: "/agents",
      icon: Home,
      exact: true
    },
    {
      title: "My Agents",
      url: "/agents?filter=my-agents",
      icon: Bot
    },
    {
      title: "Team Agents",
      url: "/agents?filter=team-agents",
      icon: Users
    },
    {
      title: "All Agents",
      url: "/agents?filter=all-agents",
      icon: List
    }
  ];
  
  const isActive = (item: { url: string, exact?: boolean }) => {
    if (item.exact) {
      return location.pathname === item.url;
    }
    return location.pathname.startsWith(item.url.split('?')[0]) && 
           (location.search === item.url.split('?')[1] ? `?${item.url.split('?')[1]}` : false || !item.url.includes('?'));
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-agent-primary" />
          <h1 className="text-xl font-semibold text-agent-text">Agent Hub</h1>
        </div>
        <SidebarTrigger className="absolute right-2 top-4" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={cn(
                    isActive(item) ? "bg-agent-accent text-agent-primary font-medium" : "text-gray-600 hover:bg-gray-100"
                  )}>
                    <Link to={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="bg-agent-primary text-white hover:bg-agent-primary/90">
                  <Link to="/agents/create" className="flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200">
                    <PlusCircle className="h-5 w-5" />
                    <span>Create New Agent</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-gray-600 hover:bg-gray-100">
              <Link to="/agents/settings" className="flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AgentsSidebar;
