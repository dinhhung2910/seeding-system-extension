export const SERVER_ENDPOINT = process.env.NODE_ENV == 'development' ?
  'http://localhost:5000' : 'http://kaitovps:5000';

export const SITE_STATE_ELM_ID = 'SIGI_STATE';
export const SITE_CONFIG_ELM_ID = 'tiktok-cookie-banner-config';

export const TIKTOK_COMMENT_BOX_SELECTOR =
  'div[data-e2e="comment-input"] div[contenteditable="true"]';
export const TIKTOK_COMMENT_SUBMIT_SELECTOR = 'div[data-e2e="comment-post"]';
