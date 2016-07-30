/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
 //控制文字大小的變數,會隨瀏覽器做調整
 var textSize = 2;
 var labelSize = 4;
 
 
 
 //
 var defaultSmithChartBase = 1;
 var smithChartBase = defaultSmithChartBase;
 var paddingSize = 0.15;
 //var smithChartBaseArr = [];
 var smithChartStateArr = [];
 
 /*
 紀錄點座標的Object
 */
function Point(x,y){
    this.x = x;
    this.y = y;
}
/*
此function 最後沒有實際用到
*/

function convertToSParam(MagParam)
{
    return 20* MathJs.countLog(2,MagParam);
}
/*

計算出Delta，


*/


function countDelta(s_param_data) //(MagS11,AngS11,MagS12,AngS12,MagS21,AngS21,MagS22,AngS22)
{
    
    var MagS11 = s_param_data.MagS11;
    var MagS12 = s_param_data.MagS12;
    var MagS21 = s_param_data.MagS21;
    var MagS22 = s_param_data.MagS22;
    var AngS11 = s_param_data.AngS11;
    var AngS12 = s_param_data.AngS12;
    var AngS21 = s_param_data.AngS21;
    var AngS22 = s_param_data.AngS22;
    
    var frontMag = MagS11 * MagS22;
    var frontAng = AngS11 + AngS22;
    var backMag = MagS12 * MagS21;
    var backAng = AngS12 + AngS21;
    var x1 = frontMag * Math.cos(MathJs.DegreeToRadius(frontAng));
    var y1 = frontMag * Math.sin(MathJs.DegreeToRadius(frontAng));
    
    var x2 = backMag * Math.cos(MathJs.DegreeToRadius(backAng));
    var y2 = backMag * Math.sin(MathJs.DegreeToRadius(backAng));
    
    var sumX = x1 - x2;
    var sumY = y1 - y2;
    
    var result = Math.sqrt(Math.pow(sumX,2) + Math.pow(sumY,2));
    return result;
}


function countDeltaInVector(s_param_data){
    var S11 = s_param_data.S11;
    var S12 = s_param_data.S12;
    var S21 = s_param_data.S21;
    var S22 = s_param_data.S22;
    
    var delta = MathJs.vectorMinus(MathJs.vectorCross(S11,S22),MathJs.vectorCross(S12,S21));
    
    return delta;
}

/*
計算出stable factor K

*/

function countK(s_param_data)
{   
    var Delta = countDelta(s_param_data);
    var S11 = s_param_data.MagS11;
    var S12 = s_param_data.MagS12;
    var S21 = s_param_data.MagS21;
    var S22 = s_param_data.MagS22;
    var topK = 1 - Math.pow(Math.abs(S11),2) -  Math.pow(Math.abs(S22),2) + Math.pow(Math.abs(Delta),2);
    var downK = 2 * Math.abs(S12 * S21);
    return topK / downK;
}

/*
計算出stable gain，依照K值不同會有不同計算式

*/

function countGain(s_param_data)
{
    var K = countK(s_param_data);
   // console.log("K = " + K);
    var S12 = s_param_data.MagS12;
    var S21 = s_param_data.MagS21;
 
    if(K > 1)
        return countMAG(S21,S12,K);
    else
        return countMSG(S21,S12);
    
}
/*
MAX 

*/

function countMAG(S21,S12,K)
{
    var MSG = countMSG(S21,S12);
    var MAG = MSG * (K - Math.sqrt( Math.pow(K,2) - 1 ) );
    return MAG;
}
function countMSG(S21,S12)
{
    var topMSG = Math.abs(S21);
    var downMSG = Math.abs(S12);
    var MSG = topMSG/downMSG;
    return MSG;
}

