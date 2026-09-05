# Database Collections

MongoDB Atlas, accessed via Mongoose. Collections (see `backend/src/models`):

- `users`
- `artisanProfiles`
- `products`
- `categories`
- `orders`
- `conversations`
- `messages`
- `notifications`
- `reviews`
- `favorites`
- `cart`
- `aiGenerations`
- `appVersions`
- `reports`

## Key indexes
```js
ProductSchema.index({ title: 'text', 'description.english': 'text', category: 1 });
ProductSchema.index({ artisanId: 1 });
ProductSchema.index({ status: 1, createdAt: -1 });
MessageSchema.index({ conversationId: 1, createdAt: 1 });
```

## Notable schema shapes
See the guide's section 15 for full field lists; the Mongoose models in
`backend/src/models` mirror them exactly (User, ArtisanProfile, Product,
Conversation, Message, Order).
