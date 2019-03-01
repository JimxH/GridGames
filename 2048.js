function getCookie(cookiename){
		var str=document.cookie;
		var i=-1;
		if((i=str.indexOf(cookiename+"="))!=-1){
			var start=i+cookiename.length+1;
			var end=str.indexOf(";",start);
			return str.slice(start,end==-1?str.length:end);
		}else{
			return null;
		}
	}
	
	function setCookie(cookiename,value){
		var date=new Date();
		date.setFullYear(date.getFullYear()+1);
		document.cookie=
			cookiename+"="+value+";expires="+date.toGMTString();
	
	}


var game={
	data:null,//保存一个二维数组
	RN:4,//总行数
	CN:4,//总列数
	score:0,
	state:1,//游戏状态，1是运行，0是结束
	RUNNING:1,
	GAMEOVER:0,
	PLAYING:2,
	top:0,
	//强调：对象自己的方法要使用自己的属性，必须加this

	CSIZE:100,
	OFFSET:16,
	init:function(){
	 var width=this.CN*(this.OFFSET+this.CSIZE)+this.OFFSET;
	 var height=this.RN*(this.OFFSET+this.CSIZE)+this.OFFSET;
	
	 gridpane1.style.width=this.width+"px";
	 gridpane1.style.height=this.height+"px";

	 var arr=[];
	 for(var r=0;r<this.RN;r++){
		for(var c=0;c<this.CN;c++){
			arr.push(""+r+c);
		}
	 }
	
	gridpane1.innerHTML='<div id="g'+arr.join('" class="grid"></div><div id="g')+'" class="grid"></div>';

	gridpane1.innerHTML+='<div id="c'+arr.join('" class="cell"></div><div id="c')+'" class="cell"></div>';
	
	},	  


	start:function(){//启动游戏
		this.init();
		this.top=getCookie("top")||0;
		this.state=this.RUNNING;//初始化游戏状态为运行中
		this.score=0;
		//初始化data为空数组
		this.data=[];
		//r从0开始，到RN结束，每次加1
			//向date中压入一个空数组
			//c从0开始，到<CN结束，每次加1
				//在data中r行列的位置保存一个0
		//（遍历结束）
		for(var r=0;r<this.RN;r++){
			this.data.push([]);
			for(var c=0;c<this.CN;c++){
				this.data[r].push("0")
			}
		}

		//调用randomNum方法
		//在调用randomNum方法
		this.randonNum();
		this.randonNum();

		this.updateView();

		console.log(this.data.join("\n"));
		//为当前页面绑定键盘事件:
		var me=this;//留住this，用闭包，实际中经常用到
		document.onkeydown=function(e){//e: 事件对象
			if(me.state==me.RUNNING){
			 switch(e.keyCode){
				case 37:me.moveLeft();break;
				case 38:me.moveTop();break;
				case 39:me.moveRight();break;
				case 40:me.moveDown();break;
			}
			}
		}
	},//强调: 每个方法之间必须用逗号分隔
 
//GAMEOVER

	isgameover:function(){
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				if(this.data[r][c]==0){
					return false;
				} if(r!=this.RN-1&&this.data[r][c]==this.data[r+1][c]){ return false;
				} if(c!=this.CN-1&&this.data[r][c]==this.data[r][c+1]){
					return false;
				}			
			}	
		}
		return true;
	},

//封装一个移动的通用属性move

	move:function(fun){
		var before=String(this.data);
		fun.call(this);
		var after=String(this.data);
	if(before!=after){
		 this.state=this.PLAYING;
		animation.startMove(function(){
		this.randonNum();
		
		if(this.isgameover()){
			this.state=this.GAMEOVER;
			this.score>this.top&&setCookie("top",this.score);
			}else{
				this.state=this.RUNNING;
			}
		this.updateView();
		}.bind(this));
	}
	},

