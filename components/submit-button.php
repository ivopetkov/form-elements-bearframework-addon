<?php

/*
 * Form elements addon for Bear Framework
 * https://github.com/ivopetkov/form-elements-bearframework-addon
 * Copyright (c) Ivo Petkov
 * Free to use under the MIT license.
 */

$text = (string) $component->text;
$waitingText = (string) $component->waitingText;

echo '<html><head>';
//echo '<script>' . file_get_contents(__DIR__ . '/../dev/submit-button.js') . '</script>';
//taken from dev/submit-button.js
$js = 'var ivoPetkov=ivoPetkov||{};ivoPetkov.bearFrameworkAddons=ivoPetkov.bearFrameworkAddons||{};ivoPetkov.bearFrameworkAddons.formElementsSubmitButton=ivoPetkov.bearFrameworkAddons.formElementsSubmitButton||function(){return{onClick:function(a,f){for(var b=a;b&&"form"!==b.tagName.toLowerCase();)b=b.parentNode;if(b&&("undefined"===typeof a.disableNextClick||!a.disableNextClick)){var c=b,d=function(){a.disableNextClick=!0;"undefined"===typeof a.originalInnerText&&(a.originalInnerText=a.innerText);a.innerText=f;a.setAttribute("disabled","true");a.style.cursor="default"},e=function(){a.disableNextClick=!1;a.innerText=a.originalInnerText;a.removeAttribute("disabled");a.style.cursor="pointer";c.removeEventListener("requestsent",d);c.removeEventListener("responsereceived",e)};c.addEventListener("submitstart",d);c.addEventListener("submitend",e);c.submit()}}}}();';
echo '<script>' . $js . '</script>';
echo '</head><body>';
echo '<div class="ivopetkov-form-elements-element ivopetkov-form-elements-submit-button">';
$onClick = 'ivoPetkov.bearFrameworkAddons.formElementsSubmitButton.onClick(this,' . json_encode($waitingText) . ');';
echo '<span class="ivopetkov-form-elements-submit-button-element-button" style="cursor:pointer;user-select:none;-moz-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-o-user-select:none;" onclick="' . htmlentities($onClick) . '">' . htmlspecialchars($text) . '</span>';
echo '</div>';
echo '</body></html>';
