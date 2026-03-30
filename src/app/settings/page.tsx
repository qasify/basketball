import React from "react";
import SettingsView from "./_components/SettingsView";

const SettingsPage = () => {
  return (
    <div className="flex flex-col px-8 py-5 gap-6">
      <div>
        <h2 className="text-white text-xl font-bold uppercase tracking-wide">
          Settings
        </h2>
        <p className="text-textGrey text-sm max-w-xl leading-relaxed mt-1">
          Manage your profile and app preferences.
        </p>
      </div>
      <SettingsView />
    </div>
  );
};

export default SettingsPage;