function dataContainer(Freq,MagS11,AngS11,MagS21,AngS21,MagS12,AngS12,MagS22,AngS22)
{
    this.Freq = parseFloat(Freq);
    this.MagS11 = parseFloat(MagS11);
    this.AngS11 = parseFloat(AngS11);
    this.MagS21 = parseFloat(MagS21);
    this.AngS21 = parseFloat(AngS21);
    this.MagS12 = parseFloat(MagS12);
    this.AngS12 = parseFloat(AngS12);
    this.MagS22 = parseFloat(MagS22);
    this.AngS22 = parseFloat(AngS22);
    
}

function dataContainer2(Freq,MagS11,AngS11,MagS21,AngS21,MagS12,AngS12,MagS22,AngS22)
{
 //   console.log("at Freq : " + Freq);
    this.Freq = parseFloat(Freq);
    this.S11 = MathJs.vectorInit(parseFloat(MagS11),parseFloat(AngS11));
    this.S21 = MathJs.vectorInit(parseFloat(MagS21),parseFloat(AngS21));
    this.S12 = MathJs.vectorInit(parseFloat(MagS12),parseFloat(AngS12));
    this.S22 = MathJs.vectorInit(parseFloat(MagS22),parseFloat(AngS22));
    this.MagS22 = parseFloat(MagS22);
    this.AngS22 = parseFloat(AngS22);
    
}


function Vector(Mag,Ang)
{
    this.Mag = Mag;
    this.Ang = Ang;
}


function drawGainGraphBox(board_name)
{
        
    //boardGain = JXG.JSXGraph.initBoard('jxgBoxGain', {boundingbox:[-1,40,5,-1], axis:true,showCopyright: false,showNavigation: false});
    //'jxgBoxGain'
    var boardGain = JXG.JSXGraph.initBoard(board_name, {
        boundingbox:[-0.4,35.5,6.5,-1],
        axis:true,
        showCopyright: false,
        showNavigation: false,
        grid:false,
        withLabel:true
        }
    );
    
    boardGain.create("text",[5.8,0.6,"Freq"],{fontSize:labelSize});
    boardGain.create("text",[0.3,35,"Gain"],{fontSize:labelSize});
    return boardGain;
}


function drawStableFactorBox(board_name)
{
                //'jxgBoxStableFactor'
    var boradStableFactor = JXG.JSXGraph.initBoard(board_name, {
        boundingbox:[-0.4,1.6,6.5,-0.1], 
        axis:true,
        showCopyright: false,
        showNavigation: false,
        withLabel:true                    
             
    });
    boradStableFactor.create("text",[6,0.05,"Freq"],{fontSize:labelSize});
    boradStableFactor.create("text",[0.09,1.55,"K"],{fontSize:labelSize});
    
    return boradStableFactor;
}  

function  redrawSmithChartBoxAfterData(board){
    var board_name = board.container;
    //alert(board_name);
    return drawSmithChartBoxInterface("",board_name);
}

function drawSmithChartBoxInterface(planes,board_name){
    //建立 smith chart 的底圖
    //alert(board_name);
    //smithChartBase *= 2;
    if(smithChartStateArr[board_name] == undefined)
        smithChartStateArr[board_name] = planes;
    if(planes == "")    
        planes =  smithChartStateArr[board_name];
    var positive =   smithChartBase * 1.15;
    var negative = smithChartBase * (-1.15);
    var board = JXG.JSXGraph.initBoard(board_name,{
            boundingbox:[negative,positive,positive,negative],
            axis: false,
            showCopyright:false,
            showNavigation: false,
            grid: true
        })
    //board.setBoundingBox([-10.15,10.15,10.15,-10.15]);        
    var colorArr = ['blue','green','red'];    
    for(var i = 0 ; i < planes.length ; i++){
        //alert("fuck = " + planes[i]);
        board = drawSmithChartBox(planes[i],board,colorArr[i]);
       // board.setBoundingBox([-10.15,10.15,10.15,-10.15]);    
    }
    return board;
        
}



/*
繪製Smith Chart底圖的最外部function

*/

