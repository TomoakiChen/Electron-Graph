function Vector(length,angle){
    this.length = length;
    this.angle = angle;
}

function Complex(real, imag){
    this.real = real;
    this.imag = imag;
}


function Point(x,y){
    this.x = x;
    this.y = y;
}
    
    
function CircleInfo(point,radius){
    this.center = point;
    this.radius = radius;
}

/* 
 * version : 0.2
 *  紀錄所有「純運算」的函式  
 *
 *
 */
/*要能 call MathJs裡的method(MathJs.xxx) 還是得宣告一個「Object」
所以就算用 
var MathJs = {
    
}
寫也沒差
*/

var MathJs = {
    Common : {
        /**
         *  Change Radius to Degree 
         * @param radius 
         * @return degree
         * 
         */
         radiusToDegree : function(radius){
            var degree = (radius / Math.PI) * 180;
            return degree;         
         },
         
         degreeToRadius : function(degree){
            var radius = (degree/180) * Math.PI;
            return parseFloat(radius).toFixed(15);             
         },
         
         cosWithDegree : function(degree){
            var radius = this.DegreeToRadius(degree);
            return Math.cos(radius);             
         },
         
         sinWithDegree : function(degree){
            var radius = this.DegreeToRadius(degree);
            return Math.sin(radius);             
         },
         
         countLog : function(base, param){
            return Math.log(param)/Math.log(base);
         },
         
         countLog10 : function(param){
            var base = 10;
            return this.countLog(10,param);             
         }
    },
    
    Vector : {
        init : function(length, angle){
            return new Vector(length, angle);
        },
        
        abs : function(vector){
            return vector.length;
        },
        
        vectorAddVector : function(vectorA, vectorB){
            var vectorC;
            
            var lengthA = vectorA.length;
            var lengthB = vectorB.length;
            var angleA = vectorA.angle;
            var angleB = vectorB.angle;
            
            var x1 = lengthA * Math.cos(MathJs.Common.degreeToRadius(angleA));
            var y1 = lengthA * Math.sin(MathJs.Common.degreeToRadius(angleA));
            
            var x2 = lengthB * Math.cos(MathJs.Common.degreeToRadius(angleB));
            var y2 = lengthB * Math.sin(MathJs.Common.degreeToRadius(angleB));
            
            var sumX = x1 + x2;
            var sumY = y1 + y2;
    
            var lengthC = Math.sqrt(Math.pow(sumX,2) + Math.pow(sumY,2));        
            var angleC = MathJs.Common.radiusToDegree(Math.atan2(sumY,sumX));
            vectorC = new Vector(lengthC,angleC);
            return vectorC;
        },
    
        vectorMinusVector : function(vectorA, vectorB){
            var vectorC;
            var lengthA = vectorA.length;
            var lengthB = vectorB.length;
            var angleA = vectorA.angle;
            var angleB = vectorB.angle;
            
            
            var x1 = lengthA * Math.cos(MathJs.Common.degreeToRadius(angleA));
            var y1 = lengthA * Math.sin(MathJs.Common.degreeToRadius(angleA));
            
            var x2 = lengthB * Math.cos(MathJs.Common.degreeToRadius(angleB));
            var y2 = lengthB * Math.sin(MathJs.Common.degreeToRadius(angleB));
            
            var sumX = x1 - x2;
            var sumY = y1 - y2;
    
            var lengthC = Math.sqrt(Math.pow(sumX,2) + Math.pow(sumY,2));        
            var angleC = MathJs.Common.radiusToDegree(Math.atan2(sumY,sumX));
            vectorC = this.init(lengthC,angleC);
            return vectorC;
    
        },
        
        /** 
         * 向量相乘為
         * 長度相乘，角度相加
         * 
         */
        vectorCrossVector : function(vectorA, vectorB){
            var vectorC;
            var length,angle;
            
            length = vectorA.length * vectorB.length;
            angle = vectorA.angle + vectorB.angle;
            vectorC = new Vector(length,angle);
            return vectorC;            
        },
        
        
        /** 
         * 向量乘純量
         * 向量的長度乘以純量為新的向量的長度
         * 原本向量的度即新向量的角度
         */
        vectorCrossScalar : function(vector, scalar){
            var resultVector;
            var resultLength = vector.length * scalar;
            var resultAngle = vector.angle;
            resultVector = this.init(resultLength, resultAngle);
            return resultVector;
        },
        
        /**
         * 向量相除為
         * 長度相除，角度相減
         * 
         */
        vectorDividedByVector : function(dividendVector, divisorVector){
            var resultVector, resultLength, resultAngle;
            
            var dividendLength = dividendVector.length;
            var dividendAngle  = dividendVector.angle;
            
            var divisorLength = divisorVector.length;
            var divisorAngle  = divisorVector.angle;
            
            resultLength = dividendLength / divisorLength;
            resultAngle = dividendAngle - divisorAngle;
            
            resultVector = new Vector(resultLength, resultAngle);
            return resultVector;            
        },
        
        
        /**
         * 
         * 向量除純數，
         * 向量長度除以純數，
         * 角度不變。
         * 
         */
        vectorDivdedByScalar : function(vector, scalar){
            var vectorC;
            var length,angle;
            length = vector.length / num;
            angle = vector.angle;
            vectorC = new Vector(length,angle);
            return vectorC;            
        },
        
        /** 
         * 純數除以向量，
         * 向量長度除以純數，
         * 角度正負相反
         * 
         */
        scalarDividedByVector : function(scalar, vector){
            var resultVector;
            var resultLength = scalar / vector.length;
            var resultAngle = 0-vector.angle;
            resultVector = this.init(resultLength, resultAngle);
            return resultVector;        
        },
        
        conjugateAngle : function(vector){
            var conjugateVector;
            var length = vector.length;
            var angle = vector.angle;
            
            conjugateVector = MathJs.vectorInit(length,-angle);
            return conjugateVector;            
        },
        
        toPolar : function(vector){
            var realPart = vector.length * this.cosWithDegree(vector.angle);
            var imagPart = vector.length * this.sinWithDegree(vector.angle);
            return this.complexInit(realPart, imagPart);
        }
        

    },
    
    Complex : {
        init : function(real, imag){
            return new Complex(real, imag);
        },
    
        complexAddComplex : function(complexA, complexB){
            var realPart = complexA.real + complexB.real;
            var imagPart = complexA.imag + complexB.imag;
            return this.init(realPart, imagPart);
        },
        
        complexAddReal : function(complexA, realB){
            //一種方法
            var realPart = complexA.real + realB;
            var imagPart = complexA.imag;
            return this.init(realPart, imagPart);
        },
        
        complexMinusComplex : function(complexA, complexB){
            var realPart = complexA.real - complexB.real;
            var imagPart = complexA.imag - complexB.imag;
            return this.init(realPart, imagPart);
        },
        
        complexMinusReal : function(complexA, realB){
            var realPart = complexA.real - realB;
            var imagPart = complexA.imag;
            return this.init(realPart, imagPart);
            
        },
        
        
        complexCrossComplex : function(complexA, complexB){
            var realPart = (complexA.real * complexB.real) - (complexA.imag * complexB.imag);
            var imagPart = (complexA.imag * complexB.real) + (complexA.real * complexB.imag);
            return this.init(realPart, imagPart);
        },
        
        complexCrossReal : function(complexA, realB){
            var complexB = this.init(realB, 0);
            return this.complexCrossComplex(complexA, complexB);
            
        },
        
        complexDivideComplex : function(complexA , complexB){
            var divided = Math.pow(complexB.real,2) + Math.pow(complexB.imag, 2);
            
            var realPartTop = (complexA.real * complexB.real) + (complexA.imag * complexB.imag);
            var realPartBottom = divided;
            var realPart = realPartTop / realPartBottom;
            
            var imagPartTop = (complexA.imag * complexB.real) - (complexA.real * complexB.imag);
            var imagPartBottom = divided;
            var imagPart = imagPartTop / imagPartBottom;        
            
            return this.init(realPart, imagPart);
        },
        /*
        this.complexDivisionReal = function(complexA, realB){
            var complexB = this.complexInit(realB, 0);
            return this.complexDivision(complexA, complexB);
        }*/
        
        realDivideComplex : function(real, complex){
            var complexA = this.init(real, 0);
            var complexB = complex;
            return this.complexDivideComplex(complexA, complexB);
        },
        
        complexDivideReal : function(complex, real){
            var complexA = complex;
            var complexB = this.init(real, 0);
            return this.complexDivideComplex(complexA, complexB);
        }        
    }
    
}