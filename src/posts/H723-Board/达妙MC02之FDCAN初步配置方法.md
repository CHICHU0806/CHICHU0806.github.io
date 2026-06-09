# 达妙MC02之FDCAN初步配置方法

2026\.1\.15\-\-1157

# 大疆C板目前面临的一些问题

由于车载电机的增多，并且一个CAN线的负载最多支持6\-\-7个电机，超出这个数量就会导致CAN信号的丢失，所以对于大部分兵种我们准备采用达妙的MC02型开发板作为最终实际上场参赛的车辆的主控板，其拥有的三路FDCAN和多外设总线可以很好地支持大部分情况下的硬件开销，并且在价格上优于大疆C板，所以相对来说是一个性价比较高的选择，在大家有了使用大疆C板的经历后，我会用同样的方式带大家再走一遍喵板的用法。

# CubeMX配置

## debug设置位置的变动

首先按照工程创建的顺序，在Clion新建项目并且打开CubeMX进行芯片的选型，这里采用STM32H724VGT6。当我们进入配置界面后，首先还是先选择DEBUG模式，在之前使用大疆C板的时候我们在SYS中选择了Serial Wire作为debug模式，但是在喵板上他把这个选择的部分移动到了最下方

![Image](/images/posts/H723-Board/FDCAN/image1.PNG)

如果忘记选择这一项同样会导致成砖，那么这一块的处理办法还是和F103相同，只需要短接开发板上BOOT的两个孔位即可更改启动方式解除锁死状态。

## 先禁用MPU与Cache

在配置时钟树之前， 还需要将System Core中CORTEX\-M的Speculation default mode从Enabled改成Disabled，先关闭MPU和Cache可以避免不必要的麻烦（比如进入无意义的HardFault等情况）。

MPU（Memory Protection Unit 内存保护单元）与Cache（高速缓存）主要使用范围在DMA与RTOS相关部分，关于这两个的具体使用方式会在后期补上。

## 时钟树配置

接下来首先还是老样子，在RCC中启用晶振作为外部时钟源。

![Image](/images/posts/H723-Board/FDCAN/image2.PNG)

然后转到Clock Configuration做进一步配置，首先我们要还是HSE\+PLL的时钟方案，通过查阅手册可以知道我们的外部晶振频率为24MHz。

![Image](/images/posts/H723-Board/FDCAN/image3.PNG)

因此我们初步改动的范围如下，虽然之前提系统时钟频率越高越好，那么为什么这里不和F4一样拉满选择550MHz而是选择480MHz呢？首先第一点，480MHz相较于C板的系统时钟频率已经足够快，并且在后续配置CAN通信的过程中必须要给自己留下足够的退路，我们之前提到CAN总线挂载在APB1总线上，我们不妨使用550MHz，这个时候分配给CAN1的时钟频率便来到了137\.5MHz，所以对后续的预分频，时钟相位1，2等处理都非常不方便，所以这里我个人更倾向于使用官方提供的480MHz，这样能让CAN总线的时钟频率来到120MHz，非常方便后续让波特率达到1MHz的目标。

![Image](/images/posts/H723-Board/FDCAN/image4.PNG)

## 项目管理配置

我们仍然采用Clion作为编译器，用CMake指导编译，因此需要在Toolchain中选择CMake

![Image](/images/posts/H723-Board/FDCAN/image5.PNG)

同样的老生常谈，

![Image](/images/posts/H723-Board/FDCAN/image6.PNG)

综上，我们在CubeMX配置的内容就已经基本完成，我们现在可以直接使用电机外设进行测试。

# FDCAN配置

在使用电机之前，你一定会去寻找如同我们F4入门中的CAN通信配置选项，但是对于H7系列板只有FDCAN而没有CAN选项，在具体配置之前让我们先简单认识一下FDCAN。

## 什么是FDCAN，为什么使用FDCAN？

首先先放一个官方介绍在这里

https://www.st.com/content/ccc/resource/technical/document/application\_note/group1/98/6e/46/61/6e/2e/45/b0/DM00625700/files/DM00625700\.pdf/jcr:content/translations/en\.DM00625700\.pdf