function drawSmithChartBox(plane,board,color){
    var realArr = [0,(1/3),1,3];
    var imagArr = [-2.0,-1,-0.5,0.5,1,2];
    board = doDrawSmithChartBox(board,plane,realArr,imagArr,color);
    return board;
    
}
/*
畫出smith chart上的線的核心function

*/

function doDrawSmithChartBox(board,plane,realArr,imagArr,color){
    var length = realArr.length;
    for(var i = 0 ; i <length ; i++){
        var center = getRealCenter(plane,realArr[i]);
        var radius = getRealRadius(plane,realArr[i]);
        drawCircle(board,center,radius,color);
    }
    length = imagArr.length;
    for(var i = 0 ; i < length ; i++){
        //console.log("imag :  " + imagArr[i]);
        var center = getImagCenter(plane,imagArr[i]);
        var radius = getImagRadius(plane,imagArr[i]);
        drawImagCircle(board,center,radius,color);
    }
    
    board.create('line',[[-1,0],[1,0]],{
   //board.create('line',[[-smithChartBase,0],[smithChartBase,0]],{
        strokeColor:color,
        straightFirst:false, 
        straightLast:false,
        strokeWidth:1,
        dash:3
    });
    return board;
}

function drawUnknownCircle(board,center,radius,color){
  //  alert("PASS");
    board.create('circle',[[center.x,center.y],[center.x,(center.y + radius)]],{
        strokeColor:color,
        strokeWidth:1,
        highlight:false
    });
    
    return board;
}



function drawCircle(board,center,radius,color){
    var smithChartBase = 1;
    board.create('circle',[[smithChartBase*center.x,smithChartBase*center.y],[smithChartBase*center.x,(center.y + radius)*smithChartBase ]],{
        strokeColor:color,
        strokeWidth:1,
        highlight:false
    });
}
function drawImagCircle(board,center,radius,color){
    var smithChartBase = 1;
    var cosBottom = Math.sqrt((Math.pow(1,2) + Math.pow(radius,2)));
    var cosTop = 1;
    var cos = cosTop / cosBottom;
    var angle = Math.acos(cos);
    var totalAngle = 2 * angle;
    
    
    var aPoint = new Point(1,0);
    if(center.x < 0)
        aPoint = new Point(-1,0);

    
    
    var bPointX = Math.cos(totalAngle).toFixed(15);
    var bPointY = Math.sin(totalAngle).toFixed(15);
    
    //以上的算法會忽略負方向的，以向兩個都是做這方面的處理
    if(center.y < 0)
        bPointY = -bPointY;
        
        
    //不加這行會錯
    if(center.x < 0)
        bPointX = -bPointX;
        
    var bPoint = new Point(bPointX,bPointY);    
    var c = board.create('point',[smithChartBase*center.x,smithChartBase*center.y],{
        visible: false        
    });
    var p1 = board.create('point',[smithChartBase*aPoint.x,smithChartBase*aPoint.y],{
        visible: false
    });
    
    var p2 = board.create('point',[smithChartBase*bPoint.x,smithChartBase*bPoint.y],{
        visible: false
    });
       
    board.create('minorarc',[c,p1,p2],{
        strokeColor:color,
        dash : 3,
        highlight:false
    });     
    /*
    JSXGraph一個很矛盾的地方= =,
    在畫circle時,如果不create一個 jsxgraph的point,
    (註:jsxgraph中,都是以這些「點」的「座標」來決定如何畫圖)
    直接傳進座標,也可畫出圓,而且他不會畫出點,
    但畫arc時就算只送點座標給他,一樣會畫出點,
    因此只能先create jsxgraph 的 point , 在用visible 讓點消失
    
    if(center.y > 0){
        var t = board.create('arc',[[center.x,center.y],[bPoint.x,bPoint.y],[aPoint.x,aPoint.y]],{
            dash : 3,
        });
    }
    else
       board.create('arc',[[center.x,center.y],[aPoint.x,aPoint.y],[bPoint.x,bPoint.y]],{
            dash : 3,
        });
    */
}

