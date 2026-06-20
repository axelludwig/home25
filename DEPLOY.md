# Mise en production — home25

## Stack

| Composant | Technologie | Port |
|-----------|-------------|------|
| Frontend SSR | Angular 19 + Express (SSR) | 4000 |
| Backend API | Node.js + Express | 3000 |
| Reverse proxy | Nginx | 80 / 443 |

---

## 1. Build du frontend

```bash
cd home25

# Installer les dépendances
npm ci

# Build de production (SSR inclus)
npm run build
# équivalent : ng build --configuration production
```

Les fichiers générés :
```
dist/home25/
  browser/      ← assets statiques (JS, CSS, fonts…)
  server/
    server.mjs  ← serveur SSR Node.js
```

---

## 2. PM2 — Backend API (home25back)

### Installation de PM2 (une seule fois sur le serveur)

```bash
npm install -g pm2
```

### Créer le fichier `.env` de production

```bash
# home25back/.env
PORT=3000
API_KEY=ta_cle_openweathermap
```

### Lancer le backend avec PM2

```bash
cd home25back
npm ci --omit=dev

pm2 start index.js --name home25-api
```

### Lancer le serveur SSR frontend avec PM2

```bash
cd home25

pm2 start dist/home25/server/server.mjs --name home25-ssr
```

> Par défaut le serveur SSR écoute sur le port **4000**.
> Tu peux le changer avec la variable d'env `PORT` :
> ```bash
> PORT=4000 pm2 start dist/home25/server/server.mjs --name home25-ssr
> ```

### Sauvegarder les process PM2 (redémarrage automatique au reboot)

```bash
pm2 save
pm2 startup   # génère la commande systemd à exécuter en root
```

### Commandes PM2 utiles

```bash
pm2 list                  # état des process
pm2 logs home25-api       # logs backend
pm2 logs home25-ssr       # logs SSR
pm2 restart home25-api    # redémarrer le backend
pm2 restart home25-ssr    # redémarrer le SSR
```

---

## 3. Configuration Nginx

```nginx
# /etc/nginx/sites-available/home25

server {
    listen 80;
    server_name ton-domaine.com www.ton-domaine.com;

    # ── Assets statiques Angular (browser) ──────────────────────────────
    # Servir directement les fichiers compilés pour éviter de passer par Node
    location /assets/ {
        root /var/www/home25/dist/home25/browser;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Fichiers statiques avec hash (JS/CSS/fonts générés par Angular)
    location ~* \.(js|css|woff2?|ttf|eot|ico|png|jpg|svg|webp)$ {
        root /var/www/home25/dist/home25/browser;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        try_files $uri =404;
    }

    # ── API backend (home25back) ─────────────────────────────────────────
    location /weather {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ── Serveur SSR Angular (tout le reste) ─────────────────────────────
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Activer le site et recharger Nginx

```bash
ln -s /etc/nginx/sites-available/home25 /etc/nginx/sites-enabled/
nginx -t            # vérification de la config
systemctl reload nginx
```

### HTTPS avec Certbot (recommandé)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d ton-domaine.com -d www.ton-domaine.com
```

Certbot modifie automatiquement le bloc `server` pour le SSL.

---

## 4. Variables d'environnement à ne pas oublier

| Fichier | Variable | Description |
|---------|----------|-------------|
| `home25back/.env` | `API_KEY` | Clé OpenWeatherMap |
| `home25back/.env` | `PORT` | Port du backend (défaut : 3000) |
| env système / PM2 | `PORT` | Port du serveur SSR (défaut : 4000) |

---

## 5. Résumé du flux de requêtes

```
Client
  │
  ▼
Nginx :80/:443
  ├── /weather, /api/*  →  PM2 home25-api  (port 3000, home25back)
  ├── *.js, *.css, …    →  Fichiers statiques dist/home25/browser/
  └── /*                →  PM2 home25-ssr  (port 4000, Angular SSR)
```
