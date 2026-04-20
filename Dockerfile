# ── Step 1: base image ───────────────────────────
# nginx:alpine = Nginx + Alpine Linux (~7 MB only)
FROM nginx:alpine

# ── Step 2: metadata ─────────────────────────────
LABEL maintainer="your.email@example.com"
LABEL version="1.0"
LABEL description="TaskFlow — Static Nginx Application"

# ── Step 3: copy app files ───────────────────────
COPY / /usr/share/nginx/html/

# ── Step 4: copy Nginx config ────────────────────
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ── Step 5: port exposed by the container ────────
EXPOSE 80

# ── Step 6: startup command ──────────────────────
CMD ["nginx", "-g", "daemon off;"]