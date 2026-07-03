# 达妙MC02之BSP\_FDCAN库的重新构建


| 版本号     | 修订时间         | 修订内容          |
|---------|--------------|---------------|
| *V1\.0* | *2026\.2\.4* | *进行了教程的第一版撰写* |

# 成功驱动电机之后我们要做的事情

有些同学在成功使用MC02开环控制电机之后，尝试将之前在大疆C板上的bsp\_can库进行移植，却发现一直处于收不到消息的状态，如果收不到电机的反馈信息，我们也就不能够对电机实现闭环控制，所以在这一章我们主要做的是FDCAN2或者FDCAN3的配置以及过滤器相关内容的处理。

# 如何接收信息

在之前的教程中我们知道接收电机数据必然离不开过滤器，接收回调函数，在MC02上同样也是如此。原理相同，硬件设施有升级的情况下，我们对于这些东西的软件处理相对来说肯定有一些变化，现在让我们从头来回顾一下它们。

## CubeMX配置部分

首先让我们看到CubeMX的配置部分，之前我们讲解过想要启用接收中断，就必须要在NVIC（嵌套向量中断控制器）中做文章。让我们把视角转向FDCAN1中的NVIC Settings，现在我们能够看到的有FDCAN1 interrupt0/1与FDCAN calibration unit interrupt这三个选项，其中最后一项在经典CAN中闻所未闻，我们第一步要做的事就是明确三者之间的区别：

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZDM3NmRhYjFjOTg2OTcyZWE4MzA1MTFlOGM1N2EyZDZfNjIwYzJkZTNkZTYyM2U1NmJjNWVjNTk0MjUwOGEwMzFfSUQ6NzYwMjk2NDA3MDIwMjk1MjkwOV8xNzgwOTc1ODAyOjE3ODEwNjIyMDJfVjM)

- FDCAN1 interrupt0：

最主要使用的中断类型，它的存在影响到所有最核心的通信部分，我们在RoboMaster阶段使用到的几乎全部的CAN通信中断内容都由它来处理。

- FDCAN1 interrupt1：

次要/辅助CAN通信的一些特性，比如Tx Event FIFO，Timestamp wrap或特殊调试类事件，这些东西与比赛能够用到的内容基本无关，更多的用在车规行业。

- FDCAN calibration unit interrupt：

这个属于FDCAN的特性，更加用不到，它的主要作用是在FDCAN\+BRS模式下根据接收边沿动态微调采样点和抵抗晶振误差，听起来就非常唬人，千万不要勾选。

那么综上所述，我们需要打开FDCAN1 interrupt0，并进行Generate Code。

## 过滤器配置部分

### 有什么区别

我们之前提到，CAN过滤器的配置主要通过ID\+MASK的模式对CAN报文进行过滤，它的主要特点是抽象层高，灵活性低，而在FDCAN的体系规则下，我们需要与硬件层之间搭建更加明确的规则，也就是说我们必须向硬件指定过滤器类型，匹配规则，命中后动作（进哪个FIFO或是丢掉）。

---

规则上具体的区别是：

1. FDCAN 支持「精确匹配」

```C++
filter.FilterType = FDCAN_FILTER_MASK;
filter.FilterID1 = 0x201;
filter.FilterID2 = 0x7FF;
```

这实际上等价于：**只接收 ID = 0x201**

2. FDCAN 支持「ID 范围」

```C++
filter.FilterType = FDCAN_FILTER_RANGE;
filter.FilterID1 = 0x201;
filter.FilterID2 = 0x208;
```

**一次规则 = 接收8个电机**

经典 CAN做不到这么干净

3. FDCAN 的“全接收”方式变了

经典CAN：

```C++
ID = 0
MASK = 0
```

FDCAN：

```C++
filter.FilterType = FDCAN_FILTER_RANGE;
filter.FilterID1 = 0x000;
filter.FilterID2 = 0x7FF;
```

---

同时在资源上也有一定的区别：

经典CAN：

- FilterBank：28 个

- CAN1 / CAN2 分用所有资源

FDCAN：

- 标准 ID 过滤器：28 个

- 扩展 ID 过滤器：8 个

- 每个 FDCAN 实例独立

### 软件层面如何配置

那么我们在软件上到底应该怎么处理？

FDCAN过滤器大致脱胎于我们之前在经典CAN中的处理，先让我们回顾一下是怎么进行经典CAN的配置的：

