import { useCallback } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "state/hooks";

import { updateUserDarkMode } from "./reducer";

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useAppSelector(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode,
    }),
    shallowEqual
  );
  // return true

  return userDarkMode === null ? matchesDarkMode : userDarkMode;
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const darkMode = useIsDarkMode();

  // const darkMode = false

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }));
  }, [darkMode, dispatch]);

  return [darkMode, toggleSetDarkMode];
}