function getRealCenter(plane,real){
    //alert(plane);
    var center; 
    switch (plane){
        case 'z':
            var x = real / (real + 1);
            var y = 0;
            center = new Point(x,y);
            break;
        case 'y': 
            var x = -(real / (real + 1));
            var y = 0;
            center = new Point(x,y);
            break;            
            
    }
    return center;
}
function getRealRadius(plane,real){
    var radius;
    switch(plane){
        case 'z':
            radius = 1 / (real + 1);
            break;
        case 'y':
            radius = 1 / (real + 1);       
            break;
    }
    return radius;
    
}

function getImagCenter(plane,imag){
   // console.log(imag);
    var center;
    switch (plane) {
        case 'z':
            var x = 1;
            var y = 1/imag;
            center = new Point(x,y);
            break;
            
        case 'y':
            var x = -1;
            var y = 1/imag;
            center = new Point(x,y);
            break;
        default:
            // code
    }
    return center;
}

function getImagRadius(plane,imag){
    var radius;
    
    switch(plane){
        case 'z':
            radius = 1 / Math.abs(imag);
            break;
            
        case 'y':
            radius = 1 / Math.abs(imag);            
            break;
    } 
    return radius;
}
//以上為畫出smith chart底圖時會用到的function


//
function drawCircleOnSmithChart(board,s_param_data,types){
   
   
   var circleInfo;
   var type = types;
   if(type == 1)
        circleInfo =  unkownCircle1(s_param_data);
   else 
        circleInfo = unkownCircle2(s_param_data);
   var center = circleInfo.center;
   var radius = circleInfo.radius;
   return drawUnknownCircle(board,center,radius,'red');   
}





//以下為
function drawGraphOnSmithChart(board,plane,datas,chooses){
    
    var S11_dataX = new Array();
    var S11_dataY = new Array();
    var S22_dataX = new Array();
    var S22_dataY = new Array();
    var S12_dataX = new Array();
    var S12_dataY = new Array();
    var S21_dataX = new Array();
    var S21_dataY = new Array();
    var rS11 = new Array();
    var rS22 = new Array();
    var rS12 = new Array();
    var rS21 = new Array();
    
    for(var i = 0 ; i < datas.length ; i++){
        console.log("datas : ");
        console.log(datas[i]);
        console.log("--------------------------");
        var Freq = datas[i].Freq;

        var pS11 = getThePoint(datas[i].MagS11,-datas[i].AngS11);
        var pS22 = getThePoint(datas[i].MagS22,-datas[i].AngS22);
        var pS12 = getThePoint(datas[i].MagS12,-datas[i].AngS12);
        var pS21 = getThePoint(datas[i].MagS21,-datas[i].AngS21);

        

        
        S11_dataX.push(pS11.x);
        S11_dataY.push(pS11.y);
        rS11.push(countRadius(pS11.x,pS11.y));
        
        S22_dataX.push(pS22.x);
        S22_dataY.push(pS22.y);
        rS22.push(countRadius(pS22.x,pS22.y));        
        
        S12_dataX.push(pS12.x);
        S12_dataY.push(pS12.y);
        rS12.push(countRadius(pS12.x,pS12.y));        
        
        S21_dataX.push(pS21.x);
        S21_dataY.push(pS21.y);        
        rS21.push(countRadius(pS21.x,pS21.y));        
    }
    
    var displayWord = "";
    
    for(var i = 0 ; i < chooses.length ; i++){
        var choose = chooses[i];
        var dataX,dataY,radiusArr;
        if(choose == "S11"){
            dataX = S11_dataX;
            dataY = S11_dataY;
            radiusArr = rS11;
            displayWord = "`Γ_(MS)`";
            //alert("S11");
        }
        else if(choose == "S12"){
            dataX = S12_dataX;
            dataY = S12_dataY;
            radiusArr = rS12;            
            //alert("S12");            
        }
        else if(choose == "S21"){
            dataX = S21_dataX;
            dataY = S21_dataY;
            radiusArr = rS21;            
            //alert("S21");      
            
        }
        else if(choose == "S22"){
            dataX = S22_dataX;
            dataY = S22_dataY;
            radiusArr = rS22;       
            displayWord = "`Γ_(ML)`";
            
            //alert("S22");            
        } 
        
  
     /*  var tempBase = Math.ceil(Math.max.apply(Math,radiusArr));
        if(smithChartBase != tempBase)
        {
            smithChartBase = tempBase;
            board = redrawSmithChartBoxAfterData(board);
            
        }*/

        //畫圖到smith chart上
        var x = dataX[0];
        //alert(datas.length);
        if(datas.length > 1){
            var graph = drawCureveByArray(board,dataX,dataY,'red',3);
            addCoordTextEvent2(board,graph);
        }
        else{
         //   alert("PASS");
          var graph = board.create('point', [dataX[0],dataY[0]],
            {
            strokeColor:'red',
            strokeWidth:3,
            name:displayWord,
            showInfobox:false
            });   
            var disText = getDesignatedPointWithOldData(datas[0], choose);
            
            addDesignatedCoordText(board, graph, disText);
            
        }
         
    }
    return board;
    
   
}