```C++
void bsp_can::BSP_CAN_FilterConfig()
{
    CAN_FilterTypeDef filter;

    /* ------------ CAN1：过滤器 0-13 全部接收 ------------ */
    filter.FilterActivation       = *ENABLE*;
    filter.FilterMode             = CAN_FILTERMODE_IDMASK;
    filter.FilterScale            = CAN_FILTERSCALE_32BIT;
    filter.FilterFIFOAssignment   = CAN_FILTER_FIFO0;

    filter.FilterIdHigh           = 0x0000;
    filter.FilterIdLow            = 0x0000;
    filter.FilterMaskIdHigh       = 0x0000;
    filter.FilterMaskIdLow        = 0x0000;

    filter.FilterBank             = 0;       // CAN1 的第一个过滤器组
    filter.SlaveStartFilterBank   = 14;      // 14 之后给 CAN2 用

    HAL_CAN_ConfigFilter(&hcan1, &filter);
    
    /* ------------ CAN2：过滤器 14-27 全部接收 ------------ */
    filter.FilterBank = 14;                 // CAN2 的第一个过滤器组
    HAL_CAN_ConfigFilter(&hcan1, &filter);  // 注意：必须用 hcan1 配置 CAN2 过滤器
}
```

关于为什么这么配置，我们可以自行查看CAN\_FilterTypeDef的结构体定义内容，同样的，在配置FDCAN\_FilterTypeDef的时候我们也应该查看其结构体定义内容，刚才我们提到了规则层面的变化，所以在软件配置的过程中，我们主要需要写的有以下几个内容：

1. IdType：标准帧还是扩展帧？这里自然是使用标准帧。

2. FilterIndex：这条规则是第几个？这里实际上对应过滤器编号，也就是之前我们在CubeMX中的Std Filters Nbr，这里我们用到第几个就填0\~3里对应的数字。

3. FilterType：用什么方式匹配？此处我们使用掩码模式匹配，最后配置为全接收。

4. FilterConfig：命中之后怎么处理？此处我们要放进FIFO0。

5. FilterID1/2：匹配规则的参数？怎么写取决于FilterType，这里既然要全接受，那就是全空。

当这里的参数填写完全之后，我们会使用HAL库的函数HAL\_FDCAN\_ConfigFilter将过滤器配置规则应用到FDCAN上。

做完这一步之后，我们仍然还有工作需要做。之前我们提到经典CAN的过滤器配置是依赖于Mailbox\+轮询模式的CAN收发体系，但是在FDCAN框架下进行经典CAN的收发却是依赖于FIFO\+中断驱动来处理的，那么比如在双板通讯时可能会发出的无效CAN帧就会直接进入FIFO，包括大部分可能出现的异常CAN帧在赛场上可能就会干扰比赛结果，为了避免这一情况的发生，HAL库给我们提供了一个名为HAL\_FDCAN\_ConfigGlobalFilter的函数，能够将没有符合过滤器规则的CAN帧以我们预想的方式进行处理，具体表现为：

```C++
HAL_FDCAN_ConfigGlobalFilter(
    &hfdcan1,
    FDCAN_REJECT,          // 非匹配 标准帧 → 丢弃
    FDCAN_REJECT,          // 非匹配 扩展帧 → 丢弃
    FDCAN_REJECT_REMOTE,   // 拒绝 标准远程帧
    FDCAN_REJECT_REMOTE    // 拒绝 扩展远程帧
);
```

那么现在我们贴出过滤器配置的完整代码块：

```C++
void bsp_fdcan::BSP_FDCAN_FilterConfig()
{
    FDCAN_FilterTypeDef filter;

    filter.IdType       = FDCAN_STANDARD_ID;
    filter.FilterIndex  = 0;
    filter.FilterType   = FDCAN_FILTER_MASK;
    filter.FilterConfig = FDCAN_FILTER_TO_RXFIFO0;

    filter.FilterID1    = 0x000;
    filter.FilterID2    = 0x000;

    if (HAL_FDCAN_ConfigFilter(&hfdcan1, &filter) != *HAL_OK*)
    {
        Error_Handler();
    }

    HAL_FDCAN_ConfigGlobalFilter(&hfdcan1,
        FDCAN_ACCEPT_IN_RX_FIFO0,
        FDCAN_ACCEPT_IN_RX_FIFO0,
        FDCAN_FILTER_REMOTE,
        FDCAN_FILTER_REMOTE
    );
}
```