接下来我们具体介绍一下：

**FDCAN = CAN 的“升级版控制器”，兼容经典CAN，同时支持更高带宽和更灵活的缓冲机制**

为什么 STM32H7 要“换掉”经典CAN？

经典CAN的问题是：

- FIFO 结构固定

- 缓冲区少

- 不支持 CAN\-FD

- 对高带宽系统（如 H7）不友好

所以 ST 在 H7 / G4 / H5 上做了这件事：**统一使用 Bosch M\_CAN IP（也就是 FDCAN）**

这不是 STM32 特有，是**行业标准实现**。

## CAN与FDCAN有什么区别？

### FDCAN 是“消息驱动”的，不是“邮箱驱动”的

传统 CAN（你可能见过）：

- Tx Mailbox 0 / 1 / 2

- Rx FIFO 0 / 1

我们会使用HAL\_CAN\_AddTxMessage这类HAL库函数来对发送信息进行处理

### FDCAN 的思维方式是“一切都是Message RAM里的消息对象”

包括：

- Tx Buffer，Rx Buffer

- Tx FIFO，Rx FIFO

CPU 并不是直接“操作寄存器”，而是**在一块专用RAM里读写消息结构**

### FDCAN 有一块”专属Message RAM”

这块 RAM：

- **不在普通 SRAM**

- 由 FDCAN 独占

- 大小有限

- 用来存放：帧内容，ID，DLC，时间戳，状态信息等内容

你在 CubeMX 里“配置 FIFO 数量”，本质就是**在切分这块 Message RAM**

切得不合理：轻则收不到，重则初始化失败。

### FDCAN 时钟源变动，与APB切割了

FDCAN相较于经典CAN，时钟不再挂在在APB总线上，也就是说在配置波特率的时候必须认识到，现在由Kernel Clock（内核时钟）来决定FDCAN的频率。

那么Kernel Clock究竟由谁决定，我们不妨再看看时钟树：

![Image](/images/posts/H723-Board/FDCAN/image7.PNG)

在整个时钟树的右下角多出了一个FDCAN Clock Mux，这里就是最终决定FDCAN最初的频率的地方，正好我们再往前溯源，可以看到这里的PLL1Q其实就是下图的DIVQ1所对应的时钟频率80MHz。

![Image](/images/posts/H723-Board/FDCAN/image8.PNG)

那么很好我们现在又遇到了新的变化，这里的PLL（锁相环）相对F4中的配置更加细致，对PLL内部结构进行了更加深入的剖析，主要分为了DIV开头，尾缀分别为MNPQR的5个参数，现在我们来具体介绍一下他们：
和CAN拆解时钟源频率的步骤大似相当，首先DIV即Divider（分频器），MNPQR则是按照字母表顺序排列的几个字母，也暗指了他们的运作顺序。

- 首先DIVM即预分频，也可称作PLL输入分频，目的也是降低输入频率使PLL可以接受，防止输入频率过快。

- 接下来是DIVN，它是倍频因子，也是锁相环这个概念中最重要的一环，决定了后续分支的主频。

- PQR都是输出分频，通过降低DIVN确定的主频让输出值成为后续内容的主频，其中DIVP主要作为系统时钟的主频，DIVQ主要作为外设部分（如FDCAN、USB、RNG等）的主频，而DIVR则相对自由，属于较边缘外设使用的主频。

理解了这一部分之后我们才真正地能够使用H7系列的PLL对外设时钟进行控制，当然如上图所示我们要使用的DIVQ已经从4改为6才能输出80MHz使用，这也是因为原来的120MHz过快在计算波特率为1MHz的时候不太容易计算，因此才改为80MHz，同样这也是达妙科技官方开源例程中所使用的主流控制频率。

## CAN和FDCAN的关系

CAN：

- 最大 8 字节数据

- 最高 1Mbps

FDCAN：

- 最多 64 字节

- 数据段可更高速

- 控制器是**同一个 FDCAN**

## FDCAN 和“中断/DMA/轮询”的关系

FDCAN 提供三种取消息方式：

1. 轮询：最直观 ，最好调试

2. 中断：工程常用，需要NVIC配合

