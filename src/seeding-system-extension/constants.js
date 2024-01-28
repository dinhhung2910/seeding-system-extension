export const SERVER_ENDPOINT = process.env.NODE_ENV == 'development' ?
  'http://127.0.0.1:6000' : 'http://127.0.0.1:6000';

export const SITE_STATE_ELM_ID = 'SIGI_STATE';
export const SITE_CONFIG_ELM_ID = 'tiktok-cookie-banner-config';

export const TIKTOK_COMMENT_BOX_SELECTOR =
  'div[data-e2e="comment-input"] div[contenteditable="true"]';

export const TIKTOK_CHAT_BOX_SELECTOR =
  'div[data-e2e="chat-room"] div[contenteditable="true"]';
export const TIKTOK_COMMENT_SUBMIT_SELECTOR = 'div[data-e2e="comment-post"]';

export const MAX_TRIALS = 5;

export const ArticleEventResultCode = {
  NONE: 0,
  SUCCESS: 200,
  SERVER_TIMEOUT: 501,
  RUNNER_TIMEOUT: 502,
  UNAUTHENTICATED: 503,
};
