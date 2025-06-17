/*!
* KioskBoard - Virtual Keyboard with Dynamic Language Switching
* Enhanced version with language selection popup
* Based on KioskBoard v2.3.0 by Furkan
*/

/* global define */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return factory(root);
    });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(root);
  } else {
    root.KioskBoard = factory(root);
  }
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this, function (window) {

  'use strict';

  // SSR check: begin
  if (typeof window === 'undefined' && typeof window.document === 'undefined') {
    return;
  }
  // SSR check: end

  // KioskBoard: Internal CSS Codes: begin
  var kioskBoardInternalCSSCodes = function () {
    var internalCSS = `
    #KioskBoard-VirtualKeyboard{box-sizing:border-box!important;position:fixed;z-index:2000;width:100%;max-width:1440px;background:#e3e3e3;background:linear-gradient(to right bottom,#eee,#ebebeb,#e8e8e8,#e6e6e6,#e3e3e3);-webkit-box-shadow:inset 1px 1px 0 rgba(255,255,255,.25),0 0 20px -8px rgba(0,0,0,.15);box-shadow:inset 1px 1px 0 rgba(255,255,255,.25),0 0 20px -8px rgba(0,0,0,.15);padding:25px 20px 20px;left:0;right:0;margin:auto}
    #KioskBoard-VirtualKeyboard.kioskboard-placement-bottom{top:unset;bottom:0;border-radius:10px 10px 0 0}
    #KioskBoard-VirtualKeyboard.kioskboard-placement-top{top:0;bottom:unset;border-radius:0 0 10px 10px}
    #KioskBoard-VirtualKeyboard *{box-sizing:border-box!important}
    #KioskBoard-VirtualKeyboard .kioskboard-wrapper{position:relative;background:inherit;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row}
    #KioskBoard-VirtualKeyboard .kioskboard-wrapper.kioskboard-overflow{padding-right:12px!important;overflow:hidden auto}
    #KioskBoard-VirtualKeyboard .kioskboard-wrapper.kioskboard-overflow::-webkit-scrollbar{height:6px;width:6px}
    #KioskBoard-VirtualKeyboard .kioskboard-wrapper.kioskboard-overflow::-webkit-scrollbar-track{border-radius:3px;background:rgba(255,255,255,.75)}
    #KioskBoard-VirtualKeyboard .kioskboard-wrapper.kioskboard-overflow::-webkit-scrollbar-thumb{border-radius:3px;background:rgba(0,0,0,.25);cursor:pointer}
    #KioskBoard-VirtualKeyboard .kioskboard-row{position:relative;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center}
    #KioskBoard-VirtualKeyboard .kioskboard-row span[class^=kioskboard-key]{-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;user-select:none;position:relative;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;-webkit-transform-origin:bottom center;transform-origin:bottom center;cursor:pointer;font-size:22px;line-height:1;font-weight:normal;font-family:sans-serif;max-width:6.25%;margin:8px 8px 12px;padding:12px 12px 22px;border-radius:8px;background:#fafafa;color:#707070;border:2px solid rgba(255,255,255,.04);-webkit-box-shadow:0 4px 0 .04px rgba(0,0,0,.1);box-shadow:0 4px 0 .04px rgba(0,0,0,.1);border-bottom-color:rgba(255,255,255,.1);border-bottom-width:4px;-webkit-box-flex:1;-webkit-flex:1 1 100%;-ms-flex:1 1 100%;flex:1 1 100%;display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;text-align:left}
    #KioskBoard-VirtualKeyboard.kioskboard-tolowercase .kioskboard-row-dynamic span[class^=kioskboard-key]{text-transform:lowercase}
    #KioskBoard-VirtualKeyboard.kioskboard-touppercase .kioskboard-row-dynamic span[class^=kioskboard-key]{text-transform:uppercase}
    #KioskBoard-VirtualKeyboard .kioskboard-row span[class^=kioskboard-key]:not(.spacebar-denied):hover{-webkit-transform:scaleY(.98) translateY(1px);transform:scaleY(.98) translateY(1px)}
    #KioskBoard-VirtualKeyboard .kioskboard-row span[class^=kioskboard-key]:not(.spacebar-denied):active{-webkit-transform:scaleY(.95) translateY(4px);transform:scaleY(.95) translateY(4px)}
    #KioskBoard-VirtualKeyboard .kioskboard-row span[class^=kioskboard-key] svg{position:absolute;z-index:10;left:10px;top:10px}
    #KioskBoard-VirtualKeyboard .kioskboard-row-top{padding:0 0 10px;border-bottom:1px solid rgba(0,0,0,.06);margin:0 0 10px}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom{padding:10px 0 0;border-top:1px solid rgba(0,0,0,.06);margin:10px 0 0}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-capslock{max-width:100%;min-height:60px;width:140px;-webkit-box-flex:1;-webkit-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-capslock::before{content:"";position:absolute;z-index:2;width:10px;height:10px;border-radius:10px;right:6px;top:6px;background:#c4c4c4}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-capslock.capslock-active::before{background:#5decaa}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-backspace,#KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-enter{position:relative;max-width:100%;min-height:60px;width:140px;-webkit-box-flex:1;-webkit-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-space{min-height:60px;max-width:100%;width:calc(100% - 16px - 140px - 16px - 140px - 16px - 140px - 16px);-webkit-box-flex:1;-webkit-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom.kioskboard-with-specialcharacter span.kioskboard-key-space{width:calc(100% - 16px - 140px - 16px - 140px - 16px - 140px - 16px - 140px - 16px)}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom.kioskboard-with-language span.kioskboard-key-space{width:calc(100% - 16px - 140px - 16px - 140px - 16px - 140px - 16px - 140px - 16px)}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom.kioskboard-with-specialcharacter.kioskboard-with-language span.kioskboard-key-space{width:calc(100% - 16px - 140px - 16px - 140px - 16px - 140px - 16px - 140px - 16px - 140px - 16px)}
    #KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-space.spacebar-denied{opacity:.4!important;cursor:not-allowed!important}
    #KioskBoard-VirtualKeyboard .kioskboard-with-specialcharacter span.kioskboard-key-specialcharacter{position:relative;max-width:100%;min-height:60px;width:140px;-webkit-box-flex:1;-webkit-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}
    #KioskBoard-VirtualKeyboard .kioskboard-with-language span.kioskboard-key-language{position:relative;max-width:100%;min-height:60px;width:140px;-webkit-box-flex:1;-webkit-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}
    #KioskBoard-VirtualKeyboard .kioskboard-row-numpad{display:flex;max-width:320px;margin:auto}
    #KioskBoard-VirtualKeyboard .kioskboard-row-numpad span[class^=kioskboard-key]{max-width:100%;min-height:60px;width:calc(33.3333% - 16px);-webkit-box-flex:1;-webkit-flex:1 1 auto;-ms-flex:1 1 auto;flex:1 1 auto}
    #KioskBoard-VirtualKeyboard .kioskboard-row-numpad span.kioskboard-key-last{order:11}
    #KioskBoard-VirtualKeyboard .kioskboard-row-numpad span.kioskboard-key-backspace{order:10}
    #KioskBoard-VirtualKeyboard .kioskboard-row-numpad span.kioskboard-key-enter{order:12}
    #KioskBoard-VirtualKeyboard .kioskboard-row-specialcharacters{-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;visibility:hidden;opacity:0;position:absolute;background:inherit;padding:20px;z-index:20;left:0;top:0;height:100%;width:100%}
    #KioskBoard-VirtualKeyboard .kioskboard-row-specialcharacters.kioskboard-specialcharacter-show{visibility:visible;opacity:1}
    #KioskBoard-VirtualKeyboard .kioskboard-row-specialcharacters span.kioskboard-specialcharacter-close{-webkit-transition:all .36s ease-in-out;-o-transition:all .36s ease-in-out;transition:all .36s ease-in-out;cursor:pointer;position:absolute;z-index:30;right:0;top:0;width:40px;height:40px;background:#a9a9a9;border-radius:20px;-webkit-box-shadow:0 0 16px -6px rgba(0,0,0,.25);box-shadow:0 0 16px -6px rgba(0,0,0,.25)}
    #KioskBoard-VirtualKeyboard .kioskboard-row-specialcharacters span.kioskboard-specialcharacter-close svg{position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;fill:#fff!important;width:16px!important;height:16px!important}
    #KioskBoard-VirtualKeyboard .kioskboard-row-specialcharacters span.kioskboard-specialcharacter-close:hover{-webkit-transform:rotate(90deg);transform:rotate(90deg)}
    #KioskBoard-VirtualKeyboard .kioskboard-specialcharacters-content{width:100%;max-height:100%;padding-right:5px;overflow-x:hidden;overflow-y:auto}
    #KioskBoard-VirtualKeyboard .kioskboard-specialcharacters-content::-webkit-scrollbar{height:6px;width:6px}
    #KioskBoard-VirtualKeyboard .kioskboard-specialcharacters-content::-webkit-scrollbar-track{border-radius:3px;background:rgba(255,255,255,.75)}
    #KioskBoard-VirtualKeyboard .kioskboard-specialcharacters-content::-webkit-scrollbar-thumb{border-radius:3px;background:rgba(0,0,0,.25);cursor:pointer}
    #KioskBoard-VirtualKeyboard .kioskboard-row-specialcharacters span.kioskboard-key{min-width:60px;min-height:30px}
    
    /* Language Selection Popup Styles */
    #KioskBoard-VirtualKeyboard .kioskboard-row-languages{-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;visibility:hidden;opacity:0;position:absolute;background:inherit;padding:20px;z-index:25;left:0;top:0;height:100%;width:100%}
    #KioskBoard-VirtualKeyboard .kioskboard-row-languages.kioskboard-language-show{visibility:visible;opacity:1}
    #KioskBoard-VirtualKeyboard .kioskboard-row-languages span.kioskboard-language-close{-webkit-transition:all .36s ease-in-out;-o-transition:all .36s ease-in-out;transition:all .36s ease-in-out;cursor:pointer;position:absolute;z-index:30;right:0;top:0;width:40px;height:40px;background:#a9a9a9;border-radius:20px;-webkit-box-shadow:0 0 16px -6px rgba(0,0,0,.25);box-shadow:0 0 16px -6px rgba(0,0,0,.25)}
    #KioskBoard-VirtualKeyboard .kioskboard-row-languages span.kioskboard-language-close svg{position:absolute;left:0;top:0;right:0;bottom:0;margin:auto;fill:#fff!important;width:16px!important;height:16px!important}
    #KioskBoard-VirtualKeyboard .kioskboard-row-languages span.kioskboard-language-close:hover{-webkit-transform:rotate(90deg);transform:rotate(90deg)}
    #KioskBoard-VirtualKeyboard .kioskboard-languages-content{width:100%;max-height:100%;padding-right:5px;overflow-x:hidden;overflow-y:auto;display:flex;flex-wrap:wrap;gap:10px}
    #KioskBoard-VirtualKeyboard .kioskboard-languages-content::-webkit-scrollbar{height:6px;width:6px}
    #KioskBoard-VirtualKeyboard .kioskboard-languages-content::-webkit-scrollbar-track{border-radius:3px;background:rgba(255,255,255,.75)}
    #KioskBoard-VirtualKeyboard .kioskboard-languages-content::-webkit-scrollbar-thumb{border-radius:3px;background:rgba(0,0,0,.25);cursor:pointer}
    #KioskBoard-VirtualKeyboard .kioskboard-row-languages span.kioskboard-language-option{min-width:120px;min-height:50px;margin:5px;padding:10px 15px;border-radius:8px;background:#fafafa;color:#707070;border:2px solid rgba(255,255,255,.04);box-shadow:0 4px 0 .04px rgba(0,0,0,.1);cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:bold;transition:all .2s ease-in-out}
    #KioskBoard-VirtualKeyboard .kioskboard-row-languages span.kioskboard-language-option:hover{transform:translateY(-2px);box-shadow:0 6px 0 .04px rgba(0,0,0,.15)}
    #KioskBoard-VirtualKeyboard .kioskboard-row-languages span.kioskboard-language-option.active{background:#5decaa;color:#fff}
    
    /* Theme adjustments for new styles */
    #KioskBoard-VirtualKeyboard.kioskboard-theme-light,#KioskBoard-VirtualKeyboard.kioskboard-theme-material{-webkit-box-shadow:inset 1px 1px 0 rgba(255,255,255,.25),0 0 20px -8px rgba(0,0,0,.15);box-shadow:inset 1px 1px 0 rgba(255,255,255,.25),0 0 20px -8px rgba(0,0,0,.15);background:#e3e3e3;background:linear-gradient(to right bottom,#eee,#ebebeb,#e8e8e8,#e6e6e6,#e3e3e3)}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-dark{-webkit-box-shadow:inset 1px 1px 0 rgba(0,0,0,.25),0 0 20px -8px rgba(0,0,0,.15);box-shadow:inset 1px 1px 0 rgba(0,0,0,.25),0 0 20px -8px rgba(0,0,0,.15);background:#151515;background:linear-gradient(to left top,#151515,#171717,#1a1a1a,#1c1c1c,#1e1e1e)}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-flat{-webkit-box-shadow:inset 1px 1px 0 rgba(255,255,255,.25),0 0 20px -8px rgba(0,0,0,.15);box-shadow:inset 1px 1px 0 rgba(255,255,255,.25),0 0 20px -8px rgba(0,0,0,.15);background:#dfdfdf}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-oldschool{-webkit-box-shadow:inset 4px 4px 4px rgba(0,0,0,.02),0 0 20px -8px rgba(0,0,0,.1);box-shadow:inset 4px 4px 4px rgba(0,0,0,.02),0 0 20px -8px rgba(0,0,0,.1);background:#e5e5e5;background:linear-gradient(to right bottom,#e5e5e5,#e6e6e6,#e7e7e7,#e7e7e7,#e8e8e8)}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-light .kioskboard-row span[class^=kioskboard-key],#KioskBoard-VirtualKeyboard.kioskboard-theme-material .kioskboard-row span[class^=kioskboard-key]{color:#707070;background:#fafafa}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-dark .kioskboard-row span[class^=kioskboard-key]{border-color:rgba(255,255,255,.02);border-bottom-color:rgba(255,255,255,.04);-webkit-box-shadow:0 5px 0 .05px rgba(255,255,255,.2);box-shadow:0 5px 0 .05px rgba(255,255,255,.2);color:#b7b7b7;background:#323232}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-flat .kioskboard-row span[class^=kioskboard-key]{color:#707070;background:#fafafa;border-color:#fafafa;border-bottom-color:#fafafa;-webkit-box-shadow:0 2px 0 .05px #fafafa;box-shadow:0 2px 0 .05px #fafafa}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-oldschool .kioskboard-row span[class^=kioskboard-key]{color:#8f8f8f;text-shadow:0 0 1px rgba(0,0,0,.2);background:#fafafa;-webkit-box-shadow:0 4px 6px .06px rgba(0,0,0,.05);box-shadow:0 4px 6px .06px rgba(0,0,0,.05)}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-oldschool .kioskboard-row span[class^=kioskboard-key]::after{content:"";position:absolute;left:0;top:-5px;right:0;bottom:0;width:100%;height:calc(100% - 5px);background:rgba(255,255,255,.1);-webkit-box-shadow:0 5px 15px -10px rgba(0,0,0,.4);box-shadow:0 5px 15px -10px rgba(0,0,0,.4);margin:auto;border-radius:inherit;border:4px solid rgba(0,0,0,.06);border-top-color:rgba(0,0,0,.02);border-bottom-color:transparent;box-sizing:border-box;border-top-width:2px;border-bottom-width:6px}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-oldschool span.kioskboard-key-capslock::before{right:9px;top:9px}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-flat span.kioskboard-key-capslock::before,#KioskBoard-VirtualKeyboard.kioskboard-theme-light span.kioskboard-key-capslock::before,#KioskBoard-VirtualKeyboard.kioskboard-theme-oldschool span.kioskboard-key-capslock::before{background:#c4c4c4}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-dark span.kioskboard-key-capslock::before{background:#a9a9a9}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-material span.kioskboard-key-capslock::before{background:#e6e6e6}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-dark span.kioskboard-key-capslock.capslock-active::before,#KioskBoard-VirtualKeyboard.kioskboard-theme-flat span.kioskboard-key-capslock.capslock-active::before,#KioskBoard-VirtualKeyboard.kioskboard-theme-light span.kioskboard-key-capslock.capslock-active::before,#KioskBoard-VirtualKeyboard.kioskboard-theme-material span.kioskboard-key-capslock.capslock-active::before,#KioskBoard-VirtualKeyboard.kioskboard-theme-oldschool span.kioskboard-key-capslock.capslock-active::before{background:#5decaa}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-flat .kioskboard-row span[class^=kioskboard-key] svg,#KioskBoard-VirtualKeyboard.kioskboard-theme-light .kioskboard-row span[class^=kioskboard-key] svg{fill:#707070!important}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-dark .kioskboard-row span[class^=kioskboard-key] svg{fill:#a9a9a9!important}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-oldschool .kioskboard-row span[class^=kioskboard-key] svg{left:12px;fill:#a1a1a1!important}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-material .kioskboard-row span[class^=kioskboard-key] svg{fill:#fafafa!important}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-material .kioskboard-row-bottom span.kioskboard-key-backspace,#KioskBoard-VirtualKeyboard.kioskboard-theme-material .kioskboard-row-bottom span.kioskboard-key-capslock,#KioskBoard-VirtualKeyboard.kioskboard-theme-material .kioskboard-row-bottom span.kioskboard-key-specialcharacter,#KioskBoard-VirtualKeyboard.kioskboard-theme-material .kioskboard-row-bottom span.kioskboard-key-language,#KioskBoard-VirtualKeyboard.kioskboard-theme-material .kioskboard-row-numpad span.kioskboard-key-backspace{-webkit-box-shadow:0 4px 0 .04px rgba(0,0,0,.3);box-shadow:0 4px 0 .04px rgba(0,0,0,.3);border-bottom-color:rgba(0,0,0,.03);color:#fafafa;background:#b0b0b0}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-flat span.kioskboard-specialcharacter-close,#KioskBoard-VirtualKeyboard.kioskboard-theme-light span.kioskboard-specialcharacter-close,#KioskBoard-VirtualKeyboard.kioskboard-theme-material span.kioskboard-specialcharacter-close,#KioskBoard-VirtualKeyboard.kioskboard-theme-oldschool span.kioskboard-specialcharacter-close,#KioskBoard-VirtualKeyboard.kioskboard-theme-flat span.kioskboard-language-close,#KioskBoard-VirtualKeyboard.kioskboard-theme-light span.kioskboard-language-close,#KioskBoard-VirtualKeyboard.kioskboard-theme-material span.kioskboard-language-close,#KioskBoard-VirtualKeyboard.kioskboard-theme-oldschool span.kioskboard-language-close{background:#a9a9a9}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-dark span.kioskboard-specialcharacter-close,#KioskBoard-VirtualKeyboard.kioskboard-theme-dark span.kioskboard-language-close{background:#323232}
    #KioskBoard-VirtualKeyboard.kioskboard-theme-dark span.kioskboard-specialcharacter-close svg,#KioskBoard-VirtualKeyboard.kioskboard-theme-dark span.kioskboard-language-close svg{fill:#b7b7b7!important}
    
    @media only screen and (max-width:767px){#KioskBoard-VirtualKeyboard{min-height:210px;padding:12px 6px}#KioskBoard-VirtualKeyboard .kioskboard-row span[class^=kioskboard-key]{font-size:13px!important;margin:2px 2px 12px;padding:8px 0;width:auto;min-width:22.5px;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;text-align:center;border-radius:4px}#KioskBoard-VirtualKeyboard .kioskboard-row-numpad span[class^=kioskboard-key]{margin:4px 4px 12px;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;font-size:16px!important;width:calc(33.3333% - 16px);min-height:55px}#KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-backspace,#KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-capslock,#KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-enter,#KioskBoard-VirtualKeyboard .kioskboard-with-specialcharacter span.kioskboard-key-specialcharacter,#KioskBoard-VirtualKeyboard .kioskboard-with-language span.kioskboard-key-language{max-width:60px;min-height:45px;margin-bottom:4px}#KioskBoard-VirtualKeyboard .kioskboard-row-bottom span.kioskboard-key-space{padding-top:10px;min-height:45px;margin-bottom:4px}#KioskBoard-VirtualKeyboard .kioskboard-row span[class^=kioskboard-key] svg{-webkit-transform:scale(.7);transform:scale(.7);-webkit-transform-origin:left top;transform-origin:left top;left:8px;top:8px}#KioskBoard-VirtualKeyboard .kioskboard-row-numpad span[class^=kioskboard-key] svg{top:0;left:18px;bottom:0;margin:auto;-webkit-transform:scale(1);transform:scale(1);-webkit-transform-origin:center center;transform-origin:center center}#KioskBoard-VirtualKeyboard .kioskboard-row-specialcharacters{padding:15px 15px 10px}#KioskBoard-VirtualKeyboard .kioskboard-row-languages{padding:15px 15px 10px}#KioskBoard-VirtualKeyboard .kioskboard-row-specialcharacters span.kioskboard-specialcharacter-close,#KioskBoard-VirtualKeyboard .kioskboard-row-languages span.kioskboard-language-close{width:30px;height:30px;top:0;right:5px}}#KioskBoard-VirtualKeyboard.kioskboard-with-animation.kioskboard-fade{opacity:1;-webkit-animation:kioskboard-animation-fade .36s ease-in-out 0s normal;animation:kioskboard-animation-fade .36s ease-in-out 0s normal}@-webkit-keyframes kioskboard-animation-fade{0%{opacity:0}100%{opacity:1}}@keyframes kioskboard-animation-fade{0%{opacity:0}100%{opacity:1}}#KioskBoard-VirtualKeyboard.kioskboard-with-animation.kioskboard-fade.kioskboard-fade-remove{opacity:0;-webkit-animation:kioskboard-animation-fade-remove .36s ease-in-out 0s normal;animation:kioskboard-animation-fade-remove .36s ease-in-out 0s normal}@-webkit-keyframes kioskboard-animation-fade-remove{0%{opacity:1}100%{opacity:0}}@keyframes kioskboard-animation-fade-remove{0%{opacity:1}100%{opacity:0}}#KioskBoard-VirtualKeyboard.kioskboard-with-animation.kioskboard-placement-bottom.kioskboard-slide{bottom:0;-webkit-animation:kioskboard-animation-slide-bottom 1.2s ease-in-out 0s normal;animation:kioskboard-animation-slide-bottom 1.2s ease-in-out 0s normal}@-webkit-keyframes kioskboard-animation-slide-bottom{0%{bottom:-100%}100%{bottom:0}}@keyframes kioskboard-animation-slide-bottom{0%{bottom:-100%}100%{bottom:0}}#KioskBoard-VirtualKeyboard.kioskboard-with-animation.kioskboard-slide.kioskboard-placement-bottom.kioskboard-slide-remove{bottom:-100%;-webkit-animation:kioskboard-animation-slide-bottom-remove 1.2s ease-in-out 0s normal;animation:kioskboard-animation-slide-bottom-remove 1.2s ease-in-out 0s normal}@-webkit-keyframes kioskboard-animation-slide-bottom-remove{0%{bottom:0}100%{bottom:-100%}}@keyframes kioskboard-animation-slide-bottom-remove{0%{bottom:0}100%{bottom:-100%}}#KioskBoard-VirtualKeyboard.kioskboard-with-animation.kioskboard-placement-top.kioskboard-slide{top:0;-webkit-animation:kioskboard-animation-slide-top 1.2s ease-in-out 0s normal;animation:kioskboard-animation-slide-top 1.2s ease-in-out 0s normal}@-webkit-keyframes kioskboard-animation-slide-top{0%{top:-100%}100%{top:0}}@keyframes kioskboard-animation-slide-top{0%{top:-100%}100%{top:0}}#KioskBoard-VirtualKeyboard.kioskboard-with-animation.kioskboard-slide.kioskboard-placement-top.kioskboard-slide-remove{top:-100%;-webkit-animation:kioskboard-animation-slide-top-remove 1.2s ease-in-out 0s normal;animation:kioskboard-animation-slide-top-remove 1.2s ease-in-out 0s normal}@-webkit-keyframes kioskboard-animation-slide-top-remove{0%{top:0}100%{top:-100%}}@keyframes kioskboard-animation-slide-top-remove{0%{top:0}100%{top:-100%}}`;
    return internalCSS || null;
  };
  // KioskBoard: Internal CSS codes: end

  // KioskBoard: Internal CSS: begin
  var kioskBoardInternalCSS = function () {
    if (kioskBoardInternalCSSCodes() !== null && !window.document.getElementById('KioskBoardInternalCSS')) {
      var internalCSS = window.document.createElement('style');
      internalCSS.id = 'KioskBoardInternalCSS';
      internalCSS.innerHTML = kioskBoardInternalCSSCodes();
      window.document.head.appendChild(internalCSS);
    }
  };
  // KioskBoard: Internal CSS: end

  // Language definitions with keyboard layouts
  var kioskBoardLanguages = {
  'en': {
    name: 'English',
    keys: [
      [
        {'0': 'q', '1': 'w', '2': 'e', '3': 'r', '4': 't', '5': 'y', '6': 'u', '7': 'i', '8': 'o', '9': 'p'},
        {'0': 'a', '1': 's', '2': 'd', '3': 'f', '4': 'g', '5': 'h', '6': 'j', '7': 'k', '8': 'l'},
        {'0': 'z', '1': 'x', '2': 'c', '3': 'v', '4': 'b', '5': 'n', '6': 'm'}
      ]
    ]
  },
  'es': {
    name: 'Español',
    keys: [
      [
        {'0': 'q', '1': 'w', '2': 'e', '3': 'r', '4': 't', '5': 'y', '6': 'u', '7': 'i', '8': 'o', '9': 'p'},
        {'0': 'a', '1': 's', '2': 'd', '3': 'f', '4': 'g', '5': 'h', '6': 'j', '7': 'k', '8': 'l', '9': 'ñ'},
        {'0': 'z', '1': 'x', '2': 'c', '3': 'v', '4': 'b', '5': 'n', '6': 'm'}
      ]
    ]
  },
  'fr': {
    name: 'Français',
    keys: [
      [
        {'0': 'a', '1': 'z', '2': 'e', '3': 'r', '4': 't', '5': 'y', '6': 'u', '7': 'i', '8': 'o', '9': 'p'},
        {'0': 'q', '1': 's', '2': 'd', '3': 'f', '4': 'g', '5': 'h', '6': 'j', '7': 'k', '8': 'l', '9': 'm'},
        {'0': 'w', '1': 'x', '2': 'c', '3': 'v', '4': 'b', '5': 'n'}
      ]
    ]
  },
  'de': {
    name: 'Deutsch',
    keys: [
      [
        {'0': 'q', '1': 'w', '2': 'e', '3': 'r', '4': 't', '5': 'z', '6': 'u', '7': 'i', '8': 'o', '9': 'p', '10': 'ü'},
        {'0': 'a', '1': 's', '2': 'd', '3': 'f', '4': 'g', '5': 'h', '6': 'j', '7': 'k', '8': 'l', '9': 'ö', '10': 'ä'},
        {'0': 'y', '1': 'x', '2': 'c', '3': 'v', '4': 'b', '5': 'n', '6': 'm', '7': 'ß'}
      ]
    ]
  },
  'ar': {
    name: 'العربية',
    keys: [
      [
        {'0': 'ض', '1': 'ص', '2': 'ث', '3': 'ق', '4': 'ف', '5': 'غ', '6': 'ع', '7': 'ه', '8': 'خ', '9': 'ح', '10': 'ج'},
        {'0': 'ش', '1': 'س', '2': 'ي', '3': 'ب', '4': 'ل', '5': 'ا', '6': 'ت', '7': 'ن', '8': 'م', '9': 'ك'},
        {'0': 'ظ', '1': 'ط', '2': 'ذ', '3': 'د', '4': 'ز', '5': 'ر', '6': 'و'}
      ]
    ]
  },
  'pt': {
    name: 'Português',
    keys: [
      [
        {'0': 'q', '1': 'w', '2': 'e', '3': 'r', '4': 't', '5': 'y', '6': 'u', '7': 'i', '8': 'o', '9': 'p'},
        {'0': 'a', '1': 's', '2': 'd', '3': 'f', '4': 'g', '5': 'h', '6': 'j', '7': 'k', '8': 'l', '9': 'ç'},
        {'0': 'z', '1': 'x', '2': 'c', '3': 'v', '4': 'b', '5': 'n', '6': 'm'}
      ]
    ]
  },
  'sw': {
    name: 'Kiswahili',
    keys: [
      [
        {'0': 'q', '1': 'w', '2': 'e', '3': 'r', '4': 't', '5': 'y', '6': 'u', '7': 'i', '8': 'o', '9': 'p'},
        {'0': 'a', '1': 's', '2': 'd', '3': 'f', '4': 'g', '5': 'h', '6': 'j', '7': 'k', '8': 'l'},
        {'0': 'z', '1': 'x', '2': 'c', '3': 'v', '4': 'b', '5': 'n', '6': 'm'}
      ]
    ]
  },
  'so': {
    name: 'Soomaali',
    keys: [
      [
        {'0': 'q', '1': 'w', '2': 'e', '3': 'r', '4': 't', '5': 'y', '6': 'u', '7': 'i', '8': 'o', '9': 'p'},
        {'0': 'a', '1': 's', '2': 'd', '3': 'f', '4': 'g', '5': 'h', '6': 'j', '7': 'k', '8': 'l'},
        {'0': 'z', '1': 'x', '2': 'c', '3': 'v', '4': 'b', '5': 'n', '6': 'm'}
      ]
    ]
  },
  'ru': {
    name: 'Русский',
    keys: [
      [
        {'0': 'й', '1': 'ц', '2': 'у', '3': 'к', '4': 'е', '5': 'н', '6': 'г', '7': 'ш', '8': 'щ', '9': 'з', '10': 'х'},
        {'0': 'ф', '1': 'ы', '2': 'в', '3': 'а', '4': 'п', '5': 'р', '6': 'о', '7': 'л', '8': 'д', '9': 'ж', '10': 'э'},
        {'0': 'я', '1': 'ч', '2': 'с', '3': 'м', '4': 'и', '5': 'т', '6': 'ь', '7': 'б', '8': 'ю'}
      ]
    ]
  },
  'tr': {
    name: 'Türkçe',
    keys: [
      [
        {'0': 'q', '1': 'w', '2': 'e', '3': 'r', '4': 't', '5': 'y', '6': 'u', '7': 'ı', '8': 'o', '9': 'p', '10': 'ğ', '11': 'ü'},
        {'0': 'a', '1': 's', '2': 'd', '3': 'f', '4': 'g', '5': 'h', '6': 'j', '7': 'k', '8': 'l', '9': 'ş', '10': 'i'},
        {'0': 'z', '1': 'x', '2': 'c', '3': 'v', '4': 'b', '5': 'n', '6': 'm', '7': 'ö', '8': 'ç'}
      ]
    ]
  },
  'vi': {
    name: 'Tiếng Việt',
    keys: [
      [
        {'0': 'q', '1': 'w', '2': 'e', '3': 'r', '4': 't', '5': 'y', '6': 'u', '7': 'i', '8': 'o', '9': 'p', '10': 'ă', '11': 'â'},
        {'0': 'a', '1': 's', '2': 'd', '3': 'f', '4': 'g', '5': 'h', '6': 'j', '7': 'k', '8': 'l', '9': 'ê', '10': 'ư'},
        {'0': 'z', '1': 'x', '2': 'c', '3': 'v', '4': 'b', '5': 'n', '6': 'm', '7': 'ô', '8': 'ơ'}
      ]
    ]
  },
  'fa': {
    name: 'فارسی',
    keys: [
      [
        {'0': 'ض', '1': 'ص', '2': 'ث', '3': 'ق', '4': 'ف', '5': 'غ', '6': 'ع', '7': 'ه', '8': 'خ', '9': 'ح', '10': 'ج', '11': 'چ'},
        {'0': 'ش', '1': 'س', '2': 'ی', '3': 'ب', '4': 'ل', '5': 'ا', '6': 'ت', '7': 'ن', '8': 'م', '9': 'ک', '10': 'گ'},
        {'0': 'ظ', '1': 'ط', '2': 'ز', '3': 'ر', '4': 'ذ', '5': 'د', '6': 'پ', '7': 'و', '8': 'ژ'}
      ]
    ]
  },
  'he': {
    name: 'עברית',
    keys: [
      [
        {'0': '/', '1': '\'', '2': 'ק', '3': 'ר', '4': 'א', '5': 'ט', '6': 'ו', '7': 'ן', '8': 'ם', '9': 'פ'},
        {'0': 'ש', '1': 'ד', '2': 'ג', '3': 'כ', '4': 'ע', '5': 'י', '6': 'ח', '7': 'ל', '8': 'ך', '9': 'ף'},
        {'0': 'ז', '1': 'ס', '2': 'ב', '3': 'ה', '4': 'נ', '5': 'מ', '6': 'צ', '7': 'ת', '8': 'ץ'}
      ]
    ]
  }
};
  // KioskBoard: Default Options: begin
  var kioskBoardDefaultOptions = {
    keysArrayOfObjects: null,
    keysJsonUrl: null,
    keysSpecialCharsArrayOfStrings: null,
    keysNumpadArrayOfNumbers: null,
    language: 'en',
    theme: 'light', // "light" || "dark" || "flat" || "material" || "oldschool"
    autoScroll: true,
    capsLockActive: true,
    allowRealKeyboard: false,
    allowMobileKeyboard: false,
    cssAnimations: true,
    cssAnimationsDuration: 360,
    cssAnimationsStyle: 'slide', // "slide" || "fade"
    keysAllowSpacebar: true,
    keysSpacebarText: 'Space',
    keysFontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,"Segoe UI", "Segoe UI Emoji", "Segoe UI Symbol",Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";',
    keysFontSize: '22px',
    keysFontWeight: 'normal',
    keysIconSize: '25px',
    keysEnterText: 'Enter',
    keysEnterCallback: undefined,
    keysEnterCanClose: true,
    // Language options
    allowLanguageSwitch: true,
    languageButtonText: 'Lang',
    onLanguageChange: undefined
  };
  
  var kioskBoardCachedKeys;
  var kioskBoardNewOptions;
  var kioskBoardCurrentLanguage = 'en';
  var kioskBoardGithubUrl = 'https://github.com/furcan/KioskBoard';
  var kioskBoardSpecialCharacters = {
    '0': '!',
    '1': '\'',
    '2': '^',
    '3': '#',
    '4': '+',
    '5': ',',
    '6': '%',
    '7': '½',
    '8': '&',
    '9': '/',
    '10': '{',
    '11': '}',
    '12': '(',
    '13': ')',
    '14': '[',
    '15': ']',
    '16': '=',
    '17': '*',
    '18': '?',
    '19': '\\',
    '20': '-',
    '21': '_',
    '22': '|',
    '23': '@',
    '24': '€',
    '25': '₺',
    '26': '~',
    '27': 'æ',
    '28': 'ß',
    '29': '<',
    '30': '>',
    '31': ',',
    '32': ';',
    '33': '.',
    '34': ':',
    '35': '`',
  };
  var kioskBoardNumpadKeysObject = {
    '0': '7',
    '1': '8',
    '2': '9',
    '3': '4',
    '4': '5',
    '5': '6',
    '6': '1',
    '7': '2',
    '8': '3',
    '9': '0',
  };
  var kioskBoardAllKeysNumbersObject = {
    '0': '1',
    '1': '2',
    '2': '3',
    '3': '4',
    '4': '5',
    '5': '6',
    '6': '7',
    '7': '8',
    '8': '9',
    '9': '0',
  };
  var kioskBoardTypes = {
    All: 'all',
    Keyboard: 'keyboard',
    Numpad: 'numpad',
  };
  var kioskBoardPlacements = {
    Bottom: 'bottom',
    Top: 'top',
  };
  // KioskBoard: Default Options: end

  // KioskBoard: Extend Options: begin
  var kioskBoardExtendObjects = function () {
    var extended = {};
    var deep = false;
    var i = 0;
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
      deep = arguments[0];
      i++;
    }
    var merge = function (obj) {
      for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
          if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
            extended[prop] = kioskBoardExtendObjects(extended[prop], obj[prop]);
          } else {
            extended[prop] = obj[prop];
          }
        }
      }
    };
    for (; i < arguments.length; i++) {
      merge(arguments[i]);
    }
    return extended;
  };
  // KioskBoard: Extend Options: end

  // KioskBoard: Check Array of Objects: begin
  var kioskBoardCheckArrayOfObjects = function (array) {
    if (Array.isArray(array) && array.length > 0) {
      var firstChild = array[0];
      if (typeof firstChild === 'object' && !Array.isArray(firstChild)) {
        for (var key in firstChild) {
          if (Object.prototype.hasOwnProperty.call(firstChild, key)) {
            return true;
          }
        }
      }
    }
    return false;
  };
  // KioskBoard: Check Array of Objects: end

  // KioskBoard: Console Error Function: begin
  var kioskBoardConsoleError = function (errorMessage) {
    return console.error('%c KioskBoard (Error) ', 'padding:2px;border-radius:20px;color:#fff;background:#f44336', '\n' + errorMessage);
  };
  // KioskBoard: Console Error Function: end

  // KioskBoard: Console Log Function: begin
  var kioskBoardConsoleLog = function (logMessage) {
    return console.log('%c KioskBoard (Info) ', 'padding:2px;border-radius:20px;color:#fff;background:#00bcd4', '\n' + logMessage);
  };
  // KioskBoard: Console Log Function: end

  // KioskBoard: Icons: begin
  var kioskBoardIconBackspace = function (width, color) {
    if (!width) { width = 25; }
    if (!color) { color = '#707070'; }
    var icon = '&nbsp;<svg id="KioskBoardIconBackspace" xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + width + '" viewBox="0 0 612 612" style="width:' + width + ';height:' + width + ';fill:' + color + ';"><path d="M561,76.5H178.5c-17.85,0-30.6,7.65-40.8,22.95L0,306l137.7,206.55c10.2,12.75,22.95,22.95,40.8,22.95H561c28.05,0,51-22.95,51-51v-357C612,99.45,589.05,76.5,561,76.5z M484.5,397.8l-35.7,35.7L357,341.7l-91.8,91.8l-35.7-35.7l91.8-91.8l-91.8-91.8l35.7-35.7l91.8,91.8l91.8-91.8l35.7,35.7L392.7,306L484.5,397.8z"/></svg>';
    return icon;
  };
  var kioskBoardIconCapslock = function (width, color) {
    if (!width) { width = 25; }
    if (!color) { color = '#707070'; }
    var icon = '&nbsp;<svg id="KioskBoardIconCapslock" xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + width + '" style="width:' + width + ';height:' + width + ';fill:' + color + ';shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 200 200"><path d="M61.8 148.97l76.4 0c6,0 10.91,4.9 10.91,10.9l0 27.24c0,5.99 -4.91,10.89 -10.91,10.89l-76.4 0c-6,0 -10.91,-4.9 -10.91,-10.89l0 -27.24c0,-6 4.91,-10.9 10.91,-10.9zm105.7 -60.38l-18.39 0 0 37.36c0,5.99 -4.91,10.89 -10.91,10.89l-76.4 0c-6,0 -10.91,-4.9 -10.91,-10.89l0 -37.36 -18.39 0c-2.65,0 -4.91,-1.47 -5.97,-3.89 -1.07,-2.42 -0.63,-5.08 1.16,-7.02l67.5 -73.57c1.28,-1.39 2.91,-2.11 4.81,-2.11 1.9,0 3.53,0.72 4.81,2.11l67.5 73.57c1.79,1.94 2.23,4.6 1.16,7.02 -1.06,2.42 -3.32,3.89 -5.97,3.89z"/></svg>';
    return icon;
  };
  var kioskBoardIconSpecialCharacters = function (width, height, color) {
    if (!width) { width = 50; }
    if (!height) { height = 25; }
    if (!color) { color = '#707070'; }
    var icon = '&nbsp;<svg id="KioskBoardIconSpecialCharacters" xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" style="width:' + width + ';height:' + height + ';fill:' + color + ';shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 300 150"><path d="M34.19 79.43l1.99 -10.86 10.8 0 -1.96 10.86 -10.83 0zm264.98 -17.22l0 -9.63c0,-1.23 -1,-2.23 -2.24,-2.23l-74.48 0c-1.24,0 -2.24,1 -2.24,2.23l0 9.63c0,1.23 1,2.23 2.24,2.23l74.48 0c1.24,0 2.24,-1 2.24,-2.23zm0 35.22l0 -9.62c0,-1.23 -1,-2.23 -2.24,-2.23l-74.48 0c-1.24,0 -2.24,1 -2.24,2.23l0 9.62c0,1.23 1,2.24 2.24,2.24l74.48 0c1.24,0 2.24,-1.01 2.24,-2.24zm-153.98 -61.91l9.63 0c1.23,0 2.23,1.01 2.23,2.25l0 30.19 30.19 0c1.25,0 2.25,1.01 2.25,2.23l0 9.63c0,1.23 -1,2.23 -2.25,2.23l-30.19 0 0 30.19c0,1.25 -1,2.25 -2.23,2.25l-9.63 0c-1.23,0 -2.23,-1 -2.23,-2.25l0 -30.19 -30.19 0c-1.24,0 -2.25,-1 -2.25,-2.23l0 -9.63c0,-1.22 1.01,-2.23 2.25,-2.23l30.19 0 0 -30.19c0,-1.24 1,-2.25 2.23,-2.25zm-67.7 33.05c1.28,0 2.31,-1.03 2.31,-2.31l0 -9.2c0,-1.27 -1.03,-2.31 -2.31,-2.31l-13.93 0 2.95 -16.51c0.12,-0.68 -0.07,-1.37 -0.51,-1.89 -0.44,-0.53 -1.09,-0.83 -1.77,-0.83l-9.36 -0.01c0,0 0,0 0,0 -1.12,0 -2.08,0.8 -2.28,1.9l-3.12 17.34 -10.74 0 3.03 -16.49c0.12,-0.67 -0.06,-1.37 -0.5,-1.89 -0.44,-0.53 -1.09,-0.84 -1.77,-0.84l-9.48 -0.01c0,0 0,0 0,0 -1.12,0 -2.08,0.8 -2.28,1.9l-3.16 17.33 -21.43 0c-1.28,0 -2.31,1.04 -2.31,2.32l0 9.19c0,1.28 1.03,2.31 2.31,2.31l18.91 0 -1.98 10.86 -16.93 0c-1.28,0 -2.31,1.04 -2.31,2.31l0 9.2c0,1.28 1.03,2.31 2.31,2.31l14.41 0 -3.35 18.36c-0.12,0.67 0.06,1.37 0.5,1.89 0.44,0.53 1.09,0.84 1.78,0.84l9.36 0c1.12,0 2.08,-0.8 2.28,-1.9l3.53 -19.19 10.88 0 -3.31 18.42c-0.13,0.67 0.06,1.36 0.49,1.89 0.44,0.52 1.08,0.83 1.76,0.84l9.49 0.09c0,0 0.01,0 0.02,0 1.12,0 2.08,-0.81 2.28,-1.91l3.44 -19.33 20.79 0c1.28,0 2.31,-1.03 2.31,-2.31l0 -9.2c0,-1.27 -1.03,-2.31 -2.31,-2.31l-18.32 0 1.93 -10.86 16.39 0z"/></svg>';
    return icon;
  };
  var kioskBoardIconLanguage = function (width, color) {
    if (!width) { width = 25; }
    if (!color) { color = '#707070'; }
    var icon = '&nbsp;<svg id="KioskBoardIconLanguage" xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + width + '" style="width:' + width + ';height:' + width + ';fill:' + color + ';" viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>';
    return icon;
  };
  var kioskBoardIconClose = function (width, color) {
    if (!width) { width = 18; }
    if (!color) { color = '#707070'; }
    var icon = '<svg id="KioskBoardIconClose" width="' + width + '" height="' + width + '" style="width:' + width + ';height:' + width + ';fill:' + color + ';" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 348.333 348.334"><path d="M336.559,68.611L231.016,174.165l105.543,105.549c15.699,15.705,15.699,41.145,0,56.85c-7.844,7.844-18.128,11.769-28.407,11.769c-10.296,0-20.581-3.919-28.419-11.769L174.167,231.003L68.609,336.563c-7.843,7.844-18.128,11.769-28.416,11.769c-10.285,0-20.563-3.919-28.413-11.769c-15.699-15.698-15.699-41.139,0-56.85l105.54-105.549L11.774,68.611c-15.699-15.699-15.699-41.145,0-56.844c15.696-15.687,41.127-15.687,56.829,0l105.563,105.554	L279.721,11.767c15.705-15.687,41.139-15.687,56.832,0C352.258,27.466,352.258,52.912,336.559,68.611z"/></svg>';
    return icon;
  };
  // KioskBoard: Icons: end

  // KioskBoard: Get Available Languages Dynamically: begin
  var kioskBoardGetAvailableLanguages = function () {
    return Object.keys(kioskBoardLanguages);
  };
  // KioskBoard: Get Available Languages Dynamically: end

  // KioskBoard: Add New Language: begin
  var kioskBoardAddLanguage = function (languageCode, languageData) {
    if (typeof languageCode === 'string' && 
        typeof languageData === 'object' && 
        languageData.name && 
        languageData.keys && 
        Array.isArray(languageData.keys)) {
      kioskBoardLanguages[languageCode] = languageData;
      return true;
    }
    kioskBoardConsoleError('Invalid language data. Language must have "name" and "keys" properties.');
    return false;
  };
  // KioskBoard: Add New Language: end

  // KioskBoard: Remove Language: begin
  var kioskBoardRemoveLanguage = function (languageCode) {
    if (kioskBoardLanguages[languageCode]) {
      delete kioskBoardLanguages[languageCode];
      return true;
    }
    return false;
  };
  // KioskBoard: Get Language Keys: begin
  var kioskBoardGetLanguageKeys = function (language) {
    if (kioskBoardLanguages[language] && kioskBoardLanguages[language].keys) {
      return kioskBoardLanguages[language].keys[0];
    }
    return kioskBoardLanguages['en'].keys[0]; // fallback to English
  };
  // KioskBoard: Get Language Keys: end

  // KioskBoard: Update Keyboard Language: begin
  var kioskBoardUpdateKeyboardLanguage = function (newLanguage, keyboardElement, opt, inputElement) {
    if (!kioskBoardLanguages[newLanguage]) {
      kioskBoardConsoleError('Language "' + newLanguage + '" is not available.');
      return false;
    }

    kioskBoardCurrentLanguage = newLanguage;
    
    // Update language attribute
    keyboardElement.lang = newLanguage;
    keyboardElement.style.webkitLocale = '"' + newLanguage + '"';
    
    // Get new keys for the language
    var newKeys = kioskBoardGetLanguageKeys(newLanguage);
    
    // Update dynamic rows
    var dynamicRows = keyboardElement.querySelectorAll('.kioskboard-row-dynamic');
    if (dynamicRows && dynamicRows.length > 0 && newKeys.length > 0) {
      for (var rowIndex = 0; rowIndex < dynamicRows.length && rowIndex < newKeys.length; rowIndex++) {
        var row = dynamicRows[rowIndex];
        var rowData = newKeys[rowIndex];
        var newRowContent = '';
        
        var fontFamily = opt.keysFontFamily || 'sans-serif';
        var fontSize = opt.keysFontSize || '22px';
        var fontWeight = opt.keysFontWeight || 'normal';
        
        for (var keyIndex in rowData) {
          if (Object.prototype.hasOwnProperty.call(rowData, keyIndex)) {
            var keyValue = rowData[keyIndex];
            var keyElement = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key kioskboard-key-' + keyValue.toString().toLocaleLowerCase(newLanguage) + '" data-index="' + keyIndex.toString() + '" data-value="' + keyValue.toString() + '">' + keyValue.toString() + '</span>';
            newRowContent += keyElement;
          }
        }
        
        row.innerHTML = newRowContent;
      }
    }
    
    // Trigger language change callback if provided
    if (typeof opt.onLanguageChange === 'function') {
      opt.onLanguageChange(newLanguage, kioskBoardLanguages[newLanguage].name);
    }
    
    return true;
  };
  // KioskBoard: Update Keyboard Language: end

  // KioskBoard: IE support for Event: begin
  (function () {
    if (typeof window.Event === 'function') {
      return false;
    }
    function Event(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = window.document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    Event.prototype = window.Event.prototype;
    window.Event = Event;
  })();
  // KioskBoard: IE support for Event: end

  // KioskBoard: Check the event target by element: begin
  var kioskBoardEventTargetIsElementOrChilds = function (event, element) {
    if (event.target === element) {
      return true;
    } else {
      var nodeList = element.querySelectorAll('*');
      if (nodeList && nodeList.length > 0) {
        for (var ni = 0; ni < nodeList.length; ni++) {
          var child = nodeList[ni];
          if (event.target === child) {
            return true;
          }
        }
      }
    }
    return false;
  };
  // KioskBoard: Check the event target by element: end

  // KioskBoard: begin
  var KioskBoard = {
    // Initialize
    init: function (initOptions) {
      initOptions = typeof initOptions === 'object' && Object.keys(initOptions).length > 0 ? initOptions : {};
      kioskBoardNewOptions = kioskBoardExtendObjects(true, kioskBoardDefaultOptions, initOptions);
      kioskBoardCurrentLanguage = kioskBoardNewOptions.language || 'en';
      kioskBoardInternalCSS();
    },
    
    // Set Language
    setLanguage: function (language) {
      if (kioskBoardLanguages[language]) {
        kioskBoardCurrentLanguage = language;
        var keyboardElement = window.document.getElementById('KioskBoard-VirtualKeyboard');
        if (keyboardElement && kioskBoardNewOptions) {
          // Find the current input element
          var activeInput = window.document.activeElement;
          var success = kioskBoardUpdateKeyboardLanguage(language, keyboardElement, kioskBoardNewOptions, activeInput);
          if (success && activeInput) {
            // Re-attach all event listeners
            setTimeout(function() {
              var keysClickListeners = window.kioskBoardKeysClickListeners;
              if (keysClickListeners) {
                keysClickListeners(activeInput);
              }
            }, 50);
          }
          return success;
        }
      }
      return false;
    },
    
    // Get Available Languages (Dynamic)
    getAvailableLanguages: function () {
      return kioskBoardGetAvailableLanguages();
    },
    
    // Add New Language
    addLanguage: function (languageCode, languageData) {
      return kioskBoardAddLanguage(languageCode, languageData);
    },
    
    // Get All Languages with Details
    getLanguages: function () {
      return Object.keys(kioskBoardLanguages).map(function(key) {
        return {
          code: key,
          name: kioskBoardLanguages[key].name
        };
      });
    },
    
    // Get Current Language
    getCurrentLanguage: function () {
      return {
        code: kioskBoardCurrentLanguage,
        name: kioskBoardLanguages[kioskBoardCurrentLanguage] ? kioskBoardLanguages[kioskBoardCurrentLanguage].name : 'English'
      };
    },

    // Run
    run: function (selectorOrElement, options) {
      // Element(s)
      var kbElements = [];

      // Allowed Element Types
      var allowedElementTypes = ['input', 'textarea'];

      // If: Check the selector is an element
      var isElement = allowedElementTypes.indexOf(((selectorOrElement || {}).nodeName || '').toLocaleLowerCase('en')) > -1;
      if (isElement) {
        kbElements.push(selectorOrElement);
      }
      // Else: Check the selector is valid for the querySelector
      else {
        // Check the selector
        var selectorIsValid = typeof selectorOrElement === 'string' && selectorOrElement.length > 0;
        if (!selectorIsValid) {
          kioskBoardConsoleError('"' + selectorOrElement + '" is not a valid selector.');
          return false;
        }

        // Get the element(s)
        kbElements = window.document.querySelectorAll(selectorOrElement);
        if (kbElements.length < 1) {
          kioskBoardConsoleError('You called the KioskBoard with the "' + selectorOrElement + '" selector, but there is no such element on the document.');
          return false;
        }
      }

      // If: Check the options to initialize or extend
      if (typeof options === 'object' && Object.keys(options).length > 0) {
        if (!kioskBoardNewOptions) {
          KioskBoard.init(options);
        } else {
          // extend the new options by the default options
          kioskBoardNewOptions = kioskBoardExtendObjects(true, kioskBoardDefaultOptions, options);
        }
      }
      // Else If: Check the initialize
      else if (!kioskBoardNewOptions) {
        kioskBoardConsoleError('You have to initialize the KioskBoard first. \n\nVisit to learn more: ' + kioskBoardGithubUrl);
        return false;
      }

      // The final options for each
      var opt = kioskBoardNewOptions;

      // Keys: Array of Objects
      var keysArrayOfObjects = opt.keysArrayOfObjects;

      // Keys: Array of Objects has keys
      var objectHasKeys = false;

      // Step 1: check the "keysArrayOfObjects": begin
      if (kioskBoardCheckArrayOfObjects(keysArrayOfObjects)) {
        // object has keys
        objectHasKeys = true;
        // cache the array
        kioskBoardCachedKeys = keysArrayOfObjects;
      }
      // Step 1: check the "keysArrayOfObjects": end

      // Step 2: check the "keysJsonUrl": begin
      if (!objectHasKeys && opt.keysJsonUrl) {
        // keys json url is valid
        var keysJsonUrlIsValid = typeof opt.keysJsonUrl === 'string' && opt.keysJsonUrl.length > 0;
        // check the "keysJsonUrl"
        if (!keysJsonUrlIsValid) {
          kioskBoardConsoleError('You have to set the path of KioskBoard Keys JSON file to "keysJsonUrl" option. \n\nVisit to learn more: ' + kioskBoardGithubUrl);
          return false;
        }
      }
      // Step 2: check the "keysJsonUrl": end

      // Use built-in language keys if no custom keys are provided
      if (!objectHasKeys && !opt.keysJsonUrl) {
        kioskBoardCachedKeys = kioskBoardGetLanguageKeys(kioskBoardCurrentLanguage);
        objectHasKeys = true;
      }

      // Functions: Create Keyboard and AppendTo: begin
      var createKeyboardAndAppendTo = function (data, input) {
        // all inputs
        var allInputs = [];
        allInputs.push(input);

        // all inputs readonly check for allowing mobile keyboard
        var getReadOnlyAttr = input.getAttribute('readonly') !== null;
        var allowMobileKeyboard = opt.allowMobileKeyboard === true;

        // each input focus listener: begin
        var inputFocusListener = function (e) {
          // input element variables: begin
          var theInput = e.currentTarget;
          var theInputSelIndex = 0;
          var theInputValArray = [];
          var keyboardTypeArray = [kioskBoardTypes.All, kioskBoardTypes.Keyboard, kioskBoardTypes.Numpad];
          var theInputKeyboardType = (theInput.dataset.kioskboardType || '').toLocaleLowerCase('en');
          var keyboardType = keyboardTypeArray.indexOf(theInputKeyboardType) > -1 ? theInputKeyboardType : kioskBoardTypes.All;
          var theInputPlacement = (theInput.dataset.kioskboardPlacement || '').toLocaleLowerCase('en');
          var keyboardPlacement = theInputPlacement === kioskBoardPlacements.Top ? theInputPlacement : kioskBoardPlacements.Bottom;
          var allowedSpecialCharacters = (theInput.dataset.kioskboardSpecialcharacters || '').toLocaleLowerCase('en') === 'true';
          var allowLanguageSwitch = opt.allowLanguageSwitch === true;
          var keyboardLanguage = kioskBoardCurrentLanguage;
          // input element variables: end

          // check mobile keyboard allowed: begin
          if (!allowMobileKeyboard) {
            theInput.setAttribute('readonly', 'readonly');
            theInput.blur();
          }
          // check mobile keyboard allowed: end

          // update theInputSelIndex on focus
          var theInputValLen = (theInput.value || '').length;
          theInputSelIndex = theInput.selectionStart || theInputValLen;

          // update theInputValArray on focus
          theInputValArray = theInput.value.split('');

          // row keys element
          var keysRowElements = '';

          // all keys styles
          var fontFamily = typeof opt.keysFontFamily === 'string' && opt.keysFontFamily.length > 0 ? opt.keysFontFamily : 'sans-serif';
          var fontSize = typeof opt.keysFontSize === 'string' && opt.keysFontSize.length > 0 ? opt.keysFontSize : '22px';
          var fontWeight = typeof opt.keysFontWeight === 'string' && opt.keysFontWeight.length > 0 ? opt.keysFontWeight : 'normal';

          // static keys: begin
          var isCapsLockActive = opt.capsLockActive === true;
          var keysIconWidth = typeof opt.keysIconSize === 'string' && opt.keysIconSize.length > 0 ? opt.keysIconSize : '25px';
          var keysIconColor = '#707070';
          var keysAllowSpacebar = opt.keysAllowSpacebar === true;
          var spaceKeyValue = keysAllowSpacebar ? ' ' : '';
          var keysSpacebarText = typeof opt.keysSpacebarText === 'string' && opt.keysSpacebarText.length > 0 ? opt.keysSpacebarText : 'Space';
          var keysEnterText = typeof opt.keysEnterText === 'string' && opt.keysEnterText.length > 0 ? opt.keysEnterText : 'Enter';
          var languageButtonText = typeof opt.languageButtonText === 'string' && opt.languageButtonText.length > 0 ? opt.languageButtonText : 'Lang';

          var spaceKey = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key kioskboard-key-space ' + (keysAllowSpacebar ? 'spacebar-allowed' : 'spacebar-denied') + '" data-value="' + spaceKeyValue + '">' + keysSpacebarText + '</span>';
          var capsLockKey = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key-capslock ' + (isCapsLockActive ? 'capslock-active' : '') + '">' + kioskBoardIconCapslock(keysIconWidth, keysIconColor) + '</span>';
          var backspaceKey = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key-backspace">' + kioskBoardIconBackspace(keysIconWidth, keysIconColor) + '</span>';
          var enterKey = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key-enter">' + keysEnterText + '</span>';
          // static keys: end

          // keyboard "specialcharacter" setting is "true": begin
          var specialCharacterKey = '';
          var specialCharactersContent = '';
          if (allowedSpecialCharacters) {
            var size = parseInt(keysIconWidth) || 25;
            var specialKeyWidth = (size * 2) + 'px';
            var specialKeyHeight = size + 'px';
            specialCharacterKey = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key-specialcharacter">' + kioskBoardIconSpecialCharacters(specialKeyWidth, specialKeyHeight, keysIconColor) + '</span>';

            // check "keysSpecialCharsArrayOfStrings" for override: begin
            var specialCharacters = opt.keysSpecialCharsArrayOfStrings;
            if (Array.isArray(specialCharacters) && specialCharacters.length > 0) {
              kioskBoardSpecialCharacters = specialCharacters.reduce(function (scMemo, scKey, scIndex) {
                scMemo[scIndex] = scKey;
                return scMemo;
              }, {});
            }
            // check "keysSpecialCharsArrayOfStrings" for override: end

            for (var key2 in kioskBoardSpecialCharacters) {
              if (Object.prototype.hasOwnProperty.call(kioskBoardSpecialCharacters, key2)) {
                var index2 = key2;
                var value2 = kioskBoardSpecialCharacters[key2];
                var eachKey2 = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key" data-index="' + index2.toString() + '" data-value="' + value2.toString() + '">' + value2.toString() + '</span>';
                specialCharactersContent += eachKey2;
              }
            }
          }
          // keyboard "specialcharacter" setting is "true": end

          // keyboard "language" setting is "true": begin
          var languageKey = '';
          var languagesContentContainer = null;
          if (allowLanguageSwitch) {
            languageKey = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key-language">' + kioskBoardIconLanguage(keysIconWidth, keysIconColor) + '</span>';

            // Create language options using innerHTML to properly decode HTML entities
            var languagesContentHTML = '';
            var availableLanguages = kioskBoardGetAvailableLanguages(); // Dynamic detection
            for (var langIndex = 0; langIndex < availableLanguages.length; langIndex++) {
              var langCode = availableLanguages[langIndex];
              if (kioskBoardLanguages[langCode]) {
                var langName = kioskBoardLanguages[langCode].name;
                var isActive = langCode === kioskBoardCurrentLanguage ? ' active' : '';
                
                languagesContentHTML += '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-language-option' + isActive + '" data-language="' + langCode + '">' + langName + '</span>';
              }
            }
            
            // Create container and set innerHTML to decode HTML entities
            languagesContentContainer = window.document.createElement('div');
            languagesContentContainer.className = 'kioskboard-languages-content';
            languagesContentContainer.innerHTML = languagesContentHTML;
          }
          // keyboard "language" setting is "true": end

          // keyboard type is "numpad": begin
          if (keyboardType === kioskBoardTypes.Numpad) {
            // check "keysNumpadArrayOfNumbers" for override: begin
            var numpadKeys = opt.keysNumpadArrayOfNumbers;
            if (Array.isArray(numpadKeys) && numpadKeys.length === 10) {
              kioskBoardNumpadKeysObject = numpadKeys.reduce(function (numpadMemo, numpadKey, numpadIndex) {
                numpadMemo[numpadIndex] = numpadKey;
                return numpadMemo;
              }, {});
            }
            // check "keysNumpadArrayOfNumbers" for override: end

            var numpadKeysContent = '';
            for (var key3 in kioskBoardNumpadKeysObject) {
              if (Object.prototype.hasOwnProperty.call(kioskBoardNumpadKeysObject, key3)) {
                var index3 = key3;
                var value3 = kioskBoardNumpadKeysObject[key3];
                var eachKey3 = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key kioskboard-key-' + value3.toString() + ' ' + (index3 === '9' ? 'kioskboard-key-last' : '') + '" data-index="' + index3.toString() + '" data-value="' + value3.toString() + '">' + value3.toString() + '</span>';
                numpadKeysContent += eachKey3;
              }
            }
            keysRowElements += '<div class="kioskboard-row kioskboard-row-numpad">' + numpadKeysContent + backspaceKey + enterKey + '</div>';
          }
          // keyboard type is "numpad": end

          // keyboard type is "all" or "keyboard": begin
          if (keyboardType === kioskBoardTypes.Keyboard || keyboardType === kioskBoardTypes.All) {
            // only keyboard type is "all": begin
            if (keyboardType === kioskBoardTypes.All) {
              var numberKeysContent = '';
              for (var key4 in kioskBoardAllKeysNumbersObject) {
                if (Object.prototype.hasOwnProperty.call(kioskBoardAllKeysNumbersObject, key4)) {
                  var index4 = key4;
                  var value4 = kioskBoardAllKeysNumbersObject[key4];
                  var eachKey4 = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key kioskboard-key-' + value4.toString() + '" data-index="' + index4.toString() + '" data-value="' + value4.toString() + '">' + value4.toString() + '</span>';
                  numberKeysContent += eachKey4;
                }
              }
              keysRowElements += '<div class="kioskboard-row kioskboard-row-top">' + numberKeysContent + '</div>';
            }
            // only keyboard type is "all": end

            // dynamic keys group: begin
            for (var i = 0; i < data.length; i++) {
              var eachObj = data[i];
              var rowKeysContent = '';
              for (var key5 in eachObj) {
                if (Object.prototype.hasOwnProperty.call(eachObj, key5)) {
                  var index5 = key5;
                  var value5 = eachObj[key5];
                  var eachKey5 = '<span style="font-family:' + fontFamily + ',sans-serif;font-weight:' + fontWeight + ';font-size:' + fontSize + ';" class="kioskboard-key kioskboard-key-' + value5.toString().toLocaleLowerCase(keyboardLanguage) + '" data-index="' + index5.toString() + '" data-value="' + value5.toString() + '">' + value5.toString() + '</span>';
                  rowKeysContent += eachKey5;
                }
              }
              keysRowElements += '<div class="kioskboard-row kioskboard-row-dynamic">' + rowKeysContent + '</div>';
            }
            // dynamic keys group: end

            // bottom keys group: begin
            var bottomRowClasses = 'kioskboard-row kioskboard-row-bottom';
            if (allowedSpecialCharacters) bottomRowClasses += ' kioskboard-with-specialcharacter';
            if (allowLanguageSwitch) bottomRowClasses += ' kioskboard-with-language';
            
            keysRowElements += '<div class="' + bottomRowClasses + '">' + capsLockKey + specialCharacterKey + languageKey + spaceKey + enterKey + backspaceKey + '</div>';
            // bottom keys group: end

            // add if special character keys allowed: begin
            if (allowedSpecialCharacters) {
              var closeSpecialCharacters = '<span class="kioskboard-specialcharacter-close">' + kioskBoardIconClose('18px', keysIconColor) + '</span>';
              var specialCharactersWrapper = '<div class="kioskboard-specialcharacters-content">' + specialCharactersContent + '</div>';
              keysRowElements += '<div class="kioskboard-row kioskboard-row-specialcharacters">' + closeSpecialCharacters + specialCharactersWrapper + '</div>';
            }
            // add if special character keys allowed: end

            // add if language switching is allowed: begin
            if (allowLanguageSwitch) {
              var closeLanguages = '<span class="kioskboard-language-close">' + kioskBoardIconClose('18px', keysIconColor) + '</span>';
              // Create languages wrapper and append the pre-built container
              var languagesWrapperDiv = window.document.createElement('div');
              languagesWrapperDiv.className = 'kioskboard-row kioskboard-row-languages';
              languagesWrapperDiv.innerHTML = closeLanguages;
              languagesWrapperDiv.appendChild(languagesContentContainer);
              
              // Convert to HTML string for insertion
              var languagesWrapper = languagesWrapperDiv.outerHTML;
              keysRowElements += languagesWrapper;
            }
            // add if language switching is allowed: end
          }
          // keyboard type is "all" or "keyboard": end

          // create keys wrapper: begin
          var wrapKeysElement = function (stringHtml) {
            var div = window.document.createElement('div');
            div.className = 'kioskboard-wrapper';
            div.innerHTML = stringHtml.trim();
            return div;
          };
          var allKeysElement = wrapKeysElement(keysRowElements); // all keyboard element
          // create keys wrapper: end

          // check "cssAnimations": begin
          var cssAnimations = opt.cssAnimations === true;
          var cssAnimationsClass = 'no-animation';
          var cssAnimationsStyle = 'no-animation';
          var cssAnimationsDuration = 0;
          if (cssAnimations) {
            cssAnimationsClass = 'kioskboard-with-animation';
            cssAnimationsStyle = 'kioskboard-fade';
            cssAnimationsDuration = typeof opt.cssAnimationsDuration === 'number' ? opt.cssAnimationsDuration : 360;
            if (opt.cssAnimationsStyle === 'slide') {
              cssAnimationsStyle = 'kioskboard-slide';
            }
          }
          // check "cssAnimations": end

          // create the keyboard: begin
          var theTheme = typeof opt.theme === 'string' && opt.theme.length > 0 ? opt.theme.trim() : 'light';
          var kioskBoardVirtualKeyboardId = 'KioskBoard-VirtualKeyboard';
          var kioskBoardVirtualKeyboard = window.document.createElement('div');
          kioskBoardVirtualKeyboard.id = kioskBoardVirtualKeyboardId;
          kioskBoardVirtualKeyboard.classList.add('kioskboard-theme-' + theTheme);
          kioskBoardVirtualKeyboard.classList.add('kioskboard-placement-' + keyboardPlacement);
          kioskBoardVirtualKeyboard.classList.add(cssAnimationsClass);
          kioskBoardVirtualKeyboard.classList.add(cssAnimationsStyle);
          kioskBoardVirtualKeyboard.classList.add((isCapsLockActive ? 'kioskboard-touppercase' : 'kioskboard-tolowercase'));
          kioskBoardVirtualKeyboard.lang = keyboardLanguage;
          kioskBoardVirtualKeyboard.style.webkitLocale = '"' + keyboardLanguage + '"';
          kioskBoardVirtualKeyboard.style.animationDuration = cssAnimations ? (cssAnimationsDuration + 'ms') : '';
          kioskBoardVirtualKeyboard.appendChild(allKeysElement);
          // create the keyboard: end

          // remove the keyboard: begin
          var removeKeyboard = function () {
            // add remove class
            var keyboardElm = window.document.getElementById(kioskBoardVirtualKeyboardId);
            if (keyboardElm) {
              keyboardElm.classList.add(cssAnimationsStyle + '-remove');

              // remove after the animation has been ended
              var removeTimeout = setTimeout(function () {
                if (keyboardElm.parentNode !== null) {
                  keyboardElm.parentNode.removeChild(keyboardElm); // remove keyboard
                  window.document.body.classList.remove('kioskboard-body-padding'); // remove body padding class
                  
                  // Clean up global click listener
                  if (window.kioskBoardDocClickListener) {
                    window.document.removeEventListener('click', window.kioskBoardDocClickListener, true);
                    window.kioskBoardDocClickListener = null;
                  }
                }
                clearTimeout(removeTimeout);
              }, cssAnimationsDuration);
            }
          };
          // remove the keyboard: end

          // event for input element trigger change: begin
          var changeEvent = new Event('change', {
            'bubbles': true,
            'cancelable': true,
          });
          // event for input element trigger change: end

          // input element keypress listener: begin
          theInput.addEventListener('keypress', function (e) {
            // if: allowed real keyboard use
            var allowRealKeyboard = opt.allowRealKeyboard === true;
            if (allowRealKeyboard) {
              // update theInputValArray on keypress
              theInputValArray = e.currentTarget.value.split('');
            }
            // else: stop
            else {
              e.stopPropagation();
              e.preventDefault();
              e.returnValue = false;
              e.cancelBubble = true;
              return false;
            }
          }, false);
          // input element keypress listener: end

          // keys event listeners: begin
          var keysEventListeners = function (keyElement, onClickHandler) {
            if (keyElement) {
              var isTouchableDevice = 'ontouchend' in window || window.navigator.maxTouchPoints > 0;

              if (isTouchableDevice) {
                keyElement.addEventListener('contextmenu', function (event) {
                  event.preventDefault();
                }, false);
                keyElement.addEventListener('touchend', onClickHandler, false);
              } else {
                // For mouse devices, use mousedown instead of click to prevent conflicts
                keyElement.addEventListener('mousedown', onClickHandler, false);
              }
              
              // Always add click as fallback
              keyElement.addEventListener('click', onClickHandler, false);
            }
          };
          // keys event listeners: end

          // keys click listeners: begin
          var keysClickListeners = function (input) {
            // Store the function globally so it can be called after language changes
            window.kioskBoardKeysClickListeners = keysClickListeners;
            
            // Remove existing event listeners first to prevent duplicates
            var existingKeys = window.document.querySelectorAll('.kioskboard-key, .kioskboard-key-capslock, .kioskboard-key-backspace, .kioskboard-key-enter, .kioskboard-key-specialcharacter, .kioskboard-key-language, .kioskboard-language-option, .kioskboard-specialcharacter-close, .kioskboard-language-close');
            for (var i = 0; i < existingKeys.length; i++) {
              var elem = existingKeys[i];
              var newElem = elem.cloneNode(true);
              elem.parentNode.replaceChild(newElem, elem);
            }
            
            // each key click listener: begin
            var eachKeyElm = window.document.querySelectorAll('.kioskboard-key');
            if (eachKeyElm && eachKeyElm.length > 0) {
              for (var ekIndex = 0; ekIndex < eachKeyElm.length; ekIndex++) {
                var keyElm = eachKeyElm[ekIndex];
                keysEventListeners(keyElm, function (e) {
                  e.preventDefault();

                  // check input max & maxlength
                  var maxLength = (input.getAttribute('maxlength') || '') * 1;
                  var max = (input.getAttribute('max') || '') * 1;
                  var liveValueLength = (input.value || '').length || 0;
                  if (maxLength > 0 && liveValueLength >= maxLength) { return false; }
                  if (max > 0 && liveValueLength >= max) { return false; }

                  // input trigger focus
                  input.focus();

                  // key's value
                  var keyValue = e.currentTarget.dataset.value || '';

                  // check capslock
                  if (isCapsLockActive) {
                    keyValue = keyValue.toLocaleUpperCase(keyboardLanguage);
                  } else {
                    keyValue = keyValue.toLocaleLowerCase(keyboardLanguage);
                  }

                  var keyValArr = keyValue.split('');
                  for (var keyValIndex = 0; keyValIndex < keyValArr.length; keyValIndex++) {
                    // update the selectionStart
                    theInputSelIndex = input.selectionStart || (input.value || '').length;

                    // add value by index
                    theInputValArray.splice(theInputSelIndex, 0, keyValArr[keyValIndex]);

                    // update input value
                    input.value = theInputValArray.join('');

                    // set next selection index
                    if (input.type !== 'number') {
                      input.setSelectionRange(theInputSelIndex + 1, theInputSelIndex + 1);
                    }

                    // input trigger change event for update the value
                    input.dispatchEvent(changeEvent);
                  }
                });
              }
            }
            // each key click listener: end

            // capslock key click listener: begin
            var capsLockKeyElm = window.document.querySelector('.kioskboard-key-capslock');
            if (capsLockKeyElm) {
              keysEventListeners(capsLockKeyElm, function (e) {
                e.preventDefault();
                // focus the input
                input.focus();

                if (e.currentTarget.classList.contains('capslock-active')) {
                  e.currentTarget.classList.remove('capslock-active');
                  kioskBoardVirtualKeyboard.classList.add('kioskboard-tolowercase');
                  kioskBoardVirtualKeyboard.classList.remove('kioskboard-touppercase');
                  isCapsLockActive = false;
                } else {
                  e.currentTarget.classList.add('capslock-active');
                  kioskBoardVirtualKeyboard.classList.remove('kioskboard-tolowercase');
                  kioskBoardVirtualKeyboard.classList.add('kioskboard-touppercase');
                  isCapsLockActive = true;
                }
              });
            }
            // capslock key click listener: end

            // backspace key click listener: begin
            var backspaceKeyElm = window.document.querySelector('.kioskboard-key-backspace');
            if (backspaceKeyElm) {
              keysEventListeners(backspaceKeyElm, function (e) {
                e.preventDefault();

                // update the selectionStart
                theInputSelIndex = input.selectionStart || (input.value || '').length;

                // input trigger focus
                input.focus();

                // remove value by index
                theInputValArray.splice((theInputSelIndex - 1), 1);

                // update input value
                input.value = theInputValArray.join('');

                // set next selection index
                if (input.type !== 'number') {
                  input.setSelectionRange(theInputSelIndex - 1, theInputSelIndex - 1);
                }

                // input trigger change event for update the value
                input.dispatchEvent(changeEvent);
              });
            }
            // backspace key click listener: end

            // specialcharacter key click listener: begin
            var specialCharacterKeyElm = window.document.querySelector('.kioskboard-key-specialcharacter');
            var specialCharactersRowElm = window.document.querySelector('.kioskboard-row-specialcharacters');
            // open
            if (specialCharacterKeyElm && specialCharactersRowElm) {
              keysEventListeners(specialCharacterKeyElm, function (e) {
                e.preventDefault();
                input.focus(); // focus the input
                if (e.currentTarget.classList.contains('specialcharacter-active')) {
                  e.currentTarget.classList.remove('specialcharacter-active');
                  specialCharactersRowElm.classList.remove('kioskboard-specialcharacter-show');
                } else {
                  e.currentTarget.classList.add('specialcharacter-active');
                  specialCharactersRowElm.classList.add('kioskboard-specialcharacter-show');
                }
              });
            }
            // close
            var specialCharCloseElm = window.document.querySelector('.kioskboard-specialcharacter-close');
            if (specialCharCloseElm && specialCharacterKeyElm && specialCharactersRowElm) {
              keysEventListeners(specialCharCloseElm, function (e) {
                e.preventDefault();
                input.focus(); // focus the input
                specialCharacterKeyElm.classList.remove('specialcharacter-active');
                specialCharactersRowElm.classList.remove('kioskboard-specialcharacter-show');
              });
            }
            // specialcharacter key click listener: end

            // language key click listener: begin
            var languageKeyElm = window.document.querySelector('.kioskboard-key-language');
            var languagesRowElm = window.document.querySelector('.kioskboard-row-languages');
            // open
            if (languageKeyElm && languagesRowElm) {
              keysEventListeners(languageKeyElm, function (e) {
                e.preventDefault();
                input.focus(); // focus the input
                if (e.currentTarget.classList.contains('language-active')) {
                  e.currentTarget.classList.remove('language-active');
                  languagesRowElm.classList.remove('kioskboard-language-show');
                } else {
                  e.currentTarget.classList.add('language-active');
                  languagesRowElm.classList.add('kioskboard-language-show');
                }
              });
            }
            // close
            var languageCloseElm = window.document.querySelector('.kioskboard-language-close');
            if (languageCloseElm && languageKeyElm && languagesRowElm) {
              keysEventListeners(languageCloseElm, function (e) {
                e.preventDefault();
                input.focus(); // focus the input
                languageKeyElm.classList.remove('language-active');
                languagesRowElm.classList.remove('kioskboard-language-show');
              });
            }
            // language key click listener: end

            // language option click listeners: begin
            var languageOptionElms = window.document.querySelectorAll('.kioskboard-language-option');
            if (languageOptionElms && languageOptionElms.length > 0) {
              for (var loIndex = 0; loIndex < languageOptionElms.length; loIndex++) {
                var langOptionElm = languageOptionElms[loIndex];
                keysEventListeners(langOptionElm, function (e) {
                  e.preventDefault();
                  e.stopPropagation(); // Prevent event bubbling
                  input.focus(); // focus the input
                  
                  var selectedLanguage = e.currentTarget.dataset.language;
                  if (selectedLanguage && selectedLanguage !== kioskBoardCurrentLanguage) {
                    // Update current language
                    var success = kioskBoardUpdateKeyboardLanguage(selectedLanguage, kioskBoardVirtualKeyboard, opt, input);
                    if (success) {
                      // Update active language option
                      var allLangOptions = window.document.querySelectorAll('.kioskboard-language-option');
                      for (var i = 0; i < allLangOptions.length; i++) {
                        allLangOptions[i].classList.remove('active');
                      }
                      e.currentTarget.classList.add('active');
                      
                      // Close language panel
                      if (languageKeyElm && languagesRowElm) {
                        languageKeyElm.classList.remove('language-active');
                        languagesRowElm.classList.remove('kioskboard-language-show');
                      }
                      
                      // Update the current language for this session
                      keyboardLanguage = selectedLanguage;
                      
                      // Re-attach event listeners for the new keys immediately
                      setTimeout(function() {
                        // Store reference to prevent losing the click-outside listener
                        var currentDocClickListener = window.kioskBoardDocClickListener;
                        keysClickListeners(input);
                        // Restore the click-outside listener
                        window.kioskBoardDocClickListener = currentDocClickListener;
                      }, 50);
                    }
                  }
                });
              }
            }
            // language option click listeners: end

            // enter key click listener: begin
            var enterKeyElm = window.document.querySelector('.kioskboard-key-enter');
            if (enterKeyElm) {
              keysEventListeners(enterKeyElm, function () {
                if (opt.keysEnterCanClose === true) {
                  removeKeyboard();
                }
                if (typeof opt.keysEnterCallback === 'function') {
                  opt.keysEnterCallback();
                }
              });
            }
            // enter key click listener: end
          };
          // keys click listeners: end

          // append keyboard: begin
          var keyboardElement = window.document.getElementById(kioskBoardVirtualKeyboardId);
          if (!keyboardElement) {
            // append the keyboard to body and cache
            window.document.body.appendChild(kioskBoardVirtualKeyboard);

            // check window and keyboard height: begin
            var windowHeight = Math.round(window.innerHeight);
            var documentHeight = Math.round(window.document.body.clientHeight);
            var keyboardHeight = Math.round(window.document.getElementById(kioskBoardVirtualKeyboardId).offsetHeight);
            if (keyboardHeight > Math.round((windowHeight / 3) * 2)) {
              var keyboardWrapper = window.document.querySelector('.kioskboard-wrapper');
              keyboardWrapper.style.maxHeight = Math.round((windowHeight / 5) * 4) + 'px';
              keyboardWrapper.style.overflowX = 'hidden';
              keyboardWrapper.style.overflowY = 'auto';
              keyboardWrapper.classList.add('kioskboard-overflow');
            }
            // check window and keyboard height: end

            // body padding bottom || top: begin
            var isPlacementTop = keyboardPlacement === kioskBoardPlacements.Top;
            var inputVisibleEdge = (isPlacementTop ? theInput.getBoundingClientRect().top : theInput.getBoundingClientRect().bottom) || 0;
            var docTop = window.document.documentElement.scrollTop || 0;
            var theInputOffsetTop = Math.round(inputVisibleEdge + docTop);
            var isPaddingTop = (theInputOffsetTop < keyboardHeight) && isPlacementTop;
            var isPaddingBottom = documentHeight <= (theInputOffsetTop + keyboardHeight) && !isPlacementTop;

            if (isPaddingTop || isPaddingBottom) {
              var styleElm = window.document.getElementById('KioskboardBodyPadding');
              if (styleElm && styleElm.parentNode !== null) {
                styleElm.parentNode.removeChild(styleElm);
              }

              var style = '<style id="KioskboardBodyPadding">.kioskboard-body-padding {padding-' + (isPaddingTop ? 'top' : 'bottom') + ':' + keyboardHeight + 'px !important;}</style>';
              var styleRange = window.document.createRange();
              styleRange.selectNode(window.document.head);
              var styleFragment = styleRange.createContextualFragment(style);
              window.document.head.appendChild(styleFragment);
              window.document.body.classList.add('kioskboard-body-padding');
            }
            // body padding bottom || top: end

            // auto scroll: begin
            var autoScroll = opt.autoScroll === true;
            if (autoScroll) {
              var inputThreshold = isPlacementTop ? 20 : 50;
              var inputTop = theInput.getBoundingClientRect().top || 0;
              var inputScrollOffsetTop = Math.round(inputTop + docTop);
              var scrollBehavior = opt.cssAnimations === true ? 'smooth' : 'auto';
              var scrollDelay = opt.cssAnimations === true && typeof opt.cssAnimationsDuration === 'number' ? opt.cssAnimationsDuration : 0;
              var scrollTop = inputScrollOffsetTop - inputThreshold - (isPlacementTop ? keyboardHeight : 0);

              var userAgent = window.navigator.userAgent.toLocaleLowerCase('en');
              var isBrowserInternetExplorer = userAgent.indexOf('.net4') > -1;
              var isBrowserEdgeLegacy = userAgent.indexOf('edge') > -1;
              var isBrowserEdgeWebView = isBrowserEdgeLegacy && userAgent.indexOf('webview') > -1;

              if ((!isBrowserEdgeLegacy || isBrowserEdgeWebView) && !isBrowserInternetExplorer) {
                var scrollTimeout = setTimeout(function () {
                  if (isBrowserEdgeWebView) {
                    window.scrollBy(0, inputScrollOffsetTop);
                  } else {
                    window.scrollTo({ top: scrollTop, left: 0, behavior: scrollBehavior });
                  }
                  clearTimeout(scrollTimeout);
                }, scrollDelay);
              } else {
                window.document.documentElement.scrollTop = scrollTop;
              }
            }
            // auto scroll: end

            // keyboard keys click listeners
            keysClickListeners(theInput);

            // keyboard click outside listener: begin
            var docClickListener = function (e) {
              var docClickTimeout = setTimeout(function () {
                // check event target to remove keyboard: begin
                var keyboardElm = window.document.getElementById(kioskBoardVirtualKeyboardId);
                if (
                  keyboardElm
                  && e.target !== theInput
                  && !kioskBoardEventTargetIsElementOrChilds(e, keyboardElm)
                  && !e.target.classList.contains('kioskboard-body-padding')
                ) {
                  removeKeyboard();
                  window.document.removeEventListener('click', docClickListener);
                  // Clear the global reference
                  window.kioskBoardDocClickListener = null;
                }
                // check event target to remove keyboard: end

                // toggle inputs: begin
                if (allInputs.indexOf(e.target) > -1) {
                  var toggleTimeout = setTimeout(function () {
                    e.target.blur();
                    e.target.focus();
                    clearTimeout(toggleTimeout);
                  }, cssAnimationsDuration);
                }
                // toggle inputs: end

                // clear doc click delay
                clearTimeout(docClickTimeout);
              }, 50); // Reduced delay for better responsiveness
            };
            
            // Store the listener globally so it doesn't get lost during language changes
            window.kioskBoardDocClickListener = docClickListener;
            window.document.addEventListener('click', docClickListener, true); // Use capture phase
            // keyboard click outside listener: end
          }
          // append keyboard: end
        };
        input.addEventListener('focus', inputFocusListener); // add input focus listener
        // each input focus listener: end

        // each input focusout listener: begin
        var inputFocusoutListener = function (e) {
          if (!allowMobileKeyboard && !getReadOnlyAttr) {
            e.currentTarget.removeAttribute('readonly');
          }
        };
        input.addEventListener('focusout', inputFocusoutListener); // add input focusout listener
        // each input focusout listener: end
      };
      // Functions: Create Keyboard and AppendTo: end

      // Functions: Get the Keys from JSON by XMLHttpRequest and AppendTo: begin
      var getKeysViaXmlHttpRequest = function (jsonUrl, input) {
        // if "kioskBoardCachedKeys" is undefined || null => send XMLHttpRequest
        if (!kioskBoardCachedKeys) {
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.open('GET', jsonUrl, true);
          xmlHttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xmlHttp.send();
          xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4) {
              if (xmlHttp.status === 200) { // success
                var data = xmlHttp.responseText || []; // data
                if (typeof data === 'string' && data.length > 0) {
                  var parsedData = JSON.parse(data); // JSON parse data
                  if (kioskBoardCheckArrayOfObjects(parsedData)) {
                    kioskBoardCachedKeys = parsedData; // cache the keys
                    createKeyboardAndAppendTo(parsedData, input); // create the keyboard
                  } else {
                    kioskBoardConsoleError('Array of objects of the keys are not valid. \n\nVisit to learn more: ' + kioskBoardGithubUrl);
                    return false;
                  }
                }
              } else {
                kioskBoardConsoleError('XMLHttpRequest has been failed. Please check your URL path or protocol.');
                return false;
              }
            }
          };
        }
      };
      // Functions: Get the Keys from JSON by XMLHttpRequest and AppendTo: end

      // Step 3: Select the element(s): begin
      for (var kbIndex = 0; kbIndex < kbElements.length; kbIndex++) {
        // each element
        var eachElement = kbElements[kbIndex];

        // each element tag name
        var getTagName = ((eachElement || {}).tagName || '').toLocaleLowerCase('en');

        // if: an input or textarea element
        if (allowedElementTypes.indexOf(getTagName) > -1) {
          // if: has cached keys => create the keyboard by using cached keys
          if (kioskBoardCachedKeys) {
            createKeyboardAndAppendTo(kioskBoardCachedKeys, eachElement);
          }
          // else: try to get the keys from the JSON file via XmlHttpRequest
          else {
            getKeysViaXmlHttpRequest(opt.keysJsonUrl, eachElement);
          }
        }
        // else: other elements
        else {
          kioskBoardConsoleLog('You have to call the "KioskBoard" with an ID/ClassName of an Input or a TextArea element. Your element\'s tag name is: "' + getTagName + '". \n\nYou can visit the Documentation page to learn more. \n\nVisit: ' + kioskBoardGithubUrl);
        }
      }
      // Step 3: Select the element(s): end
    },
  };

  return KioskBoard;
  // KioskBoard: end
});
