/* 
 * version : 0.2
 *  紀錄所有「純運算」的函式  
 *
 *
 */
function MathJs(){
    
    /**
     *  Change Radius to Degree 
     * @param radius 
     * @return degree
     * 
     */
    this.RadiusToDegree = function(radius){
        var degree = (radius / Math.PI) * 180;
        return degree;
    }
    
    
    this.DegreeToRadius = function (degree){
        var radius = (degree/180) * Math.PI;
        return parseFloat(radius).toFixed(15);
    }
    
    
    this.cosWithDegree = function (degree){
        
        var radius = this.DegreeToRadius(degree);
        return Math.cos(radius);
    }
    
    this.sinWithDegree = function (degree){
        
        var radius = this.DegreeToRadius(degree);
        return Math.sin(radius);
    }
    
    
    
    this.countLog = function (base,param){
        return Math.log(param)/Math.log(base);
    }
    
    this.countLog10 = function(param){
        var base = 10;
        return this.countLog(10,param);
    }
    
    
    this.Vector = function(){
        this.init = function(length,angle){
        var vector = new this.Vector(length,angle);
        return vector;
        }
    
        this.cross = function(vectorA,vectorB){
            var vectorC;
            var length,angle;
            
            length = vectorA.length * vectorB.length;
            angle = vectorA.angle + vectorB.angle;
            vectorC = new MathJs.Vector(length,angle);
            return vectorC;
        }
        
        this.vectorAbs = function(vector){
            return vector.length;
        }
        
        
        this.vectorAdd = function(vectorA,vectorB){
            
            var vectorC;
            
            var lengthA = vectorA.length;
            var lengthB = vectorB.length;
            var angleA = vectorA.angle;
            var angleB = vectorB.angle;
            
            
            var x1 = lengthA * Math.cos(MathJs.DegreeToRadius(angleA));
            var y1 = lengthA * Math.sin(MathJs.DegreeToRadius(angleA));
            
            var x2 = lengthB * Math.cos(MathJs.DegreeToRadius(angleB));
            var y2 = lengthB * Math.sin(MathJs.DegreeToRadius(angleB));
            
            var sumX = x1 + x2;
            var sumY = y1 + y2;
    
            var lengthC = Math.sqrt(Math.pow(sumX,2) + Math.pow(sumY,2));        
            var angleC = MathJs.RadiusToDegree(Math.atan2(sumY,sumX));
            vectorC = MathJs.vectorInit(lengthC,angleC);
            return vectorC;
        }
        
        this.vectorMinus = function(vectorA,vectorB){
            
            var vectorC;
            
            var lengthA = vectorA.length;
            var lengthB = vectorB.length;
            var angleA = vectorA.angle;
            var angleB = vectorB.angle;
            
            
            var x1 = lengthA * Math.cos(MathJs.DegreeToRadius(angleA));
            var y1 = lengthA * Math.sin(MathJs.DegreeToRadius(angleA));
            
            var x2 = lengthB * Math.cos(MathJs.DegreeToRadius(angleB));
            var y2 = lengthB * Math.sin(MathJs.DegreeToRadius(angleB));
            
            var sumX = x1 - x2;
            var sumY = y1 - y2;
    
            var lengthC = Math.sqrt(Math.pow(sumX,2) + Math.pow(sumY,2));        
            var angleC = this.RadiusToDegree(Math.atan2(sumY,sumX));
            vectorC = this.vectorInit(lengthC,angleC);
            return vectorC;
            
        }
        
    
        this.vectorConjugateAngle = function(vector){
            var conjugateVector;
            var length = vector.length;
            var angle = vector.angle;
            
            conjugateVector = MathJs.vectorInit(length,-angle);
            return conjugateVector;
            
        }
       
    }
    




    
    this.Point = function(x,y){
        this.x = x;
        this.y = y;
    }
    
    
    this.CircleInfo = function(point,radius){
        this.center = point;
        this.radius = radius;
        
    }
    
    this.circleInfoInit = function(vector,radius){
        var length = vector.length;
        var angle = vector.angle;
        var x = length * this.cosWithDegree(angle);
        var y = length * this.sinWithDegree(angle);
        
        var point = new this.Point(x,y);
        var CircleInfo = new this.CircleInfo(point,radius);
        return CircleInfo;
        
    }
    
    this.vectorDivision = function(dividendVector, divisorVector){
        var resultVector, resultLength, resultAngle;
        
        var dividendLength = dividendVector.length;
        var dividendAngle  = dividendVector.angle;
        
        var divisorLength = divisorVector.length;
        var divisorAngle  = divisorVector.angle;
        
        resultLength = dividendLength / divisorLength;
        resultAngle = dividendAngle - divisorAngle;
        
        resultVector = MathJs.vectorInit(resultLength, resultAngle);
        return resultVector;
    }
    
    this.vectorDivisionWithScalar = function(vector,num){
        var vectorC;
        var length,angle;
        length = vector.length / num;
        angle = vector.angle;
        vectorC = MathJs.vectorInit(length,angle);
        return vectorC;
    }   
    
    
    
    this.vector2Polar = function(vector){
        var realPart = vector.length * this.cosWithDegree(vector.angle);
        var imagPart = vector.length * this.sinWithDegree(vector.angle);
        return this.complexInit(realPart, imagPart);
    }
    
    
    
    
    /*
    2016-04-24 add, support completx calculate
    */
    this.Complex = function(real, imag){
        this.real = real;
        this.imag = imag;
        //return this;
    }
    
    this.complexInit = function(real, imag){
        return new this.Complex(real, imag);
    }
    
    this.complexAdd = function(complexA, complexB){
        var realPart = complexA.real + complexB.real;
        var imagPart = complexA.imag + complexB.imag;
        return this.complexInit(realPart, imagPart);
    }
    
    this.complexAddReal = function(complexA, realB){
        //一種方法
        var realPart = complexA.real + realB;
        var imagPart = complexA.imag;
        return this.complexInit(realPart, imagPart);
    }
    
    this.complexMinus = function(complexA, complexB){
        var realPart = complexA.real - complexB.real;
        var imagPart = complexA.imag - complexB.imag;
        return this.complexInit(realPart, imagPart);
    }
    
    this.complexMinusReal = function(complexA, realB){
        var realPart = complexA.real - realB;
        var imagPart = complexA.imag;
        return this.complexInit(realPart, imagPart);
        
    }
    
    
    this.complexCross = function(complexA, complexB){
        var realPart = (complexA.real * complexB.real) - (complexA.imag * complexB.imag);
        var imagPart = (complexA.imag * complexB.real) + (complexA.real * complexB.imag);
        return this.complexInit(realPart, imagPart);
    }
    
    this.complexCrossReal = function(complexA, realB){
        var complexB = this.complexInit(realB, 0);
        return this.complexCross(complexA, complexB);
        
    }
    
    this.complexDivision = function(complexA , complexB){
        var divided = Math.pow(complexB.real,2) + Math.pow(complexB.imag, 2);
        
        var realPartTop = (complexA.real * complexB.real) + (complexA.imag * complexB.imag);
        var realPartBottom = divided;
        var realPart = realPartTop / realPartBottom;
        
        var imagPartTop = (complexA.imag * complexB.real) - (complexA.real * complexB.imag);
        var imagPartBottom = divided;
        var imagPart = imagPartTop / imagPartBottom;        
        
        return this.complexInit(realPart, imagPart);
    }
    /*
    this.complexDivisionReal = function(complexA, realB){
        var complexB = this.complexInit(realB, 0);
        return this.complexDivision(complexA, complexB);
    }*/
    
    this.complexDivisionRealTop = function(complex , real){
        var complexA = this.complexInit(real, 0);
        var complexB = complex;
        return this.complexDivision(complexA, complexB);
    }
    
    this.complexDivisionRealBottom = function(complex, real){
        var complexA = complex;
        var complexB = this.complexInit(real, 0);
        return this.complexDivision(complexA, complexB);
    }
    
    
    
    
    
    
    
}
MathJs = new MathJs(); 

/*要能 call MathJs裡的method(MathJs.xxx) 還是得宣告一個「Object」
所以就算用 
var MathJs = {
    
}
**/