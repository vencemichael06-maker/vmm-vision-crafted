# Contact delivery configuration

The inquiry UI is provider-agnostic. When a production delivery service is approved, set `VITE_CONTACT_ENDPOINT` to its HTTPS endpoint. The endpoint must accept a JSON `POST` with `name`, `email`, `project`, `budget`, and `message`.

When the variable is empty, the application submits to the same-origin `/api/contact` fallback. If no server handler is configured there, the request fails safely: the form preserves the inquiry, reports that delivery could not be confirmed, and offers direct email and WhatsApp fallbacks. It never reports success without a valid confirmation response.

A successful request must return a 2xx response with JSON shaped as:

```json
{ "referenceId": "YOUR-CONFIRMATION-ID" }
```

The UI only confirms success after receiving that reference ID. Network failures, non-2xx responses, and malformed success payloads preserve the visitor's entries and expose retry, email, and WhatsApp fallbacks.

The PHP budget ranges are provisional values from the implementation handoff and are isolated in `src/lib/vmm/contact-config.ts`. Replace them there after business approval.

## Social profile configuration

Set `VITE_FACEBOOK_URL` and `VITE_LINKEDIN_URL` to the verified, complete HTTPS profile URLs. The navigation dialog includes Facebook and LinkedIn controls. When either value is empty, its control remains visible but disabled and is announced as unavailable; the application does not create a placeholder link or invent a destination.
