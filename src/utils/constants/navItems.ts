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
    key: "watchlist",
    label: "Watchlist",
    icon: "/icons/sidebar/watchlist.png",
    url: "/watchlist",
    width: 22,
    height: 18,
  },
  // {
  //   key: "notifications",
  //   label: "Notifications",
  //   icon: "/icons/sidebar/notifications.png",
  //   url: "/notifications",
  //   width: 18,
  //   height: 18,
  // },
  // News: no sidebar link; still reachable via /news
  // {
  //   key: "news",
  //   label: "News",
  //   icon: "/icons/sidebar/news.png",
  //   url: "/news",
  //   width: 18,
  //   height: 18,
  // },
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