3. DMA：高性能，必须配置Cache/MPU

## 所以到底怎么配？

在配置之前我们要明确一个事情，FDCAN主要用于汽车控制领域这种信号量负载及其大的领域，而我们RoboMaster赛事普遍使用的无刷电机基本都是1Mbps的8位经典CAN协议，之所以在H7配置FDCAN不是为了优化CAN性能，而是H7只有FDCAN而没有经典CAN的配置选项，而FDCAN又能够兼容经典CAN，因此我们要掌握配置FDCAN的能力。

现在让我们把视角转向FDCAN的配置界面，我们可以看到三个部分，分别是：

- Basic Parameters

- Clock Calibration Unit

- Bit Timings Parameters

而在他们之中我们需要操心的只有Basic Parameters与Bit Timings Parameters，Clock Calibration Unit属于FDCAN的延展特性，因此不在考虑范围之内。

### Basic Parameters

首先是基本要素的配置，他主要分为四个部分：

第一部分主要聚焦于控制模式和CAN机制层的处理

![Image](/images/posts/H723-Board/FDCAN/image9.PNG)

1. Frame Format确定帧格式为Classic CAN，即经典CAN控制模式，我们不需要任何FDCAN的新特性，因为我们用不到，并且硬件层面不支持。

2. Mode模式选择包含五种内容：（第一种为经典CAN模式专用，后四种为FDCAN专用的工作模式）

- 普通模式（Normal mode）

- 限制操作模式（Restricted\-operation mode）、

- 总线监控模式（Bus\-monitoring mode）

- 外部环回模式（External loop\-back mode）

- 内部环回模式（Internal loop\-back mode）

![Image](/images/posts/H723-Board/FDCAN/image10.PNG)

在这里我们只需要使用Normal mode即可。

3. Auto Retransmission自动重发，这一点一定要打开，可以在CAN总线出现通信错误的情况下自动重发避免电机丢帧接收不到信息。

4. Transmit Pause发送暂停，必须关闭，它的作用是在两个CAN帧之间强制插入一段空隙，但是在我们实际控制情况中CAN始终保持高频发送，不能够进行此类中断。

5. Protocol Exception协议异常处理，主要进行FDCAN中对非法FD帧的保护，经典CAN中基本没用但开着无害。

---

第二部分主要是时间参数的相关配置，首先需要明确的内容是经典CAN只用Nominal（仲裁阶段）参数，而Data开头的那一组在经典CAN下全部无效，不必操心。

我们唯一需要关注的Nominal Sync Jump Width \(NSJW 标称同步跳转宽度\)是指在CAN总线中，允许FDCAN硬件延长或缩短比特以执行重新同步的最大时间量。它与标称位时间（NOMINAL BIT TIME）相关，通常用于确保CAN节点之间的数据同步。标称位时间是比特率的倒数，而同步跳转宽度则用于调整节点之间的时钟误差，以保持网络通信的稳定性。

---

第三部分是Message RAM相关，这部分是FDCAN配置中特有的内容，属于必须要理解的部分，这里我们设置他的offset，即起始位，为0，也就是说明他在SRAM中的起始偏移为0，在我们初步使用FDCAN时候一般只打开一路FDCAN，当我们在后面的学习中打开更多FDCAN通道的时候在FDCAN2或FDCAN3才会对这个进行进一步的设置。

---

第四部分是对于收发滤波处理的相关设置，主要包含标准帧/扩展帧滤波器数量的定义，FIFO队列中存放帧数量的定义，接受和发送buffer的容量大小定义等。

![Image](/images/posts/H723-Board/FDCAN/image11.PNG)

1. Std/Ext Filters Nbr 标准/扩展帧过滤器数量

前者（即标准帧），这里的数字指代可配置多少个11\-bit ID过滤规则，我个人建议在这里设置为4个，让我们首先回顾一下什么是11\-bit ID过滤规则：

