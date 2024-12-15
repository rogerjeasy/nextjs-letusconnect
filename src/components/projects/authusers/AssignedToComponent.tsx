"use client";

import React from "react";
import { Select, SelectItem, Avatar, SelectedItems } from "@nextui-org/react";
import { Participants } from "@/store/project";

interface AssignedToComponentProps {
  users: Participants[];
  onSelectionChange: (selectedUsers: Participants[]) => void;
}

const AssignedToComponent = ({ users, onSelectionChange }: AssignedToComponentProps) => {
  return (
    <Select
      classNames={{
        base: "max-w-xs",
        trigger: "h-12",
      }}
      items={users}
      labelPlacement="outside"
      placeholder="Select users"
      selectionMode="multiple"
      onSelectionChange={(keys) => {
        // Ensure keys is treated as a Set<string>
        const selectedKeys = new Set<string>(keys as Set<string>);
        const selectedUsers = users.filter((user) => selectedKeys.has(user.userId));
        onSelectionChange(selectedUsers);
      }}
      renderValue={(items: SelectedItems<Participants>) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <Avatar
              alt={item.data?.username}
              className="flex-shrink-0"
              size="sm"
              src={item.data?.profilePicture}
            />
            <div className="flex flex-col">
              <span>{item.data?.username}</span>
              <span className="text-default-500 text-tiny">({item.data?.email})</span>
            </div>
          </div>
        ));
      }}
    >
      {(user) => (
        <SelectItem key={user.userId} textValue={user.username}>
          <div className="flex gap-2 items-center">
            <Avatar alt={user.username} className="flex-shrink-0" size="sm" src={user.profilePicture} />
            <div className="flex flex-col">
              <span className="text-small">{user.username}</span>
              <span className="text-tiny text-default-400">{user.email}</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};

export default AssignedToComponent;