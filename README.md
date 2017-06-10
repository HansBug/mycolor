# mycolor.js

**By HansBug** 项目地址: [https://github.com/HansBug/mycolor](https://github.com/HansBug/mycolor)

## 简介
**mycolor.js**是由HansBug开发的一款基于javascript的颜色计算库。对于常见的颜色计算进行了一系列的封装。

## Color 类

`Color`类所代表的是颜色，包含颜色的四个要素：红色、绿色、蓝色、透明度。

### 基本参数
* `r` ： 红色值，取值范围0 - 255
* `g` ： 绿色值，取值范围0 - 255
* `b` ： 蓝色值，取值范围0 - 255
* `a` ： 透明度值，取值范围0 - 1

**注：以上的四个参数在初始化和计算的过程中，均支持小数。** ***如果出现数据因越界而非法的情况，在相关的计算中将会被纠正。***

### 初始化
该类提供以下几种初始化方法：
* 当无初始化参数时，随机生成一个颜色（四个要素均在合法范围内随机取值）
* 当初始化参数为一个时，将根据参数经过字符串转换(`.toString()`)后的结果作为颜色。支持以下三种格式（***大小写均不敏感***）：
	* 颜色名 ： 常见的css格式之一，例如：`red`、`blue`（***支持范围为css的支持范围***）
	* `#xxxxxx` ： 常见的css颜色格式之一，十六进制格式，例如：`#1a2b3c`(***注：暂不支持类似`#fff`的简写形式***)
	* `rgb(xx , xx , xx)` ： 常见的css颜色格式之一，rgb格式，例如：`rgb(16, 32, 128)`
	* `rgba(xx , xx , xx, xx)` ： 常见的css颜色格式之一，rgba格式，例如：`rgba(16, 32, 128, 0.2)`
* 当初始化个数为3个时，三个参数依次分表代表红色、绿色和蓝色，例如 : `new Color(16, 32, 128)`
* 当初始化个数为4个时，四个参数依次分表代表红色、绿色、蓝色和透明度，例如 : `new Color(16, 32, 128, 0.2)`
* 其他情况下，视为参数错误，返回`null`

### 方法
#### 输出类
* `toString` ： 将Color对象输出为字符串类型，等价于`to_rgba`（该方法的设置意义在于提高可扩展性）
* `to_rgba` : 将Color对象输出为`rgba(xx, xx, xx, xx)`的格式
* `to_rgb` : 将Color对象输出为`rgb(xx, xx, xx)`的格式
* `to_sharp` : 将Color对象输出为`#xxxxxx`的格式

**注：在所有的输出格式中，`r`,`g`,`b`,`a`四个颜色参数均会纠正至合法范围内。在`rgba`和`rgb`格式中，`r`,`g`,`b`三个参数均四舍五入取整数**

#### 修改类
* `copy` ： 返回当前Color对象经过参数范围纠正至合法范围后的Color对象（若原对象数据完全合法，则所有参数不变）
* `m_r` ： 对于参数`r`进行修改，返回修改后的值（原对象不会被修改）
* `m_g` ： 对于参数`g`进行修改，返回修改后的值（原对象不会被修改）
* `m_b` ： 对于参数`b`进行修改，返回修改后的值（原对象不会被修改）
* `m_a` ： 对于参数`a`进行修改，返回修改后的值（原对象不会被修改）
* `gray` ： 返回当前颜色的灰度色（`a`值不变）
* `anti` ： 返回当前颜色的相反色（`a`值不变）

**关于上文的值修改：**
上文中四个参数的值修改，采用统一的修改方式和格式，均为一个参数，格式如下：
* `x` ： 直接修改至指定的值`x`，例如
```javascript
var c = new Color(10, 50, 100, 0.8);
var new_c = c.m_r(100);
```
则`new_c == new Color(100, 50, 100, 0.8)`

* `"+=x"` ： 将值增加`x`，例如
```javascript
var c = new Color(10, 50, 100, 0.8);
var new_c = c.m_r("+=100");
```
则`new_c == new Color(110, 50, 100, 0.8)`

* `"-=x"` ： 将值减少`x`，例如
```javascript
var c = new Color(10, 50, 100, 0.8);
var new_c = c.m_r("-=5");
```
则`new_c == new Color(5, 50, 100, 0.8)`

* `"*=x"` ： 将值乘`x`，例如
```javascript
var c = new Color(10, 50, 100, 0.8);
var new_c = c.m_r("*=10");
```
则`new_c == new Color(100, 50, 100, 0.8)`

* `"/=x"` ： 将值除`x`，例如
```javascript
var c = new Color(10, 50, 100, 0.8);
var new_c = c.m_a("/=2");
```
则`new_c == new Color(10, 50, 100, 0.4)`

* 若均不符合以上任意格式，则返回`null`

***注：鉴于修改类的方法的此类特性，故可以很方便的使用链状写法，例如`new_c = c.m_r(100).m_a("+=10")`***


### 类方法
* `Color.color_name_list` ：返回一个对象，里面存有css默认支持的颜色名及其对应的颜色（即为Color类以颜色名方式初始化时所支持的范围）
* `Color.validation(c)` ： 返回一个布尔值，即将单个值c是否可以进行合法的初始化，可以返回`true`，不可以返回`false`
* `Color.distance(c1, c2, c_type)` ：该方法返回两个颜色的距离。颜色的距离可视为在空间直角坐标系下，点`(c1.r, c1.g, c1.b)`和点`(c2.r, c2.g, c2.b)`之间的距离，支持三种方式：
	* `c_type == 1` 或 `c_type == 'hamiltion'`（大小写不敏感）时，返回两个颜色的Hamilton距离，即`|c1.r-c2.r| + |c1.g-c2.g| + |c1.b-c2.b|`
	* `c_type == 2` 或 `c_type == 'chebyshev'`（大小写不敏感）时，返回两个颜色的Chebyshev距离，即`max(|c1.r-c2.r|, |c1.g-c2.g|, |c1.b-c2.b|)`
	* 其他合法情况，或者`c_type`缺省时，返回两个颜色的Euler距离，即`sqrt((c1.r-c2.r)^2+(c1.g-c2.g)^2+(c1.b-c2.b)^2)`
	* 非法情况下返回`null`


### 其他
本库中，给字符串类型添加了一个原型方法`to_color`，可以将字符串转化为颜色类，`str.to_color()`等价于`new Color(str)`，在*jquery*中，使用`css()`方法获取颜色时，这样的语法可以增加代码的美观性。例如：
* 构造函数式
```javascript
var color = new Color($("#div").css("background-color"));
```

* 原型方法式
```javascript
var color = $("#div").css("background-color").to_color();
```


## ColorList 类


