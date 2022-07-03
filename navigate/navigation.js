import * as React from "react";
import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";

let activeScreen;

export const isReadyRef = React.createRef();

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

// export const navigationRef = React.createRef();

// export function navigate(name: string, params?: any) {
//   navigationRef.current?.navigate(name, params);
// }
export function push(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function reset(name, params) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
    })
  );
}

export function setActiveScreen(_activeScreen) {
  activeScreen = _activeScreen;
}

export function getActiveScreen() {
  return activeScreen;
}
