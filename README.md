# ja3sentry
A Chrome extension for identifying signs of malicious activity through client TLS fingerprinting.

Contains multiple components:
- Echo Server: Mirrors TLS Client Hello handshake packet data back to the client, including calculated JA3 data for the client.