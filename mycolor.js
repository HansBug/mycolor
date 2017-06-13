/*     Color 类     */
function Color() {
	var length = arguments.length;
	var state = false;
	if (length == 0){  //随机颜色
		function rand_int(l, r) {
			var m = Math.random();
			return parseInt(Math.round(m * (r - l) + l));
		}
		this.r = rand_int(0, 255);
		this.g = rand_int(0, 255);
		this.b = rand_int(0, 255);
		this.a = Math.random();
		state = true;
	} else if (length == 1) {  //自由格式
		var str = arguments[0].toString().toLowerCase();
		var color_list = Color.color_name_list();
		if (!!color_list[str]) str = color_list[str];
		
		reg = /^\W*#([0-9a-f]{6,6})\W*$/i;
		reg1 = /^\W*rgb\W*\(\W*([0-9]*(\.[0-9]+|))\W*\,\W*([0-9]*(\.[0-9]+|))\W*\,\W*([0-9]*(\.[0-9]+|))\W*\)\W*$/i;
		reg2 = /^\W*rgba\W*\(\W*([0-9]*(\.[0-9]+|))\W*\,\W*([0-9]*(\.[0-9]+|))\W*\,\W*([0-9]*(\.[0-9]+|))\W*,\W*([0-9]*(\.[0-9]+|))\W*\)\W*$/i;
		if (reg.test(str)) {  //#XXXXXX 格式
			function hex_to_int(str) {
				var s = str.toLowerCase();
				var res = 0;
				for (i = 0;i < s.length;i++) {
					var digit = 0;
					if ((s[i] >= 'a') && (s[i] <= 'z')) digit = s[i].charCodeAt() - 87; else digit = s[i].charCodeAt() - 48;
					res = res * 16 + digit;
				}
				return res;
			}
			var res = reg.exec(str)[1].toLowerCase();
			this.r = hex_to_int(res.substr(0, 2));
			this.g = hex_to_int(res.substr(2, 2));
			this.b = hex_to_int(res.substr(4, 2));
			this.a = 1;
			state = true;
		} else if (reg1.test(str)) {  // rgb(XX,XX,XX) 格式
			var res = reg1.exec(str);
			this.r = parseFloat(res[1]);
			this.g = parseFloat(res[3]);
			this.b = parseFloat(res[5]);
			this.a = 1;
			state = true;
		} else if (reg2.test(str)) {  // rgba(XX,XX,XX,XX) 格式
			var res = reg2.exec(str);
			this.r = parseFloat(res[1]);
			this.g = parseFloat(res[3]);
			this.b = parseFloat(res[5]);
			this.a = parseFloat(res[7]);
			state = true;
		};
		
	} else if (length == 3) {  //r,g,b格式
		this.r = parseFloat(arguments[0]);
		this.g = parseFloat(arguments[1]);
		this.b = parseFloat(arguments[2]);
		this.a = 1;
		state = true;
	} else if (length == 4) {  //r,g,b,a格式
		this.r = parseFloat(arguments[0]);
		this.g = parseFloat(arguments[1]);
		this.b = parseFloat(arguments[2]);
		this.a = parseFloat(arguments[3]);	
		state =  true;
	}

	if (!state) return null;
	
	data_validation(this);
	
	
	/*  私有方法  */
	/*  数据验证  */
	function data_validation(col) {
		if (col.r < 0) col.r = 0;
		if (col.r > 255) col.r = 255;
		if (col.g < 0) col.g = 0;
		if (col.g > 255) col.g = 255;
		if (col.b < 0) col.b = 0;
		if (col.b > 255) col.b = 255;
		if (col.a > 1) col.a == 1;
		if (col.a < 0) col.a == 0;
	}
	
	/*  共有方法  */
	/*  输出部分  */
	this.toString = function() {
		return this.to_rgba();
	}
	
	this.to_rgb = function() {
		data_validation(this);
		var r = Math.round(this.r);
		var g = Math.round(this.g);
		var b = Math.round(this.b);
		return "rgb(" + r + "," + g + "," + b + ")";
	};
	
	this.to_rgba = function() {
		data_validation(this);
		var r = Math.round(this.r);
		var g = Math.round(this.g);
		var b = Math.round(this.b);
		return "rgba(" + r + "," + g + "," + b + "," + this.a + ")";
	};
	
	this.to_sharp = function() {
		function int_to_hex(num) {
			var s = "", t = num;
			while (t > 0) {
				var digit = t % 16, d = "";
				if (digit < 10) d = String.fromCharCode(48 + digit); else d = String.fromCharCode(55 + digit);
				s = d + s;
				t = Math.floor(t / 16);
			}
			if (s == "") s = "0";
			return s;
		}
		function fill(s, length) {
			var res = s;
			while (res.length < length) res = "0" + res;
			return res;
		}
		
		data_validation(this);
		var r = fill(int_to_hex(Math.round(this.r)), 2);
		var g = fill(int_to_hex(Math.round(this.g)), 2);
		var b = fill(int_to_hex(Math.round(this.b)), 2);
		return "#" + r + g + b;
		
	}
	
	/*  链式表达式  */
	/* 拷贝 */
	this.copy = function() {
		data_validation(this);
		return new Color(this.r, this.g, this.b, this.a);
	}
	
	function modify(value, ch) {
		var v = value, change = ch.toString();
		reg_inc = /^\W*\+=\W*([0-9]*(\.[0-9]+|))\W*$/i;
		reg_dec = /^\W*\-=\W*([0-9]*(\.[0-9]+|))\W*$/i;
		reg_mul = /^\W*\*=\W*([0-9]*(\.[0-9]+|))\W*$/i;
		reg_div = /^\W*\/=\W*([0-9]*(\.[0-9]+|))\W*$/i;
		reg_num = /^\W*([0-9]*(\.[0-9]+|))\W*$/i;
		reg_empty = /^\W*$/i;
		if (reg_inc.test(change)) {
			value += parseFloat(reg_inc.exec(change)[1]);
		} else if (reg_dec.test(change)) {
			value -= parseFloat(reg_dec.exec(change)[1]);
		} else if (reg_mul.test(change)) {
			value *= parseFloat(reg_mul.exec(change)[1]);
		} else if (reg_div.test(change)) {
			value /= parseFloat(reg_div.exec(change)[1]);
		} else if (reg_num.test(change)) {
			value = parseFloat(reg_num.exec(change)[1]);
		} else if (reg_empty.test(change)) {
			value = value;
		} else {
			return null;
		}
		return value;
	}
	
	/* 修改参数r,g,b,a */
	this.m_r = function(ch) {
		return new Color(modify(this.r, ch), this.g, this.b, this.a);
	}
	this.m_g = function(ch) {
		return new Color(this.r, modify(this.g, ch), this.b, this.a);
	}
	this.m_b = function(ch) {
		return new Color(this.r, this.g, modify(this.b, ch), this.a);
	}
	this.m_a = function(ch) {
		return new Color(this.r, this.g, this.b, modify(this.a, ch));
	}
	
	/* 转化为灰度色 */
	this.gray = function() {
		var arg = (this.r + this.g + this.b) / 3;
		return new Color(arg, arg, arg, this.a);
	}
	
	/* 转化为相反色 */
	this.anti = function() {
		return new Color(255 - this.r, 255 - this.g, 255 - this.b, this.a);
	}
}

