需要在template下的根节点加上如下样式

    .root-main{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        flex-direction: row;
    }
  
具体不知道为什么是这样, 查了官网的文档也没有展示scroll-into-view的具体用例. 希望有大大能够给出更底层的原因.
