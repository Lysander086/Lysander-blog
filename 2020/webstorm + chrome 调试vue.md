### webstorm + chrome 调试vue

#### 步骤:

    (1) 安装jetbrains 插件
    (2) 如下图本地配置javascript Debug
        - 注意点:
            1. src目录旁边添加webpack://src
            2. 配置vue启动端口和url处填写的一样
      
![image](https://user-images.githubusercontent.com/19286863/90366478-e97b2000-e099-11ea-8016-0f4bf89ff2c6.png)


    (3) 配置webstorm debugger的提示端口和chrome中安装的插件配置的端口一样
        提示: 可以想将步骤2设置的js debug配置启动一遍就可以看到如下图红色框提示的需要chrome中配置的端口

![image](https://user-images.githubusercontent.com/19286863/90367133-f2202600-e09a-11ea-82a5-35432fd7bff1.png)
![image](https://user-images.githubusercontent.com/19286863/90366793-52fb2e80-e09a-11ea-8c82-bfa0b7e860a6.png)


    (4) 启动vue(正常run即可)和刚刚配置好的javascript debug
    另外: 不需要将项目弄成使用source-map方式启动
        将项目弄成source-map方式的js配置写法如下图
![image](https://user-images.githubusercontent.com/19286863/90367247-2b589600-e09b-11ea-80b3-1b4c201525cc.png)
    
    (5) 在必要出加上断点或者在要调试的代码行上写debugger这个单词
    
[参考链接](https://blog.csdn.net/guyue35/article/details/81669457)