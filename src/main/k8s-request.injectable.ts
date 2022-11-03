/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { apiKubePrefix } from "../common/vars";
import type { Cluster } from "../common/cluster/cluster";
import { getInjectable } from "@ogre-tools/injectable";
import lensProxyPortInjectable from "./lens-proxy/lens-proxy-port.injectable";
import type { RequestInit } from "node-fetch";
import { Headers } from "node-fetch";
import fetchInjectable from "../common/fetch/fetch.injectable";

export type K8sRequest = (cluster: Cluster, path: string, options?: RequestInit) => Promise<unknown>;

const k8SRequestInjectable = getInjectable({
  id: "k8s-request",

  instantiate: (di): K8sRequest => {
    const lensProxyPort = di.inject(lensProxyPortInjectable);
    const fetch = di.inject(fetchInjectable);

    return async (cluster, path, options = {}) => {
      const kubeProxyUrl = `http://localhost:${lensProxyPort.get()}${apiKubePrefix}`;
      const headers = new Headers(options.headers);

      options.timeout ??= 30000;

      // used by getClusterForRequestInjectable
      headers.set("Host", `${cluster.id}.${new URL(kubeProxyUrl).host}`);

      options.headers = headers;

      return fetch(kubeProxyUrl + path, options);
    };
  },
});

export default k8SRequestInjectable;
