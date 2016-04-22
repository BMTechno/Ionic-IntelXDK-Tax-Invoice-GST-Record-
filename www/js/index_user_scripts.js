/*jshint browser:true */
/*global $ */(function()
{
 "use strict";

//$(".fullheightdiv").css("height", window.innerHeight +"px");

 /*
   hook up event handlers 
 */
//$.feat.nativeTouchScroll=true;

 function register_event_handlers()
 {
   
     /* button  #btnsidebar */
    $(document).on("click", "#btnsidebar", function(evt)
    { 
         uib_sb.toggle_sidebar($("#sidebarMenu"));  
    });
    
        /* button  .uib_w_87 */
    $(document).on("click", ".uib_w_87", function(evt)
    {
         /*global uib_sb */
         /* Other possible functions are: 
           uib_sb.open_sidebar($sb)
           uib_sb.close_sidebar($sb)
           uib_sb.toggle_sidebar($sb)
            uib_sb.close_all_sidebars()
          See js/sidebar.js for the full sidebar API */
        
         uib_sb.toggle_sidebar($("#sidebarMenu"));  
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
