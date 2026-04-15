export type SupportFaqItem = {
  question: string;
  answer: string;
};

export const supportFaqs: SupportFaqItem[] = [
  {
    question: "How do I add a player to my watchlist?",
    answer:
      "Open Player Database, search for the player, and click the star icon. The player will appear in your Watchlist page instantly.",
  },
  {
    question: "Can I save notes for specific players?",
    answer:
      "Yes. Click the note icon for any player and save your notes. Notes are tied to that player and your account.",
  },
  {
    question: "Why can't I edit catalog players?",
    answer:
      "Catalog edit actions are available only when catalog CRUD is enabled on the server and your account has admin permissions.",
  },
  {
    question: "How do I update my profile name or password?",
    answer:
      "Go to Settings -> My Profile. You can edit your display name and update your password from that page.",
  },
  {
    question: "Who do I contact for bugs or access issues?",
    answer:
      "Email us at hooproster@gmail.com with screenshots and the page where the issue occurred. We will help you quickly.",
  },
];