11\-bit ID过滤规则这是硬件层面的过滤，我们知道之前在F407这块芯片上使用CAN的接受回调函数时，一般接收的都是0x201这样的数字，在十六进制表示下一般呈现为0000 0010 0000 0001，我们在设置范围的时候会通常0x7FF就是默认的上限，不妨让我们换算一下0x7FF的数值，我们可以看到它是0000 0111 1111 1111，确实是十一位，那么凡是超过这个范围我们都不能够接受，这也是我们在编写bsp\_can库的时候没有使用过0x801，0x901这类接收帧的原因。

而在具体配置数量的过程中，主要有四种过程：

- 范围匹配，即接受一段连续ID如0x201\~0x208

- 双ID精确匹配，精确匹配两个特定ID

- 掩码匹配，与特定十六进制数进行按位与操作再匹配

- 全收全拒，字面意思

而在具体使用过程中我们最多使用到的只有前两种，因此Std Filters Nbr设置为2理论上已经完全够用，但是在达妙这块板子上它的硬件资源足够丰富，所以我个人在这里仍然建议给到4，也就是覆盖所有类型的匹配模式。

而后者（即扩展帧），由于打开过滤器必然会占用RAM，同时我们实际上也并不需要用到扩展帧进行处理，因此这里直接设置为0就好。

2. Rx Fifo 0/1 Elmt相关内容

首先是Rx Fifo0 Elmt Nbr，即FIFO队列中最大能够够容纳的帧的数量，在赛事领域的通信高发场景下，个人建议这个数字设置范围在5\~10，当然，直接设置为10硬件上也完全支持。

而接下来的Rx Fifo0 Elmt Size自然遵守经典CAN通信的8bytes原则，这里直接默认即可。

而Fifo1可用可不用，对于H723这块芯片我们在时钟树中设置的运算频率高达480MHz，对于3条FDCAN总线上的经典CAN通信处理完全足够，如果你想要启用Fifo1，那么也和Fifo0是同样的配置道理。

3. Rx以及Tx Buffer相关内容

Buffer在某种程度上可以特指一块内存空间，也就是说当我们在FDCAN层面启用Buffer的时候往都是出现于每一块信息都有其ID，并且每个ID都有其对应的实际含义，且都不能丢失，这一情况往往出现在更高精度的场景如航空航天等，因此在实际使用过程当中我们并不对Rx/Tx Buffer进行操作，故均不做处理。

4. 其他

最后三项分别为FIFO深度，传输模式，和传输位大小，其中深度和最大容量均设置为10是一个比较保守的策略，一般常见情况是8\~16；而传输模式是在FIFO与QUEUE中进行选择，这里我们自然选择前者；最后是老样子，仍然采用8bytes即可。

### Clock Calibration Unit

CCU是FDCAN在其专属模式下用来自动校准位时间、补偿时钟误差的硬件模块。

而不用管，默认disable即可。

### Bit Timing Parameters

这里则是我们老生常谈的内容，在此处我们简单回顾一下之前在F407上进行CAN波特率计算的部分：

首先是预分频，我们从时钟树设置的FDCAN始终为80MHz，如果预分频设置为1，那么按照公式中的内容

![Image](/images/posts/H723-Board/FDCAN/image12.PNG)

我们需要让分母中的TSEG1与TSEG2相加满足80\-1=79，这样才能让Baud=1MHz，最终才能满足经典CAN通信的要求。

按照达妙官方开源例程中的设置，这里我也推荐使用TSEG1=59，TSEG2=20的搭配，这种情况下我们仍然使用SP=（1\+ TSEG1）/（1\+TSEG1\+ TSEG2），这表示信息在总线传播时候的采样范围，最后得出SP=75%，这在工业上处于一个合理范围之内，是可以接受的。

最后配置我个人配置出的情况如下图所示：

![Image](/images/posts/H723-Board/FDCAN/image13.PNG)

## 还有一件事

最后，首先要注意的是千万不要忘记找对引脚！

通过查询达妙MC02开发板的原理图，我们可以看到板子的FDCAN1的两个引脚分别为PD1与PD0，而打开FDCAN1默认提供给我们的引脚却是PA11与PA12，因此这里需要人为打开正确的引脚。

![Image](/images/posts/H723-Board/FDCAN/image14.PNG)

![Image](/images/posts/H723-Board/FDCAN/image15.PNG)

