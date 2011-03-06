/* Jax namespace */
var Jax = (function() {
  /*
    we must dynamically find the base path. This is because the user may not choose '/javascripts' 
    as a home directory. In all cases, the base path is considered to be wherever this file resides.
   */
  function getJaxBasePath() {
    var src = getJaxScriptElement().getAttribute("src");
    var index = src.indexOf("/jax.js");
    if (index != -1)
      return src.substring(0, index);
    return "/javascripts";
  }
  
  function getJaxScriptElement() {
    var scripts = document.getElementsByTagName("script");
    var script, src, index;
    
    for (var i = 0; i < scripts.length; i++)
    {
      script = scripts[i];
      src = script.getAttribute('src');
      
      if (src && (index = src.indexOf("/jax.js")) != -1)
        return script;
    }
    
    throw new Error("Could not find Jax element!");
  }
  
  var jaxScriptElement = getJaxScriptElement();
  var base_path = getJaxBasePath();
  var loaded_files = {};
  
  function require(path, callback) {
    path = base_path + (path.charAt(0) == '/' ? path : "/"+path) + ".js";
      
    /* don't load the same file twice */
    if (loaded_files[path] == 1) return;

    /* don't load this file unless it's Prototype, or unless Prototype has already been loaded */
    if (path != base_path+'/prototype.js' && typeof(Prototype) == "undefined")
    {
      Jax.after_prototype_loaded(function() {
        
      });
      return;
    }

    
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", path);
    loaded_files[path] = 0;
    
    function checkJaxLoaded() {
      loaded_files[path] = 1;
      for (var p in loaded_files) {
        if (loaded_files[p] == 0) {
          Jax.loaded = false;
          return;
        }
      }
      Jax.loaded = true;
    }

    // Opera has readyState too, but does not behave in a consistent way
    if (script.readyState && script.onload !== null) {
      // IE only (onload===undefined) not Opera (onload===null)
      script.onreadystatechange = function() {
        if (script.readyState === "loaded" || script.readyState === "complete" ) {
          // Avoid memory leaks (and duplicate call to callback) in IE
          script.onreadystatechange = null;
          if (callback) callback();
          checkJaxLoaded(path);
        }
      };
    } else {
      // other browsers (DOM Level 0)
      script.onload = function() { if (callback) callback(); checkJaxLoaded(); }
    }
    
    /*
      we want to insert the script after the last script to have been required, OR after *this* script
      if it is the first script to be required.
     */
    jaxScriptElement.parentNode.insertBefore(script, (require.after || jaxScriptElement).nextSibling);
    require.after = script;
  }
  
  function requireJaxDependencies() {
    require("jax/model");
  }
  
/* don't load Prototype if it already exists, or we might replace a newer or customized version */
  if (typeof(Prototype) == "undefined")
  {
    require("prototype", requireJaxDependencies);
  }
  else
    requireJaxDependencies();


  return {
    require: function(path) {
      require(path);
    },
  
    loaded: function() {
      /* not used any more but kept here just-in-case */
    }
  }
})();

if (window && window.attachEvent) window.attachEvent("load", Jax.loaded);             /* IE */
else                              window.addEventListener("load", Jax.loaded, false); /* W3 */