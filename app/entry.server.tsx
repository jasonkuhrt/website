import { createReadableStreamFromReadable } from '@react-router/node'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import type { EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          responseHeaders.set('Content-Type', 'text/html')
          const body = new PassThrough()
          const stream = createReadableStreamFromReadable(body)
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          )
          pipe(body)
        },
        onShellError(error: unknown) {
          reject(error)
        },
        onError(error: unknown) {
          console.error(error)
        },
      },
    )

    setTimeout(abort, 5000)
  })
}
