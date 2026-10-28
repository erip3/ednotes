# Infrastructure Maintenance: GitHub Container Registry & Runner

This guide covers routine maintenance for EdNotes infrastructure, with a primary focus on creating, rotating, and updating **Personal Access Tokens (PAT)** for the GitHub Container Registry (`ghcr.io`), along with runner service and storage hygiene.

---

## 1. Why a Personal Access Token (PAT) is Required

EdNotes publishes its backend container image to **GitHub Container Registry (GHCR)**:
```
ghcr.io/<github-username>/ednotes/backend:latest
```

To push images from the builder (Pi 5) and pull images onto the production server (DigitalOcean Droplet), Docker must authenticate against `ghcr.io`. 

### Why Maintenance is Needed
- **Token Expiration**: GitHub Personal Access Tokens have a mandatory expiration window (typically 30, 60, 90 days, or 1 year). When the token expires, container pushes or pulls immediately fail with `401 Unauthorized` or `denied: permission_denied`.
- **Credential Rotation**: Recommended periodically for security hygiene or whenever server access changes.

---

## 2. Generating a New GitHub Container Registry PAT

GitHub provides two token formats. The **Classic Token** is strongly recommended for standard Docker CLI compatibility.

### Step 1: Open Token Settings on GitHub
1. In the upper-right corner of GitHub, click your **profile photo** and choose **Settings**.
2. In the left sidebar, scroll to the bottom and click **Developer settings**.
3. Under **Personal access tokens**, click **Tokens (classic)**.
4. Click **Generate new token** > **Generate new token (classic)**.

### Step 2: Configure Token Permissions
1. **Note**: Give the token a descriptive name, e.g.:
   ```
   EdNotes GHCR Droplet & Runner Token
   ```
2. **Expiration**: Choose an interval (e.g., `90 days`).

3. **Select Scopes**:
   Check the following package scopes:
   - `repo`
   - [x] **`write:packages`** (Upload packages to GitHub Package Registry)
     - Automatically checks **`read:packages`** (Download packages from GitHub Package Registry)
   - [x] **`delete:packages`** *(Optional)* (Delete packages from GitHub Package Registry)

4. Click **Generate token** at the bottom of the page.
5. **Copy the token immediately** (it begins with `ghp_...`). GitHub will not display it again.

---

## 3. Applying the New Token Across Your Infrastructure

The new PAT needs to be updated in the environments that interact with `ghcr.io`:

### Target A: The DigitalOcean Droplet (Production Server)

The Droplet runs Docker to pull pre-built backend images. Update its stored credentials:

1. SSH into the Droplet:
   ```bash
   ssh root@<DROPLET_IP>
   ```

2. Authenticate Docker with GHCR using the new PAT:
   ```bash
   echo "<PASTE_NEW_PAT_HERE>" | docker login ghcr.io -u <YOUR_GITHUB_USERNAME> --password-stdin
   ```
   *Expected output:* `Login Succeeded`

3. Verify by manually pulling the latest backend image:
   ```bash
   docker pull ghcr.io/<YOUR_GITHUB_USERNAME>/ednotes/backend:latest
   ```

4. If needed, restart production containers:
   ```bash
   cd /opt/ednotes
   docker compose pull
   docker compose up -d
   ```

---

### Target B: GitHub Repository Secrets (Actions CI/CD)

If your workflow or deployment scripts reference a repository secret for the container registry (e.g., `CR_PAT` or `GHCR_PAT`):

1. Navigate to your repository on GitHub:
   **Settings > Secrets and variables > Actions**.
2. If `CR_PAT` or `GHCR_PAT` exists under **Repository secrets**:
   - Click the pencil icon (edit) next to it.
   - Paste the new PAT.
   - Click **Update secret**.

> [!NOTE]
> The current [`.github/workflows/deploy.yml`](file:///.github/workflows/deploy.yml) utilizes the automatic `${{ secrets.GITHUB_TOKEN }}` inside the runner job. However, if remote pulls on the Droplet fail due to package visibility, using a dedicated `CR_PAT` secret passed to the SSH step ensures uninterrupted access.

---

### Target C: The Raspberry Pi 5 (Self-Hosted Runner)

If you ever build or push images directly from the Pi outside of an automated GitHub Actions run:

1. SSH into the Pi:
   ```bash
   ssh edrip222@pi-web-builder.local
   ```

2. Log Docker into GHCR:
   ```bash
   echo "<PASTE_NEW_PAT_HERE>" | docker login ghcr.io -u <YOUR_GITHUB_USERNAME> --password-stdin
   ```

---

## 4. Package Permissions & Visibility Check

If you ever see `denied: denied` or `denied: installation not allowed to Create organization package`:

1. On GitHub, go to your profile and click the **Packages** tab (or go to your repository page).
2. Select the **backend** package (e.g., `ednotes/backend`).
3. Click **Package settings** in the right-hand menu:
   - **Manage Actions access**: Ensure your `ednotes` repository is listed with the **Write** or **Admin** role.
   - **Danger Zone / Change visibility**: If set to **Private**, ensure your Droplet is logged in using a PAT with `read:packages`.

---

## 5. Troubleshooting Token Errors

| Error Message | Cause | Solution |
|---|---|---|
| `unauthorized: authentication required` | Token expired or invalid username. | Generate a new PAT (Section 2) and re-run `docker login ghcr.io`. |
| `denied: permission_denied` | Token exists but lacks `read:packages` or `write:packages` scope. | Generate a new token with package scopes enabled. |
| `Error response from daemon: Get ...: denied` | Package is private and caller is unauthenticated. | Log into `ghcr.io` via Docker CLI on that machine. |
| Stale credentials stuck in Docker daemon | Docker config cached an old expired token. | Run `docker logout ghcr.io`, then run `docker login ghcr.io` with the new token. |

---

## 6. Runner Service Quick Reference

If you need to inspect or restart the runner service on the Raspberry Pi:

```bash
# Check runner status
sudo ~/actions-runner/svc.sh status

# Restart runner service
sudo systemctl restart $(cat ~/actions-runner/.service)

# View live runner logs
sudo journalctl -u $(cat ~/actions-runner/.service) -f
```

---

## 7. Storage Hygiene (Raspberry Pi & Droplet)

Docker images and build caches can fill up disk space over time:

```bash
# On Pi: Clean buildx build cache and untagged layers
docker builder prune -af
docker system prune -f

# On Droplet: Clean old backend container images after pulling updates
docker image prune -f
```