Color.color_name_list = function() {
	return {
			'aliceblue' : "#F0F8FF" ,
			'antiquewhite' : "#FAEBD7" ,
			'aqua' : "#00FFFF" ,
			'aquamarine' : "#7FFFD4" ,
			'azure' : "#F0FFFF" ,
			'beige' : "#F5F5DC" ,
			'bisque' : "#FFE4C4" ,
			'black' : "#000000" ,
			'blanchedalmond' : "#FFEBCD" ,
			'blue' : "#0000FF" ,
			'blueviolet' : "#8A2BE2" ,
			'brown' : "#A52A2A" ,
			'burlywood' : "#DEB887" ,
			'cadetblue' : "#5F9EA0" ,
			'chartreuse' : "#7FFF00" ,
			'chocolate' : "#D2691E" ,
			'coral' : "#FF7F50" ,
			'cornflowerblue' : "#6495ED" ,
			'cornsilk' : "#FFF8DC" ,
			'crimson' : "#DC143C" ,
			'cyan' : "#00FFFF" ,
			'darkblue' : "#00008B" ,
			'darkcyan' : "#008B8B" ,
			'darkgoldenrod' : "#B8860B" ,
			'darkgray' : "#A9A9A9" ,
			'darkgreen' : "#006400" ,
			'darkkhaki' : "#BDB76B" ,
			'darkmagenta' : "#8B008B" ,
			'darkolivegreen' : "#556B2F" ,
			'darkorange' : "#FF8C00" ,
			'darkorchid' : "#9932CC" ,
			'darkred' : "#8B0000" ,
			'darksalmon' : "#E9967A" ,
			'darkseagreen' : "#8FBC8F" ,
			'darkslateblue' : "#483D8B" ,
			'darkslategray' : "#2F4F4F" ,
			'darkturquoise' : "#00CED1" ,
			'darkviolet' : "#9400D3" ,
			'deeppink' : "#FF1493" ,
			'deepskyblue' : "#00BFFF" ,
			'dimgray' : "#696969" ,
			'dodgerblue' : "#1E90FF" ,
			'feldspar' : "#D19275" ,
			'firebrick' : "#B22222" ,
			'floralwhite' : "#FFFAF0" ,
			'forestgreen' : "#228B22" ,
			'fuchsia' : "#FF00FF" ,
			'gainsboro' : "#DCDCDC" ,
			'ghostwhite' : "#F8F8FF" ,
			'gold' : "#FFD700" ,
			'goldenrod' : "#DAA520" ,
			'gray' : "#808080" ,
			'green' : "#008000" ,
			'greenyellow' : "#ADFF2F" ,
			'honeydew' : "#F0FFF0" ,
			'hotpink' : "#FF69B4" ,
			'indianred' : "#CD5C5C" ,
			'indigo' : "#4B0082" ,
			'ivory' : "#FFFFF0" ,
			'khaki' : "#F0E68C" ,
			'lavender' : "#E6E6FA" ,
			'lavenderblush' : "#FFF0F5" ,
			'lawngreen' : "#7CFC00" ,
			'lemonchiffon' : "#FFFACD" ,
			'lightblue' : "#ADD8E6" ,
			'lightcoral' : "#F08080" ,
			'lightcyan' : "#E0FFFF" ,
			'lightgoldenrodyellow' : "#FAFAD2" ,
			'lightgrey' : "#D3D3D3" ,
			'lightgreen' : "#90EE90" ,
			'lightpink' : "#FFB6C1" ,
			'lightsalmon' : "#FFA07A" ,
			'lightseagreen' : "#20B2AA" ,
			'lightskyblue' : "#87CEFA" ,
			'lightslateblue' : "#8470FF" ,
			'lightslategray' : "#778899" ,
			'lightsteelblue' : "#B0C4DE" ,
			'lightyellow' : "#FFFFE0" ,
			'lime' : "#00FF00" ,
			'limegreen' : "#32CD32" ,
			'linen' : "#FAF0E6" ,
			'magenta' : "#FF00FF" ,
			'maroon' : "#800000" ,
			'mediumaquamarine' : "#66CDAA" ,
			'mediumblue' : "#0000CD" ,
			'mediumorchid' : "#BA55D3" ,
			'mediumpurple' : "#9370D8" ,
			'mediumseagreen' : "#3CB371" ,
			'mediumslateblue' : "#7B68EE" ,
			'mediumspringgreen' : "#00FA9A" ,
			'mediumturquoise' : "#48D1CC" ,
			'mediumvioletred' : "#C71585" ,
			'midnightblue' : "#191970" ,
			'mintcream' : "#F5FFFA" ,
			'mistyrose' : "#FFE4E1" ,
			'moccasin' : "#FFE4B5" ,
			'navajowhite' : "#FFDEAD" ,
			'navy' : "#000080" ,
			'oldlace' : "#FDF5E6" ,
			'olive' : "#808000" ,
			'olivedrab' : "#6B8E23" ,
			'orange' : "#FFA500" ,
			'orangered' : "#FF4500" ,
			'orchid' : "#DA70D6" ,
			'palegoldenrod' : "#EEE8AA" ,
			'palegreen' : "#98FB98" ,
			'paleturquoise' : "#AFEEEE" ,
			'palevioletred' : "#D87093" ,
			'papayawhip' : "#FFEFD5" ,
			'peachpuff' : "#FFDAB9" ,
			'peru' : "#CD853F" ,
			'pink' : "#FFC0CB" ,
			'plum' : "#DDA0DD" ,
			'powderblue' : "#B0E0E6" ,
			'purple' : "#800080" ,
			'red' : "#FF0000" ,
			'rosybrown' : "#BC8F8F" ,
			'royalblue' : "#4169E1" ,
			'saddlebrown' : "#8B4513" ,
			'salmon' : "#FA8072" ,
			'sandybrown' : "#F4A460" ,
			'seagreen' : "#2E8B57" ,
			'seashell' : "#FFF5EE" ,
			'sienna' : "#A0522D" ,
			'silver' : "#C0C0C0" ,
			'skyblue' : "#87CEEB" ,
			'slateblue' : "#6A5ACD" ,
			'slategray' : "#708090" ,
			'snow' : "#FFFAFA" ,
			'springgreen' : "#00FF7F" ,
			'steelblue' : "#4682B4" ,
			'tan' : "#D2B48C" ,
			'teal' : "#008080" ,
			'thistle' : "#D8BFD8" ,
			'tomato' : "#FF6347" ,
			'turquoise' : "#40E0D0" ,
			'violet' : "#EE82EE" ,
			'violetred' : "#D02090" ,
			'wheat' : "#F5DEB3" ,
			'white' : "#FFFFFF" ,
			'whitesmoke' : "#F5F5F5" ,
			'yellow' : "#FFFF00" ,
			'yellowgreen' : "#9ACD32"
		};
};

