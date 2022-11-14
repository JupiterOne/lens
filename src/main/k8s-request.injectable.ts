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

export type K8sRequest = (cluster: Cluster, path: string) => Promise<unknown>;

const k8SRequestInjectable = getInjectable({
  id: "k8s-request",

  instantiate: (di): K8sRequest => {
    const lensProxyPort = di.inject(lensProxyPortInjectable);
    const fetch = di.inject(fetchInjectable);

    return async (cluster, path) => {
      const kubeProxyUrl = `http://localhost:${lensProxyPort.get()}${apiKubePrefix}`;
      const controller = withTimeout(30_000);

      return fetch(kubeProxyUrl + path, {
        headers: {
          // used by getClusterForRequestInjectable
          Host: `${cluster.id}.${new URL(kubeProxyUrl).host}`,
        },
        signal: controller.signal,
      });
    };
  },
});

export default k8SRequestInjectable;