## 接收中断回调部分

先说变化的部分，经典CAN中断是“事件 \+ FIFO”模型，而FDCAN 中断是“事件位图 \+ 多资源队列”模型。

这句话怎么理解呢？首先我们在经典CAN中使用HAL\_CAN\_RxFifo0MsgPendingCallback这个函数去接收对应的内容的时候，有一个隐藏的前提，即**这个回调被调用 = FIFO0里一定有至少1帧**，根据判断情况进入中断之后，再使用HAL\_CAN\_GetRxMessage去把接收到的内容存入结构体。总结一下，即一个中断基本等于一个事件的发生，一个事件必然触发一次回调，这种方式基础又简单。

现在让我们来看FDCAN，它的思路就大大不相同了：

首先它的回调函数传参就发生了变化，我们一般会这样用：

```C++
void HAL_FDCAN_RxFifo0Callback(FDCAN_HandleTypeDef *hfdcan, uint32_t RxFifo0ITs)
```

你会发现需要多传入一个RxFifo0ITs，这就是特殊之处，它的含义是中断事件位图，可能包含以下几种可能：

1. FDCAN\_IT\_RX\_FIFO0\_NEW\_MESSAGE：有新帧。

2. FDCAN\_IT\_RX\_FIFO0\_FULL：FIFO 满

3. FDCAN\_IT\_RX\_FIFO0\_WATERMARK：达到水位

4. FDCAN\_IT\_RX\_FIFO0\_MESSAGE\_LOST：丢帧

一言以蔽之，一次中断是多种事件的集合，而这在经典CAN中是无法实现的。

那么怎么区分这些可能性呢？其实我们也大致了解过上面的事件无非也就是一串宏，这些宏又对应了具体的数字，那么我们可以通过\&进行操作然后与一些基本状态比对来得到中断到底是由什么事件引发的。

让我们先来看看这些事件：

```C++
#define FDCAN_IT_RX_FIFO0_MESSAGE_LOST FDCAN_IE_RF0LE */*!< Rx FIFO 0 message lost                 */*
#define FDCAN_IT_RX_FIFO0_FULL         FDCAN_IE_RF0FE */*!< Rx FIFO 0 full                         */*
#define FDCAN_IT_RX_FIFO0_WATERMARK    FDCAN_IE_RF0WE */*!< Rx FIFO 0 fill level reached watermark */*
#define FDCAN_IT_RX_FIFO0_NEW_MESSAGE  FDCAN_IE_RF0NE */*!< New message written to RxFIFO 0       */*
```

```C++
/*****************  Bit definition for FDCAN_IE register  **********************/
#define FDCAN_IE_RF0NE_Pos        (0U)
#define FDCAN_IE_RF0NE_Msk        (0x1UL << FDCAN_IE_RF0NE_Pos)                /*!< 0x00000001 */
#define FDCAN_IE_RF0NE            FDCAN_IE_RF0NE_Msk                           /*!<Rx FIFO 0 New Message Enable                 */
#define FDCAN_IE_RF0WE_Pos        (1U)
#define FDCAN_IE_RF0WE_Msk        (0x1UL << FDCAN_IE_RF0WE_Pos)                /*!< 0x00000002 */
#define FDCAN_IE_RF0WE            FDCAN_IE_RF0WE_Msk                           /*!<Rx FIFO 0 Watermark Reached Enable           */
#define FDCAN_IE_RF0FE_Pos        (2U)
#define FDCAN_IE_RF0FE_Msk        (0x1UL << FDCAN_IE_RF0FE_Pos)                /*!< 0x00000004 */
#define FDCAN_IE_RF0FE            FDCAN_IE_RF0FE_Msk                           /*!<Rx FIFO 0 Full Enable                        */
#define FDCAN_IE_RF0LE_Pos        (3U)
#define FDCAN_IE_RF0LE_Msk        (0x1UL << FDCAN_IE_RF0LE_Pos)                /*!< 0x00000008 */
#define FDCAN_IE_RF0LE            FDCAN_IE_RF0LE_Msk                           /*!<Rx FIFO 0 Message Lost Enable                */
```

他们与RxFifo0ITs进行按位与操作就能够得到对应的事件类型，只要不是RESET（即0），那就可以进入下一步使用HAL\_FDCAN\_GetRxMessage对信息进行读取并按照FDCAN的序号进行结构体信息的存入

