/**
 * CastSplit — Web Receiver personalizzato.
 *
 * L'unico scopo di questo receiver (rispetto al Default Media Receiver di
 * Google usato normalmente) è poter riscrivere gli header HTTP di ogni
 * richiesta che il dispositivo fa per scaricare il video: molti siti di
 * streaming proteggono i propri file controllando che la richiesta porti
 * lo stesso Referer/Cookie/User-Agent del browser da cui si è navigato —
 * senza questo, il dispositivo Cast riceve un file vuoto/incompleto e resta
 * bloccato in "buffering" per sempre, anche se lo stesso URL funziona
 * perfettamente nel browser del telefono.
 *
 * L'app CastSplit manda gli header da usare dentro il messaggio LOAD
 * (media.customData.headers); qui li leggiamo e li riapplichiamo ad ogni
 * richiesta di rete del player (manifest, segmenti, licenza DRM).
 */
const context = cast.framework.CastReceiverContext.getInstance();
const playbackConfig = new cast.framework.PlaybackConfig();

let currentHeaders = null;

function applyCustomHeaders(requestInfo) {
  if (currentHeaders) {
    requestInfo.headers = Object.assign({}, requestInfo.headers, currentHeaders);
  }
}

// Tutti e tre: un file diretto passa per segmentRequestHandler, uno
// HLS/DASH anche per manifestRequestHandler; licenseRequestHandler è per
// eventuale DRM (non usato da CastSplit oggi, ma non costa nulla coprirlo).
playbackConfig.manifestRequestHandler = applyCustomHeaders;
playbackConfig.segmentRequestHandler = applyCustomHeaders;
playbackConfig.licenseRequestHandler = applyCustomHeaders;

const playerManager = context.getPlayerManager();
playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  (loadRequestData) => {
    const media = loadRequestData && loadRequestData.media;
    const headers = media && media.customData && media.customData.headers;
    currentHeaders = headers && typeof headers === 'object' ? headers : null;
    return loadRequestData;
  },
);

context.start({ playbackConfig });
