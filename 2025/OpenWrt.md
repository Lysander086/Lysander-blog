# configure the network of OpenWrt Router to have health sleep routine.
## crontab -e で編集
30 23 * * * /etc/init.d/network stop
15 00 * * * /etc/init.d/network start
