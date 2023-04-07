# ja3sentry
A browser extension for identifying signs of malicious activity through client TLS fingerprinting.

Contains multiple components:
- Echo Server: Mirrors TLS Client Hello handshake packet data back to the client, including calculated JA3 data for the client.
- Extension: Client side Firefox extension which repeatedly contacts the Echo Server to get updated JA3s for the client. It then assesses the risk of the received JA3 and checks the JA3 against a database of known threats
- Verifier Lambda: A REST API that serves two endpoints:
    - Check a collection of JA3s against a database of *known threat* JA3 hashes
    - Add a JA3 to a database table of *potentially* risky client signatures