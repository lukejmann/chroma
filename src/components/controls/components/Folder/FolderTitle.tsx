import React from "react";
import { StyledTitle } from "./StyledFolder";
import { Chevron } from "../UI";

export type FolderTitleProps = {
  name?: string;
  toggled: boolean;
  toggle: (flag?: boolean) => void;
  collapsable?: boolean;
};

export function FolderTitle({ toggle, toggled, name }: FolderTitleProps) {
  return (
    <StyledTitle onClick={() => toggle()}>
      <Chevron toggled={toggled} />
      <div style={{ fontWeight: "700" }}>{name}</div>
    </StyledTitle>
  );
}