//向左移动

	  moveLeft:function(){//左移所有行
    //移动前为数组拍照(String(this.data))保存在变量before
    //r从0开始，到<RN结束，r++
      //调用moveLeftInRow(r)左移第r行
    //(遍历结束)
    //移动后为数组拍照(String(this.data))保存在变量after
    //如果before不等于after时
      //调用randomNum随机生成一个数
      //调用updateView更新页面
	this.move(function(){
	for(var r=0;r<this.RN;r++){
		this.moveLeftInRow(r);
		}
	});
	  
  },
  moveLeftInRow:function(r){//左移第r行
    //c从0开始，到<CN-1结束，每次增1
      //查找c位置后，下一个不为0的位置，保存在nextc中
      //var nextc=this.getNextInRow(r,c);
      //如果nextc是-1，就退出循环
      //否则
        //如果data中r行c位置等于0
          //将data中r行nextc位置的值赋值给data中r行c位置
          //将data中r行nextc位置置为0
          c--;//下次还在当前位置开始
        //否则 如果data中r行c位置等于data中r行nextc位置
          //将data中r行c位置*2
          //将data中r行nextc位置置为0
	for(var c=0;c<this.CN-1;c++){
		var nextc=this.getNextInRow(r,c);
		if(nextc==-1){
			break;
		}else{
			if(this.data[r][c]==0){
				this.data[r][c]=this.data[r][nextc];
				animation.addTask(r,nextc,r,c);
				this.data[r][nextc]=0;
				c--;
			}else{
				if(this.data[r][c]==this.data[r][nextc]){
					this.data[r][c]*=2;
					animation.addTask(r,nextc,r,c);
					//累加得分
					this.score+=this.data[r][c];
					this.data[r][nextc]=0;
				}
			}
		}	
	}		
  },
  getNextInRow:function(r,c){//查找r行c列右侧下一个不为0的位置
    //nextc从c+1开始，到<CN结束，nextc每次增1
      //如果data中r行nextc位置的值!=0
        //返回nextc
    //(遍历结束)就返回-1
	for(var nextc=c+1;nextc<this.CN;nextc++){
		if(this.data[r][nextc]!=0){
			return nextc;
		}	
	}
		return -1;
  },
	

//向右移动
	moveRight:function(){
		var before=String(this.data);
		for(var r=0;r<this.RN;r++){
			this.moveRightInRow(r);
		}
		var after=String(this.data);
		if(before!=after){
		 this.state=this.PLAYING;
		animation.startMove(function(){
		this.randonNum();
		
		if(this.isgameover()){
			this.state=this.GAMEOVER;
			this.score>this.top&&setCookie("top",this.score);
			}else{
				this.state=this.RUNNING;
			}
		this.updateView();
		}.bind(this));
	}
	},
	
	 moveRightInRow:function(r){
		for (var c=this.CN-1;c>0;c--){
		var nextc=this.getNextInRowRight(r,c);
		if(nextc==-1){
			break;
		}else{
			if(this.data[r][c]==0){
				this.data[r][c]=this.data[r][nextc];
				animation.addTask(r,nextc,r,c);
				this.data[r][nextc]=0;
				c++;
			}else{
				if(this.data[r][c]==this.data[r][nextc]){
					this.data[r][c]*=2;
					animation.addTask(r,nextc,r,c);
					//累加得分
					this.score+=this.data[r][c];
					this.data[r][nextc]=0;
				}	
			}	
		}
		}
	 },
	
	getNextInRowRight:function(r,c){
		for(var nextc=c-1;nextc>=0;nextc--){
			if(this.data[r][nextc]!=0){
				return nextc;
			}	
		}
		return -1;
	},

