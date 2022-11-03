/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { sortBy } from "lodash/fp";
import fetchInjectable from "../../../../../../../common/fetch/fetch.injectable";
import type { HelmRepo } from "../../../../../../../common/helm/helm-repo";

const publicHelmReposUrl = "https://github.com/lensapp/artifact-hub-repositories/releases/download/latest/repositories.json";

const requestPublicHelmRepositoriesInjectable = getInjectable({
  id: "request-public-helm-repositories",

  instantiate: (di) => {
    const fetch = di.inject(fetchInjectable);

    return async (): Promise<HelmRepo[]> => {
      const res = await fetch(publicHelmReposUrl, {
        timeout: 10_000,
      });

      const repositories = (await res.json()) as HelmRepo[];

      return sortBy(repo => repo.name, repositories);
    };
  },

  causesSideEffects: true,
});

export default requestPublicHelmRepositoriesInjectable;
