FROM ubuntu:22.04

# Prevent interactive prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install vsftpd and supporting packages
RUN apt-get update && apt-get install -y \
    vsftpd \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Create FTP user
RUN useradd -m -s /bin/bash ftpuser && \
    echo "ftpuser:ftppassword" | chpasswd

# Create FTP directory and set permissions
RUN mkdir -p /home/ftpuser/ftp && \
    chown ftpuser:ftpuser /home/ftpuser/ftp && \
    chmod 755 /home/ftpuser/ftp

# Configure vsftpd
RUN mv /etc/vsftpd.conf /etc/vsftpd.conf.orig
RUN echo "listen=YES" >> /etc/vsftpd.conf && \
    echo "listen_ipv6=NO" >> /etc/vsftpd.conf && \
    echo "anonymous_enable=NO" >> /etc/vsftpd.conf && \
    echo "local_enable=YES" >> /etc/vsftpd.conf && \
    echo "write_enable=YES" >> /etc/vsftpd.conf && \
    echo "local_umask=022" >> /etc/vsftpd.conf && \
    echo "dirmessage_enable=YES" >> /etc/vsftpd.conf && \
    echo "use_localtime=YES" >> /etc/vsftpd.conf && \
    echo "xferlog_enable=YES" >> /etc/vsftpd.conf && \
    echo "connect_from_port_20=YES" >> /etc/vsftpd.conf && \
    echo "chroot_local_user=YES" >> /etc/vsftpd.conf && \
    echo "secure_chroot_dir=/var/run/vsftpd/empty" >> /etc/vsftpd.conf && \
    echo "pam_service_name=vsftpd" >> /etc/vsftpd.conf && \
    echo "pasv_enable=YES" >> /etc/vsftpd.conf && \
    echo "pasv_min_port=40000" >> /etc/vsftpd.conf && \
    echo "pasv_max_port=40100" >> /etc/vsftpd.conf && \
    echo "userlist_enable=YES" >> /etc/vsftpd.conf && \
    echo "userlist_file=/etc/vsftpd.userlist" >> /etc/vsftpd.conf && \
    echo "userlist_deny=NO" >> /etc/vsftpd.conf

# Add FTP user to userlist
RUN echo "ftpuser" >> /etc/vsftpd.userlist

# Create required directory for vsftpd
RUN mkdir -p /var/run/vsftpd/empty

# Expose FTP ports
EXPOSE 21 

# Start vsftpd service
CMD ["/usr/sbin/vsftpd", "/etc/vsftpd.conf"]