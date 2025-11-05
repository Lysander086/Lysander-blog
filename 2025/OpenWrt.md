# configure the network of OpenWrt Router to have health sleep routine.
```text
# configure the network of OpenWrt Router to have health sleep routine.
## crontab -e で編集
45 21 * * * /etc/init.d/network stop
15 23 * * * /etc/init.d/network start
```
