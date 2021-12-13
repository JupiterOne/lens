/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { setupIpcMainHandlers } from "./setup-ipc-main-handlers";
import loggerInjectable from "../../../../common/logger.injectable";
import clusterManagerInjectable from "../../../cluster/manager.injectable";
import clusterStoreInjectable from "../../../../common/cluster-store/cluster-store.injectable";
import { onLoadOfApplicationInjectionToken } from "../../../start-main-application/runnable-tokens/on-load-of-application-injection-token";
import operatingSystemThemeInjectable from "../../../theme/operating-system-theme.injectable";
import askUserForFilePathsInjectable from "../../../ipc/ask-user-for-file-paths.injectable";
import applicationMenuItemCompositeInjectable from "../../../../features/application-menu/main/application-menu-item-composite.injectable";
import emitAppEventInjectable from "../../../../common/app-event-bus/emit-event.injectable";
import createResourceApplierInjectable from "../../../resource-applier/create-resource-applier.injectable";

const setupIpcMainHandlersInjectable = getInjectable({
  id: "setup-ipc-main-handlers",

  instantiate: (di) => {
    const logger = di.inject(loggerInjectable);
    const clusterManager = di.inject(clusterManagerInjectable);
    const applicationMenuItemComposite = di.inject(applicationMenuItemCompositeInjectable);
    const clusterStore = di.inject(clusterStoreInjectable);
    const operatingSystemTheme = di.inject(operatingSystemThemeInjectable);
    const askUserForFilePaths = di.inject(askUserForFilePathsInjectable);
    const emitAppEvent = di.inject(emitAppEventInjectable);
    const createResourceApplier = di.inject(createResourceApplierInjectable);

    return {
      id: "setup-ipc-main-handlers",
      run: () => {
        logger.debug("[APP-MAIN] initializing ipc main handlers");

        setupIpcMainHandlers({
          applicationMenuItemComposite,
          clusterManager,
          clusterStore,
          operatingSystemTheme,
          askUserForFilePaths,
          emitAppEvent,
          createResourceApplier,
        });
      },
    };
  },

  injectionToken: onLoadOfApplicationInjectionToken,
  causesSideEffects: true,
});

export default setupIpcMainHandlersInjectable;