function suitSmitChartBox(){
    
}


function drawCureveByArray(board,dataX,dataY,color,width){
    var graph = board.create('curve', [dataX,dataY],{
        strokeColor:color,
        strokeWidth:width,
        highlight:false
                
        });
    return graph;
    
}



function drawGainGraph(board,datas)
{
    var dataX = new Array();
    var dataY = new Array();
    for(var index = 0 ; index<datas.length ; index++)
    {
        var Freq = datas[index].Freq;
        if(Freq >= 0.5){                    
            dataX.push(Freq);
      // console.log(Freq);
            var Gain = countGain(datas[index]);
            var DBGain =10* MathJs.countLog10(Gain);
            dataY.push(DBGain);
            //console.log("10LogGain = " +  DBGain);
        }
    }
        var GainGraph;
        if(datas.length > 1){
            GainGraph = board.create('curve', [dataX,dataY],{
            strokeColor:'red',
            strokeWidth:3,
            highlight:false
        });
            addCoordTextEvent2(board,GainGraph);
        }
        else
            GainGraph = board.create('point', [dataX[0],dataY[0]],{strokeColor:'red',strokeWidth:3});      

}


function drawKGraph(board,datas)
{
    var dataX = new Array();
    var dataY = new Array();
    for(var index = 0 ; index<datas.length ; index++)
    {
        var Freq = datas[index].Freq;
        if(Freq >= 0.5)
        {
            dataX.push(Freq);
            var K = countK(datas[index]);
            dataY.push(K);
        }
    }
    var KGraph;
    if(datas.length > 1)
    {
        KGraph = board.create('curve', [dataX,dataY],{
        strokeColor:'red',
        strokeWidth:3,
        highlight:false
                
        });
        addCoordTextEvent2(board,KGraph);
    }
    else
    {
        KGraph = board.create('point', [dataX[0],dataY[0]],{strokeColor:'red',strokeWidth:3});       
    }
}



function getThePoint(length,angleWithDegree){
    var x = length * MathJs.cosWithDegree(angleWithDegree);
    var y = length * MathJs.sinWithDegree(angleWithDegree);
    var point = new Point(x,y);
   
    return point;
    
}

function countRadius(x,y){
    return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
}

function test(num){
    for(var i = 0 ; i < 10 ;i++){
        
        if(i < num)
            continue;
        
        console.log(i);
        
    }
    
    
}
function addCoordTextEvent(board,graph){
    var text;    
    JXG.addEvent(graph.rendNode, 'mouseover',function()
        { 
            //alert("PASS");
            
            var point = board.getUsrCoordsOfMouse(event);
            var x = point[0].toFixed(3);
            var y = point[1].toFixed(3);
            var coords = "(" + x + "," + y +")";
            txt = board.create('text',[x,y, coords], {fontSize:textSize});
        }, 
         graph);
    JXG.addEvent(graph.rendNode, 'mouseout',function()
        { 
            board.removeObject(txt);  
        }, 
         graph);         
}


