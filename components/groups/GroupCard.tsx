import { Verified, VerifiedIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import React from "react";
import Image from "next/image";

interface GroupCardProps {
  groupData: any; // Replace 'any' with the actual type of your group data
  ownerAvatarUrl: string; // Add the ownerAvatarUrl prop
}

const GroupCard: React.FC<GroupCardProps> = ({ groupData, ownerAvatarUrl }) => {
  return (
    <Card className="w-full text-center border border-zinc-900 shadow-lg bg-zinc-900 border-zinc-800 mt-4 rounded-none">
      <CardContent className="text-zinc-400 font-normal p-6">
        <div className="flex items-center justify-start flex-row space-x-2">
          <Image
            src={ownerAvatarUrl}
            alt="Owner Avatar"
            className="w-16 h-16 ml-2 rounded-full bg-black"
          />
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <p className="text-lg font-semibold">{groupData.displayName}</p>
              {groupData.verified && (
                <VerifiedIcon
                  className="w-4 h-4 ml-2 text-green-500"
                  strokeWidth={1.5}
                  stroke="black"
                  fill="white"
                />
              )}
            </div>
            <p className="text-sm text-zinc-500">
              {groupData.memberCount} members
            </p>
            <p className="text-sm text-zinc-500">
              {groupData.description.substring(0, 10) + "..."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