那么现在我们贴出接收中断回调函数配置的完整代码块：

```C++
// FDCAN 接收中断回调函数
void HAL_FDCAN_RxFifo0Callback(FDCAN_HandleTypeDef *hfdcan, uint32_t RxFifo0ITs)
{
    FDCAN_RxHeaderTypeDef RxHeader;
    uint8_t RxData[8];

    // 判断是不是“FIFO0 有新消息”中断
    if ((RxFifo0ITs & FDCAN_IT_RX_FIFO0_NEW_MESSAGE) != *RESET*)
    {
        if (HAL_FDCAN_GetRxMessage(hfdcan, FDCAN_RX_FIFO0, &RxHeader, RxData) == *HAL_OK*) {
            /* ================= FDCAN1处理 ================= */
            if (hfdcan->Instance == FDCAN1)
            {
                switch (RxHeader.Identifier)
                {
                    case 0x204://此处仅接收了id为0x204电机的报文
                    {
                        djimotor1.rotor_angle    = ((RxData[0] << 8) | RxData[1]);
                        djimotor1.rotor_speed    = ((RxData[2] << 8) | RxData[3]);
                        djimotor1.torque_current = ((RxData[4] << 8) | RxData[5]);
                        djimotor1.temp           =   RxData[6];
                        break;
                    }
                    default: break;
                }
            }
        }
    }
}
```

# 初始化函数的编写

这方面基本与经典CAN没什么区别，仅在一些HAL库函数上有所变化：

```C++
void bsp_fdcan::bsp_fdcan_init()
{
    static bsp_fdcan fdcan;

    // 1. 配置 FDCAN 过滤器
    fdcan.BSP_FDCAN_FilterConfig();

    // 2. 启动 FDCAN 外设
    if (HAL_FDCAN_Start(&hfdcan1) != *HAL_OK*)
    {
        Error_Handler();
    }
    // 如果有其他 CAN 外设，也在这里启动

    // 3. 激活 FDCAN 接收中断 (当 FIFO0 中有新消息时触发)
    if (HAL_FDCAN_ActivateNotification(&hfdcan1,FDCAN_IT_RX_FIFO0_NEW_MESSAGE,0) != *HAL_OK*)
    {
        Error_Handler(); // 激活中断失败
    }
    // 如果有其他 CAN 外设，也在这里激活中断
}
```

唯一比较值得注意的地方在于HAL\_CAN\_ActivateNotification向HAL\_FDCAN\_ActivateNotification的转变，后者需要额外多配置一个0，这里指代的是FIFO0。

# 仍需注意的地方！！！

一定一定记得新建文件夹CmakeList相关内容的添加！！！

一定一定记得代码规范中使用C\+\+特性需要注意的书写方法！！！

一定一定记得代码规范中面向C文件接口的书写方法！！！

一定一定记得包含头文件！！！

# 实际效果展示

在进行实际效果演示之前，我们要创建电机结构体，这里直接copy之前的即可，并根据你的实际操作对象初始化对应的结构体，并在main\.c函数中进行最小例子的测试：

```C++
/* USER CODE BEGIN 2 */
BSP_FDCAN_Init();

/* USER CODE END 2 */

/* Infinite loop */
/* USER CODE BEGIN WHILE */
while (1)
{
  bsp_fdcan_djimotorcmd(1000,1000,1000,1000);
  HAL_Delay(10);
  /* USER CODE END WHILE */

  /* USER CODE BEGIN 3 */
}
```

如代码块所示，现在让我们在HAL\_Delay处打上断点，开启调试并监视我们初始化的电机结构体。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=Njg1OGRjOTBiNDZhZGU4MDBjNGI0NWMwMTAyNGNkMDdfN2ZhMGI4MzA4Y2M4OWE1OGU3OWU0MTJmNDFiYjhlNjlfSUQ6NzYwMzEzOTY4MzUzNDYzODAzOV8xNzgwOTc1ODAyOjE3ODEwNjIyMDJfVjM)

当程序进入断点并且读取到电机的四个数据时，说明你真正实现通过配置过滤器与编写接收回调函数对电机的反馈数据进行接收。

# 想要启用更多路应该怎么操作？