//向上移动

	moveTop:function(){
		var before=String(this.data);
		for(var c=0;c<this.CN;c++){
			this.moveTopInRow(c);
		}
		var after=String(this.data);
		if(before!=after){
		 this.state=this.PLAYING;
		animation.startMove(function(){
		this.randonNum();
		
		if(this.isgameover()){
			this.state=this.GAMEOVER;
			this.score>this.top&&setCookie("top",this.score);
			}else{
				this.state=this.RUNNING;
			}
		this.updateView();
		}.bind(this));
	}
	},

	moveTopInRow:function(c){
		for(var r=0;r<this.RN-1;r++){
			var nextr=this.getNextInRowTop(r,c);
			if(nextr==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[nextr][c];
					animation.addTask(nextr,c,r,c);
					this.data[nextr][c]=0;
					r--;
				}else{
					if(this.data[r][c]==this.data[nextr][c]){
						this.data[r][c]*=2;
						animation.addTask(nextr,c,r,c);
						//累加得分
					this.score+=this.data[r][c];
						this.data[nextr][c]=0;
					}
				}
			}
		}	
	},

	getNextInRowTop:function(r,c){
		for (var nextr=r+1;nextr<this.RN;nextr++){
			if(this.data[nextr][c]!=0){
				return nextr;
			}
		}
			return -1;
	},
	
//向下移动
	moveDown:function(){
		var before=String(this.data);
		for(var c=0;c<this.CN;c++){
			this.moveDownInRow(c);
		}
		var after=String(this.data);
		if(before!=after){
		 this.state=this.PLAYING;
		animation.startMove(function(){
		this.randonNum();
		
		if(this.isgameover()){
			this.state=this.GAMEOVER;
			this.score>this.top&&setCookie("top",this.score);
			}else{
				this.state=this.RUNNING;
			}
		this.updateView();
		}.bind(this));
	}
	},

	moveDownInRow:function(c){
		for(var r=this.RN-1;r>=0;r--){
			var nextr=this.getNextInRowDown(r,c);
			if(nextr==-1){
				break;
			}else{
				if(this.data[r][c]==0){
					this.data[r][c]=this.data[nextr][c];
					animation.addTask(nextr,c,r,c);
					this.data[nextr][c]=0;
					r--;
				}else{
					if(this.data[r][c]==this.data[nextr][c]){
						this.data[r][c]*=2;
						animation.addTask(nextr,c,r,c);
						//累加得分
					this.score+=this.data[r][c];
						this.data[nextr][c]=0;
					}
				}
			}
		
		}
	
	},
	
	getNextInRowDown:function(r,c){
		for (var nextr=r-1;nextr>=0;nextr--){
			if(this.data[nextr][c]!=0){
				return nextr;
			}
		}
			return -1;
	},


//页面上显示数字
	updateView:function(){
		topScore.innerHTML=this.top;
		for(var r=0;r<this.RN;r++){
			for (var c=0;c<this.CN;c++){
				var div=document.getElementById("c"+r+c);
				if(this.data[r][c]==0){
					div.innerHTML="";
					div.className="cell";
				}else{
					div.innerHTML=this.data[r][c];
					div.className="cell n"+this.data[r][c];		
				}
			}		
		}
		//页面上显示分数：
		score.innerHTML=this.score;
		//设置gameover的元素display属性
		//检查游戏是否结束
			if(this.isgameover()){
			this.state=this.GAMEOVER;
			gameover.style.display="block";
			scroee.innerHTML=this.score;
			}else{
				gameover.style.display="none";
			}
	},


//反复随机生成数字	
	randonNum:function(){
		//反复生成数字
			//在0~RN-1之间生成一个随机的额行号，保存在r中
			//在0~CN-1之间生成一个随机的额行号，保存在c中
			//如果data中r行c列为0
				//随机生成一个数字保存在变量num中
				//设置data中r行c列的元素值为：
					//如果num<0.5，就设置为2，否则设置为4
					//退出循环
		while(true){
			var r=parseInt(Math.random()*this.RN);
			var c=Math.floor(Math.random()*this.CN);
			var num=0;
			/*data[r][c]===0&&num=Math.random(),num<0.5?data[r][c]=2:4,break;*/
			if(this.data[r][c]==0){
				num=Math.random();
				
				this.data[r][c]=num<0.5?2:4;
				break;
			}
		}

	
	}


}
//当页面加载后，自动启动
window.onload=function(){game.start();}