String.prototype.to_color = function() {
	try{
		var str = this.toString();
		return new Color(str);
	}
	catch(err) { return null; }
}

Color.validation = function(c) {  //数据合法性验证
	var col = new Color(c.toString());
	return !(col["error"] === null);
}

Color.distance = function() {
	if ((arguments.length < 2) || (arguments.length > 3)) return null;
	var col1 = arguments[0].toString();
	var col2 = arguments[1].toString();
	if (!Color.validation(col1)) return null;
	if (!Color.validation(col2)) return null;
	col1 = new Color(col1);
	col2 = new Color(col2);
	var dr = Math.abs(col1.r - col2.r);
	var dg = Math.abs(col1.g - col2.g);
	var db = Math.abs(col1.b - col2.b);
	var state = "";
	if (arguments.length == 2) state = ""; else state = arguments[2];
	state = state.toString();
	if ((/^\W*Hamilton\W*$/i.test(state)) || (/^\W*1\W*$/i.test(state)))  {  //哈密尔顿距离
		return dr + dg + db;
	} else if ((/^\W*Chebyshev\W*$/i.test(state)) || (/^\W*2\W*$/i.test(state))) {  //切比雪夫距离
		return Math.max(dr, dg, db);
	} else {  //默认、其他 ： 欧拉距离
		return Math.sqrt(dr * dr + dg * dg + db * db);
	}	
}

