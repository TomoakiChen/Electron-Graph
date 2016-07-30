var S_Parameter = {
     Freq : 0,
     S11 : MathJs.vectorInit(0,0),
     S12 : MathJs.vectorInit(0,0),
     S21 : MathJs.vectorInit(0,0),
     S22 : MathJs.vectorInit(0,0),
          
     init : function(Freq, MagS11, AngS11, MagS21, AngS21, MagS12, AngS12, MagS22, AngS22){
          this.setFreq(Freq);
          this.setS11(MagS11, AngS11);
          this.setS12(MagS12, AngS12);
          this.setS21(MagS21, AngS21);
          this.setS22(MagS22, AngS22);
     },
     
     getFreq : function(){
          return this.Freq;
     },
     
     getS11 : function(){
          return this.S11;
     },
     getMagS11 : function(){
          return this.S11.length;   
     },

     getAngS11: function(){
         return this.S11.angle;
     },
          
          
     getS12 : function(){
          return this.S12;
     },

     getMagS12 : function(){
          return this.S12.length;   
     },

     getAngS12: function(){
         return this.S12.angle;
     },          
          
     getS21 : function(){
          return this.S21;
     },

     getMagS21 : function(){
          return this.S21.length;   
     },

     getAngS21: function(){
         return this.S21.angle;
     },          
          
     getS22 : function(){
          return this.S22;
     },

     getMagS22 : function(){
          return this.S22.length;   
     },

     getAngS22: function(){
         return this.S22.angle;
     },            
          
     setFreq : function(freq){
       this.Freq = freq;   
     },
     
     setS11 : function(length, angle){
          this.S11 = MathJs.vectorInit(length, angle);
     },
          
     setS12 : function(length, angle){
          this.S12 = MathJs.vectorInit(length, angle);
     },
          
     setS21 : function(length, angle){
          this.S21 = MathJs.vectorInit(length, angle);
     },
     
     setS22 : function(length, angle){
          this.S22 = MathJs.vectorInit(length, angle);
     }, 
     
     transferOldFormat : function(dataContainerParam){
          var Freq = dataContainerParam.Freq;
          var MagS11 = dataContainerParam.MagS11;
          var AngS11 = dataContainerParam.AngS11;
          var MagS12 = dataContainerParam.MagS12;
          var AngS12 = dataContainerParam.AngS12;
          var MagS21 = dataContainerParam.MagS21;
          var AngS21 = dataContainerParam.AngS21;
          var MagS22 = dataContainerParam.MagS22;
          var AngS22 = dataContainerParam.AngS22;
          this.init(Freq, MagS11, AngS11, MagS21, AngS21,  MagS12, AngS12, MagS22, AngS22);
     }
}   


