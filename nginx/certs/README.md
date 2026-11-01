# TLS on the host (not Compose)

Compose no longer runs nginx. Terminate SSL on the VPS host nginx that already owns ports 80/443.

Use `../hostinger-proxy.conf` and point `ssl_certificate` / `ssl_certificate_key` at:

- Hostinger SSL files for `marriagebio.in`, or
- Let's Encrypt / certbot (`fullchain.pem` and `privkey.pem`)

Do not commit real certificate or key files into this repo.