function addCoordTextEvent2(board,graph){
    var text;    
    //console.log("PASS");
    graph.on('over',function(event)  //這樣才可以(Firefox) 類似jquery
        { 
            var point = board.getUsrCoordsOfMouse(event);
           // alert("PASS");
            var x = point[0].toFixed(3);
            var y = point[1].toFixed(3);
            var coords = "(" + x + "," + y +")";
            
            var dX;
            var dY;
            txt = board.create('text',[x,y, coords], {fontSize:textSize});
        }, 
         graph);
     graph.on('out',function()
        { 
            board.removeObject(txt);  
        }, 
         graph);         
}

function addDesignatedCoordText(board, graph, text){
   var text;    
    graph.on('over',function(event)  //這樣才可以(Firefox) 類似jquery
        { 
            var point = board.getUsrCoordsOfMouse(event);
            var x = point[0].toFixed(3);
            var y = point[1].toFixed(3);            
            txt = board.create('text',[x *0.90, y *0.90, text], 
            {fontSize:textSize * 1.5,
            cssClass:'text-red-bold',
            highlightCssClass:'text-red-bold',
            strokeColor:'red',
            highlightStrokeColor:'red'            
             }
            );
        }, 
         graph);
     graph.on('out',function()
        { 
            board.removeObject(txt);  
        }, 
         graph);             
    
}



function bindCoordText(board,graph){
    var $id = "#" + graph.rendNode.id;
    $(document).ready(function(){
        var txt;

        $($id).mouseover(function(){
            //alert("PASS");
            var point = board.getUsrCoordsOfMouse(event);
            var x = point[0].toFixed(3);
            var y = point[1].toFixed(3);
            var coords = "(" + x + "," + y +")";
            txt = board.create('text',[x,y, coords], {fontSize:textSize});
        });
        
        $($id).mouseout(function() {
            board.removeObject(txt);  
        });
    });    
    
}

function setWithBrowser(){
    var an =  new BrowserAnalyzer();
   //an.test();
    an.startAnalyze();
    var browserType = an.getBrowserName();
    switch(browserType){
        case 'Chrome':
            textSize *= 1;
            labelSize *= 1;
            break;
        case 'Firefox':
            textSize *= 5;
            labelSize *= 2.5;
            break;
        case 'IE':
            textSize *= 2.5;
            labelSize *= 2.5;
            break;
        default:
            textSize *= 2.5;
            labelSize*= 2.5;
    }
}

 setWithBrowser();
 
 function unkownCircle1(s_param_data){
     var S11 = s_param_data.S11;
     var S12 = s_param_data.S12;
     var S21 = s_param_data.S21;
     var S22 = s_param_data.S22;
     
     console.log("radius");
     //計算radius的公式
     var radius;
     console.log("vecotrCross");     
     var numerator1 = MathJs.vectorCross(S21,S12);
     
     console.log("denominator1");
     var denominator1;
     var S22_Abs_Pow = Math.pow(MathJs.vectorAbs(S22),2);
     var deltaInVector = countDeltaInVector(s_param_data);
     var daltaInVector_Abs_Pow = Math.pow(MathJs.vectorAbs(deltaInVector),2);
     denominator1 = S22_Abs_Pow - daltaInVector_Abs_Pow;
     var vector1 = MathJs.vectorDivisionWithScalar(numerator1,denominator1);
     radius = MathJs.vectorAbs(vector1);
     
     
     
     //計算圓心的公式
     var numerator2,denominator2;
     var conjS11 = MathJs.vectorConjugateAngle(S11);
     var delta_Cross_conjS11 = MathJs.vectorCross(deltaInVector,conjS11);
     var S22_minus_delta_Corss_conjS11 = MathJs.vectorMinus(S22,delta_Cross_conjS11);
     numerator2 = MathJs.vectorConjugateAngle(S22_minus_delta_Corss_conjS11);
     var vector2 = MathJs.vectorDivisionWithScalar(numerator2,denominator1);
     
     var circleInfo = MathJs.circleInfoInit(vector2,radius);
     return circleInfo;
     
}

