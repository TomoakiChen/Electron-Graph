function BrowserAnalyzer(){
     var browserName;
     var browserEngine;
     
     var isIE = false;
     var isChrome = false;
     var isFirefox = false;
     var isOpera = false;
     var isSafari = false;
     
     this.setParameter = function(){
          //alert("set : " + this.browserName);
          switch(this.browserName){
               case 'Chrome':
                    this.isChrome = true;
                    break;
               case 'Firefox':
                    this.isFirefox = true;
                    break;
               case 'IE':
                    this.isIE = true;
                    break;
               case 'Opera':
                    this.isOpera = true;
                    break;
               case "Safari":
                    this.isSafari = true;
                    break;
               default:
                    //

          }
     }
     
     this.startAnalyze = function(){
          //alert("anal");
          var wholeName = navigator.userAgent;
        //  alert(wholeName.indexOf("OPR"));
          if(wholeName.indexOf("Chrome") > -1 && wholeName.indexOf('OPR') == -1)
               this.browserName = "Chrome";
          else if(wholeName.indexOf("Chrome") > -1 && wholeName.indexOf('OPR') > -1)     
               this.browserName = 'Opera';
          else if(wholeName.indexOf("Firefox") > -1)
               this.browserName = "Firefox";
          else if(wholeName.indexOf("IE") > -1)
               this.browserName = "IE";
          else if(wholeName.indexOf("Safari") > -1)
               this.browserName = "Safari";
          else 
               this.browserName = "IE";
          
          
          
          browserEngine = navigator.product;
          this.setParameter();
     }
     
     this.test = function(){
          alert("appName = " + navigator.appName);
          alert("userAgent = " + navigator.userAgent);
          alert("versin = " + navigator.appVersion);
          alert("engine = " + navigator.product);
          
          
     }
     
     this.getBrowserName = function(){
          return browserName;
     }
     
     this.getBrowserEngine = function(){
          return browserEngine;
     }
     

     

     
     
}