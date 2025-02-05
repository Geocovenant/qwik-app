/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import { extractBase, setSsrLocaleGetter } from 'compiled-i18n/qwik'
import { manifest } from "@qwik-client-manifest";
import Root from "./root";

// +++ Allow compiled-i18n to get the current SSR locale
setSsrLocaleGetter()

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // +++ Configure the base path for assets
		base: extractBase,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      // +++ Set the HTML lang attribute to the SSR locale
			lang: opts.serverData!.locale,
      ...opts.containerAttributes,
    },
    serverData: {
      ...opts.serverData,
    },
  });
}
