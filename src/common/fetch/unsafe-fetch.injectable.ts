/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Fetch } from "./fetch.injectable";
import type * as FetchModule from "node-fetch";

const { NodeFetch: { default: fetch }} = require("../../../build/webpack/node-fetch.bundle") as { NodeFetch: typeof FetchModule };

// NOTE: this should not be used in general. Only used when the target is known is be within the control of the tests
const __UNSAFE_fetchInjectable = getInjectable({
  id: "unsafe-fetch",
  instantiate: (): Fetch => fetch,
});

export default __UNSAFE_fetchInjectable;
