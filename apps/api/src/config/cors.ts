import { INestApplication, Logger } from '@nestjs/common';
import { HttpRequestHeaderKeysEnum } from '../app/shared/framework/types';

export const corsOptionsDelegate: Parameters<INestApplication['enableCors']>[0] = function (req: Request, callback) {
  const corsOptions: Parameters<typeof callback>[1] = {
    origin: false as boolean | string | string[],
    preflightContinue: false,
    maxAge: 86400,
    allowedHeaders: Object.values(HttpRequestHeaderKeysEnum),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  };

  const origin = (req.headers as any)?.origin || '';

  if (enableWildcard(req)) {
    corsOptions.origin = '*';
  } else {
    corsOptions.origin = [process.env.FRONT_BASE_URL];
    if (process.env.WIDGET_BASE_URL) {
      corsOptions.origin.push(process.env.WIDGET_BASE_URL);
    }
  }

  const shouldDisableCorsForPreviewUrls = isPermittedDeployPreviewOrigin(req.headers);

  Logger.verbose(`Should allow deploy preview? ${shouldDisableCorsForPreviewUrls ? 'Yes' : 'No'}.`, {
    curEnv: process.env.NODE_ENV,
    previewUrlRoot: process.env.PR_PREVIEW_ROOT_URL,
    origin,
  });

  callback(null as unknown as Error, corsOptions);
};

function enableWildcard(req: Request): boolean {
  return (
    isSandboxEnvironment() ||
    isWidgetRoute(req.url) ||
    isBlueprintRoute(req.url) ||
    isPermittedDeployPreviewOrigin(req.headers)
  );
}

function isWidgetRoute(url: string): boolean {
  return url.startsWith('/v1/widgets');
}

function isBlueprintRoute(url: string): boolean {
  return url.startsWith('/v1/blueprints');
}

function isSandboxEnvironment(): boolean {
  return ['test', 'local'].includes(process.env.NODE_ENV);
}

function isPermittedDeployPreviewOrigin(headers): boolean {
  const host = (headers as any)?.host || '';

  return (
    process.env.PR_PREVIEW_ROOT_URL && process.env.NODE_ENV === 'dev' && host.includes(process.env.PR_PREVIEW_ROOT_URL)
  );
}
