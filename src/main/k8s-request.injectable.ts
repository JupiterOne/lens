/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { apiKubePrefix } from "../common/vars";
import type { Cluster } from "../common/cluster/cluster";
import { getInjectable } from "@ogre-tools/injectable";
import lensProxyPortInjectable from "./lens-proxy/lens-proxy-port.injectable";
import fetchInjectable from "../common/fetch/fetch.injectable";
import { withTimeout } from "../common/fetch/timeout-controller";
import type { RequestInit } from "node-fetch";
import createHeadersInjectable from "../common/fetch/create-headers.injectable";

export type K8sRequest = (cluster: Cluster, path: string, options?: RequestInit) => Promise<unknown>;

const k8SRequestInjectable = getInjectable({
  id: "k8s-request",

  instantiate: (di): K8sRequest => {
    const lensProxyPort = di.inject(lensProxyPortInjectable);
    const fetch = di.inject(fetchInjectable);
    const createHeaders = di.inject(createHeadersInjectable);

    return async (cluster, path, options = {}) => {
      const kubeProxyUrl = `http://localhost:${lensProxyPort.get()}${apiKubePrefix}`;

      options.signal ??= withTimeout(30_000).signal;

      const headers = options.headers = createHeaders(options.headers);

      // used by getClusterForRequestInjectable
      headers.set("Host", `${cluster.id}.${new URL(kubeProxyUrl).host}`);

      return fetch(kubeProxyUrl + path, options);
    };
  },
});

export default k8SRequestInjectable;
