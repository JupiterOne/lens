/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import fetchInjectable from "../../../../common/fetch/fetch.injectable";
import lensProxyPortInjectable from "../../../lens-proxy/lens-proxy-port.injectable";

const requestAppVersionViaProxyInjectable = getInjectable({
  id: "request-app-version-via-proxy",
  instantiate: (di) => {
    const lensProxyPort = di.inject(lensProxyPortInjectable);
    const fetch = di.inject(fetchInjectable);

    return async () => {
      const response = await fetch(`http://127.0.0.1:${lensProxyPort.get()}/version`);

      return (await response.json()).version as string;
    };
  },
});

export default requestAppVersionViaProxyInjectable;