function unkownCircle2(s_param_data){
     var S11 = s_param_data.S11;
     var S12 = s_param_data.S12;
     var S21 = s_param_data.S21;
     var S22 = s_param_data.S22;
     
     console.log("radius");
     //計算radius的公式
     var radius;
     console.log("vecotrCross");     
     var numerator1 = MathJs.vectorCross(S21,S12);
     
     console.log("denominator1");
     var denominator1;
     var S11_Abs_Pow = Math.pow(MathJs.vectorAbs(S11),2);
      //         console.log("PASS1");
     var deltaInVector = countDeltaInVector(s_param_data);
     //     console.log("PASS2");     
     var daltaInVector_Abs_Pow = Math.pow(MathJs.vectorAbs(deltaInVector),2);
     //     console.log("PASS3");     
     denominator1 = S11_Abs_Pow - daltaInVector_Abs_Pow;
     //     console.log("PASS4");
     var vector1 = MathJs.vectorDivisionWithScalar(numerator1,denominator1);
     radius = MathJs.vectorAbs(vector1);
     
     
     
     //計算圓心的公式
     var numerator2,denominator2;
     var conjS22 = MathJs.vectorConjugateAngle(S22);
     var delta_Cross_conjS22 = MathJs.vectorCross(deltaInVector,conjS22);
     var S11_minus_delta_Corss_conjS22 = MathJs.vectorMinus(S11,delta_Cross_conjS22);
     numerator2 = MathJs.vectorConjugateAngle(S11_minus_delta_Corss_conjS22);
     var vector2 = MathJs.vectorDivisionWithScalar(numerator2,denominator1);
     
     var circleInfo = MathJs.circleInfoInit(vector2,radius);
     return circleInfo;
     
}


function getDesignatedPoint(s_param_data, dType){
     var S11 = s_param_data.S11;
     var S12 = s_param_data.S12;
     var S21 = s_param_data.S21;
     var S22 = s_param_data.S22;
     
     var vector;
     
     if(dType == 'S11'){
        vector = S11;
         
     }else if(dType == 'S12'){
         vector= S12;
         
     }else if(dType == 'S21'){
         vector = S21;
         
     }else if(dType == 'S22'){
         vector = S22;
     }
     
     //var text= "(" + vector.length + ","  + vector.angle + ")";
     var text = getMagAngPoint(vector.length, vector.angle);
     return text;
    
}


function getDesignatedPointWithOldData(old_param_data, dType){
    console.log("===============data===================");
    console.log(old_param_data);
    var MagS11 = old_param_data.MagS11;
    var MagS12 = old_param_data.MagS12;
    var MagS21 = old_param_data.MagS21;
    var MagS22 = old_param_data.MagS22;
    var AngS11 = old_param_data.AngS11;
    var AngS12 = old_param_data.AngS12;
    var AngS21 = old_param_data.AngS21;
    var AngS22 = old_param_data.AngS22;
    
    var Mag,Ang;
     if(dType == 'S11'){
        Mag = MagS11;
        Ang = AngS11;
     }else if(dType == 'S12'){
        Mag = MagS12;
        Ang = AngS12;         
     }else if(dType == 'S21'){
        Mag = MagS21;
        Ang = AngS21;
         
     }else if(dType == 'S22'){
        Mag = MagS22;
        Ang = AngS22;     
         
     }    
     return getMagAngPoint(Mag,Ang);
}


function getMagAngPoint(Mag, Ang){
    var text = "(" + Mag + "," + Ang + ")";
    return text;
}