/*       ColorList        */
function ColorList(){
	array = [];
	for (var i = 0;i < arguments.length;i++) {
		var col = null, rat = null;
		if (arguments[i] instanceof Array) {
			if (arguments[i].length > 1) rat = arguments[i][1];
			col = arguments[i][0];
		} else if (arguments[i] instanceof Object) {
			if (!empty(arguments[i]["color"])) col = arguments[i]["color"];
			if (!empty(arguments[i]["ratio"])) rat = arguments[i]["ratio"];
		}
		if (col === null) { col = arguments[i]; }
		
		var color_check = Color.validation(col);
		if (!empty(col) && (color_check)) {
			var obj = { color: new Color(col), ratio: ((rat === null) ? null : parseFloat(rat)) };
			array.push(obj);
		}
	}
	
	if (array.length == 0) return null;
	if (array.length == 1) return null;
	if (empty(array[0].ratio)) array[0].ratio = 0;
	if (empty(array[array.length - 1].ratio)) array[array.length - 1].ratio = 1;
	
	for (var i = 1;i < array.length;i++) {
		if (!empty(array[i].ratio)) {
			var k = i - 1;
			while (empty(array[k].ratio)) k--;
			if (array[i].ratio <= array[k].ratio) return null;
			for (var j = 1;j < i-k;j++) {
				var left_ratio = j / (i-k);
				array[k + j].ratio = array[k].ratio * left_ratio + array[i].ratio * (1 - left_ratio);
			}
		}
	}
	
	this.length = function() {
		return array.length;
	}
	
	this.get_color = function(r) {
		function between(c1, r1, c2, r2, r) {
			var ratio = (r - r1) / (r2 - r1);
			var r = c1.r * (1 - ratio) + c2.r * ratio;
			var g = c1.g * (1 - ratio) + c2.g * ratio;
			var b = c1.b * (1 - ratio) + c2.b * ratio;
			var a = c1.a * (1 - ratio) + c2.a * ratio;
			return new Color(r, g, b, a);
		}
			
		var t = array.length - 1;
		for (var i = 1;i < array.length;i++) {
			if (r < array[i].ratio) {
				t = i;
				break;
			}
		}
		return between(array[t-1].color, array[t-1].ratio, array[t].color, array[t].ratio, r);
	}
}

Array.prototype.get_color = function(r) {
	try{
		return (new ColorList(this)).get_color(r);
	}
	catch (err) { return null; }
}


/*  各种方法  */
var empty = function (obj) {
	var e = $("main");
	if (((typeof obj) == "number") && (isNaN(obj))) return true;
	if (obj === null) return true;
	if (obj === undefined) return true;
	return false;
}