现在我们已经能够使用新的BSP\_FDCAN库进行CAN报文的发送与接收了，那么之前我们也提到一条CAN总线能够控制的电机总归是有限的，所以我们必然会启用FDCAN2甚至FDCAN3，那么他们在CubeMX的配置上到底应该怎么处理？

在上一份文档中我们明确提到了一个需要注意的点，即所有FDCAN总线共用一块Message RAM，所以我们需要在Message RAM Offset这个设置上做一定的处理，让不同路的FDCAN在RAM上不出现重叠的现象，简单来说就是人为给他们划定这块RAM上的范围。

那么我们应该怎么去确定这个范围呢？如果你有查阅过手册或者资料，你可能会通过Basic Parameters Settings中的参数对应的RAM长度进行计算来得到FDCAN2或FDCAN3的Message RAM Offset，但是在这里我们会提供一个更加快捷的方法：

首先通过查询《STM32H7x3编程参考手册》可以看到，SRAMCAN\_BASE的值是0x4000AC00，这里即代表Message RAM的总起始位置，也就是你启用的第一个FDCAN总线对应RAM的起始位置，而我们配置FDCAN1的Message RAM Offset为0时，也就是直接进行了一个SRAMCAN\_BASE \- SRAMCAN\_BASE的操作，但是实际硬件位置就是SRAMCAN\_BASE，这么说起来可能会有点绕，不妨让我们先接着往下看。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MzYxNmM2NWVjMTJhNjJkMjc3NWI4NjNlOTFlNDRhZjVfZmU1YmFjYzBkNzdjMTlkZjIwNTE5ZjFmMWY5ZDU1Y2FfSUQ6NzYwMzU5MDg0MzQ4ODQ3MjI0NF8xNzgwOTc1ODAyOjE3ODEwNjIyMDJfVjM)

并且既然Message RAM Offset这个概念，相对的也有前一条FDCAN总线对应的EndAddress，即结束范围，理论上这两部分是直接相连的，那么我们有没有一种手段去获取这个EndAddress呢？

答案是有的，通过查看fdcan1结构体我们可以找到它msgRAM的组成中存在EndAddress，此处它的值为0x4000ad50，当然获取这个值需要在调试模式下打断点来实现。

![Image](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YjNjODQzNDJhYWMxNDg0ZTUzZTJiMjJhNWQyZGQ1NzdfOWUzMWE2NDU1MmNlNWRjNGQwNzJhY2YxYWJhYjVkYmRfSUQ6NzYwMzU5MTYwODcwODUwMDQ0MF8xNzgwOTc1ODAyOjE3ODEwNjIyMDJfVjM)

那么FDCAN2的Message RAM Offset就是0x4000ad50吗？这显然是不对的，我们仍然需要进行减去SRAMCAN\_BASE的操作，即前一条FDCAN总线的EndAddress \- SRAMCAN\_BASE，此处可以通过计算得到0x4000AC00 \- x4000AD50 = 0x150，也就是说我们需要在CubeMX中为FDCAN2的Message RAM Offset所填写的内容就是0x150。

至于其他的内容，与FDCAN1配置教程一致即可， 当然，不要忘了在bsp\_fdcan\_init\(\)中开启FDCAN2：

```C++
void bsp_fdcan::bsp_fdcan_init()
{
    static bsp_fdcan fdcan;

    // 1. 配置 FDCAN 过滤器
    fdcan.BSP_FDCAN_FilterConfig();

    // 2. 启动 FDCAN 外设
    if (HAL_FDCAN_Start(&hfdcan1) != *HAL_OK*)
    {
        Error_Handler();
    }
    if (HAL_FDCAN_Start(&hfdcan2) != *HAL_OK*)
    {
        Error_Handler();
    }
    // 如果有其他 CAN 外设，也在这里启动

    // 3. 激活 FDCAN 接收中断 (当 FIFO0 中有新消息时触发)
    if (HAL_FDCAN_ActivateNotification(&hfdcan1,FDCAN_IT_RX_FIFO0_NEW_MESSAGE,0) != *HAL_OK*)
    {
        Error_Handler(); // 激活中断失败
    }
    if (HAL_FDCAN_ActivateNotification(&hfdcan2,FDCAN_IT_RX_FIFO0_NEW_MESSAGE,0) != *HAL_OK*)
    {
        Error_Handler(); // 激活中断失败
    }
    // 如果有其他 CAN 外设，也在这里激活中断
}
```



