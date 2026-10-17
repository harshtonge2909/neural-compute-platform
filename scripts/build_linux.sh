#!/bin/bash
# Neural Computing Architecture - Linux Desktop Build & Packaging Script
set -e

echo "=========================================================="
echo " Building NCA Linux Desktop Application (Tauri 2 + Python)"
echo "=========================================================="

# 1. Check system prerequisites
echo "[1/5] Checking Linux dependencies..."
MISSING_PKGS=()
for pkg in libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libayatana-appindicator3-dev librsvg2-dev python3 python3-pip python3-venv; do
    if ! dpkg -s "$pkg" >/dev/null 2>&1; then
        MISSING_PKGS+=("$pkg")
    fi
done

if [ ${#MISSING_PKGS[@]} -ne 0 ]; then
    echo "Notice: Missing packages: ${MISSING_PKGS[*]}"
    echo "You can install them via: sudo apt-get update && sudo apt-get install -y ${MISSING_PKGS[*]}"
fi

# 2. Setup Python backend virtualenv
echo "[2/5] Setting up Python backend environment..."
python3 -m venv backend_venv
source backend_venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

# 3. Build React / Vite Frontend
echo "[3/5] Building Frontend production bundle..."
npm install
npm run build

# 4. Run automated test suite
echo "[4/5] Running verification test suite..."
python3 -m pytest backend/tests -v

# 5. Build Tauri Desktop Package
echo "[5/5] Building Tauri Linux AppImage / deb..."
if command -v cargo >/dev/null 2>&1; then
    cargo tauri build
    echo "=========================================================="
    echo " Build Successful!"
    echo " Generated packages located in src-tauri/target/release/bundle/"
    echo "=========================================================="
else
    echo "Cargo not detected. To generate the final standalone AppImage or .deb:"
    echo "1. Install Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    echo "2. Run: npm run tauri:build"
fi
