import { useState } from "react";
import clsx from "clsx";
import React from "react";

const UserSettingNavbar = () => {
  const menuList = [
    {
      groupId: "MG1",
      groupName: "USER SETTINGS",
      items: [
        {
          id: "MG1_MN1",
          name: "My account",
          linkTo: "",
        },
        {
          id: "MG1_MN2",
          name: "Device",
          linkTo: "",
        },
      ],
    },
    {
      groupId: "MG2",
      groupName: "INSTALL APPS",
      items: [
        {
          id: "MG2_MN1",
          name: "Display",
          linkTo: "",
        },
        {
          id: "MG2_MN2",
          name: "Accessibility",
          linkTo: "",
        },
        {
          id: "MG2_MN3",
          name: "Chat",
          linkTo: "",
        },
        {
          id: "MG2_MN4",
          name: "Notification",
          linkTo: "",
        },
        {
          id: "MG2_MN5",
          name: "Advanced",
          linkTo: "",
        },
      ],
    },
    {
      groupId: "MG3",
      items: [
        {
          id: "MG3_MN2",
          name: "Logout",
          linkTo: "",
        },
      ],
    },
  ];

  const [menuItemActive, setMenuItemActive] = useState(menuList[0]);

  return (
    <div className="tw-h-full tw-bg-dark-4 tw-text-dark-2 tw-font-semibold tw-px-4 tw-py-10 tw-text-sm">
      {menuList.map((menuGroup, index) => (
        <React.Fragment key={menuGroup.groupId}>
          {menuGroup.groupName && (
            <div className="tw-px-4 tw-py-1.5 tw-text-xs opacity-75 tw-cursor-default">
              {menuGroup.groupName}
            </div>
          )}
          {menuGroup.items.map((menuItem) => (
            <div
              key={menuItem.id}
              className={clsx(
                "tw-px-4 tw-py-1.5 tw-cursor-pointer hover:tw-bg-dark-3 hover:tw-bg-opacity-50 tw-rounded-md tw-mb-1",
                {
                  "tw-bg-dark-3 tw-text-dark-1":
                    menuItemActive.id === menuItem.id,
                },
                { "hover:tw-text-dark-3": menuItemActive.id !== menuItem.id }
              )}
              onClick={() => setMenuItemActive(menuItem)}
            >
              {menuItem.name}
            </div>
          ))}
          {index !== menuList.length - 1 && <hr className="my-2" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default UserSettingNavbar;