var ElectronMath = {
     
     countK : function(sParam){
         var Delta = this.countDelta(sParam);
         var MagS11 = sParam.S11.length;
         var MagS12 = sParam.S12.length;
         var MagS21 = sParam.S21.length;
         var MagS22 = sParam.S22.length;
         var topK = 1 - Math.pow(Math.abs(MagS11),2) -  Math.pow(Math.abs(MagS22),2) + Math.pow(Math.abs(Delta),2);
         var downK = 2 * Math.abs(MagS12 * MagS21);
         return topK / downK;          
     },
     
     countDelta : function(sParam){
          var S11 = sParam.getS11();
          var S22 = sParam.getS22();
          var S21 = sParam.getS21();
          var S12 = sParam.getS12();
          
          var crossS11andS22 = MathJs.vectorCross(S11, S22);
          var crossS21andS12 = MathJs.vectorCross(S21, S12);
          

          var vectorMinus = MathJs.vectorMinus(crossS11andS22, crossS21andS12);
          return vectorMinus;
          //var result = vectorMinus.length;
          //return result;          
     },
     
     countGain : function(sParam){
         var K = this.countK(sParam);
         var S12 = sParam.getMagS12();
         var S21 = sParam.getMagS21();
      
         if(K > 1)
             return this.countMAG(S21,S12,K);
         else
             return this.countMSG(S21,S12);
         
     },
     
     countMAG : function(MagS21,MagS12,K) {
         var MSG = this.countMSG(MagS21,MagS12);
         var MAG = MSG * (K - Math.sqrt( Math.pow(K,2) - 1 ) );
         return MAG;
     },
     
     countMSG : function (MagS21,MagS12) {
         var topMSG = Math.abs(MagS21);
         var downMSG = Math.abs(MagS12);
         var MSG = topMSG/downMSG;
         return MSG;
     },
     
     countGammaMSParamB1 : function(sParam){
          var S11 = sParam.getS11();
          var S22 = sParam.getS22();
          var Delta = this.countDelta(sParam);
          var result = this.formatGammaMSParamB1(S11, S22, Delta);
          return result;
     },
     
     formatGammaMSParamB1 : function(S11, S22, Delta){
          var B1 = 1 + Math.pow( MathJs.vectorAbs(S11), 2) - Math.pow( MathJs.vectorAbs(S22), 2) - Math.pow( MathJs.vectorAbs(Delta), 2);
          return B1;
     },
     
     countGammaMSParamB2 : function(sParam){
          var S11 = sParam.getS11();
          var S22 = sParam.getS22();
          var Delta = this.countDelta(sParam);
          
          var result = this.formatGammaMSParamB2(S11, S22, Delta);
          return result;          
     },
     
     formatGammaMSParamB2 : function(S11, S22, Delta){
          var B2 = 1 + Math.pow( MathJs.vectorAbs(S22), 2) - Math.pow( MathJs.vectorAbs(S11), 2) - Math.pow( MathJs.vectorAbs(Delta), 2);
          return B2;
     },
     
     countGammaMSParamC1 : function(sParam){
          var S11 = sParam.getS11();
          var S22 = sParam.getS22();
          var Delta = this.countDelta(sParam);
          
          var result = this.formatGammaMSParamC1(S11, S22, Delta);
          return result;
     },
     
     
     formatGammaMSParamC1 : function(S11, S22, Delta){
          var C1 = MathJs.vectorMinus( S11,  MathJs.vectorCross( Delta,MathJs.vectorConjugateAngle(S22) ) );
          return C1;
     },
     
     countGammaMSParamC2 : function(sParam){
          var S11 = sParam.getS11();
          var S22 = sParam.getS22();
          var Delta = this.countDelta(sParam);
          
          var result = this.formatGammaMSParamC2(S11, S22, Delta);
          return result;
     },
     
     
     formatGammaMSParamC2 : function(S11, S22, Delta){
          var C2 = MathJs.vectorMinus( S22,  MathJs.vectorCross( Delta,MathJs.vectorConjugateAngle(S11) ) );
          return C2;
     },
     
     countLambda : function(freq){
          var c = PhysicalMath.ConstantVariable.c;
          return this.formatLamda(c, freq);
          
     },
     
     formatLamda : function(lightSpeedInVacuum, freq){
          return lightSpeedInVacuum / freq;
     },
     
     /*
     countBeta : function(freq){
          var doublePI = 2 * Math.PI;
          var lambda = this.countLambda(freq);
          return this.formatBeta(doublePI, lambda);
     },
     */
     countBeta : function(lambda){
          var doublePI = 2 * Math.PI;
          return this.formatBeta(doublePI, lambda);
     },     
     
     formatBeta :function(doublePI, lambda){
          return doublePI / lambda;
     },
     
     /** 
      * @param beta is 
      * @param length is input from user 
      */
     countZin : function(Z0, ZL, Beta, Length){
          var tanBL = Math.tan(Beta * Length);
          
          var result;
          var upperRe = ZL; // 本身就是複數
          var upperIm = MathJs.complexInit(0, Z0 * tanBL);
          var upper = MathJs.complexAdd(upperRe,upperIm);
          console.log(upper);     
          
          var bottomRe = MathJs.complexInit(Z0,0);
          var bottomIm = MathJs.complexCross( MathJs.complexInit(0,1) , MathJs.complexCrossReal(ZL, tanBL));
          var bottom = MathJs.complexAdd(bottomRe, bottomIm);
          console.log(bottomIm);
          console.log(bottom);
          
          
          var z = MathJs.complexDivision(upper, bottom);
          console.log(z);
          result = MathJs.complexCrossReal(z, Z0);
          
          
        /*  var newUpper = MathJs.complexCrossReal(upper, Z0);
          console.log(newUpper);
          
          result = MathJs.complexDivision(newUpper, bottom);
          return result;
         */
         /*
         var newBottom = MathJs.complexDivisionRealTop(bottom, Z0);
         result = MathJs.complexDivision(upper, newBottom);
          console.log(result);
          */
          return result;
          
     }
     
}



var ElectronGraph = {
     S_ParamDatas : [],
     
     addS_Param : function(Freq, MagS11, AngS11, MagS12, AngS12, MagS21, AngS21, MagS22, AngS22){
          var sParam = Object.create(S_Parameter);
          sParam.init(Freq, MagS11, AngS11, MagS12, AngS12, MagS21, AngS21, MagS22, AngS22);
          this.S_ParamDatas.push(sParam);
     },     
}
