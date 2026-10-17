#!/bin/bash
# NCA Linux Hardware Access - udev Configuration
# Allows non-root users in the 'plugdev' and 'dialout' groups to access the FPGA NCE accelerator and SPI bus.

set -e

echo "=== Configuring NCA Hardware udev Rules ==="

RULES_FILE="/etc/udev/rules.d/99-nca-fpga.rules"

sudo bash -c "cat > $RULES_FILE" << 'EOF'
# Milk-V Mars FPGA Neural Compute Engine (NCE) Character Driver
KERNEL=="nce[0-9]*", MODE="0666", GROUP="plugdev"

# Hardware SPI Master Bus
KERNEL=="spidev[0-9]*.[0-9]*", MODE="0666", GROUP="spi"

# USB UART / Serial Debug Interface
SUBSYSTEM=="tty", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6010", MODE="0666", GROUP="dialout"
SUBSYSTEM=="tty", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE="0666", GROUP="dialout"
EOF

echo "Reloading udev rules..."
sudo udevadm control --reload-rules
sudo udevadm trigger

# Add current user to required hardware groups
sudo usermod -a -G plugdev,dialout "$USER"

echo "=== Configuration Complete ==="
echo "Please log out and log back in for group membership changes to take effect."
