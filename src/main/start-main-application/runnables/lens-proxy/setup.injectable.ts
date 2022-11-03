/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { beforeApplicationIsLoadingInjectionToken } from "../../runnable-tokens/before-application-is-loading-injection-token";
import setupLensProxyStartableStoppableInjectable from "./startable-stoppable.injectable";

const setupLensProxyInjectable = getInjectable({
  id: "setup-lens-proxy",

  instantiate: (di) => {
    const setupLensProxyStartableStoppable = di.inject(setupLensProxyStartableStoppableInjectable);

    return {
      id: "setup-lens-proxy",
      run: () => {
        setupLensProxyStartableStoppable.start();
      },
    };
  },

  injectionToken: beforeApplicationIsLoadingInjectionToken,
});

export default setupLensProxyInjectable;
