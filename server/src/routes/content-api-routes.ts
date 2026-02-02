export default [
  {
    method: 'GET',
    path: '/api-video-asset',
    handler: 'api-video-asset.find',
  },
  {
    method: 'GET',
    path: '/api-video-asset/count',
    handler: 'api-video-asset.count',
  },
  {
    method: 'GET',
    path: '/api-video-asset/:id',
    handler: 'api-video-asset.findOne',
  },
  {
    method: 'POST',
    path: '/api-video-asset/webhook',
    handler: 'api-video-asset.webhookEncodingCompleted',
    config: {
      auth: false,
    },
  },
];
