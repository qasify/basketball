import React from 'react'
import Header from "./_components/Header";
import { Notification as NotificationType } from "./_types";
import Notification from "./_components/Notification";

const Notifications = () => {
  const notifications: NotificationType[] = [
    {
      id: 1,
      timeStamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
      title: "Player Michael Jordan has been promoted to team captain",
      description:
        "Player LeBron James has completed the 'Advanced Shooting' training with a 10% increase in shooting accuracy",
    },
    {
      id: 2,
      timeStamp: Date.now() - 60 * 60 * 1000, // 1 hour ago
      title: "Player Michael Jordan has been promoted to team captain",
      description:
        "Player LeBron James has completed the 'Advanced Shooting' training with a 10% increase in shooting accuracy",
    },
    {
      id: 3,
      timeStamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
      title: "Player Michael Jordan has been promoted to team captain",
      description:
        "Player LeBron James has completed the 'Advanced Shooting' training with a 10% increase in shooting accuracy",
    },
    {
      id: 4,
      timeStamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
      title: "Player Michael Jordan has been promoted to team captain",
      description:
        "Player LeBron James has completed the 'Advanced Shooting' training with a 10% increase in shooting accuracy",
    },
    {
      id: 5,
      timeStamp: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
      title: "Player Michael Jordan has been promoted to team captain",
      description:
        "Player LeBron James has completed the 'Advanced Shooting' training with a 10% increase in shooting accuracy",
    },
    {
      id: 6,
      timeStamp: Date.now() - 2 * 30 * 24 * 60 * 60 * 1000, // 2 months ago
      title: "Player Michael Jordan has been promoted to team captain",
      description:
        "Player LeBron James has completed the 'Advanced Shooting' training with a 10% increase in shooting accuracy",
    },
    {
      id: 7,
      timeStamp: Date.now() - 6 * 30 * 24 * 60 * 60 * 1000, // 6 months ago
      title: "Player Michael Jordan has been promoted to team captain",
      description:
        "Player LeBron James has completed the 'Advanced Shooting' training with a 10% increase in shooting accuracy",
    },
  ];
  return (
    <div className="flex flex-col p-6 gap-5">
      <Header />
      <div className="flex flex-col gap-[14px]">
        {notifications?.map((notification) => (
          <Notification key={notification?.id} {...notification} />
        ))}
      </div>
    </div>
  );
};

export default Notifications;