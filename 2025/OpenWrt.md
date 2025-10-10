# configure the network of OpenWrt Router to have health sleep routine.
```text
# configure the network of OpenWrt Router to have health sleep routine.
## crontab -e で編集
10 22 * * * /etc/init.d/network stop
55 00 * * * /etc/init.d/network start
```
