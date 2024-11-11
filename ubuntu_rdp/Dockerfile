FROM ubuntu:22.04

# Prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update && apt-get install -y \
    xrdp \
    xfce4 \
    xfce4-terminal \
    dbus-x11 \
    xorg \
    net-tools \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure XRDP
RUN cp /etc/xrdp/xrdp.ini /etc/xrdp/xrdp.ini.bak \
    && sed -i 's/3389/3389/g' /etc/xrdp/xrdp.ini \
    && sed -i 's/max_bpp=32/#max_bpp=32\nmax_bpp=128/g' /etc/xrdp/xrdp.ini \
    && sed -i 's/xserverbpp=24/#xserverbpp=24\nxserverbpp=128/g' /etc/xrdp/xrdp.ini

# Configure Xfce4 session
RUN echo "xfce4-session" > /etc/skel/.Xsession

# Create a startup script
RUN echo '#!/bin/bash\n\
/etc/init.d/xrdp start\n\
tail -f /dev/null' > /startup.sh \
    && chmod +x /startup.sh

# Set default user password (change this in production)
RUN useradd -m -s /bin/bash rdpuser \
    && echo "rdpuser:password" | chpasswd \
    && usermod -aG sudo rdpuser

# Expose RDP port
EXPOSE 3389

# Set the startup script as the entry point
CMD ["/startup.sh"]