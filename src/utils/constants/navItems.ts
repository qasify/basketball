import { NavItem } from "@/types/NavItem";

export const navItems: NavItem[] = [
  // Homepage: no sidebar link; still reachable via /dashboard and default page
  // {
  //   key: "home",
  //   label: "Homepage",
  //   icon: "/icons/sidebar/home.png",
  //   url: "/dashboard",
  //   width: 18,
  //   height: 18,
  // },
  // {
  //   key: "teamManagement",
  //   label: "Team Management",
  //   icon: "/icons/sidebar/teamManagement.png",
  //   url: "/team-management",
  //   width: 18,
  //   height: 18,
  // },
  {
    key: "playerDatabase",
    label: "Player Database",
    icon: "/icons/sidebar/playerDatabase.png",
    url: "/player-database",
    width: 18,
    height: 18,
  },
  {
    key: "freeAgents",
    label: "Free Agents",
    icon: "/icons/sidebar/freeAgents.png",
    url: "/free-agents",
    width: 18,
    height: 18,
  },
  {
    key: "watchlist",
    label: "Watchlist",
    icon: "/icons/sidebar/watchlist.png",
    url: "/watchlist",
    width: 22,
    height: 17,
  },
  // {
  //   key: "news",
  //   label: "News",
  //   icon: "/icons/sidebar/news.png",
  //   url: "/news",
  //   width: 18,
  //   height: 18,
  // },
  {
    key: "activityFeed",
    label: "Activity Feed",
    icon: "/icons/sidebar/activityFeed.png",
    url: "/activity-feed",
    width: 24,
    height: 18,
  },
];

export const bottomNavItems: NavItem[] = [
  {
    key: "settings",
    label: "Settings",
    icon: "/icons/sidebar/settings.png",
    url: "/settings",
    width: 18,
    height: 18,
  },
  {
    key: "support",
    label: "Support",
    icon: "/icons/sidebar/support.png",
    url: "/support",
    width: 18,
    height: 18,
  },
];