做完这一步之后，我们需要再次回顾一些基础操作：

![Image](/images/posts/H723-Board/FDCAN/image16.PNG)

![Image](/images/posts/H723-Board/FDCAN/image17.PNG)

至此，我们点击右上角的Generate Code即可开启代码层的编写。

# 代码层面的变化

首先由于我们使用的对象从CAN变为FDCAN，所以之前使用的诸如HAL\_CAN为前缀的内容都需要改为HAL\_FDCAN，在最开始讲解CAN通讯的教程中我们是从构建一段CAN帧并且手动推送到邮箱进行发送的，而我们即使现在使用FDCAN的硬件，但实际上还是构建经典CAN的CAN帧，所以我们不妨来回顾一下之前在经典CAN中的操作：

![Image](/images/posts/H723-Board/FDCAN/image18.PNG)

之前我们提到，在经典CAN的硬件上，一段CAN帧最重要的三要素就是帧头，数据与邮箱，并且根据C620电调的使用手册配置了帧头中的一些必要的内容，最后在填充数据之后把信息通过函数HAL\_CAN\_AddTxMessage推送到对应的CAN通道。

那么FDCAN中的CAN命令发送函数应该怎么去写？

首先由于我们使用的并不是FDCAN的体系，也就是说和Buffer，消息机制没有任何关系，我们仍然扎根于邮箱驱动的经典CAN体系，但是需要用FDCAN的框架进行对应的配置，那么首先我们要改动的结构是帧头，我们在这里需要改用FDCAN\_TxHeaderTypeDef来定义TxHeader，同时对于帧头里需要配置的部分会增多，我们先看图：

![Image](/images/posts/H723-Board/FDCAN/image19.PNG)

首先是经典CAN同源的内容：

1. 首先Identifier本质上就是StdID，这里使用M3508作测试，自然使用0x200。

2. IdType即IDE，这里我们发送的是标准帧而非扩展帧，所以设置为FDCAN\_STANDARD\_ID。

3. TxFrameType也就是RTR，我们发送的是数据帧（带数据）而非远程帧（请别人发送），故设置为FDCAN\_DATA\_FRAME。

4. DataLength也就是DLC，我们仍然是8bytes发送，故设置为FDCAN\_DLC\_BYTES\_8。

下面是FDCAN特有的内容：

5. 然后是FDFormat，我们要明确发送的是经典CAN帧还是FDCAN帧，这里设置为FDCAN\_CLASSIC\_CAN。

6. BitRateSwitch，我们不使用FDCAN特有的可变波特率功能，故设置FDCAN\_BRS\_OFF。

最后是一些基本配置上的内容：

7. ErrorStateIndicator，声明本节点当前的错误状态，可有可无，但最好开着，虽然它默认状态下是0x0U，即打开。

8. TxEventFifoControl，我们不在意哪一帧什么时候发完，所以设置为FDCAN\_NO\_TX\_EVENTS，同时把它是否关闭说清楚对我们后续使用回调函数接受反馈帧非常重要，必须要写。

帧头处理完之后，数据填充自然不必多说，只是最后推送信息的时候不再通过一个直接的邮箱去推送，而是直接把信息推进FIFO队列而不再依赖邮箱，因此我们可以看到HAL\_FDCAN\_AddMessageToTxFifoQ在命名表意上首先不再带有邮箱元素，并且在传入参数中也去除了邮箱，在某种程度上简化了信息发送过程。

![Image](/images/posts/H723-Board/FDCAN/image20.PNG)

最后我们贴一下一个完整的发送函数的变动情况：

![Image](/images/posts/H723-Board/FDCAN/image21.PNG)

要想真正发送出去，那么还是需要使用HAL\_FDCAN\_Start\(\&hfdcan1\);并且在while循环中调用该函数即可

![Image](/images/posts/H723-Board/FDCAN/image22.PNG)

# 结语

至此，FDCAN的配置到此结束，在硬件连接合理的情况下，M3508电机转动即代表你成功开启了喵板FDCAN的入门，这是一次硬件上的升级与迁移的变化，也体现了一位嵌入式工程师需要具备的适应多种硬件设施的